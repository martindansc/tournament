export function blpo2(i) {
    let x = i;
    x = x | (x >> 1);
    x = x | (x >> 2);
    x = x | (x >> 4);
    x = x | (x >> 8);
    x = x | (x >> 16);
    x = x | (x >> 32);

    let result = (x - (x >> 1))
    result = result == i ? result : result * 2;
    return result;
}