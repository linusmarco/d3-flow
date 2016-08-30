# d3-flow
Library for creating flow charts. Built on D3

### Usage example:

```javascript
var chart = new d3Flow.flowChart(800, 800, "body");

node1 = chart.addNode("rect", 100, 50, "Node 1")
    .attr("transform", "translate(" + 350 + "," + 50 + ")");

node2 = chart.addNode("rect", 100, 50, "Node 2")
    .attr("transform", "translate(" + 550 + "," + 250 + ")");

node3 = chart.addNode("rect", 100, 50, "Node 3")
    .attr("transform", "translate(" + 350 + "," + 450 + ")");

node4 = chart.addNode("rect", 100, 50, "Node 4")
    .attr("transform", "translate(" + 150 + "," + 250 + ")");

conn12 = chart.addConn(node1, node2, "Connection 1");
conn23 = chart.addConn(node2, node3, "Connection 2");
conn34 = chart.addConn(node3, node4, "Connection 3");
conn45 = chart.addConn(node4, node1, "Connection 4");
```