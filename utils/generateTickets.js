export function generateTicketCode(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  // Generate random string
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  // Add timestamp untuk lebih unique (last 6 digits of timestamp)
  const timestamp = Date.now().toString().slice(-6);
  
  // Combine: 10 random chars + 6 timestamp chars = 16 total
  const fullCode = code + timestamp;
  
  // Format: XXXX-XXXX-XXXX-XXXX
  return fullCode.match(/.{1,4}/g).join("-");
}