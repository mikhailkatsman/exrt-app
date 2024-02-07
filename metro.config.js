const { getDefaultConfig } = require('expo/metro-config')


module.exports = (() => {
  const defaultConfig = getDefaultConfig(__dirname);

  const { transformer, resolver } = defaultConfig;

  defaultConfig.resolver.assetExts.push('db');


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
    '@images': __dirname + '/assets/images',
  };

  defaultConfig.resolver.extraNodeModules = extraNodeModules;

  defaultConfig.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer")
  };

  defaultConfig.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"]
  };

  return defaultConfig
})()
