export interface ConsentTranslation {
  title: string;
  subtitle: string;
  patientParticulars: string;
  medHistory: string;
  medHistoryPlaceholder: string;
  nameLabel: string;
  phoneLabel: string;
  introText: string;
  clausePostpone: string;
  clauseDisposal: string;
  clauseUnderstand: string;
  clauseWithdraw: string;
  clauseLanguage: string;
  certifyLabel: string;
  signPrompt: string;
  clearButton: string;
  submitButton: string;
  successTitle: string;
  successDesc: string;
  backHome: string;
  editSign: string;
  requiredBadge: string;
  optionalBadge: string;
  proceduresHeader: string;
}

export interface ProcedureItem {
  id: string;
  name: string;
  risks: string;
}

export const CONSENT_TEXT: Record<"en" | "hi", ConsentTranslation> = {
  en: {
    title: "DEPARTMENT OF DENTAL SURGERY",
    subtitle: "PATIENT CLINICAL CONSENT FORM",
    patientParticulars: "1. Patient Particulars",
    medHistory: "2. Relevant Medical History / Drug History",
    medHistoryPlaceholder: "Specify any systemic conditions (Diabetes, BP), ongoing medications, or allergies...",
    nameLabel: "Patient Full Name *",
    phoneLabel: "Contact Phone Number *",
    introText: "I have been explained the related benefits and possible risk and complications of the procedure / procedures intended to be performed on me:",
    proceduresHeader: "Select Procedures Intended to be Performed on Me",
    clausePostpone: "I have also been explained that sometimes a planned procedure may need to be postponed / cancelled due to unforeseen / technical reasons. I am aware that sometimes an additional procedure may require during an exploratory procedure, and additional fees may be incurred for the same.",
    clauseDisposal: "I authorize Dental Plus Clinic for disposal of extracted Teeth / any other oral issue removed during a surgical procedure in an appropriate manner. I also allow use of photography during the procedure and usage of my data and study models for academic & restoration portfolio purposes provided my identity is not revealed.",
    clauseUnderstand: "I have fully understood the above mentioned procedure and voluntarily give consent to Dr. Jigyasa Bhardwaj and his/her team of health care professionals to perform the above mentioned procedure.",
    clauseWithdraw: "I am also allowed to withdraw my consent anytime, at my own risk and consequences by giving the withdrawal in writing.",
    clauseLanguage: "I have been explained this consent form in Hindi / my local language.",
    certifyLabel: "I certify that I have read the consent terms, understand all listed complications, and agree to digitally sign this form.",
    signPrompt: "Draw your signature on the pad below *",
    clearButton: "Clear Signature",
    submitButton: "Submit Signed Consent Form",
    successTitle: "Consent Signed Successfully!",
    successDesc: "Your digital patient consent record has been compiled and secured. A copy of this signed consent has been forwarded to our WhatsApp coordinator to lock your appointment slot.",
    backHome: "Back to Home",
    editSign: "Sign Again",
    requiredBadge: "Required",
    optionalBadge: "Optional",
  },
  hi: {
    title: "दंत चिकित्सा विभाग",
    subtitle: "मरीज नैदानिक सहमति पत्र",
    patientParticulars: "1. मरीज का विवरण",
    medHistory: "2. प्रासंगिक चिकित्सा इतिहास / दवा का इतिहास",
    medHistoryPlaceholder: "किसी भी चिकित्सा स्थिति (मधुमेह, बीपी), चल रही दवाओं या एलर्जी का विवरण दें...",
    nameLabel: "मरीज का पूरा नाम *",
    phoneLabel: "संपर्क फ़ोन नंबर *",
    introText: "मुझे संबंधित लाभों और मुझ पर की जाने वाली प्रस्तावित दंत चिकित्सा प्रक्रियाओं के संभावित जोखिमों और जटिलताओं के बारे में समझा दिया गया है:",
    proceduresHeader: "मुझ पर की जाने वाली प्रस्तावित दंत चिकित्सा प्रक्रियाओं का चयन करें",
    clausePostpone: "मुझे यह भी समझाया गया है कि कभी-कभी किसी नियोजित प्रक्रिया को अप्रत्याशित/तकनीकी कारणों से स्थगित/रद्द करना पड़ सकता है। मुझे पता है कि कभी-कभी अन्वेषण प्रक्रिया के दौरान एक अतिरिक्त प्रक्रिया की आवश्यकता हो सकती है, और इसके लिए अतिरिक्त शुल्क लिया जा सकता है।",
    clauseDisposal: "मैं अस्पताल को सर्जिकल प्रक्रिया के दौरान निकाले गए दांतों/किसी अन्य मौखिक मुद्दे को उचित तरीके से निपटाने के लिए अधिकृत करता हूं। मैं प्रक्रिया के दौरान फोटोग्राफी और मेरे डेटा और अध्ययन मॉडल के अकादमिक और मुस्कुराते हुए चित्र पोर्टफोलियो उद्देश्यों के लिए उपयोग की भी अनुमति देता हूं, बशर्ते मेरी पहचान उजागर न की जाए।",
    clauseUnderstand: "मैंने उपरोक्त वर्णित प्रक्रियाओं को पूरी तरह से समझ लिया है और स्वेच्छा से डॉ. जिज्ञासा भारद्वाज और उनके स्वास्थ्य देखभाल पेशेवरों की टीम को उपरोक्त प्रक्रिया करने की सहमति देता/देती हूँ।",
    clauseWithdraw: "मुझे लिखित में वापस लेने की सूचना देकर, अपने जोखिम और परिणामों पर किसी भी समय अपनी सहमति वापस लेने की भी अनुमति है।",
    clauseLanguage: "मुझे यह सहमति पत्र हिंदी/मेरी स्थानीय भाषा में समझा दिया गया है।",
    certifyLabel: "मैं प्रमाणित करता/करती हूँ कि मैंने सहमति शर्तों को पढ़ लिया है, सूचीबद्ध जटिलताओं को समझ लिया है, और इस फॉर्म पर डिजिटल रूप से हस्ताक्षर करने के लिए सहमत हूँ।",
    signPrompt: "नीचे दिए गए पैड पर अपने हस्ताक्षर करें *",
    clearButton: "हस्ताक्षर मिटाएं",
    submitButton: "हस्ताक्षरित सहमति पत्र जमा करें",
    successTitle: "सहमति पत्र सफलतापूर्वक हस्ताक्षरित!",
    successDesc: "आपका डिजिटल मरीज सहमति रिकॉर्ड संकलित और सुरक्षित कर लिया गया है। इस हस्ताक्षरित सहमति की एक प्रति आपके अपॉइंटमेंट स्लॉट को लॉक करने के लिए हमारे व्हाट्सएप समन्वयक को भेज दी गई है।",
    backHome: "होमपेज पर जाएं",
    editSign: "फिर से हस्ताक्षर करें",
    requiredBadge: "आवश्यक",
    optionalBadge: "वैकल्पिक",
  },
};

export const PROCEDURES_DATA: Record<"en" | "hi", ProcedureItem[]> = {
  en: [
    { id: "scaling", name: "Scaling", risks: "Post Op Sensitivity" },
    { id: "rct", name: "RCT / Pulpotomy and Post and Core", risks: "Post Op Pain, Perforation of Root, Instrument Breakage" },
    { id: "filling", name: "Filling", risks: "Post Op Sensitivity, Intentional RCT" },
    { id: "extractions", name: "Extractions", risks: "Post Op Bleeding, Dry Socket, Delayed Healing" },
    { id: "flap", name: "Flap Surgery", risks: "Post Op Bleeding, Delayed Healing" },
    { id: "gingivectomy", name: "Gingivectomy", risks: "Post Op Bleeding, Delayed Healing" },
    { id: "fluoride", name: "Fluoride Applications", risks: "Minor swallowing discomfort" },
    { id: "abscess", name: "Abscess Drainage", risks: "Post Op Bleeding, Delayed Healing" },
    { id: "crown", name: "Crown Cutting", risks: "Minor Gingival Ulceration" },
    { id: "impression", name: "Impression Alginate / Rubber Base", risks: "Mild Gag Reflex" },
    { id: "prosthesis", name: "Fabrication / Fitting of Prosthesis (RPD, CD, FPD, Obturators, Feeding appliance)", risks: "Adaptation discomfort, minor sore spots" },
    { id: "anesthesia", name: "Use of Local Anaesthesia", risks: "Syncope, Allergic Reactions" },
    { id: "implant", name: "Implant Placement", risks: "Failure to Integrate, Post Op Bleeding" },
    { id: "braces", name: "Braces & Aligners", risks: "Mild tooth mobility, post-adjustment soreness, orthodontic pressure" },
    { id: "others", name: "Others / Custom Treatment", risks: "To be discussed with Chief Dentist" },
  ],
  hi: [
    { id: "scaling", name: "स्केलिंग (दांतों की सफाई)", risks: "पोस्ट ऑपरेटिव संवेदनशीलता" },
    { id: "rct", name: "आरसीटी / पल्पोटोमी और पोस्ट एंड कोर", risks: "पोस्ट ऑपरेटिव दर्द, परफोरेशन ऑफ रूट, फाइल टूटना" },
    { id: "filling", name: "फिलिंग (मसाला भरना)", risks: "पोस्ट ऑपरेटिव ब्लीड, पोस्ट ऑपरेटिव संवेदनशीलता" },
    { id: "extractions", name: "दांत निकालना (एक्सट्रैक्शन)", risks: "पोस्ट ऑपरेटिव ब्लीड, सूखा सॉकेट, देरी से जख्म भरना" },
    { id: "flap", name: "फ्लैप सर्जरी", risks: "पोस्ट ऑपरेटिव ब्लीड, देरी से जख्म भरना" },
    { id: "gingivectomy", name: "जिंजिवेक्टोमी", risks: "पोस्ट ऑपरेटिव ब्लीड, देरी से जख्म भरना" },
    { id: "fluoride", name: "फ्लोराइड अनुप्रयोग", risks: "निगलने में हल्की असुविधा" },
    { id: "abscess", name: "फोड़ा जल निकासी (एब्सेस ड्रेनेज)", risks: "पोस्ट ऑपरेटिव ब्लीड, देरी से जख्म भरना" },
    { id: "crown", name: "क्राउन कटिंग", risks: "मामूली मसूड़े का अल्सर" },
    { id: "impression", name: "इंप्रेशन एल्गिनेट / रबर बेस", risks: "हल्की मिचली महसूस होना" },
    { id: "prosthesis", name: "कृत्रिम अंग का निर्माण / फिटिंग (आरपीडी, सीडी, एफपीडी, फीडिंग उपकरण)", risks: "अनुकूलन में असुविधा, मामूली खराश" },
    { id: "anesthesia", name: "स्थानीय संज्ञाहरण (लोकल एनेस्थीसिया) का उपयोग", risks: "सिंकोप, एलर्जी प्रतिक्रियाएं" },
    { id: "implant", name: "दंत इम्प्लांट (इम्प्लांट प्लेसमेंट)", risks: "एकीकृत करने में विफलता, पोस्ट ऑपरेटिव ब्लीड" },
    { id: "braces", name: "ब्रेसिज़ और एलाइनर", risks: "दांतों में हल्की गतिशीलता, समायोजन के बाद दर्द, ऑर्थोडॉन्टिक दबाव" },
    { id: "others", name: "अन्य / कस्टम उपचार", risks: "मुख्य दंत चिकित्सक के साथ चर्चा की जाएगी" },
  ],
};
