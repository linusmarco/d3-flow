# d3-flow
Library for creating flow charts. Built on D3

### Usage example:


```html
<html>

    <head>
        <title>Flow Chart</title>
        <script src="https://d3js.org/d3.v4.min.js"></script>
        <script src="d3-flow.js"></script>
    </head>

    <body>
        <script>
            var chart = new d3Flow.flowChart(800, 800, "body");

            node1 = chart.addNode("rect", 100, 50, "Node 1")
                .loc(350, 50);

            node2 = chart.addNode("rect", 100, 50, "Node 2")
                .loc(550, 250);

            node3 = chart.addNode("rect", 100, 50, "Node 3")
                .loc(350, 450);

            node4 = chart.addNode("rect", 100, 50, "Node 4")
                .loc(150, 250);

            node5 = chart.addNode("rect", 100, 50, "Node 5")
                .rel(node3, 0, 200);

            conn12 = chart.addConn(node1, node2, "Connection 1");
            conn23 = chart.addConn(node2, node3, "Connection 2");
            conn34 = chart.addConn(node3, node4, "Connection 3");
            conn41 = chart.addConn(node4, node1, "Connection 4");
            conn35 = chart.addConn(node3, node5, "Connection 5");
        </script>
    </body>
</html>
```