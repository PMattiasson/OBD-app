import { useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useData } from '../context/DataContext';
import useInterval from '../hooks/useInterval';

export default function WebSocketManager() {
    const settings = useSettings();
    const data = useData();
    let ws = useRef(null);

    useEffect(() => {
        try {
            if (settings.server.toggleUpload) {
                const URL = settings.server.apiURL;
                ws.current = new WebSocket(URL);
                ws.current.onopen = () => console.log('ws opened');
                ws.current.onclose = () => console.log('ws closed');

                const wsCurrent = ws.current;

                return () => {
                    wsCurrent.close();
                };
            }
        } catch (e) {
            console.log(e);
        }
    }, [settings.server.apiURL, settings.server.toggleUpload]);

    useInterval(
        () => {
            try {
                const dataSnippet = {
                    VehicleSpeed: data.VehicleSpeed.value,
                    EngineRPM: data.EngineRPM.value,
                };
                const message = JSON.stringify(dataSnippet);
                ws.current.send(message);
            } catch (e) {
                console.log('WebSocket error:', e);
            }
        },
        settings.server.toggleUpload ? settings.server.uploadFrequency : null,
    );
}
