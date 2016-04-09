/**
 * Main game component
 */
var Game = React.createClass(
    {
        LOCAL_STORAGE_KEY: "BasicIncomeHiScore",

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
                baseIncomeExpenses: 0,
                socialBenefitsExpenses: 0,
            };

            for (var i = 0; i < state.citizens.length; i++) {
                var citizen = state.citizens[i];

                stats.baseIncomeExpenses += state.baseIncome;

                if (citizen.isDependent) {
                    stats.socialBenefitsExpenses += state.socialBenefit;
                }

                stats.incomeTaxIncome += citizen.legalJob.states[citizen.legalJob.index].moneyEarned * state.incomeTax / 100.0;
                var money = citizen.legalJob.states[citizen.legalJob.index].moneyEarned * (1 - state.incomeTax / 100.0) +
                            citizen.illegalJob.states[citizen.illegalJob.index].moneyEarned;
                stats.vatIncome += money * state.valueAddedTax / 100.0;
            }

            stats.stepBalance = stats.incomeTaxIncome + stats.vatIncome - stats.baseIncomeExpenses - stats.socialBenefitsExpenses - state.stateExpenses;
            stats.totalBalance = state.savings + stats.stepBalance;

            return stats;
        },

        getInitialState: function () {
            // Just a state with zero step number
            return {
                stepNo: 0,
                message: "Click \"New game\" to start a game."
            };
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

        changeSocialBenefit: function (e) {
            var n = this._convertInteger(e);
            if (n >= 0) {
                var state = this.state;
                state.socialBenefit = n;
                state.nextStepStats = this._computeStats(state);
                this.setState(state);
            }
        },

        newGame: function () {
            "use strict";

            // Show cover
            this.props.getCover().show();

            // Start process the way that cover can show
            window.setTimeout(function() {
                var citizens = [];

                // Seed random number generator
                Random.seed(ConstantsConfig.RANDOM_SEED);

                for (var i = 0; i < ConstantsConfig.POPULATION_SIZE; i++) {
                    var isDependent = (Random.random() * 100) < ConstantsConfig.DEPENDENT_PERSON_PERCENTAGE;

                    console.log("isDependent="+isDependent);
                    citizens.push(CitizenBuilder.buildCitizen(isDependent));
                }

                var stats = Optimizer.optimizePopulation(citizens);

                var newState = {
                    baseIncome: 0,
                    incomeTax: UserVariables.incomeTax * 100,
                    valueAddedTax: UserVariables.valueAddedTax * 100,
                    socialBenefit: UserVariables.socialBenefit,
                    prevStepStats: stats,
                    nextStepStats: null,
                    citizens: citizens,
                    stateExpenses: ConstantsConfig.STATE_EXPENSES_PER_CAPITA * citizens.length,
                    stepNo: 1,
                    score: 0,
                    hiScore: 0,
                    botched: false,
                    finished: false,
                    message: "Modify variables if you wish and click \"Next turn\"",
                    savings: 0
                };

                if (window.localStorage[this.LOCAL_STORAGE_KEY] !== undefined) {
                    newState.hiScore = parseInt(window.localStorage[this.LOCAL_STORAGE_KEY]);
                }

                newState.nextStepStats = this._computeStats(newState);

                this.setState(newState);

                this.props.getCover().hide();
            }.bind(this), 100);
        },

        nextStep: function () {
            // New state (should copy...)
            var newState = this.state;

            // Check balance
            if (this.state.nextStepStats.totalBalance < 0) {
                newState.message = "Cannot continue with negative balance";
                this.setState(newState);
                return;
            }

            // Show cover
            this.props.getCover().show();

            // Start process the way that cover can show
            window.setTimeout(function() {
                // Set user variables from state
                UserVariables.incomeTax = this.state.incomeTax * .01;
                UserVariables.valueAddedTax = this.state.valueAddedTax * .01;
                UserVariables.baseIncome = this.state.baseIncome;
                UserVariables.socialBenefit = this.state.socialBenefit;

                // Optimize population
                newState.prevStepStats = Optimizer.optimizePopulation(newState.citizens);

                // Affect savings
                newState.savings = this.state.nextStepStats.totalBalance;

                // Save score
                var stepScore = Math.round(
                    (this.state.nextStepStats.baseIncomeExpenses - this.state.nextStepStats.socialBenefitsExpenses + this.state.prevStepStats.satisfactionSum)
                    / this.state.citizens.length);

                // Compute next step stats
                newState.nextStepStats = this._computeStats(newState);

                // Update step number
                newState.stepNo = this.state.stepNo + 1;

                // Copy message

                // Check botched game
                newState.finished = this.state.finished;
                newState.botched = this.state.botched;
                if (newState.prevStepStats.satisfactionSum < 0) {
                    newState.botched = true;
                }

                if ((!newState.botched) && (!newState.finished)) {
                    // Add score
                    newState.score = this.state.score + stepScore;

                    if (newState.stepNo == ConstantsConfig.GAME_STEPS) {
                        // Record hi-score
                        newState.hiScore = newState.score;
                        window.localStorage[this.LOCAL_STORAGE_KEY] = newState.hiScore;
                        newState.finished = true;
                    }
                    else {
                        newState.message = "Modify variables if you wish and click \"Next turn\"";
                    }
                }

                if (newState.botched) {
                    newState.message = "Citizens dissatisfied, GAME OVER !!!"
                }

                if (newState.finished) {
                    newState.message = "Game finished - you can continue if you like"
                }

                // Update state
                this.setState(newState);

                // Hide cover
                this.props.getCover().hide();
            }.bind(this), 100);
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
            var statsContents = "";

            if (this.state.stepNo > 0) {
                statsContents =
                    <div>
                        <div className="hudElm">
                            <div className="title">Turn #</div>
                            <div className="value">{this.state.stepNo}</div>
                        </div>
                        <div className="hudElm">
                            <div className="title">&nbsp;</div>
                            <div className="value">&nbsp;</div>
                        </div>
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
                            <div className="title">Average satisfaction</div>
                            <div className="value">{Math.round(
                                this.state.prevStepStats.satisfactionSum / this.state.citizens.length)}</div>
                        </div>
                        <div className="hudElm">
                            <div className="title">Resources fulfillment</div>
                            <div className="value">{Math.round(this.state.prevStepStats.resourcesFulfilled.avg() * 5)}%</div>
                        </div>
                        <div className="hudElm">
                            <div className="title">Under-resourced ctzs</div>
                            <div className="value">{Math.round(this.state.prevStepStats.belowMinimumResourcesPercent)}%</div>
                        </div>
                        <div className="hudElm">
                            <div className="title">Score</div>
                            <div className="value">{this.state.score}</div>
                        </div>
                        <div className="hudElm">
                            <div className="title">Hi-score</div>
                            <div className="value">{this.state.hiScore}</div>
                        </div>
                    </div>;
            }

            prevStepStats =
                <div className="hudPart double">
                    <h2>Statistics</h2>

                    {statsContents}
                </div>
            ;

            var budgetContents = "";

            if (this.state.stepNo > 0) {
                budgetContents = <div>
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
                        <div className="title">Social bnft expenses</div>
                        <div className="value">{this._moneyFmt(this.state.nextStepStats.socialBenefitsExpenses)}</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">Turn balance</div>
                        <div className="value">{this._balanceFmt(this.state.nextStepStats.stepBalance)}</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">Savings</div>
                        <div className="value">{this._moneyFmt(this.state.savings)}</div>
                    </div>
                    <div className="hudElm">
                        <div className="title">Total balance</div>
                        <div className="value">{this._balanceFmt(this.state.nextStepStats.totalBalance)}</div>
                    </div>
                </div>
            }

            nextStepStats = <div className="hudPart double">
                <h2>Budget</h2>

                {budgetContents}
            </div>;

            var controls = "";

            if (this.state.stepNo > 0) {
                controls = <div>
                    <div className="hudElm">
                        <div className="title">Social benefit</div>
                        <div className="value"><input tabIndex="1" type="text" value={this.state.socialBenefit}
                                                      onChange={this.changeSocialBenefit}/></div>
                    </div>
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
                        Next turn
                    </a>
                </div>;
            }

            return <div>
                {prevStepStats}
                <div className="hudPart single">
                    <h2>Controls</h2>

                    <a className="hudElm" tabIndex="1" onClick={this.newGame}>
                        New game
                    </a>

                    {controls}
                </div>

                <div style={{float: "left"}}>
                    {nextStepStats}

                    <br />
                    <div className="hudPart double">
                        <div className="hudElm double">
                            <div className="title">Message</div>
                            <div className="messageValue">{this.state.message}</div>
                        </div>
                    </div>
                </div>
            </div>
                ;
        }
    }
);

