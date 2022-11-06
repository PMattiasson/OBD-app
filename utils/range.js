export default function range(start, stop, step) {
    let result = [];
    for (var i = start; step > 0 ? i <= stop : i >= stop; i += step) {
        result.push(i);
    }
    return result;
}