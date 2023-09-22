export const Result = {
    Unfinished: 0,
    WinPlayer1: 1,
    WinPlayer2: 2,
    Draw: 3,
    Error: 4
}

export class Player {
    name;
    seed;
    is_bye;
    extra_info;

    constructor(seed, extra_info, is_bye = false, name) {
        this.name = name;
        this.seed = seed;
        this.is_bye = is_bye;
        this.extra_info = extra_info;
    }

    static bye(seed) {
        let new_player = new Player(seed, {}, this.is_bye = true, "Bye");
        return new_player;
    }
}

export class Stage {
    /** @type{number} */
    num;

    /** @type{String} */
    id;

    /** @type{Player} */
    player_1;
    /** @type{Player} */
    player_2;

    /** @type{number} */
    player_1_score;
    /** @type{number} */
    player_2_score;
    /** @type{number} */
    result;

    /** @type{number} */
    next_winner;
    /** @type{number} */
    next_looser;
    /** @type{number} */
    previous_up;
    /** @type{number} */
    previous_down;

    /** @type{number} */
    column;

    extra_info;

    constructor(num, column, id = null) {
        this.num = num;
        if (id == null) {
            id = String(num);
        }

        this.column = column;

        this.id = id;

        this.player_1 = null;
        this.player_2 = null;
        this.player_1_score = 0;
        this.player_2_score = 0;
        this.result = Result.Unfinished;

        this.next_winner = null;
        this.next_stage_looser = null;
        this.previous_up = null;
        this.previous_down = null;

        this.extra_info = {};
    }

    hasPrevious() {
        return this.previous_up !== null;
    }

    hasNext() {
        return this.next_winner !== null;
    }

    hasPlayers() {
        return this.player_1 !== null && this.player_2 !== null;
    }

}


