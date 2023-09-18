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

export function multiplesOf2until(m) {
    let multiples = [];

    for (let c = 1; c < m; c *= 2) {
        multiples.push(c);
    }

    multiples.reverse();
    return multiples;
}

export function calculateNextWinnerStage(c, previous_accomulated, n_stages_column) {
    return Math.floor((c - previous_accomulated) / 2) + n_stages_column + previous_accomulated;
}

export function calculatPreviousUpStage(c, previous_accomulated, n_stages_column) {
    return 2 * c - (n_stages_column * 2) - previous_accomulated;
}