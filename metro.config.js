const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add wasm to sourceExts and assetExts
config.resolver.sourceExts.push("wasm");
config.resolver.assetExts.push("wasm");

module.exports = withNativeWind(config, { input: "./global.css" });
