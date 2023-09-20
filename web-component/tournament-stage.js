import { LitElement, html, css } from 'lit';
import { Stage, Result } from "@elk/tournament";
import { css_common } from './commons';

export class TournamentStage extends LitElement {
    static get styles() {
        return [css_common(), css`
            .stage-players {
                border: 1px solid black;
                border-radius: 10px;
            }

            .p-name {
                padding: 0.3rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: clip;
                width: 10rem;
                height: 1rem;
                display: flex;
                align-items: center;
            }

            .p-color-band {
                min-width: 0.6rem;
                min-height: 100%;
            }

            .p-color-band-top {
                border-radius: 10px 0 0 0;
            }

            .p-color-band-bottom {
                border-radius: 0 0 0 10px;
            }

            .p-green {
                background-color: #638c80;
            }

            .pt-green {
                color: #04400b;
            }

            .p-blue {
                background-color: #43a9dd;
            }

            .pt-blue {
                color: #9d9be1;
            }

            .p-grey {
                background-color: #b2c4cb;
            }

            .pt-grey {
                color: #b2c4cb;
            }

            .p-red {
                background-color: #f09ca2;
            }

            .pt-red {
                color: #a70000;
            }
            
            .arrow {
                position: absolute;
                width: 100px;
                height: 2rem;
                border: 0;
                background-color: black;
                clip-path: polygon(80% 45%, 80% 30%, 100% 55%, 80% 82%, 80% 65%, 0 65%, 0 45%);
                border-radius: 0.01px;
                padding: 1px;
                margin: -1px;
            }

            .p-score {
                padding-right: 5px;
                padding-left: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-left: 1px solid;
                border-color: black;
                font-weight: bold;
            }

            .back-line {
                position: absolute;
                width: 2.5rem;
                height: 1px;
                border: 1px sold black;
            }
        `];
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
        let has_bye = this._getIsBye(this.stage.player_1) || this._getIsBye(this.stage.player_2);

        let player_1_color = 'grey';
        let player_2_color = 'grey';

        if (this.stage.hasPlayers()) {
            player_1_color = 'blue';
            player_2_color = 'blue';
        }

        if (this.stage.result == Result.WinPlayer1) {
            player_1_color = 'green';
            player_2_color = 'red';
        }

        if (this.stage.result == Result.WinPlayer2) {
            player_1_color = 'grey';
            player_2_color = 'red';
        }

        return html`
            <div class="t-row ${has_bye ? '' : ''}">
                <div class="stage-players t-column">
                    <div class="t-row p-row">
                        <div class="p-color-band p-color-band-top p-${player_1_color}"></div>
                        <div class="p-name">${this._getName(this.stage.player_1)}</div>
                        <div class="p-score pt-${player_1_color}">${this.stage.player_1_score}</div>
                    </div>
                    <div class="t-row p-row">
                        <div class="p-color-band p-color-band-bottom p-${player_2_color}"></div>
                        <div class="p-name">${this._getName(this.stage.player_2)}</div>
                        <div class="p-score pt-${player_2_color}">${this.stage.player_2_score}</div>
                    </div>
                </div>
                <div class="arrow-parent">
                    <div class="back-line" style="">
                </div>
                </duv>
            </div>
        `;
    }

    _onClick() {
    }

    _getName(value) {
        if (value !== null) {
            return value.name;
        }

        return '';
    }
    _getIsBye(value) {
        if (value !== null) {
            return value.is_bye;
        }

        return false;
    }
}

window.customElements.define('tournament-stage', TournamentStage);
