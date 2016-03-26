/**
 * Allows user to design function
 */
var FunctionDesigner = React.createClass({
    getInitialState: function() {
        return {
            selectedId: null
        };
    },

    createNewState: function() {
        // Create new state
        var newState = {
            selectedId: this.state.selectedId,
            fn: this.state.fn,
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
        catch(e) {
            newState.error = e.toString();
            return newState;
        }

        // All went OK
        return newState;
    },

    draw: function() {
        var newState = this.createNewState();
        if (newState.error.length == 0) {
            // Was OK - update
            this.setState(newState);
        }
    },

    /**
    * Called when a function is selected
    */
    functionSelected: function(e) {
        var newState = {
                selectedId: e.target.value
        };

        if (newState.selectedId != null) {
            newState.fn = FunctionConfig[newState.selectedId];

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

    render: function() {
        var red = { color: "red", "padding-left": "10px" };

        var chart = (this.state.selectedId == null)?<span />:
                    <div>
                    {this.state.fn.description}<br />
                    From: <input ref="min" size="5" defaultValue={this.state.fn.min} />&nbsp;
                    To: <input ref="max" size="5" defaultValue={this.state.fn.max} />&nbsp;
                    Function: <input ref="fn" size="40" defaultValue={this.state.fn.fn} />&nbsp;
                        <input type="button" value="Draw" onClick={this.draw} />
                        <span style={red}>{this.state.error}</span>
                        <div>
                            <FunctionChart ref="chart" id="chart" min={this.state.fn.min} max={this.state.fn.max} width="800" height="600" function={this.state.fn.fn} />
                        </div>
                    </div>
                    ;

        return (
            <div>
            <select onChange={this.functionSelected}>
                <option><i>&lt;Select function&gt;</i></option>
            {
                Object.keys(FunctionConfig).map(function(key) {
                    return <option value={FunctionConfig[key].id}>{FunctionConfig[key].name}</option>;
                })
            }
            </select>
            {chart}
            </div>
        );
    }
});