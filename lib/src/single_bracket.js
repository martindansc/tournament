import {
    calculateNextWinnerStageWinnerBracket,
    multiplesOf2until,
    calculatPreviousUpStageWinnerBracket as calculatPreviousUpStageWinnerBracket
} from "#root/helper";

import { printTree } from "#root/print-tree";

import { Player, Stage, Result } from "#root/model";

export class SingleBracket {
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
                let stage = new Stage(stage_num, stage_column);

                if (stage_column + 1 < this.stages_columns_number.length) {
                    stage.next_winner = calculateNextWinnerStageWinnerBracket(stage_num, previous_accomulated, number_of_stages_in_this_column);
                }

                if (stage_column > 0) {
                    stage.previous_up = calculatPreviousUpStageWinnerBracket(stage_num, previous_accomulated, number_of_stages_in_this_column);
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

    /** @param{string} name @param{Array} list @param{number} number*/
    assignUniqueToColumnStages(name, list, number) {
        for (let column = 0; column < this.per_column_stage.length; column++) {
            let stages = this.per_column_stage[column];
            for (let stage_num of stages) {
                let stage = this.stages[stage_num];
                stage.extra_info[name] = list.slice(number * column, number * column + number);
            }
        }
    }

    consolePrint() {

        console.log("--- Printing bracket ---")
        printTree(
            this.stages[this.stages.length - 1],
            node => {
                let players = "";
                players += node.player_1 ? ` ${node.player_1.name}` : ` -`;
                players += ` vs `;
                players += node.player_2 ? `${node.player_2.name}` : `-`;
                players += ` (${node.player_1_score} - ${node.player_2_score})`;
                let extra_info = node.extra_info.maps ? " : " + node.extra_info.maps : "";
                return String(node.num) + players + extra_info;
            },
            node => {
                if (!node) return [];
                if (node.hasPrevious()) return [this.stages[node.previous_up], this.stages[node.previous_down]];
                if (node.hasPreviousUp()) return [this.stages[node.previous_up]];
                if (node.hasPreviousDown()) return [this.stages[node.previous_down]];

                return [];
            }
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
        let assigned = false;
        for (let stage of this.stages) {
            if (stage.result == Result.Unfinished) {

                if (stage.player_2 && stage.player_2.is_bye) {
                    this.addResultVictory(stage.num, Result.WinPlayer1);
                    continue;
                }

                if (stage.player_1 && stage.player_1.is_bye) {
                    this.addResultVictory(stage.num, Result.WinPlayer2);
                    continue;
                }

                if (!assigned) {
                    assigned = true;
                    this.first_non_executed_stage = stage.num;
                }
            }
        }

        if (!assigned) {
            this.finished = true;
        }
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

    getLooserPlayers() {
        let loosers = [];
        for (let stage of this.stages) {
            if (stage.result == Result.WinPlayer1) {
                loosers.push(stage.player_2);
            }
            else if (stage.result == Result.WinPlayer2) {
                loosers.push(stage.player_1);
            }
        }

        return loosers;
    }

    getWinner() {
        if (!this.finished) {
            throw Error("Should be finished");
        }

        let last_index = this.stages.length - 1;
        return this.stages[last_index].result == Result.WinPlayer1 ? this.stages[last_index].player_1 : this.stages[last_index].player_2;
    }

}