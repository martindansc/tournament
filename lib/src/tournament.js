import { blpo2 } from "#root/helper"
import { Player } from "#root/model";
import { SingleBracket } from "#root/single_bracket"
export class Tournament {
    constructor() {
        this.players = null;
        this.bracket = null;
    }

    _createPlayers(external_players, n_players) {
        let players = [];

        for (let player_seed in external_players) {
            let external_player = external_players[player_seed];
            players.push(new Player(player_seed, external_player));
        }

        while (players.length < n_players) {
            players.push(Player.bye(players.length));
        }

        return players;
    }

    /** @param{Player[]} external_players: ordered by seed */
    create(external_players) {
        let n_real_participants = external_players.length;
        let n_players = blpo2(n_real_participants);

        this.players = this._createPlayers(external_players, n_players);
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

