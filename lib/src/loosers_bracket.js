import {
    multiplesOf2until,
    duplicateArrayNumbers,
    calculateNextWinnerStageLooserBracket,
    calculatePreviousUpStageLooserBracket,
    getSubsets,

} from "#root/helper";

import { printTree } from "#root/print-tree";

import { Player, Stage, Result } from "#root/model";

export class LooserBracket {
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

    /** @type {number} */
    stage_initial_num;

    constructor(n_players, stage_initial_num) {
        this.n_players = n_players;
        this.stage_initial_num = stage_initial_num;
        this.n_stages = this.n_players - 1;
        this.stages_columns_number = duplicateArrayNumbers(multiplesOf2until(this.n_stages / 2));
        this.first_non_executed_stage = 0;
        this._createStages();
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
                let stage = new Stage(stage_num, stage_column, stage_num + this.stage_initial_num);

                if (stage_column + 1 < this.stages_columns_number.length) {
                    stage.next_winner = calculateNextWinnerStageLooserBracket(stage_num, previous_accomulated, number_of_stages_in_this_column, stage_column);
                }

                if (stage_column > 0) {
                    let tmp_up = calculatePreviousUpStageLooserBracket(stage_num, previous_accomulated, number_of_stages_in_this_column, stage_column);
                    if (stage_column % 2 == 0) {
                        stage.previous_up = tmp_up;
                    }

                    stage.previous_down = tmp_up + 1;
                }

                stages.push(stage);

                per_column_stage[stage_column].push(stage_num);

                stage_num++;
            }

        }

        this.stages = stages;
        this.per_column_stage = per_column_stage;
    }

    /** @param{Stage[]} column_stages @param{Number} current_player_index @param{Boolean} desc*/
    _assignPlayersOrdered(column_stages, current_player_index, desc, both = false) {
        if (!desc) {
            column_stages.reverse();
        }

        for (let stage_num of column_stages) {
            let stage = this.stages[stage_num];
            stage.player_1 = this.players[current_player_index];
            if (both) {
                current_player_index++;
                stage.player_2 = this.players[current_player_index];
            }
            current_player_index++;
        }

        return current_player_index;
    }

    _assignPlayers(players) {
        this.players = players;

        let current_player_index = 0;

        current_player_index = this._assignPlayersOrdered(this.per_column_stage[0], current_player_index, true, true);
        let desc_counters = 0;
        let desc = false;

        let groups = 1;

        for (let column = 1; column < this.per_column_stage.length; column++) {
            if (column % 2 == 0) {
                continue;
            }

            let stages = this.per_column_stage[column];
            let subsets = getSubsets(stages, groups);

            if (desc_counters % 2 == 0) {
                subsets.reverse();
            }

            for (let subset of subsets) {
                current_player_index = this._assignPlayersOrdered(subset, current_player_index, desc);
            }

            desc_counters++;
            if (desc_counters % 2 == 0) {
                desc = !desc
            }
            else {
                groups = 2;
            }
        }
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

        console.log("--- Printing Looser bracket ---")
        printTree(
            this.stages[this.stages.length - 1],
            node => {
                let players = "";
                if (!node) {
                    return "()"
                }

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

    getWinner() {
        if (!this.finished) {
            throw Error("Should be finished");
        }

        let last_index = this.stages.length - 1;
        return this.stages[last_index].result == Result.WinPlayer1 ? this.stages[last_index].player_1 : this.stages[last_index].player_2;
    }

}