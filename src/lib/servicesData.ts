import {
  Sparkles, Smile, Stethoscope, Gem, Bone, Layers, Siren, Scissors,
  Shield, Zap, ShieldCheck, Activity, Baby, Wrench, Droplets, RefreshCw,
  Crown, ScanLine, CalendarCheck, LucideIcon
} from "lucide-react";

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface ServiceStep {
  title: string;
  desc: string;
}

export interface ServiceDetail {
  icon: LucideIcon;
  category: "Cosmetic" | "Restorative" | "General" | "Emergency";
  title: string;
  slug: string;
  desc: string;
  duration: string;
  tech: string;
  benefits: string[];
  steps: ServiceStep[];
  faqs: ServiceFAQ[];
}

export const serviceDetails: ServiceDetail[] = [
  {
    icon: Sparkles,
    category: "Cosmetic",
    title: "Teeth Whitening",
    slug: "teeth-whitening",
    desc: "Achieve a dazzling, bright smile in just one short session with our laser whitening technology.",
    duration: "45–60 minutes",
    tech: "LED Laser Whitening Accelerator",
    benefits: [
      "Visibly brightens teeth by up to 8 shades in a single sitting",
      "Painless formulation with customized dental gel concentration",
      "Long-lasting results that shine for 12 to 18 months",
      "Safely removes deep nicotine, tea, coffee, and age stains",
    ],
    steps: [
      { title: "Shade Analysis", desc: "We record your starting teeth shade using a visual color guide to measure exact improvement." },
      { title: "Gums Protection", desc: "A soft resin barrier is applied to protect your gums from the bleaching gel." },
      { title: "Gel Application", desc: "A premium hydrogen peroxide whitening gel is applied evenly to your teeth surfaces." },
      { title: "Laser Activation", desc: "Our advanced LED Accelerator laser light activates the gel to lift deep-set stains." },
      { title: "Polishing Finish", desc: "We wash the gel, apply desensitizing paste, and reveal your new bright smile." }
    ],
    faqs: [
      { q: "Does teeth whitening cause permanent sensitivity?", a: "No. Any sensitivity experienced during the procedure is minor and temporary, usually resolving fully within 24 to 48 hours. We apply a protective desensitizer to prevent discomfort." },
      { q: "How long do laser whitening results last?", a: "With good oral hygiene and moderate intake of colored drinks (coffee, tea, wine), results will last between 1 to 2 years. Periodic quick touch-ups can maintain the shade indefinitely." }
    ]
  },
  {
    icon: Smile,
    category: "Cosmetic",
    title: "Dental Bonding",
    slug: "dental-bonding",
    desc: "Seamlessly repair minor tooth chips, front cracks, or annoying gaps in a single, comfortable visit.",
    duration: "30–45 mins per tooth",
    tech: "High-intensity LED Curing light",
    benefits: [
      "Closes visible gaps between front teeth instantly",
      "Repairs minor enamel chips and tooth cracks in 1 visit",
      "Color-matched exactly to your surrounding teeth enamel",
      "Cost-effective, conservative, and non-invasive procedure",
    ],
    steps: [
      { title: "Enamel Prep", desc: "The tooth surface is lightly cleaned, and a mild conditioning gel is applied to secure the bond." },
      { title: "Resin Matching", desc: "Dr. Jigyasa selects a composite resin shade that matches your natural tooth color precisely." },
      { title: "Artistic Shaping", desc: "The composite resin is carefully applied and sculpted to close the gap or restore the chip." },
      { title: "Light Curing", desc: "A high-intensity curing light hardens the sculpted resin material in seconds." },
      { title: "Buffing & Polish", desc: "The tooth is refined and polished to match the natural shine of your surrounding teeth." }
    ],
    faqs: [
      { q: "Is dental bonding painful?", a: "Not at all. In most cases, because no tooth structure is removed, no anesthesia is even required. It is a completely painless cosmetic procedure." },
      { q: "Does dental bonding stain easily?", a: "While composite resin is highly durable, it can stain over time if exposed to heavy coffee, red wine, or smoking. Brushing regularly helps keep it bright." }
    ]
  },
  {
    icon: Stethoscope,
    category: "General",
    title: "Dental Checkups",
    slug: "dental-checkups",
    desc: "Maintain your family's oral health with standard comprehensive checkups and deep cleanings.",
    duration: "20–30 minutes",
    tech: "HD Intraoral Digital Camera",
    benefits: [
      "Early detection of silent cavities, micro-cracks, and gum issues",
      "Live HD screen reviews showing you exactly what the dentist sees",
      "Personalized preventive advice and custom home-care plans",
      "Oral cancer screening and bite alignment checks included",
    ],
    steps: [
      { title: "Visual Exam", desc: "We visually inspect all teeth surfaces, gums, tongue, and throat for signs of decay or inflammation." },
      { title: "Intraoral Scan", desc: "Using an HD digital camera, we capture live close-up images of your teeth to display on-screen." },
      { title: "Bite Assessment", desc: "We review how your upper and lower teeth meet to identify jaw joints strain or grinding wear." },
      { title: "Findings Discussion", desc: "We review your clinical status together, answer questions, and suggest treatment if necessary." }
    ],
    faqs: [
      { q: "How often should I get a dental checkup?", a: "We recommend a professional checkup and scaling twice a year (every 6 months) to identify and treat minor problems before they become painful or expensive." },
      { q: "Are dental checkups necessary if I feel no pain?", a: "Yes. Many dental problems like early cavities and gum disease develop silently without any pain. By the time it hurts, a root canal or tooth extraction is often required." }
    ]
  },
  {
    icon: Gem,
    category: "Cosmetic",
    title: "Cosmetic Dentistry",
    slug: "cosmetic-dentistry",
    desc: "Unlock your dream smile with customized aesthetic alignments, teeth shape designs, and color makeovers.",
    duration: "1–2 sessions",
    tech: "Digital Smile Design (DSD) software",
    benefits: [
      "Bespoke smile designs adjusted to your facial proportions",
      "Restores harmonious teeth alignment, size, and balance",
      "Increases smile confidence and rejuvenates facial aesthetics",
      "Utilizes premium, metal-free high-grade ceramic materials",
    ],
    steps: [
      { title: "Smile Analysis", desc: "We take high-resolution dental photos and facial records to map your current smile dynamics." },
      { title: "Digital Mockup", desc: "Using advanced Digital Smile Design software, we simulate your ideal, corrected smile." },
      { title: "Review & Adjust", desc: "We review the digital mockup together, adjusting tooth length and shade to your preference." },
      { title: "Aesthetic Treatment", desc: "We implement the custom plan, which may combine veneers, contouring, or alignment." }
    ],
    faqs: [
      { q: "What is Digital Smile Design (DSD)?", a: "DSD is a modern dental technology that uses digital photos and virtual software to design your ideal smile before starting treatment, allowing you to preview your results." },
      { q: "Is cosmetic dentistry expensive?", a: "We offer range-flexible treatment packages (such as contouring, veneers, or crowns) to suit different goals and budgets, ensuring transparent, flat rates." }
    ]
  },
  {
    icon: Bone,
    category: "Restorative",
    title: "Dental Implants",
    slug: "dental-implants",
    desc: "Restore missing teeth permanently with strong, bio-compatible titanium posts that function exactly like real roots.",
    duration: "2-3 sessions over 3 months",
    tech: "3D CBCT Guided Surgery",
    benefits: [
      "Permanent replacement for single or multiple missing teeth",
      "Prevents progressive jawbone shrinkage and facial sagging",
      "Restores complete chewing, biting, and natural speech",
      "Uses premium titanium implants that integrate with the bone",
    ],
    steps: [
      { title: "3D Digital scan", desc: "We perform a 3D CBCT scan to examine bone density, nerve paths, and map the safe implant angle." },
      { title: "Implant Placement", desc: "Under precise local anesthesia, the bio-safe titanium post is gently anchored into the jawbone." },
      { title: "Osseointegration", desc: "We wait 2-3 months for the jawbone to naturally fuse and grow around the titanium post." },
      { title: "Abutment Fit", desc: "A small connection post (abutment) is attached to the implant to hold the crown secure." },
      { title: "Crown Placement", desc: "A custom-milled zirconia or ceramic crown is screwed on, completing your new, permanent tooth." }
    ],
    faqs: [
      { q: "Is dental implant surgery painful?", a: "No. The procedure is performed under deep local anesthesia, making the surgery painless. Most patients report that recovery is very comfortable, similar to a standard extraction." },
      { q: "How long do dental implants last?", a: "With good brushing, flossing, and twice-a-year dentist checkups, dental implants are designed to integrate permanently and last a lifetime." }
    ]
  },
  {
    icon: Layers,
    category: "Restorative",
    title: "Dentures & Bridges",
    slug: "dentures-bridges",
    desc: "Fill dental gaps and restore complete oral function with custom-engineered bridges or lightweight, comfortable dentures.",
    duration: "2 sessions",
    tech: "3D CAD/CAM custom milling",
    benefits: [
      "Closes visible gaps between teeth seamlessly and naturally",
      "Restores chewing balance and clear pronunciation",
      "Lightweight, custom-molded high comfort designs",
      "Both partial and complete premium dentures available",
    ],
    steps: [
      { title: "Bridges Preparation", desc: "For bridges, the neighboring teeth are lightly contoured to act as strong support anchors." },
      { title: "Digital Scan", desc: "We take high-accuracy digital scans of your mouth instead of using messy, uncomfortable paste molds." },
      { title: "CAD/CAM Design", desc: "Our laboratory uses CAD/CAM 3D software to mill your custom restoration for an exact, snug fit." },
      { title: "Snug Fit Check", desc: "We place the bridge or dentures, checking your bite and adjusting the fit for perfect comfort." },
      { title: "Final Bonding", desc: "Bridges are securely bonded; dentures are polished and provided with simple care guides." }
    ],
    faqs: [
      { q: "What is the difference between a bridge and an implant?", a: "An implant replaces a single tooth without touching adjacent teeth. A bridge replaces a gap by anchoring onto the adjacent teeth, which must be lightly prepared to support it." },
      { q: "How do I care for my complete dentures?", a: "Remove and brush your dentures daily with a soft toothbrush and non-abrasive soap. Soak them in clean water or a denture cleaning solution overnight." }
    ]
  },
  {
    icon: Siren,
    category: "Emergency",
    title: "Emergency Care",
    slug: "emergency-care",
    desc: "Get instant relief from sudden, throbbing dental pain or clinical emergencies with same-day priority appointments.",
    duration: "Same-day urgent booking",
    tech: "Fast dental anesthesia systems",
    benefits: [
      "Immediate dental relief for severe, throbbing toothaches",
      "Emergency treatment for fractured, chipped, or knocked-out teeth",
      "Same-day priority bookings for emergency cases",
      "Expert surgical trauma and soft-tissue injury control",
    ],
    steps: [
      { title: "Immediate Triage", desc: "We prioritize your arrival and examine you immediately to identify the source of severe pain." },
      { title: "Diagnostic X-Ray", desc: "A rapid digital X-ray is taken to locate deep nerve infections, gum abscesses, or hidden cracks." },
      { title: "Rapid Pain Relief", desc: "We apply quick-acting local anesthesia or temporary treatment to stop the pain immediately." },
      { title: "Treatment Plan", desc: "Once the pain is managed, we outline a permanent treatment (e.g. root canal or extraction)." }
    ],
    faqs: [
      { q: "What should I do if a tooth is knocked out in an accident?", a: "Find the tooth, hold it by the crown (do not touch the root), rinse it with water, and place it in a cup of cold milk. Contact us immediately—if you reach us within 60 minutes, we can often save and re-implant the tooth!" },
      { q: "How quickly can I get an appointment in a dental emergency?", a: "We reserve emergency slots daily. Call us directly, and we will arrange to see you on the very same day." }
    ]
  },
  {
    icon: Scissors,
    category: "Emergency",
    title: "Tooth Extractions",
    slug: "tooth-extractions",
    desc: "Safe, quick, and painless extraction of non-restorable teeth or impacted wisdom teeth under professional care.",
    duration: "30–45 minutes",
    tech: "Atraumatic surgical extraction kits",
    benefits: [
      "Virtually painless extraction of severely broken or infected teeth",
      "Surgical removal of impacted wisdom teeth to prevent swelling",
      "Advanced preservation of surrounding bone and gum tissue",
      "Sterilized, aseptic clinic environment preventing infections",
    ],
    steps: [
      { title: "Digital Exam", desc: "We take a targeted digital scan to map the exact tooth root shape and check adjacent nerves." },
      { title: "Comfort Sedation", desc: "We apply powerful local anesthesia, ensuring the area is completely numb before starting." },
      { title: "Gentle Luxation", desc: "Using precise, atraumatic tools, the tooth is gently loosened from its socket without pressure." },
      { title: "Socket Cleaning", desc: "The socket is cleaned, disinfected, and dressed to encourage healthy blood clotting." },
      { title: "Care briefing", desc: "We place a sterile cotton pack and explain simple post-care steps to ensure smooth healing." }
    ],
    faqs: [
      { q: "Will wisdom tooth extraction hurt?", a: "No. With our modern local anesthetics, you will feel only a bit of pressure but absolutely no pain during the extraction. We also prescribe post-care pain relief for recovery." },
      { q: "What is a 'dry socket' and how do I avoid it?", a: "A dry socket occurs if the protective blood clot in the empty socket is dislodged before healing. Avoid drinking through a straw, smoking, or vigorous rinsing for the first 48 hours to prevent this." }
    ]
  },
  {
    icon: Shield,
    category: "General",
    title: "Fillings & Sealants",
    slug: "fillings-sealants",
    desc: "Protect vulnerable surfaces and restore decayed teeth with beautiful, tooth-colored composite materials.",
    duration: "20–30 minutes",
    tech: "Premium Nano-Hybrid Composites",
    benefits: [
      "Fills active cavities, preventing bacteria from reaching the nerve",
      "Tooth-colored composite resin matches your natural enamel shade",
      "Protective fissure sealants prevent deep decay in kids' molars",
      "100% mercury-free, durable, and highly bio-safe materials",
    ],
    steps: [
      { title: "Decay Removal", desc: "Dr. Jigyasa carefully removes decayed enamel, cleaning and disinfecting the cavity." },
      { title: "Conditioning", desc: "We apply a mild conditioning gel to open enamel pores, ensuring the bond is strong." },
      { title: "Layering Resin", desc: "The tooth-colored nano-hybrid composite resin is layered into the cavity." },
      { title: "Laser Cure", desc: "A special curing light hardens each layer of composite resin in a few seconds." },
      { title: "Bite Refinement", desc: "We check your bite alignment and polish the filling to make it feel perfectly natural." }
    ],
    faqs: [
      { q: "How long do composite fillings last?", a: "Composite fillings are durable and typically last 7 to 10 years with standard brushing and regular cleanings." },
      { q: "Can I replace my old silver fillings with tooth-colored ones?", a: "Yes! We can safely remove old silver amalgam fillings and replace them with natural-looking, mercury-free composite fillings." }
    ]
  },
  {
    icon: Zap,
    category: "Emergency",
    title: "Laser Dentistry",
    slug: "laser-dentistry",
    desc: "Experience surgical dental procedures without scalpels, needles, or heavy swelling using precise soft-tissue laser systems.",
    duration: "20–40 minutes",
    tech: "Precise Soft Tissue Diode Laser",
    benefits: [
      "Painless soft-tissue procedures without the need for scalpels",
      "Minimizes swelling, inflammation, and bleeding immediately",
      "Sterilizes the treatment area dynamically during the procedure",
      "Significantly speeds up tissue recovery and post-op healing",
    ],
    steps: [
      { title: "Laser Setup", desc: "We adjust the diode laser wavelength precisely to suit your specific tissue density." },
      { title: "Mild Numbing", desc: "Only a small amount of topical numbing gel is applied as the laser is highly comfortable." },
      { title: "Tissue Sculpting", desc: "The laser beam gently sweeps the tissue, cutting and sealing it at the same time." },
      { title: "Sanitization", desc: "The laser sterilization cycle eliminates bacteria in the surrounding tissue." },
      { title: "Recovery Guide", desc: "We review the laser post-care steps, which rarely require any pain medications." }
    ],
    faqs: [
      { q: "What can dental lasers treat?", a: "Our soft-tissue laser is used for gum contouring (reshaping a gummy smile), frenectomies, sanitizing deep gum pockets, and treating painful mouth ulcers instantly." },
      { q: "Is laser dentistry safe?", a: "Yes. It is exceptionally safe. Both the dentist and the patient wear protective glasses during the laser operation to ensure absolute safety." }
    ]
  },
  {
    icon: ShieldCheck,
    category: "General",
    title: "Mouth Guards",
    slug: "mouth-guards",
    desc: "Protect your teeth from sports impacts or night grinding with durable, custom-molded guards.",
    duration: "1 session",
    tech: "Vacuum-pressed heavy duty polymers",
    benefits: [
      "Custom sports guards protect teeth from direct athletic impact",
      "Custom night guards stop sleep teeth grinding (bruxism)",
      "Maximum breathability, speaking comfort, and perfect snap-fit",
      "Relieves morning jaw stiffness and prevents enamel wear",
    ],
    steps: [
      { title: "Impression Scan", desc: "We take high-definition digital scans of your upper and lower teeth models." },
      { title: "Lab Fabrication", desc: "The guard is vacuum-pressed in our lab using medical-grade, shock-absorbing polymer." },
      { title: "Fit Adjustment", desc: "We check the guard in your mouth, adjusting margins to ensure gums are comfortable." },
      { title: "Bite Check", desc: "We verify that jaw forces are evenly distributed across the guard." },
      { title: "Protective Case", desc: "The guard is polished, and we supply a protective storage case with care guidelines." }
    ],
    faqs: [
      { q: "Why should I choose a custom night guard over store-bought ones?", a: "Store-bought 'boil-and-bite' guards are bulky, loose, and can shift your bite over time, causing jaw joint pain. A custom guard is thin, snaps securely, and protects your bite perfectly." },
      { q: "How long does a custom guard last?", a: "Depending on how heavily you grind your teeth, a custom night guard typically lasts 2 to 5 years." }
    ]
  },
  {
    icon: Activity,
    category: "Restorative",
    title: "Oral Surgery",
    slug: "oral-surgery",
    desc: "Expert surgical care for jaw bone grafting, complex extractions, and gum corrective adjustments.",
    duration: "1-2 sittings",
    tech: "Piezosurgery ultrasonic cutting tools",
    benefits: [
      "Painless surgical treatments with advanced ultrasonic tools",
      "Corrective gum adjustments and bone grafting prep",
      "Treatment managed by experienced surgical specialists",
      "Highly responsive recovery planning and follow-up reviews",
    ],
    steps: [
      { title: "Pre-Surgical Prep", desc: "We review your medical history, take digital scans, and outline the surgical steps." },
      { title: "Advanced Sedation", desc: "We apply advanced local numbing, ensuring complete surgical comfort." },
      { title: "Ultrasonic Cut", desc: "Using Piezosurgery, bone or tissue is shaped gently with ultrasonic waves." },
      { title: "Aseptic Closing", desc: "Sutures are placed precisely if needed, and surgical dressings are applied." },
      { title: "Follow-up Booking", desc: "We arrange a recovery checkup in 7 days to monitor healing progress." }
    ],
    faqs: [
      { q: "What is Piezosurgery?", a: "Piezosurgery is an advanced technology that uses ultrasonic micro-vibrations to shape bone gently. It cuts bone cleanly while leaving soft tissues (nerves and blood vessels) completely unharmed." },
      { q: "How long is the recovery after minor oral surgery?", a: "Most patients recover fully in 3 to 5 days, returning to normal work the day after surgery with moderate post-care pain relief." }
    ]
  },
  {
    icon: Baby,
    category: "General",
    title: "Pediatric Dentistry",
    slug: "pediatric-dentistry",
    desc: "Fun, gentle, and reassuring dental care designed specifically to keep young smiles healthy and cavity-free.",
    duration: "30 minutes",
    tech: "Child-friendly clinic accessories",
    benefits: [
      "Exceptionally gentle, friendly, and non-frightening dental care",
      "Fluoride varnish therapies to strengthen young enamel",
      "Space maintainers and habit-breaking custom retainers",
      "Fun, animated oral hygiene guides that kids love",
    ],
    steps: [
      { title: "Friendly Welcome", desc: "We welcome your child, introduce them to the dental chair as a fun ride, and put them at ease." },
      { title: "Gentle Clean", desc: "We gently brush their teeth and polish them with tasty, kid-friendly fruit pastes." },
      { title: "Cavity check", desc: "We inspect growing teeth for cavities and check jaw alignment development." },
      { title: "Fluoride Shield", desc: "A protective fluoride gel is lightly applied to protect enamel from sweets and acids." },
      { title: "Surprise Reward", desc: "We praise your child's brave visit and reward them with a fun clinical sticker or toy." }
    ],
    faqs: [
      { q: "When should my child have their first dentist visit?", a: "We recommend their first dental visit by their first birthday, or when their first baby tooth emerges. This builds positive clinical habits early." },
      { q: "What are dental sealants, and are they safe for kids?", a: "Yes, they are 100% safe. Sealants are thin plastic coatings painted on the chewing surfaces of back molars, sealing out food and cavity-causing bacteria." }
    ]
  },
  {
    icon: Wrench,
    category: "Restorative",
    title: "Root Canal Treatment",
    slug: "root-canal-treatment",
    desc: "Save severely decayed or painful teeth with advanced, painless single-sitting rotary root canal therapy.",
    duration: "1–2 sessions",
    tech: "Apex Locator & Rotary Endo systems",
    benefits: [
      "Painless single-sitting root canal treatments in under 60 minutes",
      "Removes infected dental pulp and saves your natural tooth",
      "Prevents bone infections from spreading to neighboring teeth",
      "Reinforced with premium, high-strength porcelain or zirconia crowns",
    ],
    steps: [
      { title: "Digital Mapping", desc: "Using a low-radiation digital RVG X-ray, we locate the exact shape and depth of the infected canals." },
      { title: "Complete Numbing", desc: "Our fast anesthesia system ensures the tooth and surrounding areas are fully numbed." },
      { title: "Rotary Cleaning", desc: "Using automated Apex Locators and rotary endodontics, we clean the infected pulp rapidly." },
      { title: "Canal Sanity", desc: "Canals are thoroughly disinfected and filled with gutta-percha to prevent future bacteria." },
      { title: "Crown Protection", desc: "We place a strong porcelain or zirconia crown to restore 100% of the tooth's chewing power." }
    ],
    faqs: [
      { q: "Is a root canal painful?", a: "No. With modern rotary systems and precise local anesthetics, getting a root canal at our clinic is highly comfortable, feeling no different than a standard filling." },
      { q: "Why is a crown necessary after a root canal?", a: "A root canal removes the tooth's internal blood supply, making it dry and brittle over time. A custom-fit crown shields the tooth, preventing it from cracking under chewing forces." }
    ]
  },
  {
    icon: Droplets,
    category: "General",
    title: "Teeth Cleaning",
    slug: "teeth-cleaning",
    desc: "Restore fresh breath and prevent gum disease with ultrasonic scaling and airflow stain removal.",
    duration: "30–45 minutes",
    tech: "Ultrasonic Scaler & Air-polisher",
    benefits: [
      "Removes hardened calculus and plaque that brushing misses",
      "Eliminates bad breath (halitosis) and leaves mouth feeling fresh",
      "Restores natural enamel polish and lifts light external stains",
      "Essential twice a year to prevent gum bleeding and bone loss",
    ],
    steps: [
      { title: "Gum Health Check", desc: "We inspect your gums, looking for bleeding spots or deep pocket depths." },
      { title: "Ultrasonic Scaling", desc: "Using a gentle vibrating tip and a cooling water mist, we sweep away tartar deposits." },
      { title: "Airflow Polish", desc: "A high-precision spray of air, water, and fine powder lifts stubborn tea or coffee stains." },
      { title: "Flossing Finish", desc: "We clean between your teeth and review proper brushing techniques." },
      { title: "Polishing Paste", desc: "A fluoride polishing paste is applied to leave your teeth feeling glassy and fresh." }
    ],
    faqs: [
      { q: "Does professional scaling loosen teeth?", a: "No. This is a common myth. Scaling removes hardened tartar deposits. If tartar is left too long, it causes gum recession and bone loss, which makes teeth loose. Scaling actually saves teeth from loosening!" },
      { q: "Does teeth cleaning hurt?", a: "No. Ultrasonic cleaning is very comfortable. You will feel minor vibrations and a cool water mist. If you have sensitive teeth, we apply a numbing gel beforehand." }
    ]
  },
  {
    icon: RefreshCw,
    category: "Cosmetic",
    title: "Teeth Reshaping",
    slug: "teeth-reshaping",
    desc: "Quickly correct slightly overlapping, uneven, or long edges with professional cosmetic contouring.",
    duration: "1 session of 30 mins",
    tech: "Fine diamond burs & polishing discs",
    benefits: [
      "Smooths rough, chipped, or slightly overlapping tooth edges",
      "Improves cosmetic balance and facial smile harmony instantly",
      "Painless procedure that requires no local anesthesia",
      "Completed in a single, quick visit of under 30 minutes",
    ],
    steps: [
      { title: "Cosmetic Mapping", desc: "We mark the uneven margins on your teeth using a special colored charting pencil." },
      { title: "Subtle Sculpting", desc: "Using ultra-fine diamond burs, we gently smooth away minor overlapping edges." },
      { title: "Bite Assessment", desc: "We verify that your bite forces remain balanced and comfortable." },
      { title: "Edge Smoothing", desc: "We round any sharp angles to create a natural, harmonious tooth shape." },
      { title: "Enamel Polish", desc: "The reshaped tooth is polished to match the glassy look of your other teeth." }
    ],
    faqs: [
      { q: "Does teeth reshaping damage the enamel?", a: "No. We remove only a microscopic layer of surface enamel (usually under 0.5 mm). This is completely safe and does not weaken the tooth." },
      { q: "Will my teeth become sensitive after contouring?", a: "Because we remain strictly within the outer enamel layer where there are no nerves, you will feel no sensitivity or pain after the treatment." }
    ]
  },
  {
    icon: Crown,
    category: "Cosmetic",
    title: "Veneers & Crowns",
    slug: "veneers-crowns",
    desc: "Transform your smile with ultra-thin, highly aesthetic porcelain veneers or strong, metal-free crowns.",
    duration: "2 sessions",
    tech: "Ultra-thin zirconium and E-Max crowns",
    benefits: [
      "Corrects deep stains, large gaps, and misaligned teeth",
      "Ultra-thin E-Max veneers with natural translucency",
      "Strong crowns designed to match your surrounding teeth",
      "Incredibly durable restorations that last 10 to 15 years",
    ],
    steps: [
      { title: "Teeth Preparation", desc: "We lightly prepare the teeth, removing a micro-layer of enamel to accommodate the veneer." },
      { title: "Digital Capture", desc: "We take a highly accurate 3D digital scan of your prepared teeth." },
      { title: "Temporary Fit", desc: "We place lightweight, temporary veneers to protect your teeth while the lab mills your custom set." },
      { title: "Custom Milling", desc: "Our laboratory mills your custom E-Max veneers or zirconia crowns." },
      { title: "Perfect Bonding", desc: "We place the veneers, verify the color match, and bond them securely." }
    ],
    faqs: [
      { q: "How long do porcelain veneers last?", a: "With good hygiene and regular checkups, premium E-Max porcelain veneers can last 10 to 15 years, or even longer." },
      { q: "Do veneers look artificial?", a: "No. E-Max porcelain mimic the natural optical translucency and light reflection of real teeth enamel, making them look completely natural." }
    ]
  },
  {
    icon: ScanLine,
    category: "General",
    title: "Dental X-Ray",
    slug: "dental-x-ray",
    desc: "Acquire instant, high-precision digital diagnostic scans with 90% lower radiation than traditional film X-rays.",
    duration: "5 minutes",
    tech: "Low-radiation Digital RVG sensor",
    benefits: [
      "Instantly renders bone and roots on our clinic screen",
      "90% lower radiation exposure than traditional film X-rays",
      "Detects hidden decay developing between teeth surfaces",
      "Essential for accurate root canal and dental implant planning",
    ],
    steps: [
      { title: "Safety Vest", desc: "We drape a protective, lead-lined safety collar over your chest." },
      { title: "Sensor Fit", desc: "A tiny, rounded digital RVG sensor is placed inside your mouth next to the target tooth." },
      { title: "Scan Capture", desc: "The digital X-ray machine captures the image in a fraction of a second." },
      { title: "Instant Review", desc: "The high-definition digital scan renders instantly on the dentist's monitor." }
    ],
    faqs: [
      { q: "Are digital dental X-rays safe?", a: "Yes. Our digital RVG sensor uses extremely low radiation, making the scan safe. The radiation is less than what you naturally receive from a short domestic flight." },
      { q: "Why do I need an X-ray if I don't see any cavities?", a: "Many cavities develop between teeth or under old fillings where they cannot be seen. An X-ray is the only way to catch these early." }
    ]
  },
  {
    icon: CalendarCheck,
    category: "General",
    title: "Online Booking",
    slug: "online-booking",
    desc: "Experience seamless, modern slot selection and instant clinic booking receipts.",
    duration: "Instant (1 min)",
    tech: "Dynamic Digital Booking integration",
    benefits: [
      "Pick your preferred date and session slot online in 1 minute",
      "Receive instant booking details and receipts via WhatsApp",
      "Skip wait times at the clinic with reserved priority slots",
      "No advance booking fees; free rescheduling if plans change",
    ],
    steps: [
      { title: "Choose Treatment", desc: "Select the dental service or consult option you need from our treatments list." },
      { title: "Select Slot", desc: "Choose your preferred date and pick from morning or evening session chips." },
      { title: "Patient Details", desc: "Enter your name, phone number, and any special symptoms or requests." },
      { title: "Submit & Confirm", desc: "Submit the form to generate a structured WhatsApp booking message." }
    ],
    faqs: [
      { q: "How do I reschedule my online booking?", a: "Rescheduling is completely free. Simply reply to our WhatsApp confirmation message or call us, and we will update your slot." },
      { q: "Is there a booking fee to reserve a slot online?", a: "No. Reserving an appointment online is completely free. You only pay for your consultation or treatment at the clinic." }
    ]
  }
];
