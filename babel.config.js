module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin',
      ['module-resolver', { 
        alias: {
          '@thumbnails': './assets/images/exercises/thumbnails',
          '@backgrounds': './assets/images/exercises/backgrounds',
          '@videos': './assets/videos',
          '@sounds': './assets/sounds',
          '@fonts': './assets/fonts',
          '@components': './components',
          '@modules': './modules',
          '@screens': './screens',
        },
      }],
    ],
  };
};
