/**
 * Charts a function
 */
var FunctionChart = React.createClass({
    chart: null,

    getInitialState: function() {
        return { data: {} }
    },

    refreshChartData: function() {
      // Compute data
      this.state.data = {
          labels: [],
          datasets: [
              {
                  scaleGridLineColor: "rgba(255, 255, 255, 1)",
                  strokeColor: "rgba(255, 255, 255, 1)",
                  pointColor: "rgba(255, 255, 255, 1)",
                  data: []
              }
          ]
      };

      var step = Math.max(1, Math.round((this.props.max - this.props.min)/30));
      for(var x=this.props.min; x<=this.props.max; x+=step) {
          this.state.data.labels.push(x);
          this.state.data.datasets[0].data.push(eval(this.props.function));
      }
    },

    render: function() {
        // Redraw chart after DOM is redrawn
        window.setTimeout(function() {
            this.refreshChartData();
            var ctx = document.getElementById(this.props.id).getContext("2d");
            this.chart = new Chart(ctx).Line(this.state.data, { animation: false, showTooltips: false, datasetFill: false, scaleGridLineColor: "rgba(220,220,220,.2)" });
        }.bind(this), 1);

        return (<canvas id={this.props.id} width={this.props.width} height={this.props.height}></canvas>);
    }
});

/* Set defaults */
Chart.defaults.global.scaleLineColor = "rgba(220,220,220,1)";
Chart.defaults.global.scaleFontColor = "#aaa";
