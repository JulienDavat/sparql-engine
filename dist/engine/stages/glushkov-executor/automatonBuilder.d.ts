import { Automaton } from "./automaton";
/**
 * Interface of something that builds an automaton
 * @author Arthur Trottier
 * @author Charlotte Cogan
 * @author Julien Aimonier-Davat
 */
interface AutomatonBuilder<T, P> {
    build(): Automaton<T, P>;
}
/**
 * Perform the union of two sets
 * @author Arthur Trottier
 * @author Charlotte Cogan
 * @author Julien Aimonier-Davat
 * @param setA - first set
 * @param setB - second set
 * @return The union of the two sets
 */
export declare function union(setA: Set<number>, setB: Set<number>): Set<number>;
/**
 * A GlushkovBuilder is responsible for build the automaton used to evaluate a SPARQL property path.
 * @author Arthur Trottier
 * @author Charlotte Cogan
 * @author Julien Aimonier-Davat
 */
export declare class GlushkovBuilder implements AutomatonBuilder<number, string> {
    private syntaxTree;
    private nullable;
    private first;
    private last;
    private follow;
    private predicates;
    private reverse;
    private negation;
    /**
     * Constructor
     * @param path - Path object
     */
    constructor(path: any);
    /**
     * Numbers the nodes in a postorder manner
     * @param node - syntactic tree's current node
     * @param num  - first identifier to be assigned
     * @return root node identifier
     */
    postfixNumbering(node: any, num?: number): number;
    symbolProcessing(node: any): void;
    sequenceProcessing(node: any): void;
    unionProcessing(node: any): void;
    oneOrMoreProcessing(node: any): void;
    zeroOrOneProcessing(node: any): void;
    zeroOrMoreProcessing(node: any): void;
    searchChild(node: any): Set<number>;
    negationProcessing(node: any): void;
    inverseProcessing(node: any): void;
    nodeProcessing(node: any): void;
    treeProcessing(node: any): void;
    /**
     * Build a Glushkov automaton to evaluate the SPARQL property path
     * @return The Glushkov automaton used to evaluate the SPARQL property path
     */
    build(): Automaton<number, string>;
}
export {};
