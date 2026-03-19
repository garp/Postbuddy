import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
dotenv.config({
  path: `./.env`,
});

export const encryptApiKey = (apiKey) => {
  const secret = process.env.API_KEY_HASH_SECRET || "postbuddy1234";
  return CryptoJS.AES.encrypt(apiKey, secret).toString();
};

export const decryptApiKey = (encryptedKey) => {
  const secret = process.env.API_KEY_HASH_SECRET;
  const bytes = CryptoJS.AES.decrypt(encryptedKey, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};