import { createContext, useContext, useReducer } from 'react';
import { decodePID } from '../utils/Decoder';
import objectMap from '../utils/objectMap';

export const DataContext = createContext(null);
export const DataDispatchContext = createContext(null);

let myPIDs = [];

export function DataProvider({ children }) {
    const [data, dispatch] = useReducer(dataReducer, {});

    return (
        <DataContext.Provider value={data}>
            <DataDispatchContext.Provider value={dispatch}>{children}</DataDispatchContext.Provider>
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
}

export function useDataDispatch() {
    return useContext(DataDispatchContext);
}

function dataReducer(data, action) {
    switch (action.type) {
    case 'decode': {
        let newData = data;

        action.responses.forEach((response) => {
            const decodedMessage = decodePID(response);
            if (decodedMessage === null) {
                return;
            }

            if (myPIDs.includes(decodedMessage.PID)) {
                newData = objectMap(newData, (val, key) => {
                    if (key === decodedMessage.name) {
                        // Modify PID object
                        return { ...val, value: decodedMessage.value };
                    } else {
                        // No change
                        return val;
                    }
                });
            } else {
                // Add new PID object
                myPIDs.push(decodedMessage.PID);
                newData = {
                    ...newData,
                    [decodedMessage.name]: {
                        value: decodedMessage.value,
                        description: decodedMessage.description,
                        unit: decodedMessage.unit,
                    },
                };
            }
        });

        return newData;
    }
    case 'reset': {
        return {};
    }
    default: {
        throw Error('Unknown action: ' + action.type);
    }
    }
}
