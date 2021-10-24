import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DataSet, Network } from 'vis';
import { Automata } from '../automata-builder/automata-builder.component';

@Component({
    selector: 'app-automata',
    templateUrl: './automata.component.html',
    styleUrls: ['./automata.component.css']
})
export class AutomataComponent implements AfterViewInit {
    @ViewChild('network') el: ElementRef;
    private networkInstance: any;
    private _automata: Automata;
    private _isViewed: boolean = false;

    @Input() set automata(value: Automata) {
        this._automata = value;
        if (this._isViewed) {
            this.drawAutomata();
        }
    }

    constructor() { }

    ngAfterViewInit(): void {
        this._isViewed = true;
        this.drawAutomata();
    }

    drawAutomata() {
        const container = this.el.nativeElement;
        const nodes = new DataSet<any>(this._automata.states.map(s => {
            return {
                id: s.state,
                label: s.state,
                color: {
                    border: this._automata.initialState === s.state ? "#0062cc" :
                        (this._automata.finalStates.map(ss => ss.state).indexOf(s.state) > -1 ?
                            "#343a40" : "#6c757d"),
                    background: this._automata.initialState === s.state ? "#fff" :
                        (this._automata.finalStates.map(ss => ss.state).indexOf(s.state) > -1 ?
                            "#343a40" : "#fff")
                },
                font: {
                    color: this._automata.initialState === s.state ? "#343a40" :
                        (this._automata.finalStates.map(ss => ss.state).indexOf(s.state) > -1 ?
                            "#fff" : "#343a40")
                }
            };
        }));
        const edgeArr = [];
        this._automata.edges.forEach(edge => {
            const index = edgeArr.findIndex(e => e.from === edge.from && e.to === edge.to);
            if (index > -1) {
                edgeArr[index].label = `${edgeArr[index].label} ${edge.label}`;
            } else {
                edgeArr.push({
                    from: edge.from,
                    to: edge.to,
                    label: edge.label,
                    smooth: {
                        type: 'curvedCCW',
                        roundness: 0.5
                    }
                });
            }
        });
        const edges = new DataSet<any>(edgeArr);
        const data = { nodes, edges };

        this.networkInstance = new Network(container, data, {
            width: '100%',
            edges: {
                arrows: {
                    to: { enabled: true, scaleFactor: 1, type: "arrow" }
                }
            },
            physics: {
                enabled: false,
                stabilization: false
            }
        });
    }
}
