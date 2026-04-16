import Constants from "expo-constants";

const configuredUrl = Constants.expoConfig?.extra?.knowledgePlatformUrl;
const devConfiguredUrl = process.env.EXPO_PUBLIC_KNOWLEDGE_PLATFORM_DEV_URL;

const productionUrl =
  typeof configuredUrl === "string" && configuredUrl.trim().length > 0
    ? configuredUrl.replace(/\/+$/, "")
    : "https://www.goodbai.baby";

const developmentUrl =
  typeof devConfiguredUrl === "string" && devConfiguredUrl.trim().length > 0
    ? devConfiguredUrl.replace(/\/+$/, "")
    : productionUrl;

export const KNOWLEDGE_PLATFORM_URL =
  __DEV__ ? developmentUrl : productionUrl;

export function getKnowledgePlatformUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${KNOWLEDGE_PLATFORM_URL}${normalizedPath}`;
}
