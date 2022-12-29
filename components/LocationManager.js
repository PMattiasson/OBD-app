import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { Text } from 'react-native-paper';
import { useSettings } from '../context/SettingsContext';

export default function LocationManager() {
    const [location, setLocation] = useState(null);
    const settings = useSettings();
    const locationSubscription = useRef();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            locationSubscription.current = Location.watchPositionAsync(
                { accuracy: Location.Accuracy.Highest },
                (location) => {
                    setLocation(location);
                    // console.log(location);

                    if (settings.server.toggleUpload) {
                        fetch(`${settings.server.apiURL}api/gps`, {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                timestamp: location.timestamp,
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }),
                        })
                            .then((response) => response.text())
                            .then((responseData) => {
                                console.log(responseData);
                            })
                            .catch((error) => console.log(error));
                    }
                },
            );
            return () => locationSubscription.current?.remove();
        })();
    }, [settings.server.apiURL, settings.server.toggleUpload]);

    return (
        <>
            <Text>{location?.timestamp}</Text>
            <Text>Latitude: {location?.coords.latitude}</Text>
            <Text>Longitude: {location?.coords.longitude}</Text>
        </>
    );
}
