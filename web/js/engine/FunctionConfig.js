/**
 * Definition of density functions
 */
var FunctionConfig = {
    "LEGAL_JOB_MONEY": {
        id: "LEGAL_JOB_MONEY",
        name: "Legal job money",
        description: "Money earned from legal job for each hour (before taxes)",
        args: "X is working hours per week",
        fn: "175",
        min: 0,
        max: 40,
        scaleVariation: 0.2,
        offsetVariation: 0,
        dependentScaleRatio: 0
    },

    "LEGAL_JOB_SATISFACTION": {
        id: "LEGAL_JOB_SATISFACTION",
        name: "Legal job satisfaction",
        description: "Satisfaction earned from legal job each hour",
        args: "X is working hours per week",
        fn: "0.4-x/40",
        min: 0,
        max: 40,
        scaleVariation: 0.2,
        offsetVariation: 0.2,
        dependentScaleRatio: 1
    },

    "ILLEGAL_JOB_MONEY": {
        id: "ILLEGAL_JOB_MONEY",
        name: "Ilegal job money",
        description: "Money earned from illegal job each hour",
        args: "X is working hours per week",
        fn: "190",
        min: 0,
        max: 40,
        scaleVariation: 0.2,
        offsetVariation: 0,
        dependentScaleRatio: 0
    },

    "ILLEGAL_JOB_SATISFACTION": {
        id: "ILLEGAL_JOB_SATISFACTION",
        name: "Illegal job satisfaction",
        description: "Satisfaction earned from illegal job each hour",
        args: "X is working hours per week",
        fn: "-1.4-x/40",
        min: 0,
        max: 10,
        scaleVariation: 0.2,
        offsetVariation: 0.2,
        dependentScaleRatio: 1
    },

    "COMMUNAL_WORK_RESOURCES": {
        id: "COMMUNAL_WORK_RESOURCES",
        name: "Communal work resources",
        description: "Resources earned by communal work each hour",
        args: "X is working hours per week",
        fn: "80*(1+Math.min(0, (15-x)/60))",
        min: 0,
        max: 40,
        scaleVariation: 0.5,
        offsetVariation: 0,
        dependentScaleRatio: 0.2
    },

    "COMMUNAL_WORK_SATISFACTION": {
        id: "COMMUNAL_WORK_SATISFACTION",
        name: "Communal work satisfaction",
        description: "Satisfaction earned by communal work",
        args: "X is working hours per week",
        fn: "1*(0.7-Math.max(0, Math.min(1, (x-5)/12)))",
        min: 0,
        max: 40,
        scaleVariation: 0.5,
        offsetVariation: 0.3,
        dependentScaleRatio: 1
    },

    "HOME_WORK_RESOURCES": {
        id: "HOME_WORK_RESOURCES",
        name: "Home work resources",
        description: "Resources earned by working on your own household",
        args: "X is working hours per week",
        fn: "100*(1+Math.min(0, (7-x)/10))",
        min: 3,
        max: 15,
        scaleVariation: 0.5,
        offsetVariation: 0,
        dependentScaleRatio: 0.3
    },

    "HOME_WORK_SATISFACTION": {
        id: "HOME_WORK_SATISFACTION",
        name: "Home work satisfaction",
        description: "Satisfaction earned by working on your own household",
        args: "X is working hours per week",
        fn: "0.5*(1-Math.max(0, Math.min(2, (x-5)/5)))",
        min: 3,
        max: 15,
        scaleVariation: 0.5,
        offsetVariation: 0.3,
        dependentScaleRatio: 1
    },

    "FREE_TIME_SATISFACTION": {
        id: "FREE_TIME_SATISFACTION",
        name: "Free time satisfaction",
        description: "Satisfaction earned from free time",
        args: "X is free hours per week",
        fn: "2*(1-(Math.pow(x/120, 1.6)))",
        min: 0,
        max: 7*16,
        scaleVariation: 0.5,
        offsetVariation: 0.3,
        dependentScaleRatio: 1
    },

    "RESOURCES_DIFF_SATISFACTION": {
        id: "RESOURCES_DIFF_SATISFACTION",
        name: "Resources difference satisfaction",
        description: "Satisfaction earned by surplus or missing resources",
        args: "X is how many resources are surplus (negative numbers means resources are missing)",
        fn: "200*(Math.log(x+10000)-Math.log(1000))",
        min: -5000,
        max: 5000
    },

    "RESOURCES_ABS_SATISFACTION": {
        id: "RESOURCES_ABS_SATISFACTION",
        name: "Resources absolute satisfaction",
        description: "Used to generate negative satisfaction when resources are too low absolutely",
        args: "X is percentage of MINIMUM_RESOURCES_NEEDED (100 = MINIMUM_RESOURCES_NEEDED)",
        fn: "Math.min(0, (x-125)*Math.abs(x-125))",
        min: 50,
        max: 200
    }
};

