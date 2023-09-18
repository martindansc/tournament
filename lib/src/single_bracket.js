import {
    calculateNextWinnerStage,
    multiplesOf2until,
    calculatPreviousUpStage as calculatePreviousUpStage
} from "#root/helper";

import printTree from "print-tree";

import { Player, Stage } from "#root/model";

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

    constructor(players) {
        this.players = players;
        this.n_players = players.length;
        this.n_stages = this.n_players - 1;
        this.stages_columns_number = multiplesOf2until(this.n_stages);
        this._createStages();
        this._assignPlayers(this.stages[this.stages.length - 1], this.players);
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
                    stage.previous_up = calculatePreviousUpStage(stage_num, previous_accomulated, number_of_stages_in_this_column);
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
        printTree(
            this.stages[this.stages.length - 1],
            node => {
                let players = "";
                if (node.hasPlayers()) {
                    players = ` ${node.player_1.name} vs ${node.player_2.name}`;
                }
                return String(node.num) + players;
            },
            node => node.hasPrevious() ? [this.stages[node.previous_up], this.stages[node.previous_down]] : [],
        );
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

}