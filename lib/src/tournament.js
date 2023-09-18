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

    /*
        player_names: ordered list by seeding of the players
    */
    create(player_names) {
        let n_real_participants = player_names.length;
        let n_players = blpo2(n_real_participants);

        this.players = this._createPlayers(player_names, n_players);
        this.bracket = new SingleBracket(this.players);
    }

    load(data) {

    }
}

