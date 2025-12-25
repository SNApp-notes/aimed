const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

const root = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = withMetroConfig(getDefaultConfig(__dirname), {
  root,
  dirname: __dirname,
});

config.resolver.unstable_enablePackageExports = true;

// Fix for npm workspaces: the default blockList blocks all of root node_modules/react-native
// but we need to allow nested node_modules inside it
const originalBlockList = config.resolver.blockList || [];
config.resolver.blockList = originalBlockList.filter((regex) => {
  const str = regex.toString();
  // Remove the react-native blocklist entry since it blocks nested dependencies
  // The regex uses \x2d for hyphen, so we check for both patterns
  return !str.includes('react\\x2dnative') && !str.includes('react-native');
});

module.exports = config;
