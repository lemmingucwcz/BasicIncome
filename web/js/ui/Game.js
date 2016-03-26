/**
 * Main game component
 */
var Game = React.createClass({

    /**
     * Compute stats for citizens
     *
     * @param state State to work on
     *
     * @private
     */
    _computeStats: function(state) {
        var stats = {
            incomeTaxIncome: 0,
            vatIncome: 0,
            baseIncomeExpenses: 0
        };

        for(var i=0; i<state.citizens.length; i++) {
            var citizen = state.citizens[i];

            stats.baseIncomeExpenses += state.baseIncome;
            stats.incomeTaxIncome += citizen.legalJob.states[citizen.legalJob.index].moneyEarned*state.incomeTax/100.0;
            var money = citizen.legalJob.states[citizen.legalJob.index].moneyEarned*(1 - state.incomeTax/100.0) +
                        citizen.illegalJob.states[citizen.illegalJob.index].moneyEarned;
            stats.vatIncome += money*state.valueAddedTax/100.0;
        }

        stats.balance = stats.incomeTaxIncome + stats.vatIncome - stats.baseIncomeExpenses - state.stateExpenses;

         return stats;
    },

    getInitialState: function() {
        var citizens = [];
        for(var i=0; i<ConstantsConfig.POPULATION_SIZE; i++) {
            citizens.push(CitizenBuilder.buildCitizen());
        }

        var stats = Optimizer.optimizePopulation(citizens);

        var res = {
            baseIncome: 0,
            incomeTax: UserVariables.incomeTax*100,
            valueAddedTax: UserVariables.valueAddedTax*100,
            prevStepStats: stats,
            nextStepStats: null,
            citizens: citizens,
            stateExpenses: ConstantsConfig.STATE_EXPENSES_PER_CAPITA * citizens.length
        };

        res.nextStepStats = this._computeStats(res);

        return res;
    },

    /**
     * Convert value of field to non-negative number
     *
     * @param e Event
     * @returns {Number} Converted number, -1 on error
     * @private
     */
    _convertInteger: function(e) {
        var res = parseInt(e.target.value);

        if (!isNaN(res) && (res >= 0)) {
            // OK
            e.target.style.background = 'inherit';
            return res;
        }
        else {
            // Bad number
            e.target.style.background = 'red';
            return -1;
        }
    },

    changeBaseIncome: function(e) {
        var n = this._convertInteger(e);
        if (n >= 0) {
            var state = this.state;
            state.baseIncome = n;
            state.nextStepStats = this._computeStats(state);
            this.setState(state);
        }
    },

    changeIncomeTax: function(e) {
        var n = this._convertInteger(e);
        if (n >= 0) {
            var state = this.state;
            state.incomeTax = n;
            state.nextStepStats = this._computeStats(state);
            this.setState(state);
        }
    },

    changeValueAddedTax: function(e) {
        var n = this._convertInteger(e);
        if (n >= 0) {
            var state = this.state;
            state.valueAddedTax = n;
            state.nextStepStats = this._computeStats(state);
            this.setState(state);
        }
    },

    nextStep: function() {
        /* Update state */
        var newState = this.state;

        // Set user variables from state
        UserVariables.incomeTax = this.state.incomeTax*.01;
        UserVariables.valueAddedTax = this.state.valueAddedTax*.01;
        UserVariables.baseIncome = this.state.baseIncome;

        // Optimize population
        newState.prevStepStats = Optimizer.optimizePopulation(newState.citizens);

        // Compute next step stats
        newState.nextStepStats = this._computeStats(newState);

        // Update state
        this.setState(newState);
    },

    render: function() {
        var prevStepStats = "";
        if (this.state.prevStepStats != null) {
            prevStepStats = <div>
                Legal job avg hours: {this.state.prevStepStats.legalJob.avg()}<br />
                Illegal job avg hours: {this.state.prevStepStats.illegalJob.avg()}<br />
                Communal work avg hours: {this.state.prevStepStats.communalWork.avg()}<br />
                Home work avg hours: {this.state.prevStepStats.homeWork.avg()}<br />
                Free time avg hours: {this.state.prevStepStats.freeTime.avg()}<br />
                Resources fulfillment: {this.state.prevStepStats.resourcesFulfilled.avg()*5}%<br />
                Average satisfaction: {this.state.prevStepStats.satisfactionSum / this.state.citizens.length}<br />
            </div>;
        }

        var nextStepStats = "";
        if (this.state.nextStepStats != null) {
            nextStepStats = <div>
                Income tax income: {this.state.nextStepStats.incomeTaxIncome}<br />
                VAT income: {this.state.nextStepStats.vatIncome}<br />
                State expenses: {this.state.stateExpenses}<br />
                Base income expenses: {this.state.nextStepStats.baseIncomeExpenses}<br />
                Balance: {this.state.nextStepStats.balance}<br />
            </div>;
        }

        return <div>
            {prevStepStats}
            Base income: <input size="5" value={this.state.baseIncome} onChange={this.changeBaseIncome} />&nbsp;&nbsp;
            Income tax: <input size="3" value={this.state.incomeTax} onChange={this.changeIncomeTax} />%&nbsp;&nbsp;
            Value added tax: <input size="3" value={this.state.valueAddedTax} onChange={this.changeValueAddedTax} />%&nbsp;&nbsp;
            <input type="button" value="Next step >>" onClick={this.nextStep} /><br />
            {nextStepStats}
        </div>;
    }
});

