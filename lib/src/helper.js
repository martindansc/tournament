import { Player } from "#root/model";
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

    if (m == 1) {
        return [1];
    }

    for (let c = 1; c < m; c *= 2) {
        multiples.push(c);
    }

    multiples.reverse();
    return multiples;
}

export function duplicateArrayNumbers(a) {
    let a2 = [];

    for (let i = 0; i < a.length; i++) {
        a2.push(a[i]);
        a2.push(a[i]);
    }

    return a2;
}

export function calculateNextWinnerStageLooserBracket(c, previous_accomulated, n_stages_column, column_number) {
    if (column_number % 2 == 0) {
        return c + n_stages_column;
    }

    return Math.floor((c - previous_accomulated) / 2) + n_stages_column + previous_accomulated;
}

export function calculatePreviousUpStageLooserBracket(c, previous_accomulated, n_stages_column, column_number) {
    if (column_number % 2 == 1 || column_number == 1) {
        return c - n_stages_column - 1;
    }

    return 2 * c - (n_stages_column * 2) - previous_accomulated;
}

export function calculateNextWinnerStageWinnerBracket(c, previous_accomulated, n_stages_column) {
    return Math.floor((c - previous_accomulated) / 2) + n_stages_column + previous_accomulated;
}

export function calculatPreviousUpStageWinnerBracket(c, previous_accomulated, n_stages_column) {
    return 2 * c - (n_stages_column * 2) - previous_accomulated;
}

export function getSubsets(array, n) {
    let subsets = [];
    let subsets_size = array.length / n;

    if (subsets_size < 1) return [array];

    for (let i = 0; i < n; i++) {
        subsets.push(array.slice(i * subsets_size, (i + 1) * subsets_size));
    }

    return subsets;
}

export function createInternalPlayers(external_players, display_name = (x) => x.name) {
    let n_real_participants = external_players.length;
    let n_players = blpo2(n_real_participants);

    let players = [];

    for (let player_seed = 0; player_seed < external_players.length; player_seed++ in external_players) {
        let external_player = external_players[player_seed];
        players.push(new Player(player_seed, external_player, false, display_name(external_player)));
    }

    while (players.length < n_players) {
        players.push(Player.bye(players.length));
    }

    return players;
}