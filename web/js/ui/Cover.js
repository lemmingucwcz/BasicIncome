/**
 * Cover component
 *
 * Created by Michal on 9.4.2016.
 */
var Cover = React.createClass(
    {
        getInitialState: function () {
            "use strict";
            return {
                shown: false
            }
        },

        show: function () {
            this.setState({
                              shown: true
                          });
        },

        hide: function () {
            this.setState({
                              shown: false
                          });
        },

        render: function () {
            "use strict";

            if (!this.state.shown) {
                // Just an empty div
                return <div></div>;
            }
            else {
                /* Create cover */

                // Compute padding to center text vertically (kind of)
                var padding = (window.innerHeight - 20) / 2;

                return <div className="cover" style={{paddingTop: padding+"px"}}>Comp<strong>U</strong>ting...</div>;
            }
        }
    }
);