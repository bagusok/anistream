import { APP_VERSION, USER_AGENT } from "@/constants/Strings";
import axios from "axios";
import crypto from "react-native-quick-crypto";

export const axiosIn = axios.create({
  headers: {
    "User-Agent": USER_AGENT,
    "x-app-id": "miramine",
    "x-app-version": APP_VERSION,
  },
});

axiosIn.interceptors.request.use((config) => {
  const method = config.method?.toUpperCase() || "";
  const path = config.url || "";
  const endpoint = new URL(config.baseURL + path).pathname;

  const timestamp = Math.floor(Date.now() / 1000);
  const timestampPlus5Min = timestamp + 300;

  const stringToHash = `${method}:${endpoint}:${timestampPlus5Min}`;

  const hashKey = process.env.EXPO_PUBLIC_HASH_KEY || "";
  const hash = crypto
    .createHmac("sha256", hashKey)
    .update(stringToHash)
    .digest("hex");

  config.headers["x-timestamp"] = timestamp.toString();
  config.headers["x-signature"] = hash;

  return config;
});

axiosIn.interceptors.response.use(
  (response) => {
    if (typeof response.data === "string") {
      try {
        const decryptedData = decrypt(response.data);
        let data = JSON.parse(decryptedData);

        response.data = data;
      } catch (error) {
        response.data = {};
        console.error("Error decrypting response:", error);
      }
    }
    return response;
  },
  (error) => {
    if (error.response && typeof error.response.data === "string") {
      try {
        const decryptedData = decrypt(error.response.data);
        let data = JSON.parse(decryptedData);

        error.response.data = data;
      } catch (decryptError) {
        console.error("Error decrypting error response:", decryptError);
      }
    }
    return Promise.reject(error);
  }
);

const ENCRYPTION_KEY = hexStringToUint8Array(
  process.env.EXPO_PUBLIC_ENCRYPTION_KEY || ""
);
const IV_LENGTH = 12;

if (ENCRYPTION_KEY.length !== 32) {
  throw new Error(
    "Invalid ENCRYPTION_KEY length. It should be 32 bytes for AES-256-GCM."
  );
}

function hexStringToUint8Array(hexString: string): Uint8Array {
  if (hexString.length % 2 !== 0) {
    throw new Error("Hex string length must be even.");
  }

  const arrayBuffer = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    arrayBuffer[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }

  return arrayBuffer;
}

const decrypt = (encryptedText: string): string => {
  try {
    const [ivHex, authTagHex, _encryptedBase64] = encryptedText.split(":");

    if (!ivHex || !authTagHex || !_encryptedBase64) {
      throw new Error(
        "Invalid input format. Expected format is 'iv:authTag:encryptedText'."
      );
    }

    const encryptedBase64 =
      _encryptedBase64.replace(/-/g, "+").replace(/_/g, "/") +
      "=".repeat((4 - (_encryptedBase64.length % 4)) % 4);

    const iv = hexStringToUint8Array(ivHex);
    const authTag = hexStringToUint8Array(authTagHex);
    const encryptedTextBuffer = Uint8Array.from(atob(encryptedBase64), (c) =>
      c.charCodeAt(0)
    );

    const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedTextBuffer, undefined, "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data.");
  }
};
