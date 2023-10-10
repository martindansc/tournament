import { LitElement, html, css } from 'lit';
import { Tournament } from "@elk/tournament";
import { css_common } from './commons';
import { TournamentStage } from './tournament-stage';

export class TournamentViewer extends LitElement {
  static get styles() {
    return [
      css_common(),
      css`
        .per-stage-column {
          gap: 1rem;
          justify-content: space-around;
        }

        .bracket-title {
          font-size: 3rem;
          margin: 1rem;
        }
      `
    ];
  }

  static get properties() {
    return {
      /**
       * 
       * @type {Tournament}
       */
      t: { type: Object },
      tname: { type: String },
      counter: { type: Number }
    };
  }

  constructor() {
    super();
    this.t = null;
  }

  _print_stages(bracket, stages_num) {
    let html_s = [];
    for (let num of stages_num) {
      let stage = bracket.stages[num];
      html_s.push(html`<tournament-stage id="${stage.id}" .stage="${{ ...stage }}"></tournament-stage>`);
    }

    return html_s;
  }

  _print_columns(bracket) {
    let html_s = [];
    for (let column = 0; column < bracket.per_column_stage.length; column++) {
      let per_column_stage = bracket.per_column_stage[column];
      html_s.push(html`<div class="t-column per-stage-column">${this._print_stages(bracket, per_column_stage)}</div>`);
    }

    return html_s;
  }

  setTournament(tournament) {
    console.log("Tournament data updated", tournament);
    this.t = tournament;
    this.requestUpdate();
  }

  render() {
    if (!this.t) return html`No data`;

    let html_s = []
    html_s.push(html`
    <div class="bracket-title">Winner bracket</div>
    <div class="t-row gap-5">
      ${this._print_columns(this.t.bracket)}
    </div>`);
    if (this.t.looser_bracket != null) {
      html_s.push(html`
      <div class="bracket-title">Looser bracket</div>
      <div class="t-row gap-5">${this._print_columns(this.t.looser_bracket)}
      </div>`);
    }
    if (this.t.final_bracket != null) {
      html_s.push(html`
      <div class="bracket-title">Final bracket</div>
      <div class="t-row gap-5">${this._print_columns(this.t.final_bracket)}
      </div>`);
    }

    return html_s;
  }

}

window.customElements.define('tournament-viewer', TournamentViewer);
