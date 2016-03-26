/**
 * Activity of a citizen
 */
var Activity = (function() {
    "use strict";

    var Activity = function() { };

    /**
     * Current index
     * @type {number}
     */
    Activity.prototype.index = 0;

    /**
     * Possible states
     */
    Activity.prototype.states = [];

    /**
     * Generated money scale
     *
     * @type {number}
     */
    Activity.prototype.moneyScale = 1;

    /**
     * Generated resources scale
     *
     * @type {number}
     */
    Activity.prototype.resourcesScale = 1;

    /**
     * Generated satisfaction scale
     *
     * @type {number}
     */
    Activity.prototype.satScale = 1;

    /**
     * Generated satisfaction offset
     * @type {number}
     */
    Activity.prototype.satOffset = 0;

    return Activity;
})();

/**
 * Information about citizen
 */
var CitizenState = (function () {
    "use strict";

    var CitizenState = function() { };

    /**
     * Resources needed each day for well being
     */
    CitizenState.prototype.resourcesNeeded = 0,

    /**
     * Satisfaction result for current state (output of Satisfaction.computeSatisfaction())
     */
    CitizenState.prototype.satisfactionResult = null,

    /**
     * Activity - legal work
     */
    CitizenState.prototype.legalJob = null,

    /**
     * Activity - illegal work
     */
    CitizenState.prototype.illegalJob = null,

    /**
     * Activity - communal sharing
     */
    CitizenState.prototype.communalWork = null,

    /**
     * Activity - home working for self
     */
    CitizenState.prototype.homeWork = null,

    /**
     * Activity - free time
     */
    CitizenState.prototype.freeTime = null

    return CitizenState;
})();