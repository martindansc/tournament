import { blpo2 } from "#root/helper"
import { Player } from "#root/model";
import { SingleBracket } from "#root/single_bracket"
import { createInternalPlayers } from "#root/helper";
import { LooserBracket } from "#root/loosers_bracket";
import { FinalBracket } from "#root/final_bracket";
export class Tournament {
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
            return this.bracket[stage_id];
        }

        stage_num -= this.bracket.n_stages;

        if (stage_num < this.looser_bracket.n_stages) {
            return this.looser_bracket[stage_id];
        }

        return this.final_bracket[stage_id];
    }
}

