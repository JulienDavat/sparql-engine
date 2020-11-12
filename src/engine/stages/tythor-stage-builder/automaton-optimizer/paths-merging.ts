import { Automaton } from '../automaton-model/automaton'
import { SequenceTransition } from '../automaton-model/sequence-transition'
import { AlternativeTransition } from '../automaton-model/alternative-transition'
import { cloneDeep } from 'lodash'
import { isClosureTransition } from '../utils'
import { ClosureTransition } from '../automaton-model/closure-transition'

/**
 * @author Julien Aimonier-Davat
 */
export class PathsMergingOptimizer {

    public optimize(automaton: Automaton<SequenceTransition>): Automaton<AlternativeTransition> {
        let optimizedAutomaton = new Automaton<AlternativeTransition>()

        for (let state of automaton.states) {
            optimizedAutomaton.addState(cloneDeep(state))
        }

        for (let stateA of optimizedAutomaton.states) {
            for (let stateB of optimizedAutomaton.states) {
                let alternative = new AlternativeTransition(stateA, stateB)
                for (let transition of automaton.findTransitionsFrom(stateA)) {
                    if (transition.to.equals(stateB)) {
                        if (isClosureTransition(transition)) {
                            optimizedAutomaton.addTransition(new ClosureTransition<AlternativeTransition>(
                                stateA,
                                stateB,
                                this.optimize(cloneDeep(transition.automaton))
                            ))
                        } else {
                            alternative.instructions.push(cloneDeep(transition.instructions))
                        }
                    }
                }
                if (alternative.instructions.length > 0) {
                    optimizedAutomaton.addTransition(alternative)
                }
            }
        }

        return optimizedAutomaton
    }

}