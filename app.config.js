const IS_DEV = process.env.APP_VARIANT === 'development';

module.exports = ({ config }) => {
    // You can also switch out the app icon and other properties to further
    // differentiate the app on your device.
    return {
        ...config,
        name: IS_DEV ? 'OBD (Dev)' : 'OBD',
        ios: {
            bundleIdentifier: IS_DEV ? 'com.per.obd.dev' : 'com.per.obd',
        },
        android: {
            package: IS_DEV ? 'com.per.obd.dev' : 'com.per.obd',
            config: {
                googleMaps: {
                    apiKey: process.env.MAPS_API_KEY,
                },
            },
        },
    };
};
