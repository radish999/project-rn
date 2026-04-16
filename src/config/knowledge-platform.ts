import Constants from "expo-constants";

const fallbackUrl = "http://localhost:5173";

const configuredUrl = Constants.expoConfig?.extra?.knowledgePlatformUrl;

export const KNOWLEDGE_PLATFORM_URL =
  typeof configuredUrl === "string" && configuredUrl.trim().length > 0
    ? configuredUrl.replace(/\/+$/, "")
    : fallbackUrl;

export function getKnowledgePlatformUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${KNOWLEDGE_PLATFORM_URL}${normalizedPath}`;
}
