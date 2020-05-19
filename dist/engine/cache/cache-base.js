/* file: cache-base.ts
MIT License

Copyright (c) 2018-2020 Thomas Minier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
'use strict';
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
exports.AsyncLRUCache = exports.BaseAsyncCache = exports.BaseLRUCache = void 0;
var LRU = require("lru-cache");
/**
 * An in-memory LRU cache
 * @author Thomas Minier
 */
var BaseLRUCache = /** @class */ (function () {
    /**
     * Constructor
     * @param maxSize - The maximum size of the cache
     * @param maxAge - Maximum age in ms
     * @param length - Function that is used to calculate the length of stored items
     * @param onDispose - Function that is called on items when they are dropped from the cache
     */
    function BaseLRUCache(maxSize, maxAge, length, onDispose) {
        var options = {
            max: maxSize,
            maxAge: maxAge,
            length: length,
            dispose: onDispose
        };
        // if we set a dispose function, we need to turn 'noDisposeOnSet' to True,
        // otherwise onDispose will be called each time an item is updated (instead of when it slide out),
        // which will break any class extending BaseAsyncCache
        if (onDispose !== undefined) {
            options['noDisposeOnSet'] = true;
        }
        this._content = new LRU(options);
    }
    BaseLRUCache.prototype.put = function (key, item) {
        this._content.set(key, item);
    };
    BaseLRUCache.prototype.has = function (key) {
        return this._content.has(key);
    };
    BaseLRUCache.prototype.get = function (key) {
        if (this._content.has(key)) {
            return this._content.get(key);
        }
        return null;
    };
    BaseLRUCache.prototype.delete = function (key) {
        this._content.del(key);
    };
    BaseLRUCache.prototype.count = function () {
        return this._content.itemCount;
    };
    return BaseLRUCache;
}());
exports.BaseLRUCache = BaseLRUCache;
/**
 * A base class for implementing an asynchronous cache.
 * It simply needs to provides a data structure used to cache items
 * @author Thomas Minier
 */
var BaseAsyncCache = /** @class */ (function () {
    /**
     * Constructor
     */
    function BaseAsyncCache(cacheInstance) {
        this._cache = cacheInstance;
    }
    BaseAsyncCache.prototype.has = function (key) {
        return this._cache.has(key);
    };
    BaseAsyncCache.prototype.update = function (key, item, writerID) {
        if (this._cache.has(key)) {
            var entry = this._cache.get(key);
            if (entry.writerID === writerID) {
                entry.content.push(item);
                this._cache.put(key, entry);
            }
        }
        else {
            this._cache.put(key, {
                content: [item],
                writerID: writerID,
                isComplete: false,
                pendingReaders: []
            });
        }
    };
    BaseAsyncCache.prototype.commit = function (key, writerID) {
        if (this._cache.has(key)) {
            var entry_1 = this._cache.get(key);
            if (entry_1.writerID === writerID) {
                // update cache entry ot marke it complete
                this._cache.put(key, {
                    content: entry_1.content,
                    writerID: entry_1.writerID,
                    isComplete: true,
                    pendingReaders: []
                });
                // resolve all pending readers
                entry_1.pendingReaders.forEach(function (resolve) { return resolve(entry_1.content); });
            }
        }
    };
    BaseAsyncCache.prototype.get = function (key) {
        if (this.has(key)) {
            var entry_2 = this._cache.get(key);
            if (entry_2.isComplete) {
                return Promise.resolve(entry_2.content);
            }
            // wait until the entry is complete
            // all awaiting promises will be resolved by the commit or delete method
            return new Promise(function (resolve) {
                entry_2.pendingReaders.push(resolve);
            });
        }
        return null;
    };
    BaseAsyncCache.prototype.delete = function (key, writerID) {
        if (this._cache.has(key)) {
            var entry = this._cache.get(key);
            if (entry.writerID === writerID) {
                this._cache.delete(key);
                // resolve all pending readers with an empty result
                entry.pendingReaders.forEach(function (resolve) { return resolve([]); });
            }
        }
    };
    BaseAsyncCache.prototype.count = function () {
        return this._cache.count();
    };
    return BaseAsyncCache;
}());
exports.BaseAsyncCache = BaseAsyncCache;
/**
 * An in-memory LRU implementation of an asynchronous cache.
 * @author Thomas Minier
 */
var AsyncLRUCache = /** @class */ (function (_super) {
    __extends(AsyncLRUCache, _super);
    /**
     * Constructor
     * @param maxSize - The maximum size of the cache
     * @param maxAge - Maximum age in ms
     * @param length - Function that is used to calculate the length of stored items
     * @param onDispose - Function that is called on items when they are dropped from the cache
     */
    function AsyncLRUCache(maxSize, maxAge, length, onDispose) {
        return _super.call(this, new BaseLRUCache(maxSize, maxAge, length, onDispose)) || this;
    }
    return AsyncLRUCache;
}(BaseAsyncCache));
exports.AsyncLRUCache = AsyncLRUCache;
