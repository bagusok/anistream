import Constants from "expo-constants";
import * as Device from "expo-device";

export const APP_VERSION = Constants.expoConfig?.version || "1.0.0";
export const DEVICE_NAME = Device.deviceName;
export const DEVICE_MODEL = Device.modelName;
export const DEVICE_PLATFORM = Device.platformApiLevel;

export const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const USER_AGENT = `Miramine/${APP_VERSION} (${DEVICE_NAME}; ${DEVICE_MODEL}; ${DEVICE_PLATFORM}; https://miramine.app; contact@miramine.app)`;

export const SAWERIA_URL = "https://saweria.co/miramine";
export const GITHUB_REPO_URL = "https://github.com/bagusok/anistream";
export const DOWNLOAD_APP_URL = "https://anime.bagusok.dev";
