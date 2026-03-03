const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
  'require',
  'default',
];

// Add wasm to sourceExts and assetExts (required for expo-sqlite on web)
config.resolver.sourceExts.push('wasm');
config.resolver.assetExts.push('wasm');

// Add COEP and COOP headers to support SharedArrayBuffer (required for expo-sqlite on web)
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    middleware(req, res, next);
  };
};

module.exports = withNativeWind(config, { input: './global.css' });
