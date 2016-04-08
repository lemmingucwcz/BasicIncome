/**
 * Optimizes citizen state
 */
var Optimizer = (function() {
    "use strict";

    var Optimizer = {
        optimizeState: function(citizen) {
//            console.log('Started');

            var checked = 0;
            var maxSatisfaction = -1E10;
            var maxLJi = -1;
            var maxIJi = -1;
            var maxCWi = -1;
            var maxHWi = -1;
            var maxFTi = -1;
            var maxSatOut = null;

            for(var i1 = 0; i1<citizen.legalJob.states.length; i1++) {
                citizen.legalJob.index = i1;

                for(var i2 = 0; i2<citizen.illegalJob.states.length; i2++) {
                    citizen.illegalJob.index = i2;

                    for(var i3 = 0; i3<citizen.communalWork.states.length; i3++) {
                        citizen.communalWork.index = i3;

                        for(var i4 = 0; i4<citizen.homeWork.states.length; i4++) {
                            citizen.homeWork.index = i4;

                            var freeTime = 7*16;
                            freeTime -= citizen.legalJob.states[citizen.legalJob.index].hours;
                            freeTime -= citizen.illegalJob.states[citizen.illegalJob.index].hours;
                            freeTime -= citizen.communalWork.states[citizen.communalWork.index].hours;
                            freeTime -= citizen.homeWork.states[citizen.homeWork.index].hours;

                            if (freeTime >= 0) {
                                citizen.freeTime.index = freeTime;

                                var out = Satisfaction.computeSatisfaction(citizen);
                                checked++;

                                if (out.satisfaction > maxSatisfaction) {
//                                    console.log(satisfaction+": "+i1+", "+i2+", "+i3+", "+i4+", "+freeTime);
                                    maxLJi = i1;
                                    maxIJi = i2;
                                    maxCWi = i3;
                                    maxHWi = i4;
                                    maxFTi = freeTime;

                                    maxSatisfaction = out.satisfaction;
                                    maxSatOut = out;
                                }
                            }
                        }
                    }
                }
            }

//            console.log("Satisfaction: "+maxSatisfaction);

            // Set maximum indices
            citizen.legalJob.index = maxLJi;
            citizen.illegalJob.index = maxIJi;
            citizen.communalWork.index = maxCWi;
            citizen.homeWork.index = maxHWi;
            citizen.freeTime.index = maxFTi;
            citizen.satisfactionResult = maxSatOut;

            //debugger;
            Satisfaction.computeSatisfaction(citizen);
        },

        optimizePopulation: function(citizens) {
            Satisfaction.simulationStarted();

            var stats = {
                legalJob: new HistogramData(45),
                illegalJob: new HistogramData(45),
                communalWork: new HistogramData(40),
                homeWork: new HistogramData(15),
                freeTime: new HistogramData(7*16),
                resourcesFulfilled: new HistogramData(60),
                satisfactionSum: 0,
                belowMinimumResourcesPercent: 0
            }

            var belowMinimumResourcesCnt = 0;
            for(var i=0; i<citizens.length; i++) {
                var citizen = citizens[i];
                Optimizer.optimizeState(citizen);

                // Alter stats
                console.log("Satisfaction="+citizen.satisfactionResult.satisfaction);
                stats.satisfactionSum += citizen.satisfactionResult.satisfaction;
                stats.legalJob.add(citizen.legalJob.states[citizen.legalJob.index].hours);
                stats.illegalJob.add(citizen.illegalJob.states[citizen.illegalJob.index].hours);
                stats.communalWork.add(citizen.communalWork.states[citizen.communalWork.index].hours);
                stats.homeWork.add(citizen.homeWork.states[citizen.homeWork.index].hours);
                stats.freeTime.add(citizen.freeTime.states[citizen.freeTime.index].hours);

                var resourcesPercentage = Math.round((citizen.satisfactionResult.resources - citizen.resourcesNeeded)*20/citizen.resourcesNeeded) + 20;
                stats.resourcesFulfilled.add(resourcesPercentage);

                // Shift citizen resource need
                citizen.resourcesNeeded += (citizen.satisfactionResult.resources - citizen.resourcesNeeded)*ConstantsConfig.RESOURCES_NEED_SHIFT;

                // Check if resources are below minimum
                if (citizen.satisfactionResult.resources < ConstantsConfig.MINIMUM_RESOURCES_NEEDED) {
                    belowMinimumResourcesCnt++;
                }
            }

            stats.belowMinimumResourcesPercent = belowMinimumResourcesCnt*100 / citizens.length;

            return stats;
        }
    }

    return Optimizer;
})();



