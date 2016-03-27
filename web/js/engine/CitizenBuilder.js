/**
 * Build (creates) a citizen
 */
var CitizenBuilder = (function() {
    "use strict";

    var CitizenBuilder = {
        /**
         * @returns {CitizenState} Created citizen
         */
        buildCitizen: function() {
            var res = new CitizenState();

            res.resourcesNeeded = ConstantsConfig.RESOURCES_NEEDED;

            res.legalJob = ActivityBuilder.buildLegalJobActivity();
            res.legalJob.index = 2;

            res.illegalJob = ActivityBuilder.buildIllegalJobActivity();
            res.illegalJob.index = 0;

            res.homeWork = ActivityBuilder.buildHomeWorkActivity();
            res.homeWork.index = 2;

            res.communalWork = ActivityBuilder.buildCommunalWorkActivity();
            res.communalWork.index = 0;

            res.freeTime = ActivityBuilder.buildFreeTimeActivity();
            res.freeTime.index = 7*16

            return res;
        }
    }

    return CitizenBuilder;
})();


