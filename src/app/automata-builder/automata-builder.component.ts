import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-automata-builder',
    templateUrl: './automata-builder.component.html',
    styleUrls: ['./automata-builder.component.css']
})
export class AutomataBuilderComponent implements OnInit {

    automataForm: FormGroup;
    @Output() automata: EventEmitter<Automata> = new EventEmitter<Automata>();

    constructor() { }

    ngOnInit(): void {
        this.automataForm = new FormGroup({
            'edges': new FormArray(defaultAutomata.edges.map(e => {
                return new FormGroup({
                    'from': new FormControl(e.from),
                    'to': new FormControl(e.to),
                    'label': new FormControl(e.symbol)
                });
            })),
            'states': new FormArray(defaultAutomata.states.map(s => {
                return new FormGroup({
                    'state': new FormControl(s)
                });
            })),
            'finalStates': new FormArray(defaultAutomata.final.map(s => {
                return new FormGroup({
                    'state': new FormControl(s)
                });
            })),
            'symbols': new FormArray(defaultAutomata.symbols.map(s => {
                return new FormGroup({
                    'symbol': new FormControl(s)
                });
            })),
            'initialState': new FormControl(defaultAutomata.init)
        });
    }

    get stateControls() {
        return (this.automataForm.get('states') as FormArray).controls;
    }

    get finalStateControls() {
        return (this.automataForm.get('finalStates') as FormArray).controls;
    }

    get edgeControls() {
        return (this.automataForm.get('edges') as FormArray).controls;
    }

    get symbolControls() {
        return (this.automataForm.get('symbols') as FormArray).controls;
    }

    addSymbol() {
        (this.automataForm.get('symbols') as FormArray).push(new FormGroup({
            'symbol': new FormControl(null, [Validators.required])
        }));
    }

    addState() {
        (this.automataForm.get('states') as FormArray).push(new FormGroup({
            'state': new FormControl(null, [Validators.required])
        }));
    }

    addFinalState() {
        (this.automataForm.get('finalStates') as FormArray).push(new FormGroup({
            'state': new FormControl(null, [Validators.required])
        }));
    }

    addEdge() {
        (this.automataForm.get('edges') as FormArray).push(new FormGroup({
            'from': new FormControl(null, [Validators.required]),
            'to': new FormControl(null, [Validators.required]),
            'label': new FormControl(null, [Validators.required])
        }));
    }

    removeState(index: number) {
        (this.automataForm.get('states') as FormArray).removeAt(index);
    }

    removeSymbol(index: number) {
        (this.automataForm.get('symbols') as FormArray).removeAt(index);
    }

    removeFinalState(index: number) {
        (this.automataForm.get('finalStates') as FormArray).removeAt(index);
    }

    removeEdge(index: number) {
        (this.automataForm.get('edges') as FormArray).removeAt(index);
    }

    onSave() {
        this.automata.emit(this.automataForm.value as Automata);
    }
}

const defaultAutomata = {
    init: '1',
    final: ['7'],
    states: ['1','2','3','4','5','6','7'],
    symbols: ['x', 'y'],
    edges: [
        {from: '1', to: '2', symbol: 'x'},
        {from: '1', to: '3', symbol: 'y'},
        {from: '2', to: '4', symbol: 'x'},
        {from: '2', to: '5', symbol: 'y'},
        {from: '3', to: '5', symbol: 'x'},
        {from: '3', to: '6', symbol: 'y'},
        {from: '4', to: '7', symbol: 'x'},
        {from: '4', to: '5', symbol: 'y'},
        {from: '5', to: '5', symbol: 'y'},
        {from: '5', to: '7', symbol: 'x'},
        {from: '6', to: '5', symbol: 'y'},
        {from: '6', to: '7', symbol: 'x'},
        {from: '7', to: '7', symbol: 'x'},
        {from: '7', to: '7', symbol: 'y'}
    ]
};

export class Automata {
    public edges: Edge[] = [];
    public states: State[] = [];
    public initialState: string;
    public finalStates: State[] = [];
    public symbols: Symbol[] = [];
}

export class Edge {
    public from: string;
    public to: string;
    public label: string;
}

export class Symbol {
    public symbol: string;
}

export class State {
    public state: string;
}