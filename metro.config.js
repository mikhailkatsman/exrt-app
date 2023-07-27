const { getDefaultConfig } = require('expo/metro-config')

const defaultConfig = getDefaultConfig(__dirname)

defaultConfig.resolver.assetExts.push('db')

const extraNodeModules = {
  '@thumbnails': __dirname + '/assets/images/exercises/thumbnails',
  '@fonts': __dirname + '/assets/fonts',
  '@components': __dirname + '/components',
  '@modules': __dirname + '/modules',
  '@screens': __dirname + '/screens',
};

defaultConfig.resolver.extraNodeModules = extraNodeModules;

module.exports = defaultConfig
