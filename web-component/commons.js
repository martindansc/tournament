import { css } from 'lit';

export function css_common() {
    return css`
        .t-row {
            display: flex;
            flex-direction: row;
        }

        .t-column {
            display: flex;
            flex-direction: column;
        }

        .t-hide {
            visibility: hidden;
        }
        
        .gap-5 {
            gap: 5%;
        }
    `;
}