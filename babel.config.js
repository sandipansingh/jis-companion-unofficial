module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "transform-remove-console",
        {
          exclude: ["error", "warn"], // Keep console.error and console.warn
        },
      ],
    ],
    env: {
      production: {
        plugins: [
          [
            "transform-remove-console",
            {
              exclude: ["error"], // In production, only keep console.error
            },
          ],
        ],
      },
    },
  };
};
