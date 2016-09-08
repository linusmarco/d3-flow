

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
            return node;
        };

        this.addConn = function(node1, node2, t) {
            var conn = new Connection(this.chart, node1, node2, t);
            this.connections.push(conn);
            return conn;
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

        this.loc = function(x, y) {
            this.node.attr("transform", "translate(" + x + "," + y + ")");
            return this;
        };

        this.rel = function(node, dx, dy) {
            //var dims = node.node.node().getBBox();
            var tran = getTranslation(node.node.attr("transform"));
            this.node.attr("transform", "translate(" + (tran.x + dx) + "," + (tran.y + dy) + ")");
            return this;
        };
    };

    // connection class
    var Connection = function(chart, node1, node2, t) {
        
        this.getPts = function(edge1, edge2) {

            var dims1 = this.node1.node.node().getBBox();
            var dims2 = this.node2.node.node().getBBox();

            var tran1 = getTranslation(node1.node.attr("transform"));
            var tran2 = getTranslation(node2.node.attr("transform"));

            var x1, y1, x2, y2;
            
            if (edge1 === "right" || edge1 === "left") {
                y1 = tran1.y + dims1.height / 2;
                if (edge1 === "right") {
                    x1 = tran1.x + dims1.width;
                }
                else if (edge1 === "left") {
                    x1 = tran1.x;
                }
                else { throw "Invalid argument to Connection.edges"; }
            }
            else if (edge1 === "top" || edge1 === "bottom") {
                x1 = tran1.x + dims1.width / 2;
                if (edge1 === "top") {
                    y1 = tran1.y;
                }
                else if (edge1 === "bottom") {
                    y1 = tran1.y + dims1.height;
                }
                else { throw "Invalid argument to Connection.edges"; }
            }

            if (edge2 === "right" || edge2 === "left") {
                y2 = tran2.y + dims2.height / 2;
                if (edge2 === "right") {
                    x2 = tran2.x + dims2.width;
                }
                else if (edge2 === "left") {
                    x2 = tran2.x;
                }
                else { throw "Invalid argument to Connection.edges"; }
            }
            else if (edge2 === "top" || edge2 === "bottom") {
                x2 = tran2.x + dims2.width / 2;
                if (edge2 === "top") {
                    y2 = tran2.y;
                }
                else if (edge2 === "bottom") {
                    y2 = tran2.y + dims2.height;
                }
                else { throw "Invalid argument to Connection.edges"; }
            }

            this.x1 = x1;
            this.x2 = x2;
            this.y1 = y1;
            this.y2 = y2;

        };

        this.edges = function(edge1, edge2) {
            
            this.edge1 = edge1;
            this.edge2 = edge2;

            this.getPts(this.edge1, this.edge2);
            x1 = this.x1;
            x2 = this.x2;
            y1 = this.y1;
            y2 = this.y2;

            this.line
                .attr("d", "M " + x1 + " " + y1 + " L " + x2 + " " + y2);

            this.text
                .attr("transform", "translate(" + (x1 + (x2-x1)/2) + "," + (y1 + (y2-y1)/2) + ")");

            this.textBack
                .attr("transform", "translate(" + (x1 + (x2-x1)/2 - this.text.node().getBBox().width/2) + "," + (y1 + (y2-y1)/2 - this.text.node().getBBox().height/2) + ")"); 

            return this;
        };

        this.dir = function(dir) {

            this.direction = dir;

            this.line.attr("marker-end", "none");
            this.line.attr("marker-start", "none");

            switch (dir) {
                case "forward":
                    this.line.attr("marker-end", "url(#arrowhead-end)");
                    break;
                case "backward":
                    this.line.attr("marker-start", "url(#arrowhead-start)");
                    break;
                case "both":
                    this.line.attr("marker-end", "url(#arrowhead-end)");
                    this.line.attr("marker-start", "url(#arrowhead-start)");
                    break;
            }

            return this;
        };

        this.type = function(type) {

            var buffer = 20;

            this.getPts(this.edge1, this.edge2);
            x1 = this.x1;
            x2 = this.x2;
            y1 = this.y1;
            y2 = this.y2;

            var textOffset = {
                x : 0,
                y : 0
            };

            var lineString = "M " + x1 + " " + y1 + " ";
            if (type === "straight") {
                lineString += "L " + x2 + " " + y2 + " ";
            }
            else if (type === "crooked") {

                switch (this.edge1) {
                    case "right":
                        switch (this.edge2) {
                            case "right":
                                lineString += "L " + (Math.max(x1, x2) + buffer) + " " + y1 + " ";
                                lineString += "L " + (Math.max(x1, x2) + buffer) + " " + y2 + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                textOffset.x += buffer + (x2 - x1)/2;
                                break;
                            case "left":
                                lineString += "L " + ((x1 + x2)/2) + " " + y1 + " ";
                                lineString += "L " + ((x1 + x2)/2) + " " + y2 + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                break;
                            case "top":
                                lineString += "L " + x2 + " " + y1 + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                textOffset.x += (x2 - x1)/2;
                                break;
                            case "bottom":
                                lineString += "L " + x2 + " " + y1 + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                textOffset.x += (x2 - x1)/2;
                                break;
                        }
                        break;
                    case "left":
                        switch (this.edge2) {
                            case "right":
                                lineString += "L " + ((x1 + x2)/2) + " " + y1 + " ";
                                lineString += "L " + ((x1 + x2)/2) + " " + y2 + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                break;
                            case "left":
                                lineString += "L " + (Math.min(x1, x2) - buffer) + " " + y1 + " ";
                                lineString += "L " + (Math.min(x1, x2) - buffer) + " " + y2 + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                textOffset.x += -buffer + (x2 - x1)/2;
                                break;
                            case "top":
                                lineString += "L " + x2 + " " + y1 + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                textOffset.x += (x2 - x1)/2;
                                break;
                            case "bottom":
                                lineString += "L " + x2 + " " + y1 + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                textOffset.x += (x2 - x1)/2;
                                break;
                        }
                        break;
                    case "top":
                        switch (this.edge2) {
                            case "right":
                                lineString += "L " + x1 + " " + y2 + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                textOffset.x += -(x2 - x1)/2;
                                break;
                            case "left":
                                lineString += "L " + x1 + " " + y2 + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                textOffset.x += -(x2 - x1)/2;
                                break;
                            case "top":
                                lineString += "L " + x1 + " " + (Math.min(y1, y2) - buffer) + " ";
                                lineString += "L " + x2 + " " + (Math.min(y1, y2) - buffer) + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                textOffset.y += -buffer + (y2 - y1)/2;
                                break;
                            case "bottom":
                                lineString += "L " + x1 + " " + (y1 + 9*(y2 - y1)/10) + " ";
                                lineString += "L " + x2 + " " + (y1 + 9*(y2 - y1)/10) + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                textOffset.x += (x2 - x1);
                                break;
                        }
                        break;
                    case "bottom":
                        switch (this.edge2) {
                            case "right":
                                lineString += "L " + x1 + " " + y2 + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                textOffset.x += -(x2 - x1)/2;
                                break;
                            case "left":
                                lineString += "L " + x1 + " " + y2 + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                textOffset.x += -(x2 - x1)/2;
                                break;
                            case "top":
                                lineString += "L " + x1 + " " + (y1 + 9*(y2 - y1)/10) + " ";
                                lineString += "L " + x2 + " " + (y1 + 9*(y2 - y1)/10) + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                textOffset.x += (x2 - x1);
                                break;
                            case "bottom":
                                lineString += "L " + x1 + " " + (Math.max(y1, y2) + buffer) + " ";
                                lineString += "L " + x2 + " " + (Math.max(y1, y2) + buffer) + " ";
                                lineString += "L " + x2 + " " + y2 + " ";
                                textOffset.y += buffer + (y2 - y1)/2;
                                break;
                        }
                        break;
                }
            }
            else { throw "Invalid argument to Connection.type" }

            this.line
                    .attr("d", lineString);

            this.text
                .attr("transform", "translate(" + (x1 + (x2-x1)/2 + textOffset.x) + "," + (y1 + (y2-y1)/2 + textOffset.y) + ")");

            this.textBack
                .attr("transform", "translate(" + (x1 + (x2-x1)/2 - this.text.node().getBBox().width/2 + textOffset.x) + "," + (y1 + (y2-y1)/2 - this.text.node().getBBox().height/2 + textOffset.y) + ")"); 

            return this;
        };


        this.node1 = node1;
        this.node2 = node2;

        var dims1 = this.node1.node.node().getBBox();
        var dims2 = this.node2.node.node().getBBox();

        var tran1 = getTranslation(node1.node.attr("transform"));
        var tran2 = getTranslation(node2.node.attr("transform"));

        var diffs = {
            right  : (tran2.x) - (tran1.x + dims1.width),
            left   : (tran1.x) - (tran2.x + dims2.width),
            top    : (tran1.y) - (tran2.y + dims2.height),
            bottom : (tran2.y) - (tran1.y + dims1.height)
        };

        var x1, y1, x2, y2;
        if (Math.max(diffs.right, diffs.left, diffs.top, diffs.bottom) === diffs.right) {
            x1 = tran1.x + dims1.width;
            y1 = tran1.y + dims1.height / 2;
            x2 = tran2.x;
            y2 = tran2.y + dims2.height / 2;

            this.edge1 = "right";
            this.edge2 = "left";
        }
        else if (Math.max(diffs.right, diffs.left, diffs.top, diffs.bottom) === diffs.left) {
            x1 = tran1.x;
            y1 = tran1.y + dims1.height / 2;
            x2 = tran2.x + dims2.width;
            y2 = tran2.y + dims1.height / 2;  

            this.edge1 = "left";
            this.edge2 = "right";  
        }
        else if (Math.max(diffs.right, diffs.left, diffs.top, diffs.bottom) === diffs.top) {
            x1 = tran1.x + dims1.width / 2;
            y1 = tran1.y;
            x2 = tran2.x + dims2.width / 2;
            y2 = tran2.y + dims2.height;   

            this.edge1 = "top";
            this.edge2 = "bottom";
        }
        else {
            x1 = tran1.x + dims1.width / 2;
            y1 = tran1.y + dims1.height;
            x2 = tran2.x + dims2.width / 2;
            y2 = tran2.y;   

            this.edge1 = "bottom";
            this.edge2 = "top";
        }

        this.conn = chart.append("g")
            .attr("class", "flowchart-connection");

        this.conn.append("svg:defs").append("svg:marker")
            .attr("id", "arrowhead-end")
            .attr("refX", 6)
            .attr("refY", 3)
            .attr("markerWidth", 30)
            .attr("markerHeight", 30)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 6 3 0 6 1 3")
            .style("fill", "black");

        this.conn.append("svg:defs").append("svg:marker")
            .attr("id", "arrowhead-start")
            .attr("refX", 0)
            .attr("refY", 3)
            .attr("markerWidth", 30)
            .attr("markerHeight", 30)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 6 0 0 3 6 6 5 3")
            .style("fill", "black");

        this.line = this.conn.append("path")
            .attr("class", "flowchart-conn-line")
            .attr("stroke-width", 2)
            .attr("stroke", "black")
            .attr("fill", "none");

        this.text = this.conn.append("text")
            .attr("class", "flowchart-conn-text")
            .text(t)
            .style("text-anchor","middle")
            .style("dominant-baseline", "middle");

        this.textBack = this.conn.insert("rect","text")
            .attr("width", this.text.node().getBBox().width)
            .attr("height", this.text.node().getBBox().height)
            .style("fill", "white")
            .style("stroke", "white")
            .style("stroke-width", 10);

        this.edges(this.edge1, this.edge2);
        this.dir("forward");

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

















