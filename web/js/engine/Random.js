/**
 * Seedable random number generator
 */
window.Random = {
    _seed: 1,

    /**
     * Seed generator
     *
     * @param seed New seed
     */
    seed: function(seed) {
        "use strict";
        window.Random._seed = seed
    },

    /**
     * Generate new random number
     *
     * @returns {number} Random number in range <0 - 1)
     */
    random: function() {
        "use strict";
        var res = Math.sin(window.Random._seed++) * 10000;
        return res - Math.floor(res);
    }
};