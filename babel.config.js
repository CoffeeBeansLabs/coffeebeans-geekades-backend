module.exports = (api) => {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env', {
          targets: {
            node: 'current',
          },
        },
      ],
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      'lodash',
    ],
  };
};
