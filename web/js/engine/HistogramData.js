/**
 * Holds histogram data
 */
var HistogramData = (function() {
    "use strict";

    var HistogramData = function(max) {
        // Initialize array
        this.data = [];
        for(var i=0; i<=max; i++) {
            this.data[i] = 0;
        }
    };

    /**
     * Array of histogram data
     */
    HistogramData.prototype.data = null;

    /**
     * Add value to histogram
     *
     * @param n Value to add
     */
    HistogramData.prototype.add = function(n) {
        if ((n < 0) || (n >= this.data.length)) {
            throw "Value "+n+" is out of histogram range";
        }

        this.data[n]++;
    }

    /**
     * Compute average
     */
    HistogramData.prototype.avg = function() {
        var sum = 0;
        var cnt = 0;

        for(var i=0; i<this.data.length; i++) {
            sum += i*this.data[i];
            cnt += this.data[i];
        }

        return sum/cnt;
    }

    return HistogramData;
})();