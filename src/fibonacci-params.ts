
import {Param, LinearParam, MenuParam} from './params'
import {range, stringify} from './helpers'


export class FibonacciParams
{
    numRepeats: number;
    noteLength: number;
    minTimeBetweenRepeats: number;
    maxTimeBetweenRepeats: number;

    constructor() {
    }

    fetchParams(): void {
        this.numRepeats = GetParameter('Number of repeats') + 1 // because the menu in the GUI is zero-based
        this.noteLength = GetParameter('Note length')
        this.minTimeBetweenRepeats = GetParameter('Minimum time between repeats')
        this.maxTimeBetweenRepeats = GetParameter('Maximum time between repeats')

        // if the user has these backwards, just assume they meant the opposite and swap maxTime and minTime
        if (this.minTimeBetweenRepeats > this.maxTimeBetweenRepeats) {
            let temp = this.maxTimeBetweenRepeats
            this.maxTimeBetweenRepeats = this.minTimeBetweenRepeats
            this.minTimeBetweenRepeats = temp
        }
    }

    static initializePluginParameters(): Param[] {
        return [
            new MenuParam('Number of repeats', range(1, 100).map(stringify)),
            new LinearParam('Note length', 0, 0.25, 0.125, 127),
            new LinearParam('Minimum time between repeats', 0.1, 4, 1, 255),
            new LinearParam('Maximum time between repeats', 0.1, 4, 1, 255),
        ]
    }
}


