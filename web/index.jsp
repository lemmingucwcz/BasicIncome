<%-- Created by IntelliJ IDEA. --%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Basic Income Simulator</title>
    <link rel="stylesheet" type="text/css" href="css/style.css" />
    <script type="text/javascript" src="js/engine/HistogramData.js"></script>
    <script type="text/javascript" src="js/engine/CitizenState.js"></script>
    <script type="text/javascript" src="js/engine/FunctionConfig.js"></script>
    <script type="text/javascript" src="js/engine/ConstantsConfig.js"></script>
    <script type="text/javascript" src="js/engine/GlobalState.js"></script>
    <script type="text/javascript" src="js/engine/Satisfaction.js"></script>
    <script type="text/javascript" src="js/engine/UserVariables.js"></script>
    <script type="text/javascript" src="js/engine/ActivityBuilder.js"></script>
    <script type="text/javascript" src="js/engine/CitizenBuilder.js"></script>
    <script type="text/javascript" src="js/engine/Optimizer.js"></script>

    <script type="text/javascript" src="http://fb.me/react-with-addons-0.12.0.js"></script>
    <script type="text/javascript" src="http://fb.me/JSXTransformer-0.12.0.js"></script>
    <script type="text/javascript" src="js/lib/Chart.min.js"></script>
    <script type="text/jsx" src="js/ui/Application.js"></script>
    <script type="text/jsx" src="js/ui/Game.js"></script>
    <script type="text/jsx" src="js/ui/FunctionChart.js"></script>
    <script type="text/jsx" src="js/ui/FunctionDesigner.js"></script>
</head>
<body>

    <p><a href="mechanics.html" target="_blank">Explanation of simulation mechanics</a></p>

    <div id="react"></div>

    <script type="text/jsx">
        React.render(<Application />, document.getElementById("react"));
    </script>
</body>
</html>