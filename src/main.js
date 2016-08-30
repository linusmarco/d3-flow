

var d3Flow = (function() {

    // chart class
    var FlowChart = function(w, h, container) {

        this.width = w;
        this.height = h;

        this.container = container;

        this.nodes = [];
        this.connections = [];


        this.chart = d3.select(container).append("svg")
            .attr("class", "flowchart")
            .attr("width", w)
            .attr("height", h);

        this.addNode = function(s, w, h, t) {
            var node = new Node(this.chart, s, w, h, t)
            this.nodes.push(node);
            return node.node;
        };

        this.addConn = function(node1, node2, t) {
            
            var dims1 = node1.node().getBBox();
            var dims2 = node2.node().getBBox();

            var tran1 = getTranslation(node1.attr("transform"));
            var tran2 = getTranslation(node2.attr("transform"));

            var diffs = {
                right : (tran2.x) - (tran1.x + dims1.width),
                left : (tran1.x) - (tran2.x + dims2.width),
                top : (tran1.y) - (tran2.y + dims2.height),
                bottom : (tran2.y) - (tran1.y + dims1.height)
            };

            var x1, y1, x2, y2;
            if (Math.max(diffs.right, diffs.left, diffs.top, diffs.bottom) === diffs.right) {
                x1 = tran1.x + dims1.width;
                y1 = tran1.y + dims1.height / 2;
                x2 = tran2.x;
                y2 = tran2.y + dims2.height / 2;
            }
            else if (Math.max(diffs.right, diffs.left, diffs.top, diffs.bottom) === diffs.left) {
                x1 = tran1.x;
                y1 = tran1.y + dims1.height / 2;
                x2 = tran2.x + dims2.width;
                y2 = tran2.y + dims1.height / 2;    
            }
            else if (Math.max(diffs.right, diffs.left, diffs.top, diffs.bottom) === diffs.top) {
                x1 = tran1.x + dims1.width / 2;
                y1 = tran1.y;
                x2 = tran2.x + dims2.width / 2;
                y2 = tran2.y + dims2.height;   
            }
            else {
                x1 = tran1.x + dims1.width / 2;
                y1 = tran1.y + dims1.height;
                x2 = tran2.x + dims2.width / 2;
                y2 = tran2.y;   
            }

            var conn = new Connection(this.chart, x1, y1, x2, y2, t);
            this.connections.push(conn);
            return conn.conn;
        };

    };

    // node class
    var Node = function(chart, s, w, h, t) {
        this.node = chart.append("g")
            .attr("class", "flowchart-node");

        this.shape = this.node.append(s)
            .attr("class", "flowchart-node-shape")
            .attr("width", w)
            .attr("height", h)
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", 2);
        
        this.text = this.node.append("text")
            .attr("class", "flowchart-node-text")
            .text(t)
            .attr("transform", "translate(" + w/2 + "," + h/2 + ")")
            .style("text-anchor","middle")
            .style("dominant-baseline", "middle");
    };

    // connection class
    var Connection = function(chart, x1, y1, x2, y2, t) {
        this.conn = chart.append("g")
            .attr("class", "flowchart-connection");

        this.conn.append("svg:defs").append("svg:marker")
            .attr("id", "arrowhead")
            .attr("refX", 6)
            .attr("refY", 3)
            .attr("markerWidth", 30)
            .attr("markerHeight", 30)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 6 3 0 6 1 3")
            .style("fill", "black");

        this.line = this.conn.append("line")
            .attr("class", "flowchart-conn-line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke-width", 2)
            .attr("stroke", "black")
            .attr("marker-end", "url(#arrowhead)");

        this.text = this.conn.append("text")
            .attr("class", "flowchart-conn-text")
            .text(t)
            .attr("transform", "translate(" + (x1 + (x2-x1)/2) + "," + (y1 + (y2-y1)/2) + ")")
            .style("text-anchor","middle")
            .style("dominant-baseline", "middle");

        this.text = this.conn.insert("rect","text")
            .attr("transform", "translate(" + (x1 + (x2-x1)/2 - this.text.node().getBBox().width/2) + "," + (y1 + (y2-y1)/2 - this.text.node().getBBox().height/2) + ")")
            .attr("width", this.text.node().getBBox().width)
            .attr("height", this.text.node().getBBox().height)
            .style("fill", "white");

    };





    function getTranslation(transform) {
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttributeNS(null, "transform", transform);
        var matrix = g.transform.baseVal.consolidate().matrix;
        return {
            x : matrix.e, 
            y : matrix.f
        };
    }

        

    return {
        flowChart : FlowChart
    }

})();

















