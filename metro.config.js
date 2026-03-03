const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Exclude node_modules from watch folders to prevent Metro from tracking .cache files
config.watchFolders = [
  path.resolve(__dirname, "app"),
  path.resolve(__dirname, "components"),
  path.resolve(__dirname, "lib"),
  path.resolve(__dirname, "hooks"),
  path.resolve(__dirname, "constants"),
  path.resolve(__dirname, "server"),
];

// Add blockList to exclude problematic cache directories
config.resolver.blockList = [
  /.*\/\.cache\/.*/,
  /.*\/node_modules\/react-native-css-interop\/.cache\/.*/,
];

module.exports = withNativeWind(config, {
  input: "./global.css",
  // Force write CSS to file system instead of virtual modules
  // This fixes iOS styling issues in development mode
  forceWriteFileSystem: true,
});
