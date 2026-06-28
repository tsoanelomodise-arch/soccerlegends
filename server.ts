import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use express.json() to parse JSON bodies with a larger limit
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/register", async (req, res) => {
    try {
      const { formData } = req.body;
      if (!formData) {
        return res.status(400).json({ error: "Missing formData" });
      }

      const bodyFormData = new FormData();
      bodyFormData.append("_subject", "Someone just submitted your form on the Legends academy registration online form");
      bodyFormData.append("_captcha", "false");
      bodyFormData.append("_cc", "lennoxmolehe@gmail.com");
      bodyFormData.append("Player Name", formData.playerName);
      bodyFormData.append("Player DOB", formData.playerDob);
      bodyFormData.append("Player Position", formData.playerPosition);
      bodyFormData.append("Player Skill Level", formData.playerSkillLevel);
      bodyFormData.append("Goals", formData.goals || "0");
      bodyFormData.append("Assists", formData.assists || "0");
      bodyFormData.append("Minutes Played", formData.minutesPlayed || "0");
      bodyFormData.append("Parent/Guardian", `${formData.title} ${formData.firstName} ${formData.surname}`);
      bodyFormData.append("Parent Email", formData.email || "N/A");
      bodyFormData.append("Parent Phone", formData.cellphone);
      bodyFormData.append("Medical Doctor", `${formData.doctorName} (${formData.doctorContact})`);
      bodyFormData.append("Medical Aid", formData.medicalAid || "None");
      bodyFormData.append("Medical Aid Member Number", formData.medicalAidNumber || "None");
      bodyFormData.append("Next of Kin", formData.nextOfKin);
      bodyFormData.append("Photo Consent", formData.socialConsent);
      bodyFormData.append("Comments", formData.comments || "None");
      bodyFormData.append("Registration Type", formData.registrationType === "weekly" ? "Weekly (R900)" : "Daily (R250/day)");
      bodyFormData.append("Selected Sessions of Attendance", (formData.selectedDays || []).join(", "));
      bodyFormData.append("Injury & Theft Indemnity Agreed", formData.agreeIndemnity ? "Yes (Agreed to Camp Policy)" : "No");

      // Helper to convert base64 to Blob
      const base64ToBlob = (base64Str: string, mimeType: string) => {
        const base64Data = base64Str.split(",")[1] || base64Str;
        const buffer = Buffer.from(base64Data, "base64");
        return new Blob([buffer], { type: mimeType });
      };

      if (formData.playerImage) {
        try {
          const mime = formData.playerImage.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
          const blob = base64ToBlob(formData.playerImage, mime);
          const fileName = `${formData.playerName.replace(/\s+/g, "_")}_profile.jpg`;
          bodyFormData.append("attachment", blob, fileName);

          if (formData.playerImageCloudUrl) {
            bodyFormData.append("Player Profile Picture Link", formData.playerImageCloudUrl);
            bodyFormData.append("Profile Picture Status", "Uploaded to cloud storage & attached as file");
          } else {
            bodyFormData.append("Profile Picture Status", "Attached as file only");
          }
        } catch (err) {
          console.error("Error attaching player image:", err);
          bodyFormData.append("Profile Picture Status", "Provided but failed to attach");
        }
      }

      if (formData.proofOfPayment) {
        try {
          const mime = formData.proofOfPayment.match(/data:(.*?);base64/)?.[1] || "application/pdf";
          const blob = base64ToBlob(formData.proofOfPayment, mime);
          const ext = formData.proofOfPaymentName?.split(".").pop() || "jpg";
          const fileName = `${formData.playerName.replace(/\s+/g, "_")}_pop.${ext}`;
          bodyFormData.append("attachment2", blob, fileName);

          if (formData.proofOfPaymentCloudUrl) {
            bodyFormData.append("Proof of Payment Link", formData.proofOfPaymentCloudUrl);
            bodyFormData.append("Proof of Payment Status", "Uploaded to cloud & attached as file");
          } else {
            bodyFormData.append("Proof of Payment Status", "Attached as file only");
          }
        } catch (popErr) {
          console.error("Error attaching proof of payment:", popErr);
          bodyFormData.append("Proof of Payment Status", "Provided but failed to attach");
        }
      }

      const emailResponse = await fetch("https://formsubmit.co/ajax/eb1cf09e9e3178f4e5b2faa807063900", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Referer": "https://legendsacademy.co.za"
        },
        body: bodyFormData
      });

      if (emailResponse.ok) {
        return res.json({ success: true });
      } else {
        const errorText = await emailResponse.text();
        console.error("FormSubmit.co response not OK:", errorText);
        return res.status(emailResponse.status).json({ error: errorText });
      }
    } catch (error: any) {
      console.error("Server API error:", error);
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
