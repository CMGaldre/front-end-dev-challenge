import {LitElement, html, css} from 'lit';
import { ChallengeDataService } from './ChallengeDataService.js';
import './challenge-chart/dist/challenge-chart.js';
import { ChallengeTable } from './challenge-table';


export class ChartApp extends LitElement {
    static get styles() {
        return css`
          :host {  
            margin:auto;
            display:flex;
            flex-wrap:wrap;
          }

          @media screen and (min-width: 480px) and (max-width: 767px) {

          :host {
            width: 480px;
          }
        }
          @media screen and (min-width: 768px) and (max-width: 1079px) {
          :host {
            width: 768px;
          }
        }
          @media screen and (min-width: 1080px) {
          :host {
            width: 1080px;
          }
        }

        .select {
            width: 100%;
            justify-content: right;
            display: flex;
        }

        label { 
            padding: 0.25em 0.5em;
            font-size: 1.25rem;
        }

        select { 
            min-width: 15ch;
            max-width: 30ch;
            border: 1px solid #ccc;
            border-radius: 0.25em;
            padding: 0.25em 0.5em;
            font-size: 1.25rem;
            cursor: pointer;
            line-height: 1.1;
            background-color: #efefef;
            
          }

          challenge-chart {
            width:100%;
          }
          challenge-table
          {
            width:100%;
          }
        `;
      }

    static get properties() {
        return {
          // Chart App Properties
          tableName: { type: String },
          data: { type: Array }
        };
      }

    constructor(){
        super();
        this.tableName = '';
        this.data = [];
        this.table = new ChallengeTable();
        this.chart = document.createElement("challenge-chart");
        this.dataService = new ChallengeDataService();
        this.dataSuccess = this.dataSuccess.bind(this);
        this.dataFailure = this.dataFailure.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.dataStreaming = this.dataStreaming.bind(this);

        this.dataService.getDataSet("small").then(this.dataSuccess,this.dataFailure)
      }

    dataSuccess(result)
    {
        const pairedData = [];
        const xData=result.xColumn;
        const yData=result.yColumn;

        this.tableName = result.name;

        if(yData.values.length==xData.values.length)
        {
            xData.values.forEach(function(currentValue,index){
            const pair = {x : currentValue, y: yData.values[index]}
            pairedData.push(pair);

            })

           this.data = pairedData;
          
        }
        else
        {//throw error
        }
    }

    dataFailure(result)
    {
        console.log("Data Read Error");
        console.log(result);
    }

    handleChange(event) 
    {    

        const target = event.target;

        if (target.value == "streaming")
        {
            this.data = [];
            this.tableName = target.value;
           // this.dataService.startStreaming(30,this.dataStreaming)
        }

        else {
        this.dataService.stopStreaming()
        this.dataService.getDataSet(target.value).then(this.dataSuccess,this.dataFailure)
        }
    }

    dataStreaming(pointX,pointY)
    {
        const dataSet = this.data;
        const newPair = {x: pointX, y: pointY}

        console.log (dataSet);

        dataSet.push(newPair)
       
        this.data = dataSet;
        this.chart.data = this.data;
        this.table.data = this.data;
    }


    render() {   
       
        this.chart.data = this.data;
        this.table.data = this.data;
        this.table.tableName = this.tableName;
        return html`
        <div class="select">
        <label for="data-source">Select a Data Source:</label>
        <select id="data-source" @change=${this.handleChange}>            
        <option key="small" value="small">small</option>
        <option key="medium" value="medium">medium</option>
        <option key="large" value="large">large</option>
        <option key="streaming" value="streaming">streaming</option>
        </select>
        </div>
    
         ${this.chart}
         ${this.table}    
        
         
        `;
      }

}
window.customElements.define("chart-app", ChartApp);