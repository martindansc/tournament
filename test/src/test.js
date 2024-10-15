import { Tournament, Stage, Result } from "@elk/tournament";

/**
 * 
 * @param {Stage} stage 
 * @returns 
 */
async function playStage(stage) {
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

    const t = new Tournament();

    let maps = [...Array(26).keys()].map(i => String.fromCharCode(i + 97));
    t.assignUniqueToColumnStages("maps", maps, 3);

    t.create(players);

    console.log(t.players);
    console.log(t.bracket);

    t.bracket.consolePrint();
    t.bracket.validate();

    while (t.hasNextStage()) {
        let next_stage = t.getNextStage();
        let [p1, p2] = await playStage(next_stage);
        t.addResultPoints(next_stage.num, p1, p2);
        if (t.bracket.stages[next_stage.num].player_1_score !== p1) {
            console.error("Should be assigned");
        };
        if (t.bracket.stages[next_stage.num].player_2_score !== p2) {
            console.error("Should be assigned");
        };

    }

    t.bracket.consolePrint();
}

run();