import { Tournament } from "#root/tournament"

export function run() {
    let n_players = 16;
    let players = [];

    for (let i = 0; i < n_players; i++) {
        players.push("Player_" + i.toString());
    }

    const t = new Tournament();
    t.create(players);

    console.log(t.players);
    console.log(t.bracket);

    t.bracket.consolePrint();
    t.bracket.validate();
}

export { Tournament } from "#root/tournament"

run();