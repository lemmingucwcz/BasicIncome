/**
 * Class for charting histogram from HistogramData
 *
 * Created by Michal on 10.4.2016.
 */
var HistogramChart = React.createClass(
    {
        chart: null,

        getInitialState: function () {
            "use strict";

            // No chart by default
            return {
                chartId: null,
                chartLabel: null
            };
        },

        /**
         * Create chart data
         *
         * @private
         */
        _getChartData: function () {
            "use strict";

            var histogramData = this.props.getData(this.state.chartId);
            var factor = histogramData.getFactor();
            var offset = histogramData.getOffset()

            // Create labels
            var labels = [];
            for (var i = 0; i < histogramData.getData().length; i++) {
                labels.push(i * factor + offset);
            }

            return {
                labels: labels,
                datasets: [
                    {
                        label: this.state.chartLabel,
                        fillColor: "rgba(255, 255, 255, 1)",
                        strokeColor: "rgba(255, 255, 255, 1)",
                        highlightFill: "rgba(255, 255, 255, 1)",
                        highlightStroke: "rgba(255, 255, 255, 1)",
                        data: histogramData.getData()
                    }
                ]
            }
        },

        /**
         * Close histogram
         */
        close: function() {
            "use strict";

            this.setState(this.getInitialState());
        },

        render: function () {
            "use strict";

            // Destroy old chart
            if (this.chart != null) {
                this.chart.destroy();
                this.chart = null;
            }

            if (this.state.chartId == null) {
                // No chart
                return <span></span>;
            }
            else {
                // Redraw chart after DOM is redrawn
                window.setTimeout(function () {
                    var ctx = document.getElementById(this.props.id).getContext("2d");
                    this.chart =
                        new Chart(ctx).Bar(this._getChartData(),
                                           {animation: false });
                }.bind(this), 1);

                return <div className="histogramChart" onClick={this.close}>
                    <div className="background"></div>
                    <div className="chartWrapper" style={{width: (parseInt(this.props.width)+60)+"px"}}>
                        <div className="chartLabel">{this.state.chartLabel}</div>
                        <div className="yAxisLabel">Citizen count</div>
                        <canvas id={this.props.id} width={this.props.width} height={this.props.height}></canvas>
                        <div className="xAxisLabel">{this.state.axisLabel}</div>
                    </div>
                </div>;
            }
        },

        /**
         * Show chart
         *
         * @param chartId Chart id - will be passed to this.props.getData()
         * @param chartLabel Label of the chart
         */
        showChart: function (chartId, chartLabel, axisLabel) {
            "use strict";

            this.setState({
                              chartId: chartId,
                              chartLabel: chartLabel,
                              axisLabel: axisLabel
                          });
        }
    }
);


