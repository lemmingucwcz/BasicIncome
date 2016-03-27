/**
 * Main game component
 */
var Game = React.createClass(
    {
        /**
         * Compute stats for citizens
         *
         * @param state State to work on
         *
         * @private
         */
        _computeStats: function (state) {
            var stats = {
                incomeTaxIncome: 0,
                vatIncome: 0,
                baseIncomeExpenses: 0
            };

            for (var i = 0; i < state.citizens.length; i++) {
                var citizen = state.citizens[i];

                stats.baseIncomeExpenses += state.baseIncome;
                stats.incomeTaxIncome += citizen.legalJob.states[citizen.legalJob.index].moneyEarned * state.incomeTax / 100.0;
                var money = citizen.legalJob.states[citizen.legalJob.index].moneyEarned * (1 - state.incomeTax / 100.0) +
                            citizen.illegalJob.states[citizen.illegalJob.index].moneyEarned;
                stats.vatIncome += money * state.valueAddedTax / 100.0;
            }

            stats.balance = stats.incomeTaxIncome + stats.vatIncome - stats.baseIncomeExpenses - state.stateExpenses;

            return stats;
        },

        getInitialState: function () {
            var citizens = [];
            for (var i = 0; i < ConstantsConfig.POPULATION_SIZE; i++) {
                citizens.push(CitizenBuilder.buildCitizen());
            }

            var stats = Optimizer.optimizePopulation(citizens);

            var res = {
                baseIncome: 0,
                incomeTax: UserVariables.incomeTax * 100,
                valueAddedTax: UserVariables.valueAddedTax * 100,
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
        _convertInteger: function (e) {
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

        changeBaseIncome: function (e) {
            var n = this._convertInteger(e);
            if (n >= 0) {
                var state = this.state;
                state.baseIncome = n;
                state.nextStepStats = this._computeStats(state);
                this.setState(state);
            }
        },

        changeIncomeTax: function (e) {
            var n = this._convertInteger(e);
            if (n >= 0) {
                var state = this.state;
                state.incomeTax = n;
                state.nextStepStats = this._computeStats(state);
                this.setState(state);
            }
        },

        changeValueAddedTax: function (e) {
            var n = this._convertInteger(e);
            if (n >= 0) {
                var state = this.state;
                state.valueAddedTax = n;
                state.nextStepStats = this._computeStats(state);
                this.setState(state);
            }
        },

        nextStep: function () {
            /* Update state */
            var newState = this.state;

            // Set user variables from state
            UserVariables.incomeTax = this.state.incomeTax * .01;
            UserVariables.valueAddedTax = this.state.valueAddedTax * .01;
            UserVariables.baseIncome = this.state.baseIncome;

            // Optimize population
            newState.prevStepStats = Optimizer.optimizePopulation(newState.citizens);

            // Compute next step stats
            newState.nextStepStats = this._computeStats(newState);

            // Update state
            this.setState(newState);
        },

        /**
         * Format value for HUD
         */
        _hudFmt: function (value) {
            "use strict";

            return value.toFixed(2);
        },

        /**
         * Format monetary amount
         */
        _moneyFmt: function (value) {
            "use strict";

            var abs = Math.abs(value);
            var res;

            if (abs < 10000) {
                res = Math.round(abs);
            }
            else if (abs < 10000000) {
                res = Math.round(abs / 1000) + "k";
            }
            else if (abs < 10000000000) {
                res = Math.round(abs / 1000000) + "M";
            }
            else {
                res = Math.round(abs / 1000000000) + "B";
            }

            return ((value < 0) ? "-" : "") + res;
        },

        /**
         * Format balance
         *
         * @param value
         */
        _balanceFmt: function (value) {
            "use strict";

            return ((value < 0) ? "" : "+") + this._moneyFmt(value);
        },

        render: function () {
            var prevStepStats = "";
            if (this.state.prevStepStats != null) {
                prevStepStats = <div className="hudPart double">
                    <div className="hudElm">
                        <div className="title">Legal job avg hrs</div>
                        <div className="value">{this._hudFmt(this.state.prevStepStats.legalJob.avg())}</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">Illegal job avg hrs</div>
                        <div className="value">{this._hudFmt(this.state.prevStepStats.illegalJob.avg())}</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">Comm. work avg hrs</div>
                        <div className="value">{this._hudFmt(this.state.prevStepStats.communalWork.avg())}</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">House work avg hrs</div>
                        <div className="value">{this._hudFmt(this.state.prevStepStats.homeWork.avg())}</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">Free time avg hrs</div>
                        <div className="value">{this._hudFmt(this.state.prevStepStats.freeTime.avg())}</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">&nbsp;</div>
                        <div className="value">&nbsp;</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">Resources fulfillment</div>
                        <div className="value">{Math.round(this.state.prevStepStats.resourcesFulfilled.avg() * 5)}%</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">Average satisfaction</div>
                        <div className="value">{Math.round(
                            this.state.prevStepStats.satisfactionSum / this.state.citizens.length)}</div>
                    </div>
                </div>;
            }

            var nextStepStats = "";
            if (this.state.nextStepStats != null) {
                nextStepStats = <div className="hudPart double">
                    <div className="hudElm">
                        <div className="title">Income tax income</div>
                        <div className="value">{this._moneyFmt(this.state.nextStepStats.incomeTaxIncome)}</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">VAT income</div>
                        <div className="value">{this._moneyFmt(this.state.nextStepStats.vatIncome)}</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">Base income expenses</div>
                        <div className="value">{this._moneyFmt(this.state.nextStepStats.baseIncomeExpenses)}</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">State expenses</div>
                        <div className="value">{this._moneyFmt(this.state.stateExpenses)}</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">&nbsp;</div>
                        <div className="value">&nbsp;</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">Total balance</div>
                        <div className="value">{this._balanceFmt(this.state.nextStepStats.balance)}</div>
                    </div>
                </div>;
            }

            return <div>
                {prevStepStats}
                <div className="hudPart single">
                    <div className="hudElm">
                        <div className="title">Base income</div>
                        <div className="value"><input tabIndex="1" type="text" value={this.state.baseIncome}
                                                      onChange={this.changeBaseIncome}/></div>
                    </div>
                    <div className="hudElm">
                        <div className="title">Income tax [%]</div>
                        <div className="value"><input tabIndex="1" type="text" value={this.state.incomeTax}
                                                      onChange={this.changeIncomeTax}/></div>
                    </div>
                    <div className="hudElm">
                        <div className="title">Value added tax [%]</div>
                        <div className="value"><input tabIndex="1" type="text" value={this.state.valueAddedTax}
                                                      onChange={this.changeValueAddedTax}/></div>
                    </div>
                    <a className="hudElm" tabIndex="1" onClick={this.nextStep}>
                        Next step
                    </a>
                </div>
                {nextStepStats}
            </div>;
        }
    }
);

