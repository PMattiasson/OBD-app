import { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { useSettings } from '../context/SettingsContext';

export default function WebSocketManager() {
    const settings = useSettings();
    let ws = useRef(null);
    const [data, setData] = useState('');

    useEffect(() => {
        const URL = settings.server.apiURL;
        ws.current = new WebSocket(URL);
        ws.current.onopen = () => console.log('ws opened');
        ws.current.onclose = () => console.log('ws closed');

        const wsCurrent = ws.current;

        return () => {
            wsCurrent.close();
        };
    }, [settings.server.apiURL]);

    useEffect(() => {
        if (!ws.current || !settings.server.toggleUpload) return;
        try {
            ws.current.send(data);
        } catch (e) {
            console.log(e);
        }
    }, [data, settings.server.toggleUpload]);

    return (
        <>
            <TextInput
                style={{ height: 50, width: '80%' }}
                label={'Data'}
                onChangeText={(text) => setData(text)}
                mode={'outlined'}
            />
        </>
    );
}
