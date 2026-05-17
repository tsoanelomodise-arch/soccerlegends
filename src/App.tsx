import { motion, AnimatePresence } from "motion/react";
import { 
  Check,
  ChevronLeft,
  ArrowRight,
  AlertCircle,
  Facebook,
  Twitter,
  Instagram,
  Camera,
  User,
  Upload
} from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  title: string;
  firstName: string;
  surname: string;
  email: string;
  identification: string;
  cellphone: string;
  doctorName: string;
  doctorContact: string;
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
}

interface FormErrors {
  [key: string]: string;
}

export default function App() {
  const [usePassport, setUsePassport] = useState(false);
  const [noEmail, setNoEmail] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title: "Mr.",
    firstName: "",
    surname: "",
    email: "",
    identification: "",
    cellphone: "",
    doctorName: "",
    doctorContact: "",
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
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, playerImage: "Please upload a JPG, PNG or WEBP image." }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, playerImage: "Image must be less than 2MB." }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, playerImage: reader.result as string }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.playerImage;
        return newErrors;
      });
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validate()) {
      // Simulate API call
      setTimeout(() => {
        alert("Registration successful! Welcome to Future Football Stars.");
        setIsSubmitting(false);
      }, 1000);
    } else {
      setIsSubmitting(false);
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.getElementsByName(firstError)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-field-green-light font-sans text-text-main flex flex-col items-center lg:py-12 lg:px-4">
      <main className="w-full max-w-6xl flex-1 flex flex-col bg-white relative lg:rounded-2xl lg:shadow-2xl overflow-hidden min-h-0 lg:min-h-[85vh]">
        {/* Top Nav */}
        <nav className="h-24 border-b border-gray-100 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-12">
            <div className="flex items-center gap-3">
              <img src="https://socceracademy.wonderlandstudio.co.za/images/Logo_clear_background.png" alt="Legends Academy Logo" className="h-20 w-20 object-contain" referrerPolicy="no-referrer" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black tracking-tight text-text-main leading-tight">LEGENDS</span>
                <span className="text-[8px] font-bold text-gray-400 tracking-[0.2em] uppercase leading-tight">Academy</span>
              </div>
            </div>
            <div className="flex space-x-8">
              <a href="#register" className="text-[10px] font-bold uppercase tracking-widest text-brand-red border-b-2 border-brand-red py-5">Register</a>
            </div>
          </div>
          <a href="#" className="text-[10px] font-bold uppercase text-gray-400 hover:text-brand-red flex items-center transition-colors">
            <ChevronLeft size={14} className="mr-1" /> Back to Login
          </a>
        </nav>

          {/* Hero Section - Background image only */}
        <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden flex items-center justify-center shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('http://socceracademy.wonderlandstudio.co.za/images/background.png')" }}
          />
          
          {/* Graphical elements matching the image */}
          <div className="absolute bottom-8 left-8 flex space-x-4 opacity-30">
            <div className="w-16 h-1.5 bg-white/50 rounded-full overflow-hidden">
              <div className="h-full bg-white w-2/3"></div>
            </div>
          </div>
          <div className="absolute bottom-8 right-8 flex space-x-4 opacity-30">
            <div className="w-16 h-1.5 bg-white/50 rounded-full overflow-hidden">
              <div className="h-full bg-white w-1/3"></div>
            </div>
          </div>
        </section>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          <div className="max-w-3xl mx-auto mb-16">
            <div className="mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-red block mb-3">Form Alpha-03</span>
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
                      {noEmail && <Check size={10} className="text-white" />}
                    </div>
                    Cell Only
                  </label>
                  <label className="flex items-center text-[11px] font-semibold cursor-pointer group">
                    <div 
                      onClick={() => setUsePassport(!usePassport)}
                      className={`w-4 h-4 mr-2 border rounded-sm flex items-center justify-center transition-all ${usePassport ? 'bg-brand-red border-brand-red' : 'border-gray-300'}`}
                    >
                      {usePassport && <Check size={10} className="text-white" />}
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
                      <AlertCircle size={10} /> {errors.firstName}
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
                      <AlertCircle size={10} /> {errors.surname}
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
                        <AlertCircle size={10} /> {errors.email}
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
                      <AlertCircle size={10} /> {errors.identification}
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
                      <AlertCircle size={10} /> {errors.cellphone}
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
                      <AlertCircle size={10} /> {errors.doctorName}
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
                      <AlertCircle size={10} /> {errors.doctorContact}
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
                      <AlertCircle size={10} /> {errors.nextOfKin}
                    </motion.span>
                  )}
                </AnimatePresence>
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
                      <AlertCircle size={10} /> {errors.agreeTerms}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Player Registration Section */}
              <div className="col-span-1 md:col-span-2 pt-12 mb-4">
                <div className="mb-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-red block mb-2">Form Alpha-03B</span>
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
                      <User size={60} className="text-gray-200" />
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
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Max 2MB • JPG, PNG, WEBP</p>
                  <AnimatePresence>
                    {errors.playerImage && (
                      <motion.span 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[10px] text-brand-red mt-2 font-bold flex items-center justify-center gap-1"
                      >
                        <AlertCircle size={10} /> {errors.playerImage}
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
                      <AlertCircle size={10} /> {errors.playerName}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col">
                <label className="artistic-label">Date of Birth</label>
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
                      <AlertCircle size={10} /> {errors.playerDob}
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
              <div className="col-span-1 md:col-span-2 pt-12 mb-4">
                <div className="mb-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-red block mb-2">Form Alpha-03C</span>
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
            </form>

            {/* Form Actions */}
            <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex space-x-3 w-full md:w-auto">
                <button type="button" className="flex-1 btn-artistic-outline">Add Children</button>
                <button type="button" className="flex-1 btn-artistic-muted">Add Parent</button>
              </div>
              <button 
                type="submit" 
                form="register"
                disabled={isSubmitting}
                className="w-full md:w-auto btn-artistic-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Register"} <ArrowRight size={14} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb / Progress Status Bar with Social Links */}
        <footer className="h-12 bg-white border-t border-gray-100 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center">
            <div className="flex space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-red"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
            </div>
            <span className="ml-4 text-[9px] uppercase font-bold text-gray-400 tracking-wider">Step 01: Guardian Details</span>
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
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-brand-red transition-colors">
                <Twitter size={14} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-brand-red transition-colors">
                <Instagram size={14} />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

