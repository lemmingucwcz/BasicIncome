/**
 * Main application
 */
var Application = React.createClass({
    NAVIGATION_GAME: "game",
    NAVIGATION_FUNCTION_DESIGNER: "designer",


    getInitialState: function() {
        return {
            navigation: this.NAVIGATION_GAME
        }
    },

    /**
     * Go to this navigation
     * @param navigation Navigaton to go to
     */
    goToNavigation: function(navigation) {
        this.setState({
            navigation: navigation
         });
    },

    _getButtonClasses: function(navigation) {
        return "button" + ((this.state.navigation == navigation) ? " active" : "");
    },

    render: function() {
        var content = "";

        if (this.state.navigation == this.NAVIGATION_GAME) {
            content = <Game />
        }
        else if (this.state.navigation == this.NAVIGATION_FUNCTION_DESIGNER) {
            content = <FunctionDesigner />
        }

        return <div>
            <div className="menu">
                <a href="mechanics.html" target="_blank" className="rightLink">Explanation of simulation mechanics</a>
                <a href="#" className={this._getButtonClasses(this.NAVIGATION_GAME)} onClick={this.goToNavigation.bind(this, this.NAVIGATION_GAME)} >Simulation</a>
                <a href="#" className={this._getButtonClasses(this.NAVIGATION_FUNCTION_DESIGNER)} onClick={this.goToNavigation.bind(this, this.NAVIGATION_FUNCTION_DESIGNER)} >Designer</a>
            </div>
            <div className="content">{content}</div>
            </div>;
    }
});
