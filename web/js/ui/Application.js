/**
 * Main application
 */
var Application = React.createClass(
    {
        NAVIGATION_GAME: "game",
        NAVIGATION_FUNCTION_DESIGNER: "designer",
        NAVIGATION_CONFIGURATION: "configuration",

        getInitialState: function () {
            return {
                navigation: this.NAVIGATION_GAME
            }
        },

        /**
         * Go to this navigation
         * @param navigation Navigaton to go to
         */
        goToNavigation: function (navigation) {
            this.setState({
                              navigation: navigation
                          });
        },

        _getButtonClasses: function (navigation) {
            return "button" + ((this.state.navigation == navigation) ? " active" : "");
        },

        _getCover: function() {
            "use strict";
            return this.refs.cover;
        },

        render: function () {
            var content = "";

            var cover = <Cover ref="cover" />;

            if (this.state.navigation == this.NAVIGATION_GAME) {
                content = <Game getCover={this._getCover} />
            }
            else if (this.state.navigation == this.NAVIGATION_FUNCTION_DESIGNER) {
                content = <FunctionDesigner />
            }
            else if (this.state.navigation == this.NAVIGATION_CONFIGURATION) {
                content = <Configuration />
            }

            return <div>
                {cover}
                <div className="menu">
                    <a href="mechanics.html" target="_blank" className="rightLink">Explanation of simulation mechanics</a>
                    <a href="https://github.com/lemmingucwcz/BasicIncome" target="_blank" className="rightLink">GitHub</a>
                    <a href="#" className={this._getButtonClasses(this.NAVIGATION_GAME)} onClick={this.goToNavigation.bind(this, this.NAVIGATION_GAME)}>Simulation</a>
                    <a href="#" className={this._getButtonClasses(this.NAVIGATION_FUNCTION_DESIGNER)}
                       onClick={this.goToNavigation.bind(this, this.NAVIGATION_FUNCTION_DESIGNER)}>Designer</a>
                    <a href="#" className={this._getButtonClasses(this.NAVIGATION_CONFIGURATION)} onClick={this.goToNavigation.bind(this, this.NAVIGATION_CONFIGURATION)}>Configuration</a>
                </div>
                <div className="content">{content}</div>
            </div>;
        }
    }
);
