import Graph from './graph';
import UnionGraph from './union-graph';
/**
 * An abstraction over an RDF datasets, i.e., a collection of RDF graphs.
 * @abstract
 * @author Thomas Minier
 */
export default abstract class Dataset {
    private _graphFactory;
    /**
     * Constructor
     */
    constructor();
    abstract get iris(): string[];
    /**
     * Set the Default Graph of the Dataset
     * @param g - Default Graph
     */
    abstract setDefaultGraph(g: Graph): void;
    /**
     * Get the Default Graph of the Dataset
     * @return The Default Graph of the Dataset
     */
    abstract getDefaultGraph(): Graph;
    /**
     * Add a Named Graph to the Dataset
     * @param iri - IRI of the Named Graph
     * @param g   - RDF Graph
     */
    abstract addNamedGraph(iri: string, g: Graph): void;
    /**
     * Get a Named Graph using its IRI
     * @param  iri - IRI of the Named Graph to retrieve
     * @return The corresponding Named Graph
     */
    abstract getNamedGraph(iri: string): Graph;
    /**
     * Return True if the Dataset contains a Named graph with the provided IRI
     * @param  iri - IRI of the Named Graph
     * @return True if the Dataset contains a Named graph with the provided IRI
     */
    abstract hasNamedGraph(iri: string): boolean;
    /**
     * Get an UnionGraph, i.e., the dynamic union of several graphs,
     * from the RDF Graphs in the Dataset.
     * @param  iris           - Iris of the named graphs to include in the union
     * @param  includeDefault - True if the default graph should be included
     * @return The dynamic union of several graphs in the Dataset
     */
    getUnionGraph(iris: string[], includeDefault?: boolean): UnionGraph;
    /**
     * Returns all Graphs in the Dataset, including the Default one
     * @param  includeDefault - True if the default graph should be included
     * @return The list of all graphs in the Dataset
     */
    getAllGraphs(includeDefault?: boolean): Graph[];
    /**
     * Set the Graph Factory used by te dataset to create new RDF graphs on-demand
     * @param  factory - Graph Factory
     */
    setGraphFactory(factory: (iri: string) => Graph): void;
    /**
     * Create a new RDF Graph, using the current Graph Factory.
     * This Graph factory can be set using the "setGraphFactory" method.
     * @param  iri - IRI of the graph to create
     * @return A new RDF Graph
     */
    createGraph(iri: string): Graph;
}
