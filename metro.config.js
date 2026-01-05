const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add wasm to sourceExts and assetExts
config.resolver.sourceExts.push("wasm");
config.resolver.assetExts.push("wasm");

module.exports = config;
