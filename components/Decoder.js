import responsePIDs from './PID-database';

export function decodePID(hexString) {
    const messageResponse = {
        bytes: 0,
        mode: '01',
        PID: '00',
        data: {
            A: '00',
            B: '00',
            C: '00',
            D: '00',
        },
        undf: '00'
    };
    let hexBytes = [];

    // Remove spaces from hexadecimal string
    hexString = hexString.replace(/\s/g, '');

    // Split the hexadecimal string into individual bytes
    for (let i = 0; i < hexString.length; i += 2) {
        hexBytes.push(hexString.substring(i, i+2));
    }
    // Assign the corresponding bytes
    messageResponse.bytes = parseInt(hexBytes[0], 10);
    messageResponse.mode = hexBytes[1];
    messageResponse.PID = hexBytes[2];

    // Assign A, B, C, D
    Object.keys(messageResponse.data).map((key, i)=>{
        messageResponse.data[key] = hexBytes[i+3];
    });

    // Find the corresponding response PID object
    let response = responsePIDs.find(obj => obj.PID === messageResponse.PID);
    if (response == undefined) {
        return null;
    }

    // Get decimal value from message
    let hexValueString = Object.entries(messageResponse.data)
        .slice(0, response.bytes)
        .map(entry => entry[1])
        .join('');
    let value = parseInt(hexValueString, 16);

    // Calculate message value from formula
    response.value = convertFormula(response, value);
    return response;
}

function convertFormula(objResponse, decValue) {
    let result = objResponse.offset + objResponse.scale * decValue;
    return result;
}

