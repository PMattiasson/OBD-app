const modeCurrentData = '01';
export default responsePIDs = [
    { description: 'Engine RPM', PID: '0C', mode: modeCurrentData, dataBytes: 2, unit: 'rpm', scale: 0.25, offset: 0, min: 0, max: 16384, value: 0},
    { description: 'Vehicle speed', PID: '0D', mode: modeCurrentData, dataBytes: 1, unit: 'km/h', scale: 1, offset: 0, min: 0, max: 255, value: 0},
];