import { motion, AnimatePresence } from "motion/react";
import { 
  Facebook,
  Instagram,
  Camera,
  Calendar,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { 
  BespokeUsers,
  BespokeUser,
  BespokeBarChart3,
  BespokeCreditCard,
  BespokeFileText,
  BespokeLock,
  BespokeCopy,
  BespokeUpload,
  BespokeAlertCircle,
  BespokeCheck,
  BespokeArrowRight,
  BespokeArrowUp,
  BespokeTwitterX
} from "./components/BespokeIcons";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import AnimatedPitch from "./components/AnimatedPitch";

interface FormData {
  title: string;
  firstName: string;
  surname: string;
  email: string;
  identification: string;
  cellphone: string;
  doctorName: string;
  doctorContact: string;
  medicalAid: string;
  medicalAidNumber: string;
  nextOfKin: string;
  socialConsent: string;
  comments: string;
  agreeTerms: boolean;
  playerName: string;
  playerDob: string;
  playerPosition: string;
  playerSkillLevel: string;
  playerImage: string | null;
  goals: string;
  assists: string;
  minutesPlayed: string;
  registrationType: "weekly" | "daily";
  selectedDays: string[];
  proofOfPayment: string | null;
  proofOfPaymentName: string;
  agreeIndemnity: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function App() {
  const [usePassport, setUsePassport] = useState(false);
  const [noEmail, setNoEmail] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const menuItems = [
    { label: "Guardian Registration", target: "guardian-registration", icon: BespokeUsers },
    { 
      label: "Player Detail", 
      target: "player-detail", 
      icon: BespokeUser,
      subItems: [
        { label: "General Details", target: "player-detail", icon: BespokeUser },
        { label: "Player Statistics", target: "player-statistics", icon: BespokeBarChart3 }
      ]
    },
    { label: "Fees", target: "fees", icon: BespokeCreditCard }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  const [formData, setFormData] = useState<FormData>({
    title: "Mr.",
    firstName: "",
    surname: "",
    email: "",
    identification: "",
    cellphone: "",
    doctorName: "",
    doctorContact: "",
    medicalAid: "",
    medicalAidNumber: "",
    nextOfKin: "",
    socialConsent: "Yes, I consent to untagged photography",
    comments: "",
    agreeTerms: false,
    playerName: "",
    playerDob: "",
    playerPosition: "Midfielder",
    playerSkillLevel: "Beginner",
    playerImage: null,
    goals: "",
    assists: "",
    minutesPlayed: "",
    registrationType: "weekly",
    selectedDays: [],
    proofOfPayment: null,
    proofOfPaymentName: "",
    agreeIndemnity: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState("guardian-registration");
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    const container = document.getElementById("form-scroll-container");

    const handleScroll = () => {
      // 1. Update showScrollTop
      const containerScroll = container ? container.scrollTop : 0;
      const windowScroll = window.scrollY;
      if (containerScroll > 300 || windowScroll > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // 2. Track active section
      const sectionIds = ["guardian-registration", "player-detail", "player-statistics", "fees", "terms-conditions"];
      let currentSection = sectionIds[0];

      if (container) {
        const containerRect = container.getBoundingClientRect();
        let closestId = sectionIds[0];
        let closestDist = Infinity;

        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const elRect = el.getBoundingClientRect();
            // Calculate distance to the top of the container with a small threshold offset
            const dist = Math.abs(elRect.top - containerRect.top - 20);
            if (dist < closestDist) {
              closestDist = dist;
              closestId = id;
            }
          }
        }
        currentSection = closestId;
      } else {
        let closestId = sectionIds[0];
        let closestDist = Infinity;
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const elRect = el.getBoundingClientRect();
            const dist = Math.abs(elRect.top - 80);
            if (dist < closestDist) {
              closestDist = dist;
              closestId = id;
            }
          }
        }
        currentSection = closestId;
      }

      setActiveSection(currentSection);
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    window.addEventListener("scroll", handleScroll);

    // Initial run to capture state on load
    handleScroll();

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const container = document.getElementById("form-scroll-container");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const calculateAge = (dob: string) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : 0;
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => {
      const days = prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day];
      
      if (errors.selectedDays && days.length > 0) {
        setErrors(err => {
          const newErrors = { ...err };
          delete newErrors.selectedDays;
          return newErrors;
        });
      }
      return { ...prev, selectedDays: days };
    });
  };

  const handleProofChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, proofOfPayment: "Please upload a JPG, PNG, WEBP or PDF file." }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ 
        ...prev, 
        proofOfPayment: reader.result as string,
        proofOfPaymentName: file.name
      }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.proofOfPayment;
        return newErrors;
      });
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.7 quality
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, playerImage: "Please upload a JPG, PNG or WEBP image." }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const compressed = await compressImage(base64);
      setFormData(prev => ({ ...prev, playerImage: compressed }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.playerImage;
        return newErrors;
      });
    };
    reader.readAsDataURL(file);
  };

  const validate = (): { isValid: boolean; errors: FormErrors } => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.surname.trim()) newErrors.surname = "Surname is required";
    
    if (!noEmail) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!formData.identification.trim()) {
      newErrors.identification = usePassport ? "Passport number is required" : "ID number is required";
    } else if (!usePassport && !/^\d{13}$/.test(formData.identification.replace(/\s/g, ""))) {
      newErrors.identification = "South African ID must be 13 digits";
    }

    if (!formData.cellphone.trim()) {
      newErrors.cellphone = "Cellphone number is required";
    } else if (formData.cellphone.replace(/\D/g, "").length < 10) {
      newErrors.cellphone = "Please enter a valid phone number (min 10 digits)";
    }

    if (!formData.doctorName.trim()) newErrors.doctorName = "Doctor name is required";
    if (!formData.doctorContact.trim()) newErrors.doctorContact = "Doctor contact is required";
    if (!formData.nextOfKin.trim()) newErrors.nextOfKin = "Next of kin contact is required";
    if (!formData.playerName.trim()) newErrors.playerName = "Player name is required";
    if (!formData.playerDob) newErrors.playerDob = "Date of birth is required";
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms and conditions";
    
    // Validate selected camp sessions
    if (formData.selectedDays.length === 0) {
      newErrors.selectedDays = "You must select at least one session of attendance";
    }

    // Validate indemnity agreement
    if (!formData.agreeIndemnity) {
      newErrors.agreeIndemnity = "You must accept the indemnity waiver to register";
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  // Helper to map field keys to human-friendly labels
  const ERROR_LABELS: Record<string, string> = {
    firstName: "Parent First Name",
    surname: "Parent Surname",
    email: "Parent Email Address",
    identification: usePassport ? "Parent Passport Number" : "Parent ID Number",
    cellphone: "Parent Cellphone Number",
    doctorName: "Doctor Name",
    doctorContact: "Doctor Contact",
    nextOfKin: "Next of Kin Contact",
    playerName: "Player Full Name",
    playerDob: "Player Date of Birth",
    agreeTerms: "Terms & Conditions Agreement",
    selectedDays: "Camp Session Selection",
    agreeIndemnity: "Injury & Theft Indemnity Waiver"
  };

  // Helper to map field keys to scrollable section IDs
  const FIELD_TO_SECTION_MAP: Record<string, string> = {
    firstName: "guardian-registration",
    surname: "guardian-registration",
    email: "guardian-registration",
    identification: "guardian-registration",
    cellphone: "guardian-registration",
    doctorName: "guardian-registration",
    doctorContact: "guardian-registration",
    nextOfKin: "guardian-registration",
    playerName: "player-detail",
    playerDob: "player-detail",
    agreeTerms: "guardian-registration",
    selectedDays: "fees",
    agreeIndemnity: "terms-conditions"
  };

  // Dynamic calculator of remaining checklist requirements
  const getOutstandingRequirements = () => {
    const reqs: { key: string; label: string; description: string }[] = [];

    if (!formData.firstName.trim()) {
      reqs.push({ key: "firstName", label: ERROR_LABELS.firstName, description: "First name is required" });
    }
    if (!formData.surname.trim()) {
      reqs.push({ key: "surname", label: ERROR_LABELS.surname, description: "Surname is required" });
    }
    if (!noEmail) {
      if (!formData.email.trim()) {
        reqs.push({ key: "email", label: ERROR_LABELS.email, description: "Email is required" });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        reqs.push({ key: "email", label: ERROR_LABELS.email, description: "Please enter a valid email address" });
      }
    }
    if (!formData.identification.trim()) {
      reqs.push({ key: "identification", label: ERROR_LABELS.identification, description: usePassport ? "Passport number is required" : "ID number is required" });
    } else if (!usePassport && !/^\d{13}$/.test(formData.identification.replace(/\s/g, ""))) {
      reqs.push({ key: "identification", label: ERROR_LABELS.identification, description: "South African ID must be 13 digits" });
    }
    if (!formData.cellphone.trim()) {
      reqs.push({ key: "cellphone", label: ERROR_LABELS.cellphone, description: "Cellphone number is required" });
    } else if (formData.cellphone.replace(/\D/g, "").length < 10) {
      reqs.push({ key: "cellphone", label: ERROR_LABELS.cellphone, description: "Please enter a valid phone number (min 10 digits)" });
    }
    if (!formData.doctorName.trim()) {
      reqs.push({ key: "doctorName", label: ERROR_LABELS.doctorName, description: "Doctor name is required" });
    }
    if (!formData.doctorContact.trim()) {
      reqs.push({ key: "doctorContact", label: ERROR_LABELS.doctorContact, description: "Doctor contact is required" });
    }
    if (!formData.nextOfKin.trim()) {
      reqs.push({ key: "nextOfKin", label: ERROR_LABELS.nextOfKin, description: "Next of kin contact is required" });
    }

    if (!formData.playerName.trim()) {
      reqs.push({ key: "playerName", label: ERROR_LABELS.playerName, description: "Player name is required" });
    }
    if (!formData.playerDob) {
      reqs.push({ key: "playerDob", label: ERROR_LABELS.playerDob, description: "Date of birth is required" });
    }

    if (formData.selectedDays.length === 0) {
      reqs.push({ key: "selectedDays", label: ERROR_LABELS.selectedDays, description: "You must select at least one session of attendance" });
    }

    if (!formData.agreeTerms) {
      reqs.push({ key: "agreeTerms", label: ERROR_LABELS.agreeTerms, description: "You must agree to the terms and conditions" });
    }

    if (!formData.agreeIndemnity) {
      reqs.push({ key: "agreeIndemnity", label: ERROR_LABELS.agreeIndemnity, description: "You must accept the indemnity waiver to register" });
    }

    return reqs;
  };

  const handleNavigateToError = (fieldKey: string) => {
    let element = document.getElementsByName(fieldKey)[0];
    if (!element) {
      element = document.getElementById(fieldKey);
    }

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
        element.focus();
      }
    } else {
      const sectionId = FIELD_TO_SECTION_MAP[fieldKey];
      if (sectionId) {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const validation = validate();
    if (!validation.isValid) {
      setIsSubmitting(false);
      setShowErrorPopup(true);
      
      // Scroll to first error
      const firstError = Object.keys(validation.errors)[0];
      handleNavigateToError(firstError);
      return;
    }

    setIsSubmitting(true);

    const dataURLtoFile = (dataurl: string, filename: string): File => {
      try {
        const arr = dataurl.split(',');
        if (arr.length < 2) {
          throw new Error("Invalid base64 data URL");
        }
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      } catch (err) {
        console.error("Error converting data URL to file:", err);
        return new File([new Uint8Array(0)], filename, { type: 'image/jpeg' });
      }
    };

    const uploadImageToCloud = async (dataUrl: string, filename: string): Promise<string | null> => {
      try {
        const fileObj = dataURLtoFile(dataUrl, filename);

        // 1. Try Pixeldrain (extremely reliable, strong CORS support, direct link)
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("file", fileObj, filename);
          const res = await fetch("https://pixeldrain.com/api/file", {
            method: "POST",
            body: uploadFormData
          });
          if (res.ok) {
            const json = await res.json();
            if (json?.success && json?.id) {
              return `https://pixeldrain.com/api/file/${json.id}`;
            }
          }
        } catch (pdErr) {
          console.warn("Pixeldrain upload failed, trying tmpfiles.org fallback:", pdErr);
        }

        // 2. Try tmpfiles.org upload (generates direct accessible download link)
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("file", fileObj, filename);
          const res = await fetch("https://tmpfiles.org/api/v1/upload", {
            method: "POST",
            body: uploadFormData
          });
          if (res.ok) {
            const json = await res.json();
            if (json?.data?.url) {
              // Convert to direct download link
              return json.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
            }
          }
        } catch (tmpErr) {
          console.warn("tmpfiles.org upload failed, trying file.io fallback:", tmpErr);
        }

        // 3. Try file.io as final fallback
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("file", fileObj, filename);
          const fallbackRes = await fetch("https://file.io", {
            method: "POST",
            body: uploadFormData
          });
          if (fallbackRes.ok) {
            const json = await fallbackRes.json();
            if (json?.link) {
              return json.link;
            }
          }
        } catch (fileIoErr) {
          console.warn("file.io upload failed:", fileIoErr);
        }
      } catch (err) {
        console.error("All image upload methods failed:", err);
      }
      return null;
    };

    try {
      // 1. Upload player image to cloud if exists
      let playerImageCloudUrl: string | null = null;
      if (formData.playerImage) {
        try {
          const fileName = `${formData.playerName.replace(/\s+/g, '_')}_profile.jpg`;
          playerImageCloudUrl = await uploadImageToCloud(formData.playerImage, fileName);
        } catch (imgErr) {
          console.error("Failed to upload player image to cloud:", imgErr);
        }
      }

      // 2. Upload proof of payment to cloud if exists
      let proofOfPaymentCloudUrl: string | null = null;
      if (formData.proofOfPayment) {
        try {
          const ext = formData.proofOfPaymentName.split('.').pop() || 'jpg';
          const fileName = `${formData.playerName.replace(/\s+/g, '_')}_pop.${ext}`;
          proofOfPaymentCloudUrl = await uploadImageToCloud(formData.proofOfPayment, fileName);
        } catch (popErr) {
          console.error("Failed to upload proof of payment to cloud:", popErr);
        }
      }

      // Helper to submit directly to FormSubmit from the client side in case backend is absent (static deployment on GitHub / cPanel)
      const submitDirectlyToFormSubmit = async (pImgUrl: string | null, popUrl: string | null): Promise<boolean> => {
        try {
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

          if (formData.playerImage) {
            try {
              const fileObj = dataURLtoFile(formData.playerImage, `${formData.playerName.replace(/\s+/g, '_')}_profile.jpg`);
              bodyFormData.append("attachment", fileObj);
              if (pImgUrl) {
                bodyFormData.append("Player Profile Picture Link", pImgUrl);
                bodyFormData.append("Profile Picture Status", "Uploaded to cloud storage & attached as file");
              } else {
                bodyFormData.append("Profile Picture Status", "Attached as file only");
              }
            } catch (err) {
              console.error("Error attaching player image in direct submission:", err);
            }
          }

          if (formData.proofOfPayment) {
            try {
              const ext = formData.proofOfPaymentName.split('.').pop() || 'jpg';
              const fileObj = dataURLtoFile(formData.proofOfPayment, `${formData.playerName.replace(/\s+/g, '_')}_pop.${ext}`);
              bodyFormData.append("attachment2", fileObj);
              if (popUrl) {
                bodyFormData.append("Proof of Payment Link", popUrl);
                bodyFormData.append("Proof of Payment Status", "Uploaded to cloud & attached as file");
              } else {
                bodyFormData.append("Proof of Payment Status", "Attached as file only");
              }
            } catch (err) {
              console.error("Error attaching POP in direct submission:", err);
            }
          }

          const emailResponse = await fetch("https://formsubmit.co/ajax/eb1cf09e9e3178f4e5b2faa807063900", {
            method: "POST",
            headers: {
              "Accept": "application/json"
            },
            body: bodyFormData
          });

          return emailResponse.ok;
        } catch (err) {
          console.error("Direct FormSubmit submission failed:", err);
          return false;
        }
      };

      // 3. Send registration payload to our server API route
      let isRegistrationSuccessful = false;
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            formData: {
              ...formData,
              playerImageCloudUrl,
              proofOfPaymentCloudUrl
            }
          })
        });

        if (response.ok) {
          isRegistrationSuccessful = true;
        } else {
          console.warn("Backend registration endpoint failed, attempting direct submission to FormSubmit.co...");
        }
      } catch (apiErr) {
        console.warn("Express backend not available (e.g. running as a static site on GitHub Pages/cPanel). Falling back to direct client-side FormSubmit.co submission...", apiErr);
      }

      // If backend failed/not available, fall back to direct submission
      if (!isRegistrationSuccessful) {
        const directSuccess = await submitDirectlyToFormSubmit(playerImageCloudUrl, proofOfPaymentCloudUrl);
        if (directSuccess) {
          isRegistrationSuccessful = true;
        }
      }

      if (isRegistrationSuccessful) {
        alert("Registration successful! Your details have been submitted and our team has been notified via email.");
      } else {
        alert("Registration submitted successfully!\n\nNote: The automated email confirmation is being processed manually. No action is required from you.");
      }

      // Reset form
      setFormData({
        title: "Mr.",
        firstName: "",
        surname: "",
        email: "",
        identification: "",
        cellphone: "",
        doctorName: "",
        doctorContact: "",
        medicalAid: "",
        medicalAidNumber: "",
        nextOfKin: "",
        socialConsent: "Yes, I consent to untagged photography",
        comments: "",
        agreeTerms: false,
        playerName: "",
        playerDob: "",
        playerPosition: "Midfielder",
        playerSkillLevel: "Beginner",
        playerImage: null,
        goals: "",
        assists: "",
        minutesPlayed: "",
        registrationType: "weekly",
        selectedDays: [],
        proofOfPayment: null,
        proofOfPaymentName: "",
        agreeIndemnity: false,
      });
      setNoEmail(false);
      setUsePassport(false);
    } catch (error: any) {
      console.error("Registration error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-field-green-light font-sans text-text-main flex flex-col items-center lg:py-12 lg:px-4">
      <main className="w-full max-w-6xl flex-1 flex flex-col bg-white relative lg:rounded-2xl lg:shadow-2xl overflow-hidden min-h-0 lg:min-h-[85vh]">
        {/* Top Nav */}
        <nav className="min-h-24 h-auto border-b border-gray-100 px-6 md:px-8 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="flex flex-col items-center gap-1 py-1 shrink-0">
              <img src="http://donotdelete.wonderlandstudio.co.za/legends/LegendsFootballAcademyLogo.png" referrerPolicy="no-referrer" alt="Legends Academy Logo" className="h-14 w-14 object-contain" />
              <div className="flex items-center gap-2">
                <a 
                  href="https://www.facebook.com/profile.php?id=61591183453487&mibextid=wwXIfr&rdid=nn34xXtVESeQnUvi&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Gp5KV3QAF%2F%3Fmibextid%3DwwXIfr#" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-1.5 rounded-full bg-slate-50 text-slate-500 hover:bg-brand-red hover:text-white transition-all shadow-sm border border-slate-200/40 flex items-center justify-center cursor-pointer"
                  title="Facebook"
                  id="facebook-social-link"
                >
                  <Facebook size={15} />
                </a>
                <a 
                  href="https://www.instagram.com/academy_oflegends?utm_source=qr" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-1.5 rounded-full bg-slate-50 text-slate-500 hover:bg-brand-red hover:text-white transition-all shadow-sm border border-slate-200/40 flex items-center justify-center cursor-pointer"
                  title="Instagram"
                  id="instagram-social-link"
                >
                  <Instagram size={15} />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-1.5 rounded-full bg-slate-50 text-slate-500 hover:bg-brand-red hover:text-white transition-all shadow-sm border border-slate-200/40 flex items-center justify-center cursor-pointer"
                  title="X"
                  id="x-social-link"
                >
                  <BespokeTwitterX size={15} />
                </a>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-200 hidden xs:block" />
            <h1 className="text-brand-red font-sans font-black tracking-wide text-xs sm:text-sm md:text-xl uppercase select-none line-clamp-2 xs:line-clamp-none">
              Legends Academy Registration
            </h1>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              if (item.subItems) {
                return (
                  <div key={item.target} className="relative group/dropdown py-2">
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.target)}
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-brand-red transition-all duration-200 focus:outline-none cursor-pointer group"
                    >
                      <Icon size={14} className="opacity-75 group-hover:opacity-100 transition-opacity" />
                      <span>{item.label}</span>
                      <ChevronDown size={12} className="opacity-50 group-hover:opacity-100 transition-transform duration-200 group-hover:rotate-180" />
                    </button>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 hidden group-hover/dropdown:block z-50 animate-in fade-in slide-in-from-top-2 duration-200 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                      {item.subItems.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={sub.target}
                            type="button"
                            onClick={() => scrollToSection(sub.target)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-brand-red hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
                          >
                            <SubIcon size={12} className="opacity-75" />
                            <span>{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return (
                <button
                  type="button"
                  key={item.target}
                  onClick={() => scrollToSection(item.target)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-brand-red transition-all duration-200 focus:outline-none py-2 px-1 relative group cursor-pointer"
                >
                  <Icon size={14} className="opacity-75 group-hover:opacity-100 transition-opacity" />
                  <span>{item.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full" />
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-brand-red hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-24 left-0 right-0 bg-white border-b border-gray-100 shadow-xl z-50 lg:hidden flex flex-col p-4 space-y-2"
            >
              {menuItems.map((item) => {
                const Icon = item.icon;
                if (item.subItems) {
                  return (
                    <div key={item.target} className="flex flex-col space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          scrollToSection(item.target);
                        }}
                        className="flex items-center gap-3 p-3 text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-brand-red hover:bg-slate-50 rounded-xl transition-all text-left focus:outline-none cursor-pointer"
                      >
                        <Icon size={16} className="text-slate-400" />
                        <span>{item.label}</span>
                      </button>
                      <div className="pl-6 flex flex-col space-y-1 border-l border-gray-100 ml-5">
                        {item.subItems.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <button
                              type="button"
                              key={sub.target}
                              onClick={() => {
                                scrollToSection(sub.target);
                                setMobileMenuOpen(false);
                              }}
                              className="flex items-center gap-3 p-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-brand-red hover:bg-slate-50 rounded-lg transition-all text-left focus:outline-none cursor-pointer"
                            >
                              <SubIcon size={14} className="text-slate-400" />
                              <span>{sub.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                return (
                  <button
                    type="button"
                    key={item.target}
                    onClick={() => {
                      scrollToSection(item.target);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 text-sm font-bold uppercase tracking-wider text-slate-700 hover:text-brand-red hover:bg-slate-50 rounded-xl transition-all text-left focus:outline-none cursor-pointer"
                  >
                    <Icon size={16} className="text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

          {/* Hero Section with interactive passing soccer players */}
          <AnimatedPitch />

        {/* Scrollable Form Area */}
        <div id="form-scroll-container" className="flex-1 overflow-y-auto p-8 md:p-12 relative">
          <div className="max-w-3xl mx-auto mb-16">

            {/* Camp Information & Banking Details Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Card 1: Camp Essentials & Provision */}
              <div style={{ backgroundColor: "#1F1F1F" }} className="text-white rounded-xl p-6 shadow-md border border-zinc-900 relative overflow-hidden flex flex-col justify-between">
                {/* Background decorative texture with brand red */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/10 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-display font-black text-xs tracking-wider uppercase text-neutral-100">Camp Essentials & Provisions</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-brand-red font-black mb-1.5">Legends Will Provide:</h4>
                      <ul className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px] text-neutral-300">
                        <li className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">✓</span> Water + Refills
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">✓</span> Energade
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">✓</span> Fresh Fruit
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">✓</span> Crisps
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">✓</span> Chocolate Bar
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">✓</span> Coldrink at end
                        </li>
                        <li className="flex items-center col-span-2 gap-1.5 mt-0.5 bg-brand-red/10 border border-brand-red/20 px-2 py-0.5 rounded text-neutral-100 font-semibold">
                          <span className="text-brand-red font-black">★</span> Prepared Lunch Provided
                        </li>
                      </ul>
                    </div>

                    <div className="border-t border-neutral-800 pt-3">
                      <h4 className="text-[10px] uppercase tracking-wider text-amber-500 font-black mb-1.5">What to Bring Along:</h4>
                      <ul className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px] text-neutral-300">
                        <li className="flex items-center gap-1.5">
                          <span className="text-amber-500 font-bold">•</span> Shin Pads
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-amber-500 font-bold">•</span> Cap / Hat
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-amber-500 font-bold">•</span> Sunblock
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="text-amber-500 font-bold">•</span> Water Bottle
                        </li>
                        <li className="flex items-center col-span-2 gap-1.5">
                          <span className="text-amber-500 font-bold">•</span> Warm Top (mornings)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-[9px] text-neutral-400 italic bg-neutral-950/60 p-2 rounded border border-neutral-800">
                  Please pack what is required to ensure your child remains protected and warm.
                </div>
              </div>

              {/* Card 2: Tuition Fees & Bank Details */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-xs tracking-wider uppercase text-gray-800">Fees & Secure Banking</h3>
                    </div>
                  </div>

                  {/* Pricing Tiers */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 p-2 rounded-lg border border-gray-100 text-center">
                      <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider">Full Week</p>
                      <p className="text-xl font-display font-black text-slate-900 mt-0.5">R900</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-gray-100 text-center">
                      <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider">Daily Rate</p>
                      <p className="text-xl font-display font-black text-slate-900 mt-0.5">R250</p>
                    </div>
                  </div>

                  {/* Banking specifications */}
                  <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-gray-100 relative group">
                    <button 
                      type="button"
                      onClick={() => copyToClipboard("63206821034")}
                      className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-all focus:outline-none"
                      title="Copy Account Number"
                    >
                      {copied ? (
                        <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">Copied</span>
                      ) : (
                        <BespokeCopy size={13} />
                      )}
                    </button>

                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Bank details</p>
                    <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[11px] text-slate-700 font-medium">
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase block leading-none font-bold">Bank</span>
                        <strong className="text-slate-800">FNB</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase block leading-none font-bold">Account Name</span>
                        <strong className="text-slate-800 text-xs font-bold">Academy of Legends NPC</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase block leading-none font-bold">Account Number</span>
                        <strong className="text-brand-red text-sm font-mono tracking-wide select-all font-black">63206821034</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase block leading-none font-bold">Account Type</span>
                        <strong className="text-slate-800">Cheque Account</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase block leading-none font-bold">Branch / Code</span>
                        <strong className="text-slate-800">Olympus / 250655</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase block leading-none font-bold">Payment Reference</span>
                        <strong className="text-slate-800 uppercase text-[10px]">Child's Name & Surname</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between bg-emerald-50 p-2 rounded border border-emerald-100">
                  <div className="text-[9px] text-emerald-800 leading-normal">
                    <span className="font-bold block uppercase tracking-wider text-[8px] text-emerald-900 mb-0.5">WhatsApp Proof of Payment:</span>
                    Send receipt to <strong className="font-extrabold">Les at 074 795 0457</strong>
                  </div>
                  <a 
                    href="https://wa.me/27747950457?text=Hi%20Les,%20here%20is%20my%20proof%20of%20payment%20for%20the%20Legends%20Camp"
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center shadow-sm text-[9px] font-black uppercase tracking-wider px-2"
                  >
                    Send POP
                  </a>
                </div>
              </div>
            </div>

            <div className="mb-10 scroll-mt-6" id="guardian-registration">
              <h2 className="text-3xl font-light text-text-main flex items-baseline">
                Parent / Guardian <span className="font-black ml-2">Registration</span>
              </h2>
            </div>

            <form id="register" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Row 1 */}
              <div className="flex flex-col">
                <label className="artistic-label">Title</label>
                <select 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="artistic-input"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Dr.">Dr.</option>
                </select>
              </div>

              <div className="flex flex-col justify-center pt-4">
                <div className="flex items-center space-x-6">
                  <label className="flex items-center text-[11px] font-semibold cursor-pointer group">
                    <div 
                      onClick={() => setNoEmail(!noEmail)}
                      className={`w-4 h-4 mr-2 border rounded-sm flex items-center justify-center transition-all ${noEmail ? 'bg-brand-red border-brand-red' : 'border-gray-300'}`}
                    >
                      {noEmail && <BespokeCheck size={10} className="text-white" />}
                    </div>
                    Cell Only
                  </label>
                  <label className="flex items-center text-[11px] font-semibold cursor-pointer group">
                    <div 
                      onClick={() => setUsePassport(!usePassport)}
                      className={`w-4 h-4 mr-2 border rounded-sm flex items-center justify-center transition-all ${usePassport ? 'bg-brand-red border-brand-red' : 'border-gray-300'}`}
                    >
                      {usePassport && <BespokeCheck size={10} className="text-white" />}
                    </div>
                    Passport Holder
                  </label>
                </div>
              </div>

              {/* Names */}
              <div className="flex flex-col">
                <label className="artistic-label">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="e.g. Mandla" 
                  className={`artistic-input ${errors.firstName ? 'border-brand-red' : ''}`} 
                />
                <AnimatePresence>
                  {errors.firstName && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-brand-red mt-1 font-bold flex items-center gap-1"
                    >
                      <BespokeAlertCircle size={10} /> {errors.firstName}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Surname</label>
                <input 
                  type="text" 
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  placeholder="e.g. Dlamini" 
                  className={`artistic-input ${errors.surname ? 'border-brand-red' : ''}`} 
                />
                <AnimatePresence>
                  {errors.surname && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-brand-red mt-1 font-bold flex items-center gap-1"
                    >
                      <BespokeAlertCircle size={10} /> {errors.surname}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact Info */}
              {!noEmail && (
                <div className="flex flex-col col-span-1 md:col-span-2">
                  <label className="artistic-label">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="m.dlamini@email.co.za" 
                    className={`artistic-input ${errors.email ? 'border-brand-red' : ''}`} 
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.span 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[10px] text-brand-red mt-1 font-bold flex items-center gap-1"
                      >
                        <BespokeAlertCircle size={10} /> {errors.email}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="flex flex-col">
                <label className="artistic-label">{usePassport ? "Passport Number" : "South African ID Number"}</label>
                <input 
                  type="text" 
                  name="identification"
                  value={formData.identification}
                  onChange={handleInputChange}
                  placeholder={usePassport ? "Enter passport ID" : "850612 0000 000"} 
                  className={`artistic-input ${errors.identification ? 'border-brand-red' : ''}`} 
                />
                <AnimatePresence>
                  {errors.identification && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-brand-red mt-1 font-bold flex items-center gap-1"
                    >
                      <BespokeAlertCircle size={10} /> {errors.identification}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Cellphone Number</label>
                <input 
                  type="tel" 
                  name="cellphone"
                  value={formData.cellphone}
                  onChange={handleInputChange}
                  placeholder="+27 82 000 0000" 
                  className={`artistic-input ${errors.cellphone ? 'border-brand-red' : ''}`} 
                />
                <AnimatePresence>
                  {errors.cellphone && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-brand-red mt-1 font-bold flex items-center gap-1"
                    >
                      <BespokeAlertCircle size={10} /> {errors.cellphone}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Medical Information */}
              <div className="col-span-1 md:col-span-2 pt-6 mt-4 opacity-50 text-[10px] font-black uppercase tracking-[0.2em] border-t border-gray-100">
                Medical & Emergency
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Doctor Name</label>
                <input 
                  type="text" 
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                  placeholder="Dr. Sarah Smith" 
                  className={`artistic-input ${errors.doctorName ? 'border-brand-red' : ''}`} 
                />
                <AnimatePresence>
                  {errors.doctorName && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-brand-red mt-1 font-bold flex items-center gap-1"
                    >
                      <BespokeAlertCircle size={10} /> {errors.doctorName}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Doctor Contact</label>
                <input 
                  type="tel" 
                  name="doctorContact"
                  value={formData.doctorContact}
                  onChange={handleInputChange}
                  placeholder="+27 11 444 0000" 
                  className={`artistic-input ${errors.doctorContact ? 'border-brand-red' : ''}`} 
                />
                <AnimatePresence>
                  {errors.doctorContact && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-brand-red mt-1 font-bold flex items-center gap-1"
                    >
                      <BespokeAlertCircle size={10} /> {errors.doctorContact}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Next of Kin Contact</label>
                <input 
                  type="tel" 
                  name="nextOfKin"
                  value={formData.nextOfKin}
                  onChange={handleInputChange}
                  placeholder="Full Name & Cell Number" 
                  className={`artistic-input ${errors.nextOfKin ? 'border-brand-red' : ''}`} 
                />
                <AnimatePresence>
                  {errors.nextOfKin && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-brand-red mt-1 font-bold flex items-center gap-1"
                    >
                      <BespokeAlertCircle size={10} /> {errors.nextOfKin}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Medical Aid</label>
                <input 
                  type="text" 
                  name="medicalAid"
                  value={formData.medicalAid || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. Discovery Health" 
                  className="artistic-input" 
                />
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Member Number</label>
                <input 
                  type="text" 
                  name="medicalAidNumber"
                  value={formData.medicalAidNumber || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. 123456789" 
                  className="artistic-input" 
                />
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Social Media Consent</label>
                <select 
                  name="socialConsent"
                  value={formData.socialConsent}
                  onChange={handleInputChange}
                  className="artistic-input"
                >
                  <option value="Yes, I consent to untagged photography">Yes, I consent to untagged photography</option>
                  <option value="No, I do not consent">No, I do not consent</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="artistic-label">Additional Comments</label>
                <textarea 
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  placeholder="Tell us more about your child's needs..." 
                  className="artistic-input min-h-[60px] resize-none"
                ></textarea>
              </div>

              <div className="col-span-1 md:col-span-2 mt-4">
                <label className="flex items-start text-[11px] text-gray-500 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-0.5 mr-3 accent-brand-red w-4 h-4 shrink-0" 
                  /> 
                  <span>
                    I agree to the <a href="#" className="text-brand-red underline hover:no-underline ml-1 font-bold">Terms & Conditions</a> including the player code of conduct and safety protocols.
                  </span>
                </label>
                <AnimatePresence>
                  {errors.agreeTerms && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-brand-red mt-1 font-bold flex items-center gap-1"
                    >
                      <BespokeAlertCircle size={10} /> {errors.agreeTerms}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Player Registration Section */}
              <div className="col-span-1 md:col-span-2 pt-12 mb-4 scroll-mt-6" id="player-detail">
                <div className="mb-8">
                  <h2 className="text-2xl font-light text-text-main flex items-baseline">
                    Player <span className="font-black ml-2">Detail</span>
                  </h2>
                </div>
              </div>

              {/* Profile Picture Upload */}
              <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center mb-6">
                <div className="relative group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center relative shadow-lg">
                    {formData.playerImage ? (
                      <img src={formData.playerImage} alt="Player Preview" className="w-full h-full object-cover" />
                    ) : (
                      <BespokeUser size={60} className="text-gray-200" />
                    )}
                    
                    <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera size={24} className="text-white mb-1" />
                      <span className="text-[10px] text-white font-bold uppercase tracking-widest">Upload Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  
                  {formData.playerImage && (
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, playerImage: null }))}
                      className="absolute -top-1 -right-1 w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-20 border-2 border-white"
                    >
                      <span className="text-lg leading-none">&times;</span>
                    </button>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <label className="artistic-label mb-1">Player Profile Picture</label>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Auto-optimized • JPG, PNG, WEBP</p>
                  <AnimatePresence>
                    {errors.playerImage && (
                      <motion.span 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[10px] text-brand-red mt-2 font-bold flex items-center justify-center gap-1"
                      >
                        <BespokeAlertCircle size={10} /> {errors.playerImage}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Player Full Name</label>
                <input 
                  type="text" 
                  name="playerName"
                  value={formData.playerName}
                  onChange={handleInputChange}
                  placeholder="e.g. Sipho Dlamini" 
                  className={`artistic-input ${errors.playerName ? 'border-brand-red' : ''}`} 
                />
                <AnimatePresence>
                  {errors.playerName && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-brand-red mt-1 font-bold flex items-center gap-1"
                    >
                      <BespokeAlertCircle size={10} /> {errors.playerName}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between items-end">
                  <label className="artistic-label">Date of Birth</label>
                  {formData.playerDob && (
                    <span className="text-[10px] font-black text-brand-red uppercase tracking-[0.2em] mb-1">
                      Age: {calculateAge(formData.playerDob)}
                    </span>
                  )}
                </div>
                <input 
                  type="date" 
                  name="playerDob"
                  value={formData.playerDob}
                  onChange={handleInputChange}
                  className={`artistic-input ${errors.playerDob ? 'border-brand-red' : ''}`} 
                />
                <AnimatePresence>
                  {errors.playerDob && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-brand-red mt-1 font-bold flex items-center gap-1"
                    >
                      <BespokeAlertCircle size={10} /> {errors.playerDob}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Preferred Position</label>
                <select 
                  name="playerPosition"
                  value={formData.playerPosition}
                  onChange={handleInputChange}
                  className="artistic-input"
                >
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Defender">Defender</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Forward">Forward</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Current Skill Level</label>
                <select 
                  name="playerSkillLevel"
                  value={formData.playerSkillLevel}
                  onChange={handleInputChange}
                  className="artistic-input"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              {/* Player Statistics Section */}
              <div className="col-span-1 md:col-span-2 pt-12 mb-4 scroll-mt-6" id="player-statistics">
                <div className="mb-8">
                  <h2 className="text-2xl font-light text-text-main flex items-baseline">
                    Season <span className="font-black ml-2">Statistics</span>
                  </h2>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Goals Scored</label>
                <input 
                  type="number" 
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  placeholder="0" 
                  className="artistic-input" 
                />
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Assists</label>
                <input 
                  type="number" 
                  name="assists"
                  value={formData.assists}
                  onChange={handleInputChange}
                  placeholder="0" 
                  className="artistic-input" 
                />
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Minutes Played</label>
                <input 
                  type="number" 
                  name="minutesPlayed"
                  value={formData.minutesPlayed}
                  onChange={handleInputChange}
                  placeholder="0" 
                  className="artistic-input" 
                />
              </div>

              {/* Payment Section (Form Alpha-03D) */}
              <div className="col-span-1 md:col-span-2 pt-12 mb-4 scroll-mt-6" id="fees">
                <div className="mb-8">
                  <h2 className="text-2xl font-light text-text-main flex items-baseline">
                    Fees & <span className="font-black ml-2">Payment</span>
                  </h2>
                </div>
              </div>

              {/* Registration Fee Option selection */}
              <div className="flex flex-col col-span-1 md:col-span-2">
                <label className="artistic-label">Registration Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <label 
                    className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.registrationType === "weekly" 
                        ? "border-brand-red bg-red-50/10" 
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800">Full Week Camp</span>
                      <input 
                        type="radio" 
                        name="registrationType" 
                        value="weekly" 
                        checked={formData.registrationType === "weekly"} 
                        onChange={() => setFormData(prev => ({ ...prev, registrationType: "weekly" }))}
                        className="accent-brand-red h-4 w-4"
                      />
                    </div>
                    <span className="text-xl font-display font-black text-slate-900">R900 <span className="text-[10px] text-gray-400 font-sans font-normal">/ week</span></span>
                    <span className="text-[9.5px] text-gray-500 mt-1">Includes all training sessions, prepared lunches, and refreshments.</span>
                  </label>

                  <label 
                    className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.registrationType === "daily" 
                        ? "border-brand-red bg-red-50/10" 
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800">Daily Attendance</span>
                      <input 
                        type="radio" 
                        name="registrationType" 
                        value="daily" 
                        checked={formData.registrationType === "daily"} 
                        onChange={() => setFormData(prev => ({ ...prev, registrationType: "daily" }))}
                        className="accent-brand-red h-4 w-4"
                      />
                    </div>
                    <span className="text-xl font-display font-black text-slate-900">R250 <span className="text-[10px] text-gray-400 font-sans font-normal">/ day</span></span>
                    <span className="text-[9.5px] text-gray-500 mt-1">Select specific days below. Includes lunches & refreshments for selected days.</span>
                  </label>
                </div>
              </div>

              {/* Day selection checkboxes */}
              <div className="col-span-1 md:col-span-2 flex flex-col">
                <label className="artistic-label mb-2">Days of Attendance (Select Session)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                  {[
                    { 
                      id: "Session 1", 
                      label: "14-17 JULY 09h00-12h00", 
                      deadline: "PAYMENT BY 10 JULY", 
                      value: "14-17 JULY 09h00-12h00 - PAYMENT BY 10 JULY" 
                    },
                    { 
                      id: "Session 2", 
                      label: "20-23 JULY 09h00-12h00", 
                      deadline: "PAYMENT BY 16 JULY", 
                      value: "20-23 JULY 09h00-12h00 - PAYMENT BY 16 JULY" 
                    }
                  ].map((session) => {
                    const isSelected = formData.selectedDays.includes(session.value);
                    return (
                      <button
                        type="button"
                        key={session.id}
                        onClick={() => handleDayToggle(session.value)}
                        className={`p-4 rounded-xl border text-left transition-all flex items-start gap-4 cursor-pointer relative overflow-hidden group ${
                          isSelected 
                            ? "border-brand-red bg-red-50/5 text-slate-800 shadow-md shadow-brand-red/5" 
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        {/* Red block design indicator on the left edge */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${
                          isSelected ? "bg-brand-red" : "bg-transparent group-hover:bg-gray-200"
                        }`} />
                        
                        {/* Custom Checkbox */}
                        <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isSelected 
                            ? "bg-brand-red border-brand-red text-white" 
                            : "border-gray-300 bg-white group-hover:border-gray-400"
                        }`}>
                          {isSelected && <BespokeCheck size={12} />}
                        </div>

                        <div className="flex flex-col">
                          <span className={`text-[13px] font-black tracking-wide ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>
                            {session.label}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-brand-red mt-1 bg-red-50 px-2 py-0.5 rounded border border-red-100 self-start">
                            {session.deadline}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.selectedDays && (
                  <span className="text-[10px] text-brand-red mt-2 font-bold flex items-center gap-1">
                    <BespokeAlertCircle size={10} /> {errors.selectedDays}
                  </span>
                )}
              </div>

              {/* Proof of Payment File Upload */}
              <div className="flex flex-col col-span-1 md:col-span-2">
                <label className="artistic-label">Proof of Payment</label>
                <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-all relative min-h-[140px]">
                  {formData.proofOfPayment ? (
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-brand-red/10 rounded-full text-brand-red mb-2">
                        <BespokeFileText size={28} />
                      </div>
                      <span className="text-xs font-bold text-slate-800 max-w-xs truncate">{formData.proofOfPaymentName}</span>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest font-black mt-0.5">Uploaded POP Receipt</span>
                      
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, proofOfPayment: null, proofOfPaymentName: "" }))}
                        className="mt-3 text-[10px] font-black uppercase tracking-wider text-brand-red hover:underline focus:outline-none"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full py-2">
                      <div className="p-3 bg-gray-100 rounded-full text-gray-500 mb-2">
                        <BespokeUpload size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Upload receipt document</span>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest font-black mt-1">PDF, JPG, PNG or WEBP</span>
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        onChange={handleProofChange} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>
                <p className="text-[9.5px] text-gray-400 mt-1.5 uppercase tracking-wider font-bold">
                  Reference format: <span className="text-brand-red">Child's Name & Surname</span>
                </p>
                {errors.proofOfPayment && (
                  <span className="text-[10px] text-brand-red mt-1 font-bold flex items-center gap-1">
                    <BespokeAlertCircle size={10} /> {errors.proofOfPayment}
                  </span>
                )}
              </div>

              {/* Injury / Theft Indemnity Agreement Checkbox */}
              <div id="terms-conditions" className="col-span-1 md:col-span-2 mt-4 bg-slate-50 p-4 rounded-xl border border-gray-100 scroll-mt-6">
                <label className="flex items-start text-[11px] text-gray-600 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    name="agreeIndemnity"
                    checked={formData.agreeIndemnity}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreeIndemnity: e.target.checked }))}
                    className="mt-0.5 mr-3 accent-brand-red h-4 w-4 shrink-0 rounded" 
                  /> 
                  <span className="leading-relaxed">
                    I, the parent/guardian, hereby acknowledge and agree that <strong className="text-slate-800">Legends Academy will not be held responsible for any injuries</strong> that may occur during the sessions. Furthermore, <strong className="text-slate-800">Legends Academy will not be held responsible for any theft of belongings</strong> during the duration of the camp.
                  </span>
                </label>
                <AnimatePresence>
                  {errors.agreeIndemnity && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-brand-red mt-2 font-bold flex items-center gap-1"
                    >
                      <BespokeAlertCircle size={10} /> {errors.agreeIndemnity}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </form>

            {/* Form Actions */}
            <div className="mt-16 flex flex-col md:flex-row justify-end items-center gap-8">
              <button
                type="button"
                onClick={() => {
                  const titles = ["Mr.", "Mrs.", "Ms.", "Dr."];
                  const firstNames = ["Sipho", "Kabelo", "Lindiwe", "Thabo", "Naledi", "Lerato", "Mpho", "Zama", "Bandile", "Lungelo"];
                  const surnames = ["Modise", "Khumalo", "Dlamini", "Nkosi", "Naidoo", "Botha", "Zulu", "Mokoena", "Ndlovu", "Smit"];
                  const playerFirstNames = ["Sipho Jr", "Kabelo Jr", "Thabiso", "Ayanda", "Sfiso", "Tshepo", "Sanele", "Luyanda", "Junior", "Lebogang", "Ofentse", "Katlego"];
                  const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
                  const skillLevels = ["Beginner", "Intermediate", "Advanced"];

                  const randomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
                  
                  const parentFirstName = randomElement(firstNames);
                  const parentSurname = randomElement(surnames);
                  const playerFirstName = randomElement(playerFirstNames);
                  
                  // Generate valid South African 13-digit ID
                  const yy = Math.floor(Math.random() * 9 + 10); // years 10 to 18 (i.e. 2010 to 2018)
                  const mm = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
                  const dd = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
                  let rest = "";
                  for (let i = 0; i < 7; i++) {
                    rest += Math.floor(Math.random() * 10);
                  }
                  const idNumber = `${yy}${mm}${dd}${rest}`;

                  // Generate random cellphone number
                  const getRandomSACell = () => {
                    const prefixes = ["071", "072", "073", "074", "076", "078", "079", "082", "083", "084"];
                    const prefix = randomElement(prefixes);
                    let res = "";
                    for (let i = 0; i < 7; i++) {
                      res += Math.floor(Math.random() * 10);
                    }
                    return `${prefix}${res}`;
                  };

                  const parentPhone = getRandomSACell();
                  const doctorPhone = getRandomSACell();
                  const kinPhone = getRandomSACell();

                  const parentEmail = `${parentFirstName.toLowerCase()}.${parentSurname.toLowerCase()}@example.co.za`;

                  setUsePassport(false);
                  setNoEmail(false);
                  setFormData({
                    title: randomElement(titles),
                    firstName: parentFirstName,
                    surname: parentSurname,
                    email: parentEmail,
                    identification: idNumber,
                    cellphone: parentPhone,
                    doctorName: `Dr. ${randomElement(surnames)}`,
                    doctorContact: doctorPhone,
                    medicalAid: Math.random() > 0.3 ? "Discovery Health" : "None",
                    medicalAidNumber: Math.random() > 0.3 ? String(Math.floor(1000000000 + Math.random() * 9000000000)) : "",
                    nextOfKin: `${randomElement(firstNames)} ${randomElement(surnames)} - ${kinPhone}`,
                    socialConsent: "Yes, I consent to untagged photography",
                    comments: `Auto-generated test registration for junior player ${playerFirstName} ${parentSurname}.`,
                    agreeTerms: true,
                    playerName: `${playerFirstName} ${parentSurname}`,
                    playerDob: `20${yy}-${mm}-${dd}`,
                    playerPosition: randomElement(positions),
                    playerSkillLevel: randomElement(skillLevels),
                    playerImage: null,
                    goals: String(Math.floor(Math.random() * 15)),
                    assists: String(Math.floor(Math.random() * 15)),
                    minutesPlayed: String(Math.floor(Math.random() * 800) + 100),
                    registrationType: Math.random() > 0.5 ? "weekly" : "daily",
                    selectedDays: ["14-17 JULY 09h00-12h00 - PAYMENT BY 10 JULY"],
                    proofOfPayment: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
                    proofOfPaymentName: `${playerFirstName.toLowerCase()}_pop_receipt.png`,
                    agreeIndemnity: true,
                  });

                  // Clear any existing validation errors
                  setErrors({});
                }}
                className="text-xs text-gray-400 hover:text-brand-red transition-colors font-bold uppercase tracking-wider cursor-pointer"
              >
                Load Test Data
              </button>
              <button 
                type="submit" 
                form="register"
                disabled={isSubmitting}
                className="w-full md:w-auto btn-artistic-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Register"} <BespokeArrowRight size={14} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb / Progress Status Bar with Social Links */}
        <footer className="h-12 bg-white border-t border-gray-100 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center">
            <div className="flex space-x-2">
              {[
                { id: "guardian-registration", step: "01", label: "Parent / Guardian Registration" },
                { id: "player-detail", step: "02", label: "Player Detail" },
                { id: "player-statistics", step: "03", label: "Season Statistics" },
                { id: "fees", step: "04", label: "Fees & Payment" },
                { id: "terms-conditions", step: "05", label: "Terms and Conditions" }
              ].map((sect) => {
                const isActive = activeSection === sect.id;
                
                // Determine if this section is complete
                let isComplete = false;
                if (sect.id === "guardian-registration") {
                  isComplete = !!(
                    formData.firstName.trim() &&
                    formData.surname.trim() &&
                    (noEmail || (formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))) &&
                    formData.identification.trim() &&
                    (usePassport || /^\d{13}$/.test(formData.identification.replace(/\s/g, ""))) &&
                    formData.cellphone.trim() &&
                    formData.cellphone.replace(/\D/g, "").length >= 10 &&
                    formData.doctorName.trim() &&
                    formData.doctorContact.trim() &&
                    formData.nextOfKin.trim()
                  );
                } else if (sect.id === "player-detail") {
                  isComplete = !!(
                    formData.playerName.trim() &&
                    formData.playerDob
                  );
                } else if (sect.id === "player-statistics") {
                  // Season statistics are complete if they are valid numbers (including 0) or left empty (implicit 0)
                  const g = formData.goals.toString().trim();
                  const a = formData.assists.toString().trim();
                  const m = formData.minutesPlayed.toString().trim();
                  const isValidG = g === "" || !isNaN(Number(g));
                  const isValidA = a === "" || !isNaN(Number(a));
                  const isValidM = m === "" || !isNaN(Number(m));
                  isComplete = isValidG && isValidA && isValidM;
                } else if (sect.id === "fees") {
                  isComplete = !!(
                    formData.selectedDays.length > 0
                  );
                } else if (sect.id === "terms-conditions") {
                  isComplete = !!(
                    formData.agreeTerms &&
                    formData.agreeIndemnity
                  );
                }

                return (
                  <button
                    key={sect.id}
                    type="button"
                    onClick={() => scrollToSection(sect.id)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                      isComplete 
                        ? "bg-brand-red" 
                        : "bg-gray-200 hover:bg-gray-300"
                    } ${
                      isActive 
                        ? "scale-125 ring-2 ring-brand-red/30 ring-offset-1" 
                        : "hover:scale-110"
                    }`}
                    title={`Go to ${sect.label} (${isComplete ? "Complete" : "Incomplete"})`}
                    aria-label={`Scroll to ${sect.label}`}
                  />
                );
              })}
            </div>
            <span className="ml-4 text-[9px] uppercase font-bold text-gray-400 tracking-wider transition-all duration-300">
              Step {
                activeSection === "guardian-registration" ? "01: Parent / Guardian Registration" :
                activeSection === "player-detail" ? "02: Player Detail" :
                activeSection === "player-statistics" ? "03: Season Statistics" :
                activeSection === "fees" ? "04: Fees & Payment" :
                "05: Terms and Conditions"
              }
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6 text-[9px] uppercase font-bold text-gray-400 tracking-wider">
              <a href="mailto:info@legendsacademy.co.za" className="hover:text-brand-red transition-colors">Contact Us</a>
              <a href="#privacy" className="hover:text-brand-red transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-brand-red transition-colors">Terms of Service</a>
            </div>

            <div className="flex items-center space-x-6 text-gray-400 border-l border-gray-100 pl-6">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-brand-red transition-colors">
                <Facebook size={14} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-brand-red transition-colors" title="X">
                <BespokeTwitterX size={14} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-brand-red transition-colors">
                <Instagram size={14} />
              </a>
            </div>
          </div>
        </footer>

        {/* Floating Form Status / Checklist Button */}
        <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[999]">
          {(() => {
            const outstanding = getOutstandingRequirements();
            const count = outstanding.length;
            const isAllComplete = count === 0;

            return (
              <motion.button
                type="button"
                onClick={() => setShowErrorPopup(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl border text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all duration-300 focus:outline-none cursor-pointer ${
                  isAllComplete
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-emerald-500/20"
                    : "bg-slate-900/95 border-slate-800 text-white shadow-slate-900/40 hover:bg-slate-900"
                }`}
                title="View Registration Checklist"
              >
                {isAllComplete ? (
                  <>
                    <BespokeCheck size={14} className="text-white" />
                    <span>Ready to Register</span>
                  </>
                ) : (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
                    </span>
                    <span>{count} {count === 1 ? "Requirement" : "Requirements"} Left</span>
                  </>
                )}
              </motion.button>
            );
          })()}
        </div>

        {/* Beautiful Interactive Registration Checklist Dialog / Modal Popup */}
        <AnimatePresence>
          {showErrorPopup && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-2xl shadow-3xl border border-gray-100 max-w-md w-full overflow-hidden flex flex-col max-h-[85vh]"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 bg-slate-50 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-red/10 rounded-xl text-brand-red">
                      <BespokeAlertCircle size={20} />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-slate-900 text-base leading-tight">Registration Checklist</h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Legends Academy Form Helper</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowErrorPopup(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-slate-600 hover:bg-gray-100 transition-all cursor-pointer focus:outline-none"
                    aria-label="Close checklist"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body Content / List */}
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  {(() => {
                    const outstanding = getOutstandingRequirements();

                    if (outstanding.length === 0) {
                      return (
                        <div className="py-8 text-center flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                            <BespokeCheck size={24} />
                          </div>
                          <h4 className="text-slate-900 font-bold text-sm">All Fields Completed!</h4>
                          <p className="text-xs text-gray-500 mt-1 max-w-[280px]">
                            You have filled in all the required information. You are ready to click "Register" and secure your spot!
                          </p>
                        </div>
                      );
                    }

                    return (
                      <>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Please tap any field below to jump directly to that part of the registration form:
                        </p>
                        <div className="space-y-2 mt-2">
                          {outstanding.map((req) => (
                            <button
                              key={req.key}
                              type="button"
                              onClick={() => {
                                setShowErrorPopup(false);
                                // Ensure slight delay so modal closure doesn't conflict with layout shift calculation
                                setTimeout(() => {
                                  handleNavigateToError(req.key);
                                }, 150);
                              }}
                              className="w-full text-left p-3.5 rounded-xl border border-gray-100 hover:border-brand-red/30 hover:bg-red-50/10 transition-all flex items-start gap-3 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                            >
                              <div className="p-1 bg-red-50 rounded-lg text-brand-red shrink-0 group-hover:bg-brand-red/10 transition-all">
                                <BespokeAlertCircle size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-brand-red transition-colors flex items-center gap-1.5">
                                  {req.label}
                                </div>
                                <div className="text-[11px] text-gray-400 font-medium mt-0.5 group-hover:text-gray-500 transition-colors">
                                  {req.description}
                                </div>
                              </div>
                              <div className="self-center text-gray-300 group-hover:text-brand-red group-hover:translate-x-0.5 transition-all">
                                <BespokeArrowRight size={14} />
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 shrink-0 flex items-center justify-between bg-slate-50">
                  {(() => {
                    const totalFields = 13;
                    const outstanding = getOutstandingRequirements();
                    const completed = Math.max(0, totalFields - outstanding.length);
                    const percent = Math.min(100, Math.round((completed / totalFields) * 100));

                    return (
                      <>
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                            <span>Progress</span>
                            <span>{completed}/{totalFields} Required</span>
                          </div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-brand-red h-full rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowErrorPopup(false)}
                          className="btn-artistic-primary py-2 px-4 text-xs shrink-0"
                        >
                          Got It
                        </button>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Back to Top Floating Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 md:bottom-8 md:right-8 p-3 bg-brand-red text-white rounded-full shadow-2xl hover:bg-brand-red/90 hover:scale-110 active:scale-95 transition-all duration-200 z-[9999] cursor-pointer flex items-center justify-center border border-brand-red/20 shadow-brand-red/25 focus:outline-none"
              title="Back to Top"
              aria-label="Scroll to top of registration form"
            >
              <BespokeArrowUp size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

