/**
 * State of an activity
 */
var ActivityState = (function() {
    "use strict";

    var ActivityState = function() { };

    /**
     * How many hours does this activity take
     * @type {number}
     */
    ActivityState.prototype.hours = 0;

    /**
     * How much resources were earned by this activity
     * @type {number}
     */
    ActivityState.prototype.resourcesEarned = 0;

    /**
     * How much money is earned by this activity (excluding tax, not inflated)
     * @type {number}
     */
    ActivityState.prototype.moneyEarned = 0;

    /**
     * Total satisfaction gained by this activity
     * @type {number}
     */
    ActivityState.prototype.satisfaction = 0;

    return ActivityState;
})();


/**
 * Builds activities
 */
var ActivityBuilder = (function() {
    "use strict";

    var ActivityBuilder = {
        /**
         * Get function from configuration
         *
         * @param id Function id
         *
         * @return function Created function
         */
        _getFunction: function(id) {
            return new Function("x", "return "+FunctionConfig[id].fn);
        },

        /**
         * Set scale and offset to activity
         *
         * @param activity Activity to work on
         * @param moneyFnId ID of money function (or null)
         * @param resourcesFnId ID of resources function (or null)
         * @param satFnId ID of satisfaction function
         * @param isDependent This is dependent person
         * @private
         */
        _setScaleOffset: function(activity, moneyFnId, resourcesFnId, satFnId, isDependent) {
            if (moneyFnId != null) {
                var fn = FunctionConfig[moneyFnId];
                activity.moneyScale = 1 + Random.random()*fn.scaleVariation*2 - fn.scaleVariation;
                if (isDependent && (fn.dependentScaleRatio !== undefined)) {
                    activity.moneyScale *= fn.dependentScaleRatio;
                }
            }

            if (resourcesFnId != null) {
                var fn = FunctionConfig[resourcesFnId];
                activity.resourcesScale = 1 + Random.random()*fn.scaleVariation*2 - fn.scaleVariation;
                if (isDependent && (fn.dependentScaleRatio !== undefined)) {
                    activity.resourcesScale *= fn.dependentScaleRatio;
                }
            }

            var fn = FunctionConfig[satFnId];
            activity.satScale = 1 + Random.random()*fn.scaleVariation*2 - fn.scaleVariation;
            activity.satOffset = Random.random()*fn.offsetVariation*2 - fn.offsetVariation;
        },

        /**
         * Build activity and its states
         *
         * @param hoursArray Array of integers - how many weekly hours to compute for
         * @param resourcesDensityFn Function defining resource density or NULL
         * @param moneyDensityFn Function defining  money density or NULL
         * @param satisfactionDensityFn Function defining satisfaction density
         *
         * @return {Activity} Created activity
         */
        _buildActivity: function(hoursArray, moneyDensityFn, resourcesDensityFn, satisfactionDensityFn) {
            var res = new Activity();
            res.states = [];

            for(var i=0; i<hoursArray.length; i++) {
                var hours = hoursArray[i];

                var resources = 0;
                var satisfaction = 0;
                var money = 0;
                for (var n = 1; n <= hours; n++) {
                    if (moneyDensityFn != null) {
                        money += moneyDensityFn(n);
                    }
                    if (resourcesDensityFn != null) {
                        resources += resourcesDensityFn(n);
                    }
                    satisfaction += satisfactionDensityFn(n);
                }

                var state = new ActivityState();
                state.hours = hours;
                state.moneyEarned = money;
                state.resourcesEarned = resources;
                state.satisfaction = satisfaction;
                res.states.push(state);
            }

            return res;
        },

        /**
         * @param isDependent This is dependent person
         *
         * @returns {Activity} Activity for legal job
         */
        buildLegalJobActivity: function(isDependent) {
            var moneyFn = this._getFunction("LEGAL_JOB_MONEY");
            var satFn = this._getFunction("LEGAL_JOB_SATISFACTION");
            var hoursArray = [ 0, 4*5, 6*5, 8*5 ];

            var res = this._buildActivity(hoursArray, moneyFn, null, satFn);
            this._setScaleOffset(res, "LEGAL_JOB_MONEY", null, "LEGAL_JOB_SATISFACTION", isDependent);

            return res;
        },

        /**
         * @param isDependent This is dependent person
         *
         * @returns {Activity} Activity for legal job
         */
        buildIllegalJobActivity: function(isDependent) {
            var moneyFn = this._getFunction("ILLEGAL_JOB_MONEY");
            var satFn = this._getFunction("ILLEGAL_JOB_SATISFACTION");
            var hoursArray = [ 0, 4*5, 6*5, 8*5 ];

            var res = this._buildActivity(hoursArray, moneyFn, null, satFn);
            this._setScaleOffset(res, "ILLEGAL_JOB_MONEY", null, "ILLEGAL_JOB_SATISFACTION", isDependent);

            return res;
        },

        /**
         * @param isDependent This is dependent person
         *
         * @returns {Activity} Activity for communal work
         */
        buildCommunalWorkActivity: function(isDependent) {
            var res = new Activity();
            res.states = [];

            var hoursArray = [ 0, 3, 6, 9, 12, 15, 20, 30, 40];
            var resourcesDensity = this._getFunction("COMMUNAL_WORK_RESOURCES");
            var satisfactionDensity = this._getFunction("COMMUNAL_WORK_SATISFACTION");

            var res = this._buildActivity(hoursArray, null, resourcesDensity, satisfactionDensity);
            this._setScaleOffset(res, null, "COMMUNAL_WORK_RESOURCES", "COMMUNAL_WORK_SATISFACTION", isDependent);

            return res;
        },

        /**
         * @param isDependent This is dependent person
         *
         * @returns {Activity} Activity for working on their own household
         */
        buildHomeWorkActivity: function(isDependent) {
            var res = new Activity();
            res.states = [];

            var hoursArray = [ 3, 6, 9, 12, 15];
            var resourcesDensity = this._getFunction("HOME_WORK_RESOURCES");
            var satisfactionDensity = this._getFunction("HOME_WORK_SATISFACTION");

            var res = this._buildActivity(hoursArray, null, resourcesDensity, satisfactionDensity);
            this._setScaleOffset(res, null, "HOME_WORK_RESOURCES", "HOME_WORK_SATISFACTION", isDependent);

            return res;
        },

        /**
         * @param isDependent This is dependent person
         *
         * @returns {Activity} Activity for free time
         */
        buildFreeTimeActivity: function(isDependent) {
            var res = new Activity();
            res.states = [];

            var hoursArray = [];
            for(var i=0; i<=7*16; i++) {
                hoursArray.push(i);
            }
            var satisfactionDensity = this._getFunction("FREE_TIME_SATISFACTION");
            var res = this._buildActivity(hoursArray, null, null, satisfactionDensity);
            this._setScaleOffset(res, null, null, "FREE_TIME_SATISFACTION", isDependent);

            return res;
        }
    }

    return ActivityBuilder;
})();

