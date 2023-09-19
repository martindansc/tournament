import { blpo2 } from "#root/helper"
import { Player } from "#root/model";
import { SingleBracket } from "#root/single_bracket"
export class Tournament {
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
            players.push(new Player(players.length));
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

