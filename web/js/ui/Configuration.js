/**
 * Shows configuration variables and allows saving / loading
 */
var Configuration = React.createClass(
    {
        LOCAL_STORAGE_KEY: "BasicIncome",

        getInitialState: function() {
            "use strict";

            var state = {
                values: {
                    STATE_EXPENSES_PER_CAPITA: ConstantsConfig.STATE_EXPENSES_PER_CAPITA,
                    RESOURCES_NEED_SHIFT: ConstantsConfig.RESOURCES_NEED_SHIFT,
                    POPULATION_SIZE: ConstantsConfig.POPULATION_SIZE,
                    RESOURCES_NEEDED: ConstantsConfig.RESOURCES_NEEDED,
                    DEPENDENT_PERSON_PERCENTAGE: ConstantsConfig.DEPENDENT_PERSON_PERCENTAGE,
                    MINIMUM_RESOURCES_NEEDED: ConstantsConfig.MINIMUM_RESOURCES_NEEDED
                },

                configName: "",

                configKeys: [],
            };

            // Fill in config keys
            var ls = JSON.parse(window.localStorage[this.LOCAL_STORAGE_KEY] || "{}");
            for(var key in ls) {
                if (ls.hasOwnProperty(key)) {
                    state.configKeys.push(key);
                }
            }

            return state;
        },

        /**
         * Called when value was changed
         *
         * @param key
         */
        valueChange: function(e, key) {
            "use strict";

            var res = parseFloat(e.target.value);
            if (!isNaN(res) && (res >= 0)) {
                // Set new value
                this.state.values[key] = res;
                ConstantsConfig[key] = res;
                this.setState(this.state);
            }
        },

        /**
         * Render input for value
         *
         * @param title Value title
         * @param key Value key
         */
        renderValue: function(title, key) {
            "use strict";

            return <div className="hudElm double">
                <div className="title">{title}</div>
                <div className="value"><input tabIndex="1" type="text" value={this.state.values[key]} onChange={function(e) { this.valueChange(e, key);}.bind(this)} /></div>
            </div>;
        },

        configNameChanged: function(e) {
            "use strict";

            this.state.configName = e.target.value;
            this.setState(this.state);
        },

        /**
         * Refresh state completely, set given config name
         *
         * @param configName Config name to set
         * @private
         */
        _refreshState: function(configName) {
            "use strict";

            var state = this.getInitialState();
            state.configName = configName;
            this.setState(state);
        },

        /**
         * Load configuration
         */
        load: function() {
            "use strict";

            var configName = this.state.configName;
            var config = JSON.parse(window.localStorage[this.LOCAL_STORAGE_KEY])[configName];

            // Store global config
            window.ConstantsConfig = config.ConstantsConfig;
            window.FunctionConfig = config.FunctionConfig;

            // Re-create state, keep config name
            this._refreshState(configName);
        },

        /**
         * Save configuration
         */
        save: function() {
            "use strict";

            var configName = this.state.configName;
            var ls = JSON.parse(window.localStorage[this.LOCAL_STORAGE_KEY] || "{}");

            // Create new config
            var config = {
                ConstantsConfig: window.ConstantsConfig,
                FunctionConfig: window.FunctionConfig
            };

            // Store
            ls[configName] = config;
            window.localStorage[this.LOCAL_STORAGE_KEY] = JSON.stringify(ls);

            // Re-create state, keep config name
            this._refreshState(configName);
        },

        delete: function() {
            "use strict";

            // Clear key
            var ls = JSON.parse(window.localStorage[this.LOCAL_STORAGE_KEY] || "{}");
            ls[this.state.configName] = undefined;
            window.localStorage[this.LOCAL_STORAGE_KEY] = JSON.stringify(ls);

            // Clear selected value in select
            this.refs.select.getDOMNode().value = "";

            // Re-create state, clear config name
            this._refreshState("");
        },

        render: function() {
            "use strict";

            // Create load and delete buttons
            var loadBtn = <span />;
            var deleteBtn = <span />;
            var ls = JSON.parse(window.localStorage[this.LOCAL_STORAGE_KEY] || "{}");
            if ((this.state.configName.length > 0) && (typeof ls[this.state.configName] == "object")) {
                loadBtn = <a className="hudElm" tabIndex="1" onClick={this.load}> Load </a>;
                deleteBtn = <a className="hudElm" tabIndex="1" onClick={this.delete}> Delete </a>;
            }

            // Create save button
            var saveBtn = <span />;
            if (this.state.configName.length > 0) {
                saveBtn = <a className="hudElm double" tabIndex="1" onClick={this.save}> Save </a>;
            }

            return <div>
                <div className="hudPart double">
                    <h2>Variables (applied immediatelly)</h2>
                    {this.renderValue("Other expenses per capita", "STATE_EXPENSES_PER_CAPITA")}
                    {this.renderValue("Initial resources needed by one citizen", "RESOURCES_NEEDED")}
                    {this.renderValue("How quickly citizen accomodates to new amount of resources (0 (not at all) - 1 (immediatelly))", "RESOURCES_NEED_SHIFT")}
                    {this.renderValue("Population size", "POPULATION_SIZE")}
                    {this.renderValue("Percentage of dependent persons in population", "DEPENDENT_PERSON_PERCENTAGE")}
                    {this.renderValue("Minimal resources needed for survival of person (not really a limit, but citizens start to be very disappointed below this line)", "MINIMUM_RESOURCES_NEEDED")}
                </div>

                <div className="hudPart double">
                    <h2>Load/save configuration</h2>
                    <select size="10" ref="select" onChange={this.configNameChanged}>
                        {
                            Object.keys(ls).map(function (key) {
                                return <option value={key}>{key}</option>;
                            })
                        }
                    </select><br />

                    <input type="text" placeholder="Configuration name" value={this.state.configName} style={{"text-align": "left", margin: "5px 10px", width: "465px", "font-size": "120%"}} onChange={this.configNameChanged} /><br />

                    {saveBtn}
                    {loadBtn}
                    {deleteBtn}
                </div>
            </div>
        }
    }
);
