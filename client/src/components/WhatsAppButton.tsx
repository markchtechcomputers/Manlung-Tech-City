import WhatsAppMark from "@/components/WhatsAppMark";

export default function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href="https://wa.me/254724356178?text=Hello%20Manlung%20Tech%20City%2C%20I%27d%20like%20to%20enquire%20about%20your%20services."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Manlung Tech City on WhatsApp, +254 724 356 178"
    >
      <WhatsAppMark />
      <span>Chat on WhatsApp</span>
    </a>
  );
}
