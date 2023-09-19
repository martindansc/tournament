import { LitElement, html, css } from 'lit';
import { Tournament } from "@elk/tournament";
import { TournamentStage } from './tournament-stage';
import { Excalidraw } from "@excalidraw/excalidraw";

export class TournamentViewer extends LitElement {
  static get styles() {
    return css`
      .t-row {
        display: flex;
        flex-direction: row;
      }

      .t-column {
        display: flex;
        flex-direction: column;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * 
       * @type {Tournament}
       */
      tournament: { type: Tournament },
    };
  }

  constructor() {
    super();

    let n_players = 14;
    let players = [];

    for (let i = 0; i < n_players; i++) {
      players.push("Player_" + i.toString());
    }

    const t = new Tournament();
    t.create(players);

    this.t = t;

  }

  _print_stages(bracket, stages_num) {
    let html_s = [];
    for (let num of stages_num) {
      let stage = bracket.stages[num];
      html_s.push(html`<tournament-stage .stage="${stage}"></tournament-stage>`);
    }

    return html_s;
  }

  _print_columns(bracket) {
    let html_s = [];
    for (let column = 0; column < bracket.per_column_stage.length; column++) {
      let per_column_stage = bracket.per_column_stage[column];
      html_s.push(html`<div class="t-column">${this._print_stages(bracket, per_column_stage)}</div>`);
    }
    return html_s;
  }

  render() {
    let bracket = this.t.bracket;
    let html_s = html`<div class="t-row">${this._print_columns(bracket)}</div>`;

    return html`<Excalidraw />`;
  }

  _onClick() {
    this.count++;
    this.dispatchEvent(new CustomEvent('count-changed'));
  }
}

window.customElements.define('tournament-viewer', TournamentViewer);
