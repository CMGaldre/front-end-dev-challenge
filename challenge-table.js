import {LitElement, html, css} from 'lit';

export class ChallengeTable extends LitElement {
  static get styles() {
    return css`
      :host {
        color: black;
      }
      table {
        border-collapse: collapse;
        width:100%;

      }
      table th
      {
        background: #333;
        color: #efefef;
        text-align:left;
        padding:5px;

      }
  
      tbody tr:nth-child(odd) {
        background-color: #efefef;
      }
    `;
  }
  
  static get properties() {
    return {
      // Feel free to refactor, change type, name, etc
      tableName: { type: String },
      data: { type: Array },
    };
  }

  constructor(){
    super();
    this.tableName = '';
    this.data = [];
  }

  render() {
    return html`
      <h1>${this.tableName}</h1>
      
      <table>
      <tr><th scope='col'>X</th><th scop='col'>Y</th></tr>
        ${this.data.map(
          (dataRow) => html`
            <tr>
              <td>${dataRow.x}</td>
              <td>${dataRow.y}</td>
              <td></td>
            </tr>
          `
        )}
      </table>
    `;
  }
}
window.customElements.define("challenge-table", ChallengeTable);