import { State } from "./state"
import { Transition } from "./transition"


/**
 * @author Julien Aimonier-Davat
 */
export class Automaton<T extends Transition> {
    
    private _states: Array<State>
    private _transitions: Array<T>

    constructor() {
        this._states = new Array<State>()
        this._transitions = new Array<T>()
    }

    get states(): Array<State> {
        return this._states
    }

    get transitions(): Array<T> {
        return this._transitions
    }

    public addState(state: State): void {
        this.states.push(state)
    }

    public findState(name: number): State | undefined {
        return this.states.find((state: State) => {
            return state.name === name
        })
    }

    public findInitialStates(): State[] {
        return this.states.filter((state: State) => {
            return state.isInitial
        })
    }

    public findTransitionsFrom(from: State): T[] {
        return this.transitions.filter((transition: T) => {
            return transition.from.equals(from)
        })
    }

    public findTransition(from: State, to: State): T | undefined {
        return this.transitions.find((transition: T) => {
            return transition.from.equals(from) && transition.to.equals(to)
        })
    }

    public addTransition(transition: T): void {
        this.transitions.push(transition)
    }

    public print(marginLeft: number = 0): void {
        console.log(`${" ".repeat(marginLeft)}>>> STATES :`)
        for (let state of this._states) {
            state.print(marginLeft)
        }
        console.log(`${" ".repeat(marginLeft)}>>> TRANSITIONS :`)
        for (let transition of this._transitions) {
            transition.print(marginLeft)
        }
    }

    public equals(other: Automaton<T>): boolean {
        let sameStates: boolean = other.states.every((otherState: State) => {
            return this.states.some((state: State) => {
                return otherState.equals(state)
            })
        })

        let sameTransitions: boolean = other.transitions.every((otherTransition: T) => {
            return this.transitions.some((transition: T) => {
                return otherTransition.equals(transition)
            })
        })
        
        return sameStates && sameTransitions
    }
}