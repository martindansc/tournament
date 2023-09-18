export class Player {
    name;
    seed;

    constructor(seed, name = null) {
        if (!name) {
            name = "Bye";
        }

        this.name = name;
        this.seed = seed;
    }
}

export class Stage {
    num;

    player_1;
    player_2;
    player_1_score;
    player_2_score;
    winner;

    next_winner;
    next_looser;
    previous_up;
    previous_down;

    constructor(num) {
        this.num = num;

        this.player_1 = null;
        this.player_2 = null;
        this.player_1_score = 0;
        this.player_2_score = 0;
        this.winner = 0;

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

}


