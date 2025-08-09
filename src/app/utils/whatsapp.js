// Nomor WA global
const WHATSAPP_NUMBER = "+62 857-1216-5658";

export function redirectToWhatsApp(message = "") {
  const cleanedNumber = WHATSAPP_NUMBER.replace(/\D/g, ""); // hapus spasi/tanda
  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${cleanedNumber}${
    message ? `?text=${encodedMessage}` : ""
  }`;

  window.open(waUrl, "_blank", "noopener,noreferrer");
}
