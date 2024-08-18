import axios, { AxiosResponse } from "axios";
import crypto from "react-native-quick-crypto";
import { Buffer } from "buffer";
global.Buffer = Buffer;

export const axiosIn = axios.create({
  // headers: {
  //   "User-Agent": "Animeku",
  // },
});

axiosIn.interceptors.response.use(
  (response) => {
    if (typeof response.data === "string") {
      try {
        // Mencoba mendekripsi respons
        const decryptedData = decrypt(response.data);
        // response.data = JSON.parse(decryptedData);
        let data = JSON.parse(decryptedData);
        if (typeof data === "string") {
          data = JSON.parse(data);
        }

        response.data = data;
      } catch (error) {
        response.data = {};
        console.error("Error decrypting response:", error);
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Menggunakan ENCRYPTION_KEY yang sama seperti di server
const ENCRYPTION_KEY = Buffer.from(
  process.env.EXPO_PUBLIC_ENCRYPTION_KEY as string,
  "hex"
);
const IV_LENGTH = 12; // Panjang IV yang digunakan untuk AES-256-GCM

// Fungsi untuk mendekripsi data
const decrypt = (encryptedText: string): string => {
  const [ivHex, authTagHex, encryptedBase64] = encryptedText.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encryptedTextBuffer = Buffer.from(encryptedBase64, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedTextBuffer, undefined, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
