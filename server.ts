import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Initialize Resend lazily to avoid crashing if key is missing on startup
let resend: Resend | null = null;
function getResend() {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY environment variable is required");
    }
    resend = new Resend(key);
  }
  return resend;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use express.json() to parse JSON bodies
  app.use(express.json());

  // API routes
  app.post("/api/register", async (req, res) => {
    try {
      const { 
        title, firstName, surname, email, identification, cellphone, 
        doctorName, doctorContact, nextOfKin, socialConsent, comments,
        playerName, playerDob, playerPosition, playerSkillLevel,
        goals, assists, minutesPlayed, playerImage
      } = req.body;

      const resendClient = getResend();
      
      const { data, error } = await resendClient.emails.send({
        from: 'Legends Academy <onboarding@resend.dev>',
        to: ['tsoanelomodise@gmail.com'],
        subject: `New Registration: ${playerName} (${firstName} ${surname})`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h1 style="color: #e11d48; border-bottom: 2px solid #e11d48; padding-bottom: 10px;">New Academy Registration</h1>
            
            ${playerImage ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${playerImage}" alt="Player Photo" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid #eee;" /></div>` : ''}

            <h2 style="color: #333;">Parent / Guardian Information</h2>
            <p><strong>Name:</strong> ${title} ${firstName} ${surname}</p>
            <p><strong>Email:</strong> ${email || 'N/A'}</p>
            <p><strong>ID/Passport:</strong> ${identification}</p>
            <p><strong>Phone:</strong> ${cellphone}</p>
            
            <h2 style="color: #333;">Medical & Emergency</h2>
            <p><strong>Doctor:</strong> ${doctorName} (${doctorContact})</p>
            <p><strong>Next of Kin:</strong> ${nextOfKin}</p>
            <p><strong>Social Media Consent:</strong> ${socialConsent}</p>
            
            <h2 style="color: #333;">Player Information</h2>
            <p><strong>Name:</strong> ${playerName}</p>
            <p><strong>DOB:</strong> ${playerDob}</p>
            <p><strong>Position:</strong> ${playerPosition}</p>
            <p><strong>Skill Level:</strong> ${playerSkillLevel}</p>
            
            <h2 style="color: #333;">Season Statistics</h2>
            <p><strong>Goals:</strong> ${goals || 0}</p>
            <p><strong>Assists:</strong> ${assists || 0}</p>
            <p><strong>Minutes Played:</strong> ${minutesPlayed || 0}</p>
            
            <h2 style="color: #333;">Comments</h2>
            <p>${comments || 'No comments'}</p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        return res.status(400).json({ error: error.message });
      }

      res.json({ message: "Registration successful", id: data?.id });
    } catch (error: any) {
      console.error("Server error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
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
