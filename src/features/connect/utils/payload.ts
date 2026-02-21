import CryptoJS from "crypto-js";
import { QRPayload } from "../types";

const SECRET_KEY = process.env.EXPO_PUBLIC_QR_SECRET_KEY
  || "da253c6dcf70460d815fb3270b2928904619a846615d691bf1e5ac7a8a0ce111";

export const encryptPayload = (payload: QRPayload): string => {
  try {
    const jsonString = JSON.stringify(payload);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    return "";
  }
};

export const decryptPayload = (encryptedText: string): QRPayload | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) return null;
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};
