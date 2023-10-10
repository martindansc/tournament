import {
    calculateNextWinnerStageWinnerBracket,
    multiplesOf2until,
    calculatPreviousUpStageWinnerBracket as calculatPreviousUpStageWinnerBracket
} from "#root/helper";

import { printTree } from "#root/print-tree";

import { Player, Stage, Result } from "#root/model";

export class FinalBracket {
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

    constructor(players, stage_initial_num) {
        this.players = players;
        this.n_players = players.length;
        this.stage_initial_num = stage_initial_num;
        this.n_stages = this.n_players;
        this.stages_columns_number = [1, 1];
        this.first_non_executed_stage = 0;
        this._createStages();
        this._assignPlayers();
        this._updateFirstNonExecutedStage();
    }

    _createStages() {
        let stage0 = new Stage(0, 0, this.stage_initial_num);
        stage0.next_winner = 1;

        let stage1 = new Stage(1, 1, this.stage_initial_num + 1);
        stage1.previous_down = 0;

        this.stages = [stage0, stage1];
        this.per_column_stage = [[0], [1]];
    }

    /** @param{Stage} current_stage @param{Player[]} current_players*/
    _assignPlayers() {
        this.stages[0].player_1 = this.players[0];
        this.stages[0].player_2 = this.players[1];
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

        console.log("--- Printing Final bracket ---")
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
        for (let stage of this.stages) {
            if (stage.result == Result.WinPlayer1) {
                this.finished = true;
            }
            else if (stage.result == Result.WinPlayer2) {
                this.stages[1].player_1 = this.players[0];
                this.stages[1].player_2 = this.players[1];
            }

            if (stage.result == Result.Unfinished) {

                if (stage.player_2 && stage.player_2.is_bye) {
                    this.addResultVictory(stage.num, Result.WinPlayer1);
                    continue;
                }

                if (stage.player_1 && stage.player_1.is_bye) {
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