/**
 * Evaluate satisfaction of citizen
 */
var Satisfaction = (function() {
    "use strict";

    var Satisfaction = {
        /**
         * Function to get satisfaction for resources difference
         */
        _resSatDiffFn: null,

        /**
         * Function to get satisfaction for absolute resources amount
         */
        _resSatAbsFn: null,

        _processActivity: function(activity, output, applyIncomeTax) {
            var as = activity.states[activity.index];

            if (as.moneyEarned > 0) {
                output.payment += activity.moneyScale * as.moneyEarned * (1 - (applyIncomeTax?UserVariables.incomeTax:0)) * GlobalState.priceMultiplier;
            }

            output.resources += activity.resourcesScale * as.resourcesEarned;
            output.satisfaction += activity.satScale * as.satisfaction + activity.satOffset;
        },

        /**
         * Pre-creates functions. To be called before simulation begins.
         */
        simulationStarted: function() {
            this._resSatDiffFn = new Function("x", "return "+FunctionConfig["RESOURCES_DIFF_SATISFACTION"].fn);
            this._resSatAbsFn = new Function("x", "return "+FunctionConfig["RESOURCES_ABS_SATISFACTION"].fn);
        },

        /**
         * Compute satisfaction of given citizen
         *
         * @param {Citizen} citizen
         */
        computeSatisfaction: function(citizen) {
            var output = {
                payment: UserVariables.baseIncome,
                resources: 0,
                satisfaction: 0
            };

            // Process activities
            Satisfaction._processActivity(citizen.legalJob, output, true);
            Satisfaction._processActivity(citizen.illegalJob, output, true);
            Satisfaction._processActivity(citizen.homeWork, output, false);
            Satisfaction._processActivity(citizen.communalWork, output, false);
            Satisfaction._processActivity(citizen.freeTime, output, false);

            // Compute resources bought by income
            output.resources += output.payment*(1-UserVariables.valueAddedTax) / GlobalState.priceMultiplier;

            // Compute resources satisfaction
            output.satisfaction += this._resSatAbsFn(output.resources) + this._resSatDiffFn(output.resources - citizen.resourcesNeeded);

            return output;
        }
    }

    return Satisfaction;
})();