import React from 'react';
import { WebView, WebViewProps } from 'react-native-webview';

import { useDevice } from '@/src/hooks/useDevice';

export function buildViewerUrl(
  rawUrl: string,
  opts: { isAndroid: boolean; forceGoogleViewer?: boolean },
): string {
  if (!rawUrl) return '';
  if (opts.forceGoogleViewer || opts.isAndroid) {
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(rawUrl)}`;
  }
  return rawUrl;
}

const VIEWPORT_SCRIPT = `
  (function () {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute(
      'content',
      'width=device-width, initial-scale=1.15, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes'
    );
    document.head && document.head.appendChild(meta);
    true;
  })();
`;

const HIDE_POPOUT_SCRIPT = `
  (function () {
    const styleId = 'jis-hide-popout-style';

    const ensureStyle = function () {
      if (document.getElementById(styleId)) return;
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent =
        '[aria-label="Pop-out"],' +
        '[aria-label="Open in new window"],' +
        '[aria-label="Open in new tab"],' +
        '[data-tooltip*="new window"],' +
        '[data-tooltip*="new tab"] {' +
          'display:none !important;' +
          'opacity:0 !important;' +
          'visibility:hidden !important;' +
          'pointer-events:none !important;' +
        '}';
      (document.head || document.documentElement).appendChild(style);
    };

    const SELECTORS = [
      '[aria-label="Pop-out"]',
      '[aria-label="Open in new window"]',
      '[aria-label="Open in new tab"]',
      '[data-tooltip*="new window"]',
      '[data-tooltip*="new tab"]',
    ];

    const hidePopout = function () {
      ensureStyle();
      SELECTORS.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (el) {
          // Hide the matching element AND walk up 3 levels to catch the
          // dark-background container that surfaces while scrolling.
          var target = el;
          for (var i = 0; i < 3; i++) {
            if (target && target.style) {
              target.style.display = 'none';
              target.style.opacity = '0';
              target.style.visibility = 'hidden';
              target.style.pointerEvents = 'none';
              target.style.background = 'transparent';
            }
            if (!target.parentElement) break;
            target = target.parentElement;
          }
        });
      });
    };

    hidePopout();

    var observer = new MutationObserver(hidePopout);
    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    setInterval(hidePopout, 400);
    true;
  })();
`;

type OmittedProps =
  | 'source'
  | 'injectedJavaScriptBeforeContentLoaded'
  | 'injectedJavaScript'
  | 'initialScale'
  | 'mixedContentMode'
  | 'androidLayerType';

export interface PdfWebViewProps extends Omit<WebViewProps, OmittedProps> {
  uri: string;
}

export function PdfWebView({ uri, ...rest }: PdfWebViewProps) {
  const { isAndroid } = useDevice();
  const initialScale = isAndroid ? 115 : 100;

  return (
    <WebView
      source={{ uri }}
      originWhitelist={['*']}
      javaScriptEnabled
      domStorageEnabled
      thirdPartyCookiesEnabled
      sharedCookiesEnabled
      mixedContentMode={isAndroid ? 'always' : 'never'}
      androidLayerType="hardware"
      allowFileAccess
      allowFileAccessFromFileURLs
      allowUniversalAccessFromFileURLs
      setBuiltInZoomControls
      setDisplayZoomControls={false}
      overScrollMode="never"
      nestedScrollEnabled
      startInLoadingState
      cacheEnabled
      incognito={false}
      scalesPageToFit={false}
      setSupportMultipleWindows={false}
      injectedJavaScriptBeforeContentLoaded={isAndroid ? VIEWPORT_SCRIPT : undefined}
      injectedJavaScript={HIDE_POPOUT_SCRIPT}
      initialScale={initialScale}
      {...rest}
    />
  );
}
