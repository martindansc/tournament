var tournament = (function (exports) {
    'use strict';

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

    class Stage {
        /** @type{number} */
        num;

        /** @type{Number} */
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
                id = num;
            }

            this.column = column;

            this.id = id;

            this.player_1 = null;
            this.player_2 = null;
            this.player_1_score = 0;
            this.player_2_score = 0;
            this.result = Result.Unfinished;

            this.next_winner = null;
            this.next_looser = null;
            this.previous_up = null;
            this.previous_down = null;

            this.extra_info = {};
        }

        hasPreviousUp() {
            return this.previous_up !== null;
        }

        hasPreviousDown() {
            return this.previous_down !== null;
        }

        hasPrevious() {
            return this.previous_up !== null && this.previous_down !== null;
        }

        hasNext() {
            return this.next_winner !== null;
        }

        hasPlayers() {
            return this.player_1 && this.player_2;
        }

    }

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

        if (m == 1) {
            return [1];
        }

        for (let c = 1; c < m; c *= 2) {
            multiples.push(c);
        }

        multiples.reverse();
        return multiples;
    }

    function duplicateArrayNumbers(a) {
        let a2 = [];

        for (let i = 0; i < a.length; i++) {
            a2.push(a[i]);
            a2.push(a[i]);
        }

        return a2;
    }

    function calculateNextWinnerStageLooserBracket(c, previous_accomulated, n_stages_column, column_number) {
        if (column_number % 2 == 0) {
            return c + n_stages_column;
        }

        return Math.floor((c - previous_accomulated) / 2) + n_stages_column + previous_accomulated;
    }

    function calculatePreviousUpStageLooserBracket(c, previous_accomulated, n_stages_column, column_number) {
        if (column_number % 2 == 1 || column_number == 1) {
            return c - n_stages_column - 1;
        }

        return 2 * c - (n_stages_column * 2) - previous_accomulated;
    }

    function calculateNextWinnerStageWinnerBracket(c, previous_accomulated, n_stages_column) {
        return Math.floor((c - previous_accomulated) / 2) + n_stages_column + previous_accomulated;
    }

    function calculatPreviousUpStageWinnerBracket(c, previous_accomulated, n_stages_column) {
        return 2 * c - (n_stages_column * 2) - previous_accomulated;
    }

    function getSubsets(array, n) {
        let subsets = [];
        let subsets_size = array.length / n;

        if (subsets_size < 1) return [array];

        for (let i = 0; i < n; i++) {
            subsets.push(array.slice(i * subsets_size, (i + 1) * subsets_size));
        }

        return subsets;
    }

    function createInternalPlayers(external_players, display_name = (x) => x.name) {
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

            console.log("--- Printing bracket ---");
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

    class LooserBracket {
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
                    desc = !desc;
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

            console.log("--- Printing Looser bracket ---");
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

    class FinalBracket {
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

            console.log("--- Printing Final bracket ---");
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

    class Tournament {
        constructor() {
            this.players = null;
            this.bracket = null;
            this.looser_bracket = null;
            this.final_bracket = null;
            this.has_looser_bracket = null;
            this.assignations = [];
        }

        _createNextBracketIfNeeded() {
            if (this.has_looser_bracket && this.looser_bracket == null) {
                this.looser_bracket = new LooserBracket(this.bracket.n_players - 1, this.bracket.n_stages);
                for (let assign of this.assignations) {
                    assign.list.splice(0, assign.number);
                    this.looser_bracket.assignUniqueToColumnStages(assign.name, assign.list, assign.number);
                }
            }

            if (this.has_looser_bracket) {
                let looser_players = this.bracket.getLooserPlayers();
                this.looser_bracket._assignPlayers(looser_players);
            }

            if (this.looser_bracket != null && this.looser_bracket.finished && this.final_bracket == null) {
                let final_bracket_players = [this.bracket.getWinner(), this.looser_bracket.getWinner()];
                this.final_bracket = new FinalBracket(final_bracket_players, this.bracket.n_stages + this.looser_bracket.n_stages);
                for (let assign of this.assignations) {
                    assign.list.splice(0, this.looser_bracket.stages_columns_number.length * assign.number);
                    this.final_bracket.assignUniqueToColumnStages(assign.name, assign.list, assign.number);
                }
                console.log("Final bracket");
            }
        }


        /** @param{Player[]} external_players: ordered by seed */
        create(external_players, has_looser_bracket = false, display_name = (x) => x.name,) {
            this.has_looser_bracket = has_looser_bracket;

            this.players = createInternalPlayers(external_players, display_name);

            this.bracket = new SingleBracket(this.players);
            for (let assign of this.assignations) {
                this.bracket.assignUniqueToColumnStages(assign.name, assign.list, assign.number);
            }

            this._createNextBracketIfNeeded();
        }

        assignUniqueToColumnStages(name, list, number) {
            if (this.bracket != null) {
                throw Error("This should be called before create");
            }

            this.assignations.push({ name, list, number });
        }

        hasNextStage() {
            if (!this.bracket.finished) return true;
            if (this.looser_bracket != null && !this.looser_bracket.finished) return true;
            if (this.final_bracket != null && !this.final_bracket.finished) return true;
            return false;
        }

        getNextStage() {
            if (!this.bracket.finished) {
                return this.bracket.getNextStage();
            }

            if (this.looser_bracket != null && !this.looser_bracket.finished) {
                return this.looser_bracket.getNextStage();
            }

            if (this.final_bracket && !this.final_bracket.finishe) {
                return this.final_bracket.getNextStage();
            }

            return null;
        }

        addResultPoints(stage_id, points_player_1, points_player_2) {
            let stage_num = stage_id;
            if (stage_id < this.bracket.n_stages) {
                this.bracket.addResultPoints(stage_num, points_player_1, points_player_2);
                this._createNextBracketIfNeeded();
                return;
            }

            stage_num -= this.bracket.n_stages;

            if (stage_num < this.looser_bracket.n_stages) {
                this.looser_bracket.addResultPoints(stage_num, points_player_1, points_player_2);
                this._createNextBracketIfNeeded();
                return;
            }

            stage_num -= this.looser_bracket.n_stages;

            this.final_bracket.addResultPoints(stage_num, points_player_1, points_player_2);
            this._createNextBracketIfNeeded();
        }

        /** @param {number} stage_id @param {Result} result */
        addResultVictory(stage_id, result) {
            let stage_num = stage_id;
            if (stage_num < this.bracket.n_stages) {
                this.bracket.addResultVictory(stage_num, result);
                this._createNextBracketIfNeeded();
                return;
            }

            stage_num -= this.bracket.n_stages;

            if (stage_num < this.looser_bracket.n_stages) {
                this.looser_bracket.addResultVictory(stage_num, result);
                this._createNextBracketIfNeeded();
                return;
            }

            stage_num -= this.looser_bracket.n_stages;

            this.final_bracket.addResultPoints(stage_num, points_player_1, points_player_2);

            this._createNextBracketIfNeeded();
        }

        getStage(stage_id) {
            let stage_num = stage_id;
            if (stage_id < this.bracket.n_stages) {
                return this.bracket.stages[stage_id];
            }

            stage_num -= this.bracket.n_stages;

            if (stage_num < this.looser_bracket.n_stages) {
                return this.looser_bracket.stages[stage_id];
            }

            return this.final_bracket.stages[stage_id];
        }
    }

    exports.Result = Result;
    exports.Stage = Stage;
    exports.Tournament = Tournament;

    return exports;

})({});
