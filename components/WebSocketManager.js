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
    let authorized = useRef(false);
    const toggleUploadRef = useRef(settings.server.toggleUpload);
    const usernameRef = useRef(settings.server.username);
    const passwordRef = useRef(settings.server.password);
    const reconnectInterval = useRef(null);

    const sendData = useCallback(() => {
        try {
            if (Object.keys(data).length == 0 || connected.current === false) return;

            let dataSnippet = objectMap(data, (val) => {
                return val?.value;
            });
            dataSnippet = { ...dataSnippet, timestamp: data.timestamp };
            const message = JSON.stringify(dataSnippet);
            ws.current.send(message);
        } catch (e) {
            console.log('WebSocket send error:', e);
        }
    }, [data]);

    const authorize = useCallback(async (loginURL, username, password, callback) => {
        if (loginURL?.length === 0) return console.log('Login URL invalid');

        return fetch(loginURL, {
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
            .then((response) => response.text())
            .then((responseData) => {
                // console.log(responseData);
                const data = JSON.parse(responseData);
                if (data.result === 'OK') {
                    authorized.current = true;
                    console.log('Authorized to server');
                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                } else {
                    authorized.current = false;
                    console.log('Failed to authorize to server');
                    toast({
                        type: 'open',
                        message: 'Failed to authorize to server',
                        toastType: 'error',
                    });
                }
            })
            .catch((error) => {
                authorized.current = false;
                console.log('Auth error:', error);
                toast({
                    type: 'open',
                    message: 'Failed to connect to server',
                    toastType: 'error',
                });
            });
    }, []);

    // Auth to server
    useEffect(() => {
        const httpURL = settings.server.apiURL;
        const loginURL = `${httpURL}login`;
        const logoutURL = `${httpURL}logout`;
        usernameRef.current = settings.server.username;
        passwordRef.current = settings.server.password;

        if (httpURL) {
            authorize(loginURL, usernameRef.current, passwordRef.current);
            return () => fetch(logoutURL, { method: 'DELETE' });
        }
    }, [settings.server.apiURL, settings.server.username, settings.server.password, authorize]);

    // Connection to server WebSocket
    useEffect(() => {
        const httpURL = settings.server.apiURL;
        const loginURL = `${httpURL}login`;
        toggleUploadRef.current = settings.server.toggleUpload;

        if (settings.server.toggleUpload && httpURL) {
            if (authorized.current === false) {
                authorize(loginURL, usernameRef.current, passwordRef.current, connect);
            } else {
                connect();
            }
            return () => disconnect();
        }

        async function connect() {
            try {
                ws.current = new WebSocket(httpURL);

                ws.current.onopen = () => {
                    connected.current = true;
                    clearInterval(reconnectInterval.current);
                    reconnectInterval.current = null;
                    console.log('ws opened');
                    toast({
                        type: 'open',
                        message: 'Connected to server WebSocket',
                        toastType: 'success',
                    });
                };

                ws.onmessage = (event) => {
                    // a message was received
                    console.log(event.data);
                };

                ws.current.onclose = (event) => {
                    console.log('ws closed', event);

                    if (event?.code === 1000) {
                        toast({
                            type: 'open',
                            message: 'Disconnected from server WebSocket',
                            toastType: 'success',
                        });
                    } else {
                        authorized.current = false;
                        if (connected.current) {
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
                        reconnectInterval.current = setInterval(() => {
                            if (toggleUploadRef.current) {
                                authorize(
                                    loginURL,
                                    usernameRef.current,
                                    passwordRef.current,
                                    connect,
                                );
                            }
                        }, 5000);
                    }

                    connected.current = false;
                };

                ws.onerror = (event) => {
                    // an error occurred
                    console.log('WebSocket error:', event.message);
                };

                wsCurrent = ws.current;
            } catch (e) {
                console.log('WebSocket connect error:', e);
            }
        }

        function disconnect() {
            wsCurrent?.close();
        }
    }, [settings.server.apiURL, settings.server.toggleUpload, authorize]);

    // Send data to server with interval
    useInterval(sendData, settings.server.toggleUpload ? settings.server.uploadFrequency : null);

    // Send data to server on data update
    useEffect(() => {
        if (settings.server.toggleUpload && settings.server.uploadFrequency === null) {
            sendData();
        }
    }, [sendData, settings.server.toggleUpload, settings.server.uploadFrequency]);
}
