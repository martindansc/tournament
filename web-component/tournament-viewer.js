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
      `
    ];
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
    this.t = null;
  }

  _print_stages(bracket, stages_num) {
    let html_s = [];
    for (let num of stages_num) {
      let stage = bracket.stages[num];
      html_s.push(html`<tournament-stage id="${stage.num}" .stage="${stage}"></tournament-stage>`);
    }

    return html_s;
  }

  _print_columns(bracket) {
    let html_s = [];
    for (let column = 0; column < bracket.per_column_stage.length; column++) {
      let per_column_stage = bracket.per_column_stage[column];
      html_s.push(html`<div class="t-column per-stage-column">${this._print_stages(bracket, per_column_stage)}</div>`);
    }

    // html_s.push(html`
    // <div id="div1" style="width: 100px; height: 100px; top:0; left:0; background:#777; position:absolute;"></div>
    // <div id="div2" style="width: 100px; height: 100px; top:300px; left:300px; background:#333; position:absolute;"></div>

    // <svg style="position:absolute" width="100%" height="100%"><line x1="50" y1="50" x2="350" y2="350" stroke="black"/><line x1="150" y1="50" x2="350" y2="350" stroke="black"/></svg>`);

    return html_s;
  }

  setTournament(tournament) {
    this.t = tournament;
    this.requestUpdate();
  }

  __render_line(stage) {

  }

  render() {
    if (!this.t) return html``;

    let bracket = this.t.bracket;
    let html_s = html`<div class="t-row gap-5">${this._print_columns(bracket)}</div>`;

    return html_s;
  }

  _onClick() {
    this.count++;
    this.dispatchEvent(new CustomEvent('count-changed'));
  }
}

window.customElements.define('tournament-viewer', TournamentViewer);
