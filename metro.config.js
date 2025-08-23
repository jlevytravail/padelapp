const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Reduce file watcher usage
config.watchFolders = [];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Optimize file watching
config.watcher = {
  healthCheck: {
    enabled: true,
  },
  watchman: {
    deferStates: ['hg.update'],
  },
};

module.exports = config;