/*!
 * helpers.js - Utility methods and properties
 *
 * Copyright (c) 2013-2014 Matthew A. Miller
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

var q = require("q"),
    crypto = require("crypto");

// helper functions
exports.makeArray = function(candidate) {
    var output;

    if (!candidate) {
        otuput = [];
    } else if   (candidate instanceof Array) {
        output = candidate;
    } else if   (typeof(candidate) === "object" &&
               "length" in candidate) {
        output = Array.prototype.slice.call(candidate);
    } else {
        output = [candidate];
    }

    return output;
}

exports.clone = function(orig) {
    if (orig == null) {
        return orig;
    }
    if (typeof(orig) !== "object") {
        return orig;
    }
    if (orig instanceof Array) {
        return orig.slice();
    }
    if (orig instanceof Date) {
        return new Date(orig.getTime());
    }

    var cpy;
    if (orig instanceof RegExp) {
        var flags = [];
        if (orig.global) { flags.push("g"); }
        if (orig.ignoreCase) { flags.push("i"); }
        if (orig.multiline) { flags.push("m"); }

        cpy = new RegExp(orig.source, flags.join(""));
        cpy.lastIndex = orig.lastIndex;

        return cpy;
    }

    cpy = {};
    Object.keys(orig).forEach(function(p) {
        cpy[p] = orig[p];
    });

    return cpy;
}
exports.extend = function(orig, spec) {
    orig = orig || {};
    spec = spec || {};
    
    var value;
    Object.keys(spec).forEach(function(p) {
        value = spec[p];
        if (typeof(value) === "undefined") {
            delete orig[p];
        } else {
            orig[p] = exports.clone(value);
        }
    });
    
    return orig;
}

exports.promisedValue = function(config, prop) {
    var val = config[prop];
    if (typeof(val) === "function") {
        try {
            var args = exports.makeArray(arguments).slice(2);
            args.unshift(config);
            val = val.apply(config, args);
        } catch (ex) {
            return q.reject(ex);
        }
    }
    return q.resolve(val || "");
}

var XOR = exports.XOR = function(s1, s2) {
    if (typeof(s1) === "string") {
        s1 = new Buffer(s1, "binary");
    } else if (!Buffer.isBuffer(s1)) {
        throw new Error("s1 must be a buffer");
    }
    if (typeof(s2) === "string") {
        s2 = new Buffer(s2, "binary");
    } else if (!Buffer.isBuffer(s2)) {
        throw new Error("s2 must be a buffer");
    }

    var len = Math.max(s1.length, s2.length);
    var output = new Buffer(len);
    var c1, c2;
    for (var idx = 0; idx < len; idx++) {
        c1 = s1[idx] || 0;
        c2 = s2[idx] || 0;
        output[idx] = c1 ^ c2;
    }

    return output;
}


exports.DEFAULT_PRF = "sha1";
exports.DEFAULT_SALT = new Buffer("XJLr3lZl5uJxIW6U8NrYNBnepmwqds4x1X5SpYOULYQjJUw13WrWHJGW8RO8peCU6YjplCIjEpvTnbixxQF6Pw==", "base64").toString("binary");
exports.DEFAULT_ITERATIONS = 4096;
