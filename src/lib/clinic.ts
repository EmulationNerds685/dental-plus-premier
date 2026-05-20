export const CLINIC = {
  name: "Dental Plus",
  tagline: "Premium Dental Care in Dehradun",
  doctor: {
    name: "Dr. Jigyasa Bhardwaj",
    qualifications: "BDS, MAOI",
    panel: "On Panel — IIP PTCUL",
  },
  address: {
    line1: "Dental Plus Clinic, Swami Dayanand Saraswati Setu",
    line2: "Pragati Vihar, Ajabpur Kalan",
    city: "Dehradun, Uttarakhand 248001",
  },
  mapsUrl: "https://maps.app.goo.gl/ZkGXaxMFm5Q2sptq6",
  phones: ["+918755703677", "+919927866519"],
  phonesDisplay: ["+91 87557 03677", "+91 99278 66519"],
  whatsapp: "918755703677",
  hours: [
    { day: "Monday – Saturday", time: "10:00 AM – 2:00 PM  •  5:00 PM – 8:00 PM" },
    { day: "Sunday", time: "Closed" },
  ],
};

export const waLink = (msg = "Hi Dental Plus, I'd like to book an appointment.") =>
  `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(msg)}`;
