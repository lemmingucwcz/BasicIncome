/**
 * Holds histogram data
 */
var HistogramData = (function () {
    "use strict";

    /**
     * Create histogram data
     *
     * @param max Maximum value that will be put in histogram data
     * @param factor Factor to apply to values (= category size: when it is 5, values 0-4 will fall into one category, 5-9 into another one, ...). Default is one.
     * @constructor
     */
    var HistogramData = function (max, factor) {
        if (typeof factor == "number") {
            this._factor = factor;
        }

        // Initialize array
        this._data = [];
        for (var i = 0; i <= Math.ceil(max / this._factor); i++) {
            this._data[i] = 0;
        }
    };

    /**
     * Array of histogram data
     */
    HistogramData.prototype._data = null;

    /**
     * Factor of the data
     * @type {number}
     * @private
     */
    HistogramData.prototype._factor = 1;

    /**
     * Add value to histogram
     *
     * @param n Value to add
     */
    HistogramData.prototype.add = function (n) {

        var idx = Math.floor(n/this._factor);

        if ((idx < 0) || (idx >= this._data.length)) {
            throw "Value " + n + " is out of histogram range";
        }

        this._data[idx]++;
    };

    /**
     * Compute average
     */
    HistogramData.prototype.avg = function () {
        var sum = 0;
        var cnt = 0;

        for (var i = 0; i < this._data.length; i++) {
            sum += i * this._data[i];
            cnt += this._data[i];
        }

        return sum / cnt * this._factor;
    };

    /**
     * Get histogram data
     *
     * @returns {Array} Histogram data (array of counts)
     */
    HistogramData.prototype.getData = function() {
        return this._data;
    };

    /**
     * Get factor set to this class
     */
    HistogramData.prototype.getFactor = function() {
        return this._factor;
    };

    return HistogramData;
})();