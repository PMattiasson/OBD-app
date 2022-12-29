import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { styles } from '../styles/styles';
import { useSettings } from '../context/SettingsContext';

export default function MapScreen() {
    const mapRef = useRef();
    const settings = useSettings();
    const [coordinates, setCoordinates] = useState([]);

    const getData = useCallback(() => {
        fetch(`${settings.server.apiURL}api/gps`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                setCoordinates(responseData);
            })
            .catch((error) => console.log(error));
    }, [settings.server.apiURL]);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <View style={styles.container.base}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={{ width: '100%', height: '100%' }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                <Polyline coordinates={coordinates} strokeColor="#c43a31" strokeWidth={6} />
            </MapView>
            <View style={{ position: 'absolute', padding: 5 }}>
                <IconButton
                    icon={'refresh'}
                    iconColor="black"
                    mode="contained-tonal"
                    containerColor="white"
                    onPress={getData}
                />
            </View>
        </View>
    );
}
