import { useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useData } from '../context/DataContext';
import useInterval from '../hooks/useInterval';
import objectMap from '../utils/objectMap';
import { useToast } from '../context/ToastContext';

export default function WebSocketManager() {
    const settings = useSettings();
    const data = useData();
    const { dispatch: toast } = useToast();
    let ws = useRef(null);
    let connected = useRef(false);

    useEffect(() => {
        try {
            if (settings.server.toggleUpload) {
                const URL = settings.server.apiURL;
                ws.current = new WebSocket(URL);

                ws.current.onopen = () => {
                    connected.current = true;
                    console.log('ws opened');
                    toast({
                        type: 'open',
                        message: 'Connected to server WebSocket',
                        toastType: 'success',
                    });
                };

                ws.current.onclose = () => {
                    console.log('ws closed');
                    if (connected.current) {
                        connected.current = false;
                        toast({
                            type: 'open',
                            message: 'Lost connection to server WebSocket',
                            toastType: 'error',
                        });
                    } else {
                        toast({
                            type: 'open',
                            message: 'Could not connect to server WebSocket',
                            toastType: 'error',
                        });
                    }
                };

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
                if (Object.keys(data).length == 0) return;

                const dataSnippet = objectMap(data, (val, key) => {
                    if (val === 'value') {
                        return { [key]: val };
                    }
                });
                const message = JSON.stringify(dataSnippet);
                ws.current.send(message);
            } catch (e) {
                console.log('WebSocket error:', e);
            }
        },
        settings.server.toggleUpload ? settings.server.uploadFrequency : null,
    );
}
