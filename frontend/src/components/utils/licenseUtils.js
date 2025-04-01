import CryptoJS from "crypto-js";

// 🔹 Securely derive AES Key from SECRET_KEY
const SECRET_KEY = CryptoJS.SHA256("protectionmark").toString();

// ✅ Generate a License Code
export const generateLicenseCode = ({
  OrganizationName,
  PurchaseDate,
  Quantity,
  PartnerName,
}) => {
  if (!OrganizationName || !PurchaseDate || !Quantity || !PartnerName) {
    throw new Error("All license details are required");
  }

  const dataString = `${OrganizationName}|${PurchaseDate}|${Quantity}|${PartnerName}`;

  // AES Encrypt the data (returns a Base64-encoded string)
  const encrypted = CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();

  return encrypted;
};

// ✅ Decode and Validate a License Code
export const decodeLicenseCode = (licenseCode) => {
  try {
    if (!licenseCode) {
      throw new Error("License code is required");
    }

    // AES Decrypt the data
    const bytes = CryptoJS.AES.decrypt(licenseCode, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) {
      throw new Error("Invalid License Code");
    }

    // Extract fields
    const fields = decryptedData.split("|");
    if (fields.length !== 4) {
      throw new Error("Malformed License Code");
    }

    const [OrganizationName, PurchaseDate, Quantity, PartnerName] = fields;

    // 🔹 Validate Purchase Date Format
    if (isNaN(new Date(PurchaseDate))) {
      throw new Error("Invalid Purchase Date Format");
    }

    // 🔹 Calculate Expiry Date (1 year from Purchase Date)
    const expiryDate = new Date(PurchaseDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    return {
      OrganizationName,
      PurchaseDate,
      ExpiryDate: expiryDate.toISOString().split("T")[0], // Standard Date Format (YYYY-MM-DD)
      Quantity,
      PartnerName,
    };
  } catch (error) {
    console.error("License Decode Error:", error.message);
    throw new Error("Invalid License Code");
  }
};
