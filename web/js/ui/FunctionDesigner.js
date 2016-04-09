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

            // Parse scale variation
            if (this.refs.scaleVariation !== undefined) {
                var newScaleVariation = parseFloat(this.refs.scaleVariation.getDOMNode().value);
                if (isNaN(newScaleVariation)) {
                    newState.error = "Invalid scale variation";
                    return newState;
                }
                newState.scaleVariation = newScaleVariation;
            }

            // Parse offset variation
            if (this.refs.offsetVariation !== undefined) {
                var newOffsetVariation = parseFloat(this.refs.offsetVariation.getDOMNode().value);
                if (isNaN(newOffsetVariation)) {
                    newState.error = "Invalid offset variation";
                    return newState;
                }
                newState.offsetVariation = newOffsetVariation;
            }

            // Parse dependent scale variation
            if (this.refs.dependentScaleRatio !== undefined) {
                var newDependentScaleRatio = parseFloat(this.refs.dependentScaleRatio.getDOMNode().value);
                if (isNaN(newDependentScaleRatio)) {
                    newState.error = "Invalid dependent scale ratio";
                    return newState;
                }
                newState.dependentScaleRatio = newDependentScaleRatio;
            }

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
                    this.refs.scaleVariation.getDOMNode().value = newState.fn.scaleVariation;
                    this.refs.offsetVariation.getDOMNode().value = newState.fn.offsetVariation;
                    this.refs.dependentScaleRatio.getDOMNode().value = newState.fn.dependentScaleRatio;
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

            // Parse and draw new data
            this.draw();

            if (this.state.error.length == 0) {
                // No error - save
                FunctionConfig[this.state.selectedId].fn = this.state.fn.fn;

                // Mark new function as original
                this.state.originalFn = this.state.fn.fn;
            }
        },

        render: function () {
            var storeButton = <span />;

            if ((this.state.selectedId != null) && (this.state.error.length == 0)) {
                storeButton = <a className="hudElm double" tabIndex="1" onClick={this.store}>
                    Store
                </a>;
            }


            var variations = "";

            if (this.state.fn !== undefined) {
                var variationsStyle = (this.state.fn.scaleVariation !== undefined) ? {} : {display: "none"};

                variations = <div style={variationsStyle}>
                    <div className="hudElm">
                        <div className="title">Scale variation</div>
                        <div className="value"><input tabIndex="1" type="text" ref="scaleVariation"
                                                      defaultValue={this.state.fn.scaleVariation}/></div>
                    </div>

                    <div className="hudElm">
                        <div className="title">Offset variation</div>
                        <div className="value"><input tabIndex="1" type="text" ref="offsetVariation"
                                                      defaultValue={this.state.fn.offsetVariation}/></div>
                    </div>

                    <div className="hudElm double">
                        <div className="title">Dependent scale ratio</div>
                        <div className="value"><input tabIndex="1" type="text" ref="dependentScaleRatio"
                                                      defaultValue={this.state.fn.dependentScaleRatio}/></div>
                    </div>
                </div>;
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
                                      <div className="value" style={{"fontSize": "100%"}}><input style={{"textAlign": "left"}} tabIndex="1" type="text" ref="fn"
                                                                    defaultValue={this.state.fn.fn}/></div>
                                  </div>

                                  <p className="description" style={{ fontSize: "80%"}}>{this.state.fn.args}</p>

                                  <a className="hudElm double" tabIndex="1" onClick={this.draw}>
                                      Draw
                                  </a>

                                  {variations}

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