import responsePIDs from '../constants/PID-database';

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
        undf: '00',
    };
    let hexBytes = [];

    try {
        // Remove spaces from hexadecimal string
        hexString = hexString.replace(/\s/g, '');

        // Split the hexadecimal string into individual bytes
        for (let i = 0; i < hexString.length; i += 2) {
            hexBytes.push(hexString.substring(i, i + 2));
        }
        // Assign the corresponding bytes
        messageResponse.bytes = parseInt(hexBytes[0], 16);
        messageResponse.mode = parseInt(hexBytes[1], 16);
        messageResponse.PID = parseInt(hexBytes[2], 16);

        // Assign A, B, C, D
        Object.keys(messageResponse.data).map((key, i) => {
            messageResponse.data[key] = hexBytes[i + 3];
        });

        // Find the corresponding response PID object
        let response = responsePIDs.find((obj) => obj.PID === messageResponse.PID);
        if (response == undefined) {
            return null;
        }

        // Get decimal value from message
        let hexValueString = Object.entries(messageResponse.data)
            .slice(0, response.bytes)
            .map((entry) => entry[1])
            .join('');
        let value = parseInt(hexValueString, 16);

        // Calculate message value from formula
        response.value = convertFormula(response.offset, response.scale, value);
        return response;
    } catch (error) {
        console.log('Error decoding message: ', error);
    }
}

function convertFormula(offset, scale, decValue) {
    let result = offset + scale * decValue;
    if (Number.isInteger(result)) return result;
    else return +result.toFixed(2);
}
