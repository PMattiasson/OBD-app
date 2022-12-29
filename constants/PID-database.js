const modeCurrentData = 1;
const responsePIDs = [
    {
        name: 'engineRPM',
        description: 'Engine RPM',
        PID: 12,
        mode: modeCurrentData,
        dataBytes: 2,
        unit: 'rpm',
        scale: 0.25,
        offset: 0,
        min: 0,
        max: 16384,
        value: 0,
    },
    {
        name: 'vehicleSpeed',
        description: 'Vehicle speed',
        PID: 13,
        mode: modeCurrentData,
        dataBytes: 1,
        unit: 'km/h',
        scale: 1,
        offset: 0,
        min: 0,
        max: 255,
        value: 0,
    },
    {
        name: 'coolantTemperature',
        description: 'Engine coolant temperature',
        PID: 5,
        mode: modeCurrentData,
        dataBytes: 1,
        unit: '°C',
        scale: 1,
        offset: -40,
        min: -40,
        max: 215,
        value: 0,
    },
];

export default responsePIDs;
