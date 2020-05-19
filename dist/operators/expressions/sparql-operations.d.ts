import { Term } from 'rdf-js';
declare const _default: {
    coalesce: (baseValue: Term | null, defaultValue: Term | null) => Term;
    if: (booleanValue: Term | null, valueIfTrue: Term | null, valueIfFalse: Term | null) => Term;
    '+': (a: Term, b: Term) => Term;
    '-': (a: Term, b: Term) => Term;
    '*': (a: Term, b: Term) => Term;
    '/': (a: Term, b: Term) => Term;
    '=': (a: Term, b: Term) => Term;
    '!=': (a: Term, b: Term) => Term;
    '<': (a: Term, b: Term) => Term;
    '<=': (a: Term, b: Term) => Term;
    '>': (a: Term, b: Term) => Term;
    '>=': (a: Term, b: Term) => Term;
    '!': (a: Term) => Term;
    '&&': (a: Term, b: Term) => Term;
    '||': (a: Term, b: Term) => Term;
    bound: (a: Term) => import("rdf-js").Literal;
    sameterm: (a: Term, b: Term) => Term;
    in: (a: Term, b: Term[]) => Term;
    notin: (a: Term, b: Term[]) => Term;
    isiri: (a: Term) => Term;
    isblank: (a: Term) => Term;
    isliteral: (a: Term) => Term;
    isnumeric: (a: Term) => Term;
    str: (a: Term) => Term;
    lang: (a: Term) => Term;
    datatype: (a: Term) => Term;
    iri: (a: Term) => Term;
    bnode: (a?: import("rdf-js").NamedNode | import("rdf-js").BlankNode | import("rdf-js").Literal | import("rdf-js").Variable | import("rdf-js").DefaultGraph | undefined) => Term;
    strdt: (x: Term, datatype: Term) => Term;
    strlang: (x: Term, lang: Term) => Term;
    uuid: () => Term;
    struuid: () => Term;
    strlen: (a: Term) => Term;
    substr: (str: Term, index: Term, length?: import("rdf-js").NamedNode | import("rdf-js").BlankNode | import("rdf-js").Literal | import("rdf-js").Variable | import("rdf-js").DefaultGraph | undefined) => Term;
    ucase: (a: Term) => Term;
    lcase: (a: Term) => Term;
    strstarts: (term: Term, substring: Term) => Term;
    strends: (term: Term, substring: Term) => Term;
    contains: (term: Term, substring: Term) => Term;
    strbefore: (term: Term, token: Term) => Term;
    strafter: (str: Term, token: Term) => Term;
    encode_for_uri: (a: Term) => Term;
    concat: (a: Term, b: Term) => Term;
    langmatches: (langTag: Term, langRange: Term) => Term;
    regex: (subject: Term, pattern: Term, flags?: import("rdf-js").NamedNode | import("rdf-js").BlankNode | import("rdf-js").Literal | import("rdf-js").Variable | import("rdf-js").DefaultGraph | undefined) => import("rdf-js").Literal;
    replace: (arg: Term, pattern: Term, replacement: Term, flags?: import("rdf-js").NamedNode | import("rdf-js").BlankNode | import("rdf-js").Literal | import("rdf-js").Variable | import("rdf-js").DefaultGraph | undefined) => Term;
    abs: (a: Term) => Term;
    round: (a: Term) => Term;
    ceil: (a: Term) => Term;
    floor: (a: Term) => Term;
    now: () => Term;
    year: (a: Term) => Term;
    month: (a: Term) => Term;
    day: (a: Term) => Term;
    hours: (a: Term) => Term;
    minutes: (a: Term) => Term;
    seconds: (a: Term) => Term;
    tz: (a: Term) => Term;
    md5: (v: Term) => Term;
    sha1: (v: Term) => Term;
    sha256: (v: Term) => Term;
    sha384: (v: Term) => Term;
    sha512: (v: Term) => Term;
};
/**
 * Implementation of SPARQL operations found in FILTERS
 * All arguments are pre-compiled from string to an intermediate representation.
 * All possible intermediate representation are gathered in the `src/rdf-terms.js` file,
 * and are used to represents RDF Terms.
 * Each SPARQL operation is also expected to return the same kind of intermediate representation.
 * @author Thomas Minier
 * @author Corentin Marionneau
 */
export default _default;
