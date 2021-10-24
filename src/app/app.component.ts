import { Component } from '@angular/core';
import { Automata } from './automata-builder/automata-builder.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'automata1';

    xAutomat: Automata;
    minAutomat: Automata;

    onAutomata(automata: Automata) {
        this.xAutomat = automata;
        this.minAutomat = this.minimize();
    }

    private minimize(): Automata {
        const minAutomat = new Automata();
        const power = {};
        this.xAutomat.symbols.forEach(symbol => {
            power[symbol.symbol] = {};
            this.xAutomat.states.forEach(state => {
                const existsPath = this.xAutomat.edges.findIndex(e => e.from === state.state && e.label === symbol.symbol) > -1;
                power[symbol.symbol][state.state] = existsPath ? 1 : 0;
            });
        });
        const divideSet = [
            this.xAutomat.states.filter(s => this.xAutomat.finalStates.map(fs => fs.state).indexOf(s.state) === -1).map(s => s.state),
            this.xAutomat.finalStates.map(s => s.state)
        ];
        const drobSet: DrobItem[] = [];
        this.xAutomat.symbols.forEach(symbol => {
            divideSet.forEach(divide => {
                drobSet.push({
                    states: divide,
                    symbol: symbol.symbol
                });
            });
        });
        while (drobSet.length > 0) {
            const drobItem = drobSet.shift();
            const changeItems = [];
            divideSet.forEach((divide, i) => {
                const divideInclude = this.xAutomat.edges.filter(
                                                e => divide.indexOf(e.from) > -1 && 
                                                e.label === drobItem.symbol && 
                                                drobItem.states.indexOf(e.to) > -1)
                    .map(e => e.from);
                const divideExclude = this.xAutomat.edges.filter(
                                                e => divide.indexOf(e.from) > -1 && 
                                                e.label === drobItem.symbol && 
                                                drobItem.states.indexOf(e.to) === -1)
                    .map(e => e.from);
                if (divideInclude.length > 0 && divideExclude.length > 0) {
                    changeItems.push({
                        index: i,
                        newItem: [divideInclude, divideExclude]
                    });
                    this.xAutomat.symbols.forEach(symbol => {
                        const stringifiedDivide = JSON.stringify(divide);
                        const drobIndex = drobSet.findIndex(d => d.symbol === symbol.symbol && JSON.stringify(d.states) === stringifiedDivide);
                        if (drobIndex > -1) {
                            drobSet[drobIndex] = {
                                symbol: symbol.symbol,
                                states: divideInclude
                            };
                            drobSet.push({
                                symbol: symbol.symbol,
                                states: divideExclude
                            });
                        } else {
                            drobSet.push({
                                symbol: symbol.symbol,
                                states: this.getSmallerDivide(divideInclude, divideExclude, power[symbol.symbol])
                            });
                        }
                    });
                }
            });
            if (changeItems.length) {
                changeItems.forEach(item => {
                    divideSet.splice(item.index, 1);
                });
                changeItems.forEach(item => {
                    divideSet.push(...item.newItem);
                });
            }
        }
        divideSet.forEach((divide, i) => {
            minAutomat.states.push({
                state: `k${i}`
            });
            divideSet.forEach((sibling, index) => {
                const labels = this.xAutomat.edges.filter(e => divide.indexOf(e.from) > -1 && sibling.indexOf(e.to) > -1)
                    .map(e => e.label);
                const usedLabels = [];
                labels.forEach(label => {
                    if (usedLabels.indexOf(label) === -1) {
                        minAutomat.edges.push({
                            from: `k${i}`,
                            to: `k${index}`,
                            label: label
                        });
                        usedLabels.push(label);
                    }
                });
            });
            if (divide.indexOf(this.xAutomat.initialState) > -1) {
                minAutomat.initialState = `k${i}`;
            }
            if (divide.filter(d => this.xAutomat.finalStates.map(s => s.state).indexOf(d) > -1).length > 0) {
                minAutomat.finalStates.push({
                    state: `k${i}`
                });
            }
        });
        this.rename(minAutomat);
        return minAutomat;
    }

    private rename(minAutomat: Automata) {
        const initialStateName = minAutomat.initialState;
        minAutomat.initialState = 'a0';
        this.renameNode(minAutomat, {index: 0}, initialStateName);
    }

    private renameNode(minAutomat: Automata, index: any, lastName: string) {
        minAutomat.states[minAutomat.states.findIndex(s => s.state === lastName)] = {
            state: `a${index.index}`
        };
        const finalIndex = minAutomat.finalStates.findIndex(s => s.state === lastName);
        if (finalIndex > -1) {
            minAutomat.finalStates[finalIndex] = {
                state: `a${index.index}`
            };
        }
        const currentIndex = index.index;
        minAutomat.edges.forEach(e => {
            if (e.from === lastName) {
                e.from = `a${currentIndex}`;
                if (e.to === lastName) {
                    e.to = `a${currentIndex}`;
                }
                if (!e.to.startsWith('a')) {
                    index.index = index.index + 1;
                    this.renameNode(minAutomat, index, e.to);
                }
            }
            if (e.to === lastName) {
                e.to = `a${currentIndex}`;
            }
        });
    }

    private getSmallerDivide(divideInclude: string[], divideExclude: string[], power: any): string[] {
        const includePower = divideInclude.filter(d => power[d] === 1).length;
        const excludePower = divideExclude.filter(d => power[d] === 1).length;
        return includePower > excludePower ? divideExclude : divideInclude;
    }
}

export class DrobItem {
    public states: string[] = [];
    public symbol: string;
}