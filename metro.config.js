const { getDefaultConfig } = require('expo/metro-config')

const defaultConfig = getDefaultConfig(__dirname)

defaultConfig.resolver.assetExts.push('db')

const extraNodeModules = {
  '@exerciseThumbnails': __dirname + '/assets/images/exercises/thumbnails',
  '@exercireBackgrounds': __dirname + '/assets/images/exercises/backgrounds',
  '@programThumbnails': __dirname + '/assets/images/programs',
  '@muscleGroups': __dirname + '/assets/images/muscles',
  '@videos': __dirname + '/assets/videos',
  '@sounds': __dirname + '/assets/sounds',
  '@fonts': __dirname + '/assets/fonts',
  '@components': __dirname + '/components',
  '@modules': __dirname + '/modules',
  '@screens': __dirname + '/screens',
  '@icons': __dirname + '/assets/icons',
};

defaultConfig.resolver.extraNodeModules = extraNodeModules;

module.exports = defaultConfig
