module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin',
      ['module-resolver', { 
        alias: {
          '@exerciseThumbnails': './assets/images/exercises/thumbnails',
          '@exerciseBackgrounds': './assets/images/exercises/backgrounds',
          '@programThumbnails': './assets/images/programs',
          '@videos': './assets/videos',
          '@sounds': './assets/sounds',
          '@fonts': './assets/fonts',
          '@components': './components',
          '@modules': './modules',
          '@screens': './screens',
          '@icons': './assets/icons',
        },
      }],
    ],
  };
};
