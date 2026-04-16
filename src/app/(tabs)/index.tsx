import { KnowledgePlatformWebView } from "@/src/components/knowledge-platform-webview";
import { getKnowledgePlatformUrl } from "@/src/config/knowledge-platform";

export default function Index() {
  return <KnowledgePlatformWebView initialUrl={getKnowledgePlatformUrl("/")} />;
}
