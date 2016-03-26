/**
 * Global constants for the game
 */
"use strict";

window.ConstantsConfig = {
    /**
     * Expenses of state per one citizen
     */
    STATE_EXPENSES_PER_CAPITA: 2600,

    /**
     * How much expected resources move towards really gained resources
     *
     * (0 - not at all, 1 - citizen expects same resources as he earned in previous period)
     */
    RESOURCES_NEED_SHIFT: 0.5,

    /**
     * Number of citizens
     */
    POPULATION_SIZE: 1000
};