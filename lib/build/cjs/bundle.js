'use strict';

function blpo2(i) {
    let x = i;
    x = x | (x >> 1);
    x = x | (x >> 2);
    x = x | (x >> 4);
    x = x | (x >> 8);
    x = x | (x >> 16);
    x = x | (x >> 32);

    let result = (x - (x >> 1));
    result = result == i ? result : result * 2;
    return result;
}

function multiplesOf2until(m) {
    let multiples = [];

    for (let c = 1; c < m; c *= 2) {
        multiples.push(c);
    }

    multiples.reverse();
    return multiples;
}

function calculateNextWinnerStage(c, previous_accomulated, n_stages_column) {
    return Math.floor((c - previous_accomulated) / 2) + n_stages_column + previous_accomulated;
}

function calculatPreviousUpStage(c, previous_accomulated, n_stages_column) {
    return 2 * c - (n_stages_column * 2) - previous_accomulated;
}

const Result = {
    Unfinished: 0,
    WinPlayer1: 1,
    WinPlayer2: 2,
    Draw: 3,
    Error: 4
};

class Player {
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

class Stage {
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

function printTree(
    initialTree,
    printNode,
    getChildren,
) {
    function printBranch(tree, branch) {
        const isGraphHead = branch.length === 0;
        const children = getChildren(tree) || [];

        let branchHead = '';

        if (!isGraphHead) {
            branchHead = children && children.length !== 0 ? '┬ ' : '─ ';
        }

        const toPrint = printNode(tree, `${branch}${branchHead}`);

        if (typeof toPrint === 'string') {
            console.log(`${branch}${branchHead}${toPrint}`);
        }

        let baseBranch = branch;

        if (!isGraphHead) {
            const isChildOfLastBranch = branch.slice(-2) === '└─';
            baseBranch = branch.slice(0, -2) + (isChildOfLastBranch ? '  ' : '│ ');
        }

        const nextBranch = baseBranch + '├─';
        const lastBranch = baseBranch + '└─';

        children.forEach((child, index) => {
            printBranch(child, children.length - 1 === index ? lastBranch : nextBranch);
        });
    }

    printBranch(initialTree, '');
}

class SingleBracket {
    /** @type {?number[]} */
    stages_columns_number = null;
    /** @type {?number[][]} */
    per_column_stage = null;

    /** @type {?number} */
    n_players = null;
    /** @type {?number} */
    n_stages = null;

    /** @type {?Player[]} */
    players = null;

    /** @type {?Stage[]} */
    stages = null;

    /** @type {number} */
    first_non_executed_stage = 0;

    constructor(players) {
        this.players = players;
        this.n_players = players.length;
        this.n_stages = this.n_players - 1;
        this.stages_columns_number = multiplesOf2until(this.n_stages);
        this.first_non_executed_stage = 0;
        this._createStages();
        this._assignPlayers(this.stages[this.stages.length - 1], [...this.players]);
        this._updateFirstNonExecutedStage();
    }

    _createStages() {
        let stages = [];
        let per_column_stage = [];

        let accomulated = 0;
        let stage_num = 0;
        for (let stage_column = 0; stage_column < this.stages_columns_number.length; stage_column++) {
            per_column_stage[stage_column] = [];

            let number_of_stages_in_this_column = this.stages_columns_number[stage_column];
            let previous_accomulated = accomulated;
            accomulated += number_of_stages_in_this_column;

            while (stage_num < accomulated) {
                let stage = new Stage(stage_num);

                if (stage_column + 1 < this.stages_columns_number.length) {
                    stage.next_winner = calculateNextWinnerStage(stage_num, previous_accomulated, number_of_stages_in_this_column);
                }

                if (stage_column > 0) {
                    stage.previous_up = calculatPreviousUpStage(stage_num, previous_accomulated, number_of_stages_in_this_column);
                    stage.previous_down = stage.previous_up + 1;
                }

                stages.push(stage);

                per_column_stage[stage_column].push(stage_num);

                stage_num++;
            }

        }

        this.stages = stages;
        this.per_column_stage = per_column_stage;
    }

    /** @param{Stage} current_stage @param{Player[]} current_players*/
    _assignPlayers(current_stage, current_players) {
        if (current_players.length == 2) {
            current_stage.player_1 = current_players[0];
            current_stage.player_2 = current_players[1];
            return;
        }

        let list_up = [];
        let list_down = [];

        while (current_players.length > 3) {
            list_up.push(current_players.shift());
            list_down.push(current_players.shift());
            list_down.push(current_players.shift());
            list_up.push(current_players.shift());
        }

        this._assignPlayers(this.stages[current_stage.previous_up], list_up);
        this._assignPlayers(this.stages[current_stage.previous_down], list_down);
    }

    consolePrint() {

        console.log("--- Printing current tree ---");
        printTree(
            this.stages[this.stages.length - 1],
            node => {
                let players = "";
                players += node.player_1 ? ` ${node.player_1.name}` : ` -`;
                players += ` vs `;
                players += node.player_2 ? `${node.player_2.name}` : `-`;
                players += ` (${node.player_1_score} - ${node.player_2_score})`;
                return String(node.num) + players;
            },
            node => node.hasPrevious() ? [this.stages[node.previous_up], this.stages[node.previous_down]] : [],
        );

        console.log("\n");
    }

    validate() {
        for (let stage of this.stages) {
            if (stage.hasPrevious()) {
                if (stage.num !== this.stages[stage.previous_up].next_winner || stage.num !== this.stages[stage.previous_down].next_winner) {
                    console.error(`[test_previous_stage] Invalid stage found ${stage.num} `);
                }
            }

            if (stage.hasNext()) {
                if (stage.num !== this.stages[stage.next_winner].previous_up && stage.num !== this.stages[stage.next_winner].previous_down) {
                    console.error(`[test_next_stage] Invalid stage found ${stage.num} `);
                }
            }
        }
    }

    _updateFirstNonExecutedStage() {
        for (let stage of this.stages) {
            if (stage.result == Result.Unfinished) {

                if (stage.player_2.is_bye) {
                    this.addResultVictory(stage.num, Result.WinPlayer1);
                    continue;
                }

                if (stage.player_1.is_bye) {
                    this.addResultVictory(stage.num, Result.WinPlayer2);
                    continue;
                }

                this.first_non_executed_stage = stage.num;
                if (!stage.hasPlayers()) {
                    console.error("First non executed stage should have players");
                }

                return;
            }
        }

        this.finished = true;
    }

    getNextStage() {
        if (this.finished) {
            return null;
        }

        return this.stages[this.first_non_executed_stage];
    }

    addResultPoints(stage_num, points_player_1, points_player_2) {
        let stage = this.stages[stage_num];
        stage.player_1_score = points_player_1;
        stage.player_2_score = points_player_2;

        let result = Result.Draw;
        if (points_player_1 > points_player_2) {
            result = Result.WinPlayer1;
        }

        if (points_player_1 < points_player_2) {
            result = Result.WinPlayer2;
        }

        this.addResultVictory(stage_num, result);
    }

    /** @param {number} stage_num @param {Result} result */
    addResultVictory(stage_num, result) {
        if (result == Result.Draw) {
            console.error("Not implemented");
        }

        let stage = this.stages[stage_num];
        stage.result = result;

        let winner_player = Result.WinPlayer1 == result ? stage.player_1 : stage.player_2;

        if (stage.hasNext()) {
            let next_stage_winner = this.stages[stage.next_winner];
            if (next_stage_winner.previous_up == stage_num) {
                next_stage_winner.player_1 = winner_player;
            }
            else {
                next_stage_winner.player_2 = winner_player;
            }
        }

        this._updateFirstNonExecutedStage();
    }

}

class Tournament {
    constructor() {
        this.players = null;
        this.bracket = null;
    }

    _createPlayers(player_names, n_players) {
        let players = [];

        for (let player_seed in player_names) {
            let player_name = player_names[player_seed];
            players.push(new Player(player_seed, player_name));
        }

        while (players.length < n_players) {
            players.push(Player.bye(players.length));
        }

        return players;
    }

    /** @param{Player[]} player_names: ordered by seed */
    create(player_names) {
        let n_real_participants = player_names.length;
        let n_players = blpo2(n_real_participants);

        this.players = this._createPlayers(player_names, n_players);
        this.bracket = new SingleBracket(this.players);
    }

    hasNextStage() {
        return !this.bracket.finished;
    }

    getNextStage() {
        return this.bracket.getNextStage();
    }

    load(data) {

    }

    addResultPoints(stage_num, points_player_1, points_player_2) {
        this.bracket.addResultPoints(stage_num, points_player_1, points_player_2);
    }

    /** @param {number} stage_num @param {Result} result */
    addResultVictory(stage_num, result) {
        this.bracket.addResultVictory(stage_num, result);
    }
}

exports.Result = Result;
exports.Stage = Stage;
exports.Tournament = Tournament;
