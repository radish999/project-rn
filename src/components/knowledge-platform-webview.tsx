import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import type { ShouldStartLoadRequest } from "react-native-webview/lib/WebViewTypes";

import { KNOWLEDGE_PLATFORM_URL } from "@/src/config/knowledge-platform";

type Props = {
  initialUrl: string;
};

const allowedHost = new URL(KNOWLEDGE_PLATFORM_URL).host;
const injectedBridgeScript = `
  (function () {
    if (window.__KNOWLEDGE_PLATFORM_BRIDGE__) {
      true;
      return;
    }

    window.__KNOWLEDGE_PLATFORM_BRIDGE__ = true;

    function post(type) {
      if (!window.ReactNativeWebView || !window.ReactNativeWebView.postMessage) {
        return;
      }

      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: type,
        url: window.location.href
      }));
    }

    function notifyRouteReady() {
      window.setTimeout(function () {
        post("route-ready");
      }, 60);
    }

    function applyMobileHeaderTweaks() {
      if (document.getElementById("__knowledge_platform_mobile_header_styles__")) {
        return;
      }

      var style = document.createElement("style");
      style.id = "__knowledge_platform_mobile_header_styles__";
      style.textContent = [
        "@media (max-width: 768px) {",
        "  header.sticky { padding: 12px 16px !important; }",
        "  header.sticky > div,",
        "  header > div.mx-auto {",
        "    display: flex !important;",
        "    flex-direction: column !important;",
        "    align-items: stretch !important;",
        "    justify-content: flex-start !important;",
        "    gap: 12px !important;",
        "  }",
        "  header a[href='/'],",
        "  header a[href='\\/'] {",
        "    align-self: flex-start !important;",
        "  }",
        "  header a[href='/'] span,",
        "  header a[href='\\/'] span {",
        "    font-size: 18px !important;",
        "    line-height: 1.2 !important;",
        "  }",
        "  header nav {",
        "    width: 100% !important;",
        "    overflow-x: auto !important;",
        "    -webkit-overflow-scrolling: touch !important;",
        "    padding: 0 !important;",
        "    margin: 0 !important;",
        "  }",
        "  header nav::-webkit-scrollbar { display: none !important; }",
        "  header nav ul {",
        "    display: flex !important;",
        "    flex-wrap: nowrap !important;",
        "    min-width: max-content !important;",
        "    width: max-content !important;",
        "    gap: 12px !important;",
        "    align-items: center !important;",
        "    padding: 0 0 2px 0 !important;",
        "    margin: 0 !important;",
        "  }",
        "  header nav li {",
        "    flex: 0 0 auto !important;",
        "    list-style: none !important;",
        "  }",
        "  header nav a,",
        "  header nav button {",
        "    white-space: nowrap !important;",
        "    writing-mode: horizontal-tb !important;",
        "    font-size: 15px !important;",
        "    line-height: 1.2 !important;",
        "  }",
        "  header nav button {",
        "    padding: 8px 12px !important;",
        "    border-radius: 12px !important;",
        "  }",
        "}",
      ].join("");
      document.head.appendChild(style);
    }

    function syncUiAfterRouteChange() {
      applyMobileHeaderTweaks();
      notifyRouteReady();
    }

    var originalPushState = window.history.pushState;
    var originalReplaceState = window.history.replaceState;

    window.history.pushState = function () {
      var result = originalPushState.apply(window.history, arguments);
      syncUiAfterRouteChange();
      return result;
    };

    window.history.replaceState = function () {
      var result = originalReplaceState.apply(window.history, arguments);
      syncUiAfterRouteChange();
      return result;
    };

    window.addEventListener("load", function () {
      applyMobileHeaderTweaks();
      post("page-load");
      notifyRouteReady();
    });

    window.addEventListener("popstate", syncUiAfterRouteChange);
    document.addEventListener("DOMContentLoaded", applyMobileHeaderTweaks);
    document.addEventListener("readystatechange", function () {
      if (document.readyState === "complete") {
        applyMobileHeaderTweaks();
        post("document-ready");
        notifyRouteReady();
      }
    });

    true;
  })();
`;

export function KnowledgePlatformWebView({ initialUrl }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const originWhitelist = useMemo(
    () => [KNOWLEDGE_PLATFORM_URL, `${KNOWLEDGE_PLATFORM_URL}/*`],
    []
  );

  const handleShouldStartLoad = (request: ShouldStartLoadRequest) => {
    const requestUrl = request.url;

    if (!requestUrl) {
      return false;
    }

    if (requestUrl.startsWith("about:blank")) {
      return true;
    }

    try {
      const parsedUrl = new URL(requestUrl);
      if (parsedUrl.host === allowedHost && parsedUrl.pathname === "/about") {
        router.push("/about");
        return false;
      }

      if (parsedUrl.host === allowedHost) {
        setIsLoading(true);
        return true;
      }

      void Linking.openURL(requestUrl);
      return false;
    } catch {
      void Linking.openURL(requestUrl);
      return false;
    }
  };

  const handleMessage = (data: string) => {
    try {
      const payload = JSON.parse(data) as { type?: string };
      if (
        payload.type === "route-ready" ||
        payload.type === "page-load" ||
        payload.type === "document-ready"
      ) {
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        {loadError ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>页面加载失败</Text>
            <Text style={styles.stateText}>{loadError}</Text>
          </View>
        ) : (
          <View style={styles.webviewShell}>
            <WebView
              source={{ uri: initialUrl }}
              originWhitelist={originWhitelist}
              injectedJavaScriptBeforeContentLoaded={injectedBridgeScript}
              onLoadStart={() => {
                setIsLoading(true);
                setLoadError(null);
              }}
              onLoadProgress={({ nativeEvent }) => {
                if (nativeEvent.progress >= 0.95) {
                  setIsLoading(false);
                }
              }}
              onLoadEnd={() => setIsLoading(false)}
              onError={(event) => {
                setIsLoading(false);
                setLoadError(event.nativeEvent.description || "请检查知识平台站点是否可以正常访问。");
              }}
              onHttpError={(event) => {
                setIsLoading(false);
                setLoadError(`服务返回异常状态：${event.nativeEvent.statusCode}`);
              }}
              onShouldStartLoadWithRequest={handleShouldStartLoad}
              onMessage={(event) => handleMessage(event.nativeEvent.data)}
              allowsBackForwardNavigationGestures
              startInLoadingState
              style={styles.webview}
            />
            {isLoading ? (
              <View style={styles.loadingOverlay} pointerEvents="none">
                <ActivityIndicator size="small" color="#0F766E" />
                <Text style={styles.loadingText}>正在加载知识平台…</Text>
              </View>
            ) : null}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7F2",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F7F2",
  },
  webviewShell: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  webview: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  loadingText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
  },
  stateCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
  },
  stateTitle: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "800",
  },
  stateText: {
    marginTop: 10,
    color: "#475569",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
});
