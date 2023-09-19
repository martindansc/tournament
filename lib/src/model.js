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

    constructor(seed, name = null, is_bye = false) {
        this.name = name;
        this.seed = seed;
        this.is_bye = is_bye;
    }

    static bye(seed) {
        let new_player = new Player(seed, "Bye", this.is_bye = true);
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

    constructor(num, id = null) {
        this.num = num;
        if (id == null) {
            id = String(num);
        }

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

