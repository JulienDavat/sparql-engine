"use strict";
/* file : path-stage-builder.ts
MIT License

Copyright (c) 2018-2020 Thomas Minier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var stage_builder_1 = require("./stage-builder");
var pipeline_1 = require("../pipeline/pipeline");
var bindings_1 = require("../../rdf/bindings");
var utils_1 = require("../../utils");
/**
 * A fork of Bindings#bound specialized for triple patterns with property paths
 * @private
 * @param  triple   - A triple pattern with a property path
 * @param  bindings - Set of bindings used to bound the triple
 * @return The bounded triple pattern
 */
function boundPathTriple(triple, bindings) {
    var t = {
        subject: triple.subject,
        predicate: triple.predicate,
        object: triple.object
    };
    if (triple.subject.startsWith('?') && bindings.has(triple.subject)) {
        t.subject = bindings.get(triple.subject);
    }
    if (triple.object.startsWith('?') && bindings.has(triple.object)) {
        t.object = bindings.get(triple.subject);
    }
    return t;
}
/**
 * The base class to implements to evaluate Property Paths.
 * A subclass of this class only has to implement the `_executePropertyPath` method to provide an execution logic for property paths.
 * @abstract
 * @author Thomas Minier
 */
var PathStageBuilder = /** @class */ (function (_super) {
    __extends(PathStageBuilder, _super);
    function PathStageBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Return the RDF Graph to be used for BGP evaluation.
     * * If `iris` is empty, returns the default graph
     * * If `iris` has a single entry, returns the corresponding named graph
     * * Otherwise, returns an UnionGraph based on the provided iris
     * @param  iris - List of Graph's iris
     * @return An RDF Graph
     */
    PathStageBuilder.prototype._getGraph = function (iris) {
        if (iris.length === 0) {
            return this._dataset.getDefaultGraph();
        }
        else if (iris.length === 1) {
            return this._dataset.getNamedGraph(iris[0]);
        }
        return this._dataset.getUnionGraph(iris);
    };
    /**
     * Get a {@link PipelineStage} for evaluating a succession of property paths, connected by joins.
     * @param source - Input {@link PipelineStage}
     * @param  triples - Triple patterns
     * @param  context - Execution context
     * @return A {@link PipelineStage} which yield set of bindings from the pipeline of joins
     */
    PathStageBuilder.prototype.execute = function (source, triples, context) {
        var _this = this;
        // create a join pipeline between all property paths using an index join
        var engine = pipeline_1.Pipeline.getInstance();
        return triples.reduce(function (iter, triple) {
            return engine.mergeMap(iter, function (bindings) {
                var _a = boundPathTriple(triple, bindings), subject = _a.subject, predicate = _a.predicate, object = _a.object;
                return engine.map(_this._buildIterator(subject, predicate, object, context), function (b) { return bindings.union(b); });
            });
        }, source);
    };
    /**
     * Get a {@link PipelineStage} for evaluating the property path.
     * @param  subject - Path subject
     * @param  path  - Property path
     * @param  obj   - Path object
     * @param  context - Execution context
     * @return A {@link PipelineStage} which yield set of bindings
     */
    PathStageBuilder.prototype._buildIterator = function (subject, path, obj, context) {
        var graph = (context.defaultGraphs.length > 0) ? this._getGraph(context.defaultGraphs) : this._dataset.getDefaultGraph();
        var evaluator = this._executePropertyPath(subject, path, obj, graph, context);
        return pipeline_1.Pipeline.getInstance().map(evaluator, function (triple) {
            var temp = new bindings_1.BindingBase();
            if (utils_1.rdf.isVariable(subject)) {
                temp.set(subject, triple.subject);
            }
            if (utils_1.rdf.isVariable(obj)) {
                temp.set(obj, triple.object);
            }
            // TODO: change the function's behavior for ask queries when subject and object are given
            if (!utils_1.rdf.isVariable(subject) && !utils_1.rdf.isVariable(obj)) {
                temp.set('?ask_s', triple.subject);
                temp.set('?ask_v', triple.object);
            }
            return temp;
        });
    };
    return PathStageBuilder;
}(stage_builder_1.default));
exports.default = PathStageBuilder;
