module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        env: {
            production: {
                plugins: ['react-native-paper/babel', 'transform-remove-console'],
            },
        },
        plugins: ['react-native-reanimated/plugin', 'transform-inline-environment-variables'],
    };
};
