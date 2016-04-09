/**
 * Global constants for the game
 */
"use strict";

window.ConstantsConfig = {
    /**
     * Expenses of state per one citizen
     */
    STATE_EXPENSES_PER_CAPITA: 1500,

    /**
     * How much expected resources move towards really gained resources
     *
     * (0 - not at all, 1 - citizen expects same resources as he earned in previous period)
     */
    RESOURCES_NEED_SHIFT: 0.5,

    /**
     * Number of citizens
     */
    POPULATION_SIZE: 1000,

    /**
     * Initial resources needed by one citizen
     */
    RESOURCES_NEEDED: 24000/4,

    /**
     * Percentage of dependent persons
     */
    DEPENDENT_PERSON_PERCENTAGE: 20,

    /**
     * Minimum resources needed by one citizen
     */
    MINIMUM_RESOURCES_NEEDED: 7000/4,

    /**
     * How long is the game
     */
    GAME_STEPS: 20
};
