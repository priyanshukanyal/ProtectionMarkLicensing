import CryptoJS from "crypto-js";

// Secret Key for AES Encryption (Keep it secure in production)
const SECRET_KEY = "protectionmark";

// ✅ Generate a License Code
export const generateLicenseCode = ({
  OrganizationName,
  PurchaseDate,
  Quantity,
  PartnerName,
}) => {
  const dataString = `${OrganizationName}|${PurchaseDate}|${Quantity}|${PartnerName}`;

  // AES Encrypt the data (returns a Base64-encoded string)
  const encrypted = CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();

  // Return the full encrypted string
  return encrypted;
};

// ✅ Decode and Validate a License Code
export const decodeLicenseCode = (licenseCode) => {
  try {
    // Decrypt using AES (licenseCode is the full Base64-encoded encrypted string)
    const bytes = CryptoJS.AES.decrypt(licenseCode, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) {
      throw new Error("Invalid License Code");
    }

    // Extract fields
    const [OrganizationName, PurchaseDate, Quantity, PartnerName] =
      decryptedData.split("|");

    // Calculate Expiry Date (1 year later)
    const expiryDate = new Date(PurchaseDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    return {
      OrganizationName,
      PurchaseDate,
      ExpiryDate: expiryDate.toISOString().split("T")[0],
      Quantity,
      PartnerName,
    };
  } catch (error) {
    throw new Error("Invalid License Code");
  }
};
