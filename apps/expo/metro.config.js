// Learn more https://docs.expo.io/guides/customizing-metro
import { getDefaultConfig } from "expo/metro-config";
import { resolve } from "path";

const projectRoot = __dirname;
const workspaceRoot = resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.resolver.sourceExts.push("cjs");

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  resolve(projectRoot, "node_modules"),
  resolve(workspaceRoot, "node_modules"),
];

// config.resolver.disableHierarchicalLookup = true;

export default config;
