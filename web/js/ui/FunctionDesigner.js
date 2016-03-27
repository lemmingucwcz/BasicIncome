/**
 * Allows user to design function
 */
var FunctionDesigner = React.createClass(
    {
        getInitialState: function () {
            return {
                selectedId: null,
                error: ""
            };
        },

        createNewState: function () {
            // Create new state
            var newState = {
                selectedId: this.state.selectedId,
                fn: this.state.fn,
                originalFn: this.state.originalFn,
                error: ""
            };

            // Parse min
            var newMin = parseInt(this.refs.min.getDOMNode().value);
            if (
                isNaN(newMin)) {
                newState.error = "Invalid min";
                return newState;
            }
            newState.fn.min = newMin;

            // Parse max
            var newMax = parseInt(this.refs.max.getDOMNode().value);
            if (isNaN(newMax)) {
                newState.error = "Invalid max";
                return newState;
            }
            newState.fn.max = newMax;

            // Parse function
            try {
                var x = 1;
                var newFn = this.refs.fn.getDOMNode().value;

                eval(newFn);

                newState.fn.fn = newFn;
            }
            catch (e) {
                newState.error = e.toString();
                return newState;
            }

            // All went OK
            return newState;
        },

        draw: function () {
            // Update
            var newState = this.createNewState();
            this.setState(newState);
        },

        /**
         * Called when a function is selected
         */
        functionSelected: function (e) {
            var newState = {
                selectedId: e.target.value,
                error: ""
            };

            if (newState.selectedId != null) {
                newState.fn = FunctionConfig[newState.selectedId];
                newState.originalFn = newState.fn.fn;

                if (this.refs.min != null) {
                    this.refs.min.getDOMNode().value = newState.fn.min;
                    this.refs.max.getDOMNode().value = newState.fn.max;
                    this.refs.fn.getDOMNode().value = newState.fn.fn;
                }
            }

            this.setState(newState);
            if (this.refs.chart != null) {
                this.refs.chart.refreshChartData();
            }
        },

        /**
         * Store function to config
         */
        store: function () {
            "use strict";

            FunctionConfig[this.state.selectedId].fn = this.state.fn.fn;

            // Mark new function as original
            this.state.originalFn = this.state.fn.fn;

            // Redraw
            this.setState(this.state);
        },

        render: function () {
            var storeButton = <span />;

            if ((this.state.selectedId != null) && (this.state.error.length == 0) && (this.state.fn.fn != this.state.originalFn)) {
                storeButton = <a className="hudElm double" tabIndex="1" onClick={this.store}>
                    Store
                </a>;
            }

            var chartParams = (this.state.selectedId == null) ? <span /> :
                              <div>
                                  <p className="description">{this.state.fn.description}</p>

                                  <div className="hudElm">
                                      <div className="title">From</div>
                                      <div className="value"><input tabIndex="1" type="text" ref="min"
                                                                    defaultValue={this.state.fn.min}/></div>
                                  </div>

                                  <div className="hudElm">
                                      <div className="title">To</div>
                                      <div className="value"><input tabIndex="1" type="text" ref="max"
                                                                    defaultValue={this.state.fn.max}/></div>
                                  </div>

                                  <div className="hudElm double">
                                      <div className="title">Function</div>
                                      <div className="value" style={{"font-size": "100%"}}><input style={{"text-align": "left"}} tabIndex="1" type="text" ref="fn"
                                                                    defaultValue={this.state.fn.fn}/></div>
                                  </div>

                                  <a className="hudElm double" tabIndex="1" onClick={this.draw}>
                                      Draw
                                  </a>

                                  {storeButton}

                                  <div className="error">{this.state.error}</div>
                              </div>;

            var chart = (this.state.selectedId == null) ? <span /> :
                        <div className="chart">
                            <FunctionChart ref="chart" id="chart" min={this.state.fn.min} max={this.state.fn.max}
                                           width="800" height="600" function={this.state.fn.fn}/>
                        </div>
                ;

            return (
                <div>
                    <div className="hudPart double">
                        <select tabIndex="1" onChange={this.functionSelected}>
                            <option><i>&lt;Select function&gt;</i></option>
                            {
                                Object.keys(FunctionConfig).map(function (key) {
                                    return <option value={FunctionConfig[key].id}>{FunctionConfig[key].name}</option>;
                                })
                            }
                        </select>

                        {chartParams}
                    </div>
                    {chart}
                </div>
            );
        }
    }
);