/**
 * Build (creates) a citizen
 */
var CitizenBuilder = (function() {
    "use strict";

    var CitizenBuilder = {
        /**
         * @param isDependent Build dependent citizen
         *
         * @returns {CitizenState} Created citizen
         */
        buildCitizen: function(isDependent) {
            var res = new CitizenState();

            res.resourcesNeeded = isDependent?ConstantsConfig.RESOURCES_NEEDED_DEPENDENT:ConstantsConfig.RESOURCES_NEEDED;

            res.legalJob = ActivityBuilder.buildLegalJobActivity(isDependent);
            res.legalJob.index = 2;

            res.illegalJob = ActivityBuilder.buildIllegalJobActivity(isDependent);
            res.illegalJob.index = 0;

            res.homeWork = ActivityBuilder.buildHomeWorkActivity(isDependent);
            res.homeWork.index = 2;

            res.communalWork = ActivityBuilder.buildCommunalWorkActivity(isDependent);
            res.communalWork.index = 0;

            res.freeTime = ActivityBuilder.buildFreeTimeActivity(isDependent);
            res.freeTime.index = 7*16

            res.isDependent = isDependent;

            return res;
        }
    }

    return CitizenBuilder;
})();


