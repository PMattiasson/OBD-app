import { useCallback, useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useData } from '../context/DataContext';
import useInterval from '../hooks/useInterval';
import objectMap from '../utils/objectMap';
import { useToast } from '../context/ToastContext';

let wsCurrent = null;

export default function WebSocketManager() {
    const settings = useSettings();
    const data = useData();
    const { dispatch: toast } = useToast();
    let ws = useRef(null);
    let connected = useRef(false);

    const sendData = useCallback(() => {
        try {
            if (Object.keys(data).length == 0 || connected.current === false) return;

            const dataSnippet = objectMap(data, (val) => {
                return val.value;
            });
            const message = JSON.stringify(dataSnippet);
            ws.current.send(message);
        } catch (e) {
            console.log('WebSocket error:', e);
        }
    }, [data]);

    // Connection to server WebSocket
    useEffect(() => {
        const httpURL = settings.server.apiURL.replace('ws', 'http');

        connect();

        return () => disconnect();

        async function authorize() {
            const username = settings.server.username;
            const password = settings.server.password;

            return fetch(`${httpURL}login`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            })
                .then((response) => response.json())
                .then((json) => {
                    if (json.result === 'OK') return true;
                    else return false;
                })
                .catch((error) => console.log(error));
        }

        async function connect() {
            try {
                if (settings.server.toggleUpload) {
                    const authResult = await authorize();
                    if (authResult == false) {
                        console.log('Failed to authorize to server');
                        return;
                    }
                    console.log('Authorized to server');

                    const wsURL = settings.server.apiURL;
                    ws.current = new WebSocket(wsURL);

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

                    wsCurrent = ws.current;
                }
            } catch (e) {
                console.log(e);
            }
        }

        function disconnect() {
            wsCurrent?.close();
            fetch(`${httpURL}logout`, { method: 'DELETE' });
        }
    }, [settings.server.apiURL, settings.server.toggleUpload]);

    // Send data to server with interval
    useInterval(sendData, settings.server.toggleUpload ? settings.server.uploadFrequency : null);

    // Send data to server on data update
    useEffect(() => {
        if (settings.server.toggleUpload && settings.server.uploadFrequency === null) {
            sendData();
        }
    }, [sendData, settings.server.toggleUpload, settings.server.uploadFrequency]);
}
