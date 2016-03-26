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

    render: function() {
        var content = "";

        if (this.state.navigation == this.NAVIGATION_GAME) {
            content = <Game />;
        }
        else if (this.state.navigation == this.NAVIGATION_FUNCTION_DESIGNER) {
            content = <FunctionDesigner />
        }

        return <div>
            <input type="button" value="Game" onClick={this.goToNavigation.bind(this, this.NAVIGATION_GAME)} />
            <input type="button" value="Designer" onClick={this.goToNavigation.bind(this, this.NAVIGATION_FUNCTION_DESIGNER)} /><br />
            {content}
            </div>;
    }
});
