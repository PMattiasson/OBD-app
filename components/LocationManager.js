import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { useSettings } from '../context/SettingsContext';

export default function LocationManager() {
    const [location, setLocation] = useState(null);
    const settings = useSettings();
    const locationSubscription = useRef();

    const sendData = useCallback(
        (timestamp, latitude, longitude) => {
            if (settings.server.toggleUpload) {
                fetch(`${settings.server.apiURL}api/gps`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        timestamp: timestamp,
                        latitude: latitude,
                        longitude: longitude,
                    }),
                })
                    .then((response) => response.text())
                    .then((responseData) => {
                        console.log(responseData);
                    })
                    .catch((error) => console.log(error));
            }
        },
        [settings.server.toggleUpload, settings.server.apiURL],
    );

    useEffect(() => {
        if (settings.maps.toggleGPS) {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                    return;
                }

                await Location.enableNetworkProviderAsync().catch((error) => console.log(error));

                locationSubscription.current = await Location.watchPositionAsync(
                    { accuracy: Location.Accuracy.Highest },
                    (location) => {
                        setLocation(location);
                        // console.log(location);
                        sendData(
                            location.timestamp,
                            location.coords.latitude,
                            location.coords.longitude,
                        );
                    },
                );
            })();
            return () => locationSubscription.current?.remove();
        }
    }, [settings.maps.toggleGPS, sendData]);
}
