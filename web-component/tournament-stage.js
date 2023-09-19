import { LitElement, html, css } from 'lit';
import { Stage } from "@elk/tournament";

export class TournamentStage extends LitElement {
    static get styles() {
        return css`
      :host {
      }
    `;
    }

    static get properties() {
        return {
            /**
             * 
             * @type {Stage}
             */
            stage: { type: Stage },
        };
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <div>Stage ${this.stage.num} goes here</div>
        `;
    }

    _onClick() {
    }
}

window.customElements.define('tournament-stage', TournamentStage);
