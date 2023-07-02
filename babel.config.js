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
          '@components': './components',
          '@modules': './modules',
          '@screens': './screens',
        },
      }],
    ],
  };
};
