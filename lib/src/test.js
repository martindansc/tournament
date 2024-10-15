import { Tournament } from "#root/tournament";
import { Stage } from "#root/model";

import { getSubsets, createInternalPlayers } from "#root/helper"
import { LooserBracket } from "#root/loosers_bracket"

async function playStage(stage) {
    if ((stage.player_1 && stage.player_1.is_bye) || (stage.player_2 && stage.player_2.is_bye)) {
        console.error("Error, no player should play vs a bye");
    }

    if (Math.random() < 0.5) {
        return [0, 1];
    }
    return [1, 0];
}

async function run() {
    let n_players = 36;
    let players = [];

    for (let i = 0; i < n_players; i++) {
        players.push({ name: "Player_" + i.toString(), id: i });
    }

    let maps = [...Array(70).keys()].map(i => "Map_" + String(i));

    const t = new Tournament();
    t.assignUniqueToColumnStages("maps", maps, 5);
    t.create(players, true);

    while (t.hasNextStage()) {
        let next_stage = t.getNextStage();
        let [p1, p2] = await playStage(next_stage);
        t.addResultPoints(next_stage.id, p1, p2);
    }

    t.bracket.consolePrint();
    t.looser_bracket.consolePrint();
    t.final_bracket.consolePrint();
}

async function test_looser_bracket() {
    let players = [];

    let n_players = 28;

    for (let i = 0; i < n_players; i++) {
        players.push({ name: "Looser_" + i.toString(), id: i });
    }

    let int_players = createInternalPlayers(players);
    let bracket = new LooserBracket(int_players);

    while (!bracket.finished) {
        let next_stage = bracket.getNextStage();
        let [p1, p2] = await playStage(next_stage);
        bracket.addResultPoints(next_stage.num, p1, p2);
        if (bracket.stages[next_stage.num].player_1_score !== p1) {
            console.error("Should be assigned");
        };
        if (bracket.stages[next_stage.num].player_2_score !== p2) {
            console.error("Should be assigned");
        };
    }

    bracket.consolePrint();
}

function test_subsets() {
    let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    console.log(getSubsets(a, 4));
    console.log(getSubsets([1], 2));
}

run();