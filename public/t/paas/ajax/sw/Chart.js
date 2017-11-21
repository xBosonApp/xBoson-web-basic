var nytg = nytg || {};

nytg.Chart = function () {
    return {
        $: jQuery,
        //defaults
        width: 1000,
        height: 2000,
        groupPadding: 10,
        totalValue: 37000,//最大值
        deficitValue: 9010,
        // CONST
        MANDATORY: "Mandatory",
        DISCRETIONARY: "Discretionary",
        NET_INTEREST: "Net interest",

        //will be calculated later
        boundingRadius: null,
        maxRadius: null,
        centerX: null,
        centerY: null,
        scatterPlotY: null,

        //d3 settings
        defaultGravity: 0.1,
        defaultCharge: function (d) {
            if (d.value < 0) {
                return 0;
            } else {
                return -Math.pow(d.radius, 2.0) / 8;
            }
        },
        links: [],
        nodes: [],
        positiveNodes: [],
        force: {},
        svg: {},
        circle: {},
        gravity: null,
        charge: null,
        changeTickValues: [-1, -0.5, -0.25, 0.25, 0.5, 1],
        //圆取色范围定义
        categorizeChange: function (c) {
            if (isNaN(c)) {
                return 0;
            } else if (c < -0.5) {
                return -2;
            } else if (c < 0) {
                return -1;
            } else if (c < 0.5) {
                return 1;
//            } else if (c <= 0.001) {
//                return 0;
            } else if (c <= 1) {
                return 2;
            } else if (c <= 2) {
                return 3;
            } else { return 4; }
        },
        //圆填充颜色定义
        fillColor: d3.scale.ordinal().domain([-2, -1, 0, 1, 2, 3,4]).range(["#ee9586", "#e4b7b2","#AAA",  "#d9e7ca", "#c1cdae", "#99ae7e","#749a57"]),
        //圆边框颜色定义
        strokeColor: d3.scale.ordinal().domain([-2, -1, 0, 1, 2, 3,4]).range([ "#e67761", "#d9a097", "#999", "#9ba990", "#8aa775", "#719656","#507335"]),
        getFillColor: null,
        getStrokeColor: null,
        pFormat: d3.format("+.1%"),
        pctFormat: function () { return false },
        tickChangeFormat: d3.format("+%"),
        simpleFormat: d3.format(","),
        simpleDecimal: d3.format(",.2f"),

        bigFormat: function (n) { return "￥" +nytg.formatNumber(n,2) },
        nameFormat: function (n) { return n },
        discretionFormat: function (d) {
            if (d == 'Discretionary' || d == 'Mandatory') {
                return d + " spending"
            } else { return d }
        },

        rScale: null,
        radiusScale: null,
        changeScale: d3.scale.linear().domain([-0.28, 0.28]).range([620, 180]).clamp(true),
        sizeScale: d3.scale.linear().domain([0, 110]).range([0, 1]),
        groupScale: {},

        //data settings
        currentYearDataColumn: 'budget',
        data: nytg.budget_array_data,
        categoryPositionLookup: {},
        categoriesList: [],

        // 
        // 
        // 
        init: function () {
            var that = this;
            that.rScale = d3.scale.pow().exponent(0.5).domain([0, that.totalValue]).range([1, 150]),
            //d3.scale.sqrt().domain([0, that.totalValue]).range([1, 200]);
            this.scatterPlotY = this.changeScale(0);

            this.pctFormat = function (p) {
                if (p === Infinity || p === -Infinity) {
                    return "N.A."
                } else {
                    return that.pFormat(p)
                }

            }

            this.radiusScale = function (n) { return that.rScale(Math.abs(n)); };
            //圆取色
            this.getStrokeColor = function (d) {
                 if (d.isNegative) {
                   return "#333"
                 }
                return that.strokeColor(d.changeCategory);
            };
            this.getFillColor = function (d) {
                if (d.isNegative) {
                    return "#fff"
                }
                return that.fillColor(d.changeCategory);
            };

            this.boundingRadius = this.radiusScale(this.totalValue);
            this.centerX = this.width / 2;
            this.centerY = 300;

            nytg.category_data.sort(function (a, b) {
                return b['total'] - a['total'];
            });

            //calculates positions of the category clumps
            //it is probably overly complicated
            var columns = [5, 5, 5, 5]
            //rowPadding = [0, 0, 0, 0, 0],
            rowPosition = [220, 390, 560, 730, 1000],
          rowOffsets = [130, 80, 60, 45, 48]
            currentX = 0,
          currentY = 0;
            for (var i = 0; i < nytg.category_data.length; i++) {
                var t = 0,
            w,
            numInRow = -1,
            positionInRow = -1,
            currentRow = -1,
            cat = nytg.category_data[i]['label'];
                // calc num in this row
                for (var j = 0; j < columns.length; j++) {
                    if (i < (t + columns[j])) {
                        numInRow = columns[j];
                        positionInRow = i - t;
                        currentRow = j;
                        break;
                    };
                    t += columns[j];
                };
                if (numInRow === -1) {
                    numInRow = nytg.category_data.length - d3.sum(columns);
                    currentRow = columns.length;
                    positionInRow = i - d3.sum(columns)
                };
                nytg.category_data[i].row = currentRow;
                nytg.category_data[i].column = positionInRow;
                w = (this.width-rowOffsets[1]-rowOffsets[3]) / numInRow
                w = w;
                currentX = w * positionInRow + w / 2;
                currentY = rowPosition[currentRow];
                this.categoriesList.push(cat);
                this.categoryPositionLookup[cat] = {
                    x: currentX,
                    y: currentY,
                    w: w,
                    offsetY: rowOffsets[currentRow],
                    numInRow: numInRow,
                    positionInRow: positionInRow,
                    currentRow:currentRow
                }
            };

            //
            this.groupScale = d3.scale.ordinal().domain(this.categoriesList).rangePoints([0, 1]);

            // Builds the nodes data array from the original data
            for (var i = 0; i < this.data.length; i++) {
                var n = this.data[i];
                var out = {
                    sid: n['id'],
                    radius: this.radiusScale(n[this.currentYearDataColumn]),
                    group: n['department'],
                    change: n['change']/100,
                    changeCategory: this.categorizeChange(n['change']/100),
                    value: n[this.currentYearDataColumn],
                    name: n['name'],
                    discretion: n['discretion'],
                    isNegative: (n[this.currentYearDataColumn] < 0),
                    positions: n.positions,
                    x: Math.random() * 500 + 344,
                    y: Math.random() * 500
                }
                //起始坐标设置
                if (n.positions&&n.positions.total) {
                    out.x = n.positions.total.x + (n.positions.total.x - (that.width / 2)) * 0.5;
                    out.y = n.positions.total.y + (n.positions.total.y - (150)) * 0.5;
                };
//                if ((n[this.currentYearDataColumn] > 0) !== (n[this.previousYearDataColumn] > 0)) {
//                    out.change = "N.A.";
//                    out.changeCategory = 0;
//                };
                this.nodes.push(out)
            };

            this.nodes.sort(function (a, b) {
                return Math.abs(b.value) - Math.abs(a.value);
            });

            for (var i = 0; i < this.nodes.length; i++) {
                if (!this.nodes[i].isNegative) {
                    this.positiveNodes.push(this.nodes[i])
                }
            };

            this.svg = d3.select("#nytg-chartCanvas").append("svg:svg")
        .attr("width", this.width);

            for (var i = 0; i < this.changeTickValues.length; i++) {
                d3.select("#nytg-discretionaryOverlay").append("div")
            .html("<p>" + this.tickChangeFormat(this.changeTickValues[i]) + "</p>")
            //-----------Changs 显示设置
            .style("top", this.changeScale(this.changeTickValues[i]/4) + 'px')
            .classed('nytg-discretionaryTick', true)
            .classed('nytg-discretionaryZeroTick', (this.changeTickValues[i] === 0))
            };
            d3.select("#nytg-discretionaryOverlay").append("div")
          .html("<p></p>")
          .style("top", this.changeScale(0) + 'px')
          .classed('nytg-discretionaryTick', true)
          .classed('nytg-discretionaryZeroTick', true)
            d3.select("#nytg-discretionaryOverlay").append("div")
          .html("<p>+104% 以上</p>")
          .style("top", this.changeScale(100) + 'px')
          .classed('nytg-discretionaryTickLabel', true)
            d3.select("#nytg-discretionaryOverlay").append("div")
          .html("<p>&minus;104% 以下</p>")
          .style("top", this.changeScale(-100) + 'px')
          .classed('nytg-discretionaryTickLabel', true)



            // total circle
            // this.svg.append("circle")
            //   .attr('r', this.radiusScale(this.totalValue))
            //   .style("stroke-width",1)
            //   .style('stroke',"#AAA")
            //   .style('fill','none')
            //   .attr('cx', this.width/2)
            //   .attr('cy', this.height/2);

            // deficit circle
          d3.selectAll(".nytg-scaleKeyCircle").remove();

            
            d3.select("#nytg-scaleKey").append("circle")
        .attr('r', 60)
        .attr('class', "nytg-scaleKeyCircle")
        .attr('cx', 65)
        .attr('cy', 70);
            d3.select("#nytg-scaleKey").append("circle")
        .attr('r', 30)
        .attr('class', "nytg-scaleKeyCircle")
        .attr('cx', 65)
        .attr('cy', 100);
            d3.select("#nytg-scaleKey").append("circle")
        .attr('r', 15)
        .attr('class', "nytg-scaleKeyCircle")
        .attr('cx', 65)
        .attr('cy', 115);


            var departmentOverlay = $("#nytg-departmentOverlay")
            departmentOverlay.html("");
            for (var i = 0; i < nytg.category_data.length; i++) {
                var cat = nytg.category_data[i]['label']
                var catLabel = nytg.category_data[i]['short_label']
                var catTot = this.bigFormat(nytg.category_data[i]['total'])
                var catWidth = this.categoryPositionLookup[cat].w
                var catYOffset = this.categoryPositionLookup[cat].offsetY;
                var catNode;
                if (catLabel === "Other") {//" + nytg.category_data[i]['row'] + "
                    catNode = $("<div class='nytg-departmentAnnotation nytg-row0'><p class='department'>" + catLabel + "</p></div>")

                } else {
                    catNode = $("<div class='nytg-departmentAnnotation nytg-row0'><p class='total'>" + catTot + "</p><p class='department'>" + catLabel + "</p></div>")

                }
                catNode.css({ 'left': this.categoryPositionLookup[cat].x - catWidth / 2, 'top': this.categoryPositionLookup[cat].y - catYOffset, 'width': catWidth })
                departmentOverlay.append(catNode)

            };

            // This is the every circle
            this.circle = this.svg.selectAll("circle")
          .data(this.nodes, function (d) { return d.sid; });

            this.circle.enter().append("svg:circle")
        .attr("r", function (d) { return 0; })
        .style("fill", function (d) { return that.getFillColor(d); })
        .style("stroke-width", 1)
        .attr('id', function (d) { return 'nytg-circle' + d.sid })
        .style("stroke", function (d) { return that.getStrokeColor(d); })
        .on("mouseover", function (d, i) {
            var el = d3.select(this)
            var xpos = Number(el.attr('cx'))
            var ypos = (el.attr('cy') - d.radius - 10)
            el.style("stroke", "#000").style("stroke-width", 3);
            d3.select("#nytg-tooltip").style('top', ypos + "px").style('left', xpos + "px").style('display', 'block')
            .classed('nytg-plus', (d.changeCategory > 0))
            .classed('nytg-minus', (d.changeCategory < 0));
            d3.select("#nytg-tooltip .nytg-name").html(that.nameFormat(d.name))

            d3.select("#nytg-tooltip .nytg-discretion").text(that.discretionFormat(d.discretion))
            d3.select("#nytg-tooltip .nytg-department").text(d.group)
            d3.select("#nytg-tooltip .nytg-value").html(that.bigFormat(d.value))

            var pctchngout = that.pctFormat(d.change)
            if (d.change == "N.A.") {
                pctchngout = "N.A."
            };
            d3.select("#nytg-tooltip .nytg-change").html(pctchngout)
        })
        .on("mouseout", function (d, i) {
            d3.select(this)
          .style("stroke-width", 1)
          .style("stroke", function (d) { return that.getStrokeColor(d); })
            d3.select("#nytg-tooltip").style('display', 'none')
        });


            this.circle.transition().duration(2000).attr("r", function (d) { return d.radius })

        },




        // 
        // 
        // 
        getCirclePositions: function () {
            var that = this
            var circlePositions = {};
            this.circle.each(function (d) {

                circlePositions[d.sid] = {
                    x: Math.round(d.x),
                    y: Math.round(d.y)
                }


            })
            return JSON.stringify(circlePositions)
        },



        // 
        // 
        // 
        start: function () {
            var that = this;

            this.force = d3.layout.force()
        .nodes(this.nodes)
        .size([this.width, this.height])

        },




        // 
        // 
        // 
        totalLayout: function () {
            var that = this;
            this.force
        .gravity(-0.01)
        .charge(that.defaultCharge)
        .friction(0.9)
        .on("tick", function (e) {
            that.circle
            .each(that.totalSort(e.alpha))
            .each(that.buoyancy(e.alpha))
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
        })
        .start();

        },

        // 
        // 
        // 
        mandatoryLayout: function () {
            var that = this;
            this.force
        .gravity(0)
        .friction(0.9)
        .charge(that.defaultCharge)
        .on("tick", function (e) {
            that.circle
            .each(that.mandatorySort(e.alpha))
            .each(that.buoyancy(e.alpha))
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
        })
        .start();

        },

        // 
        // 
        // 
        discretionaryLayout: function () {
            var that = this;
            this.force
        .gravity(0)
        .charge(0)
        .friction(0.2)
        .on("tick", function (e) {
            that.circle
            .each(that.discretionarySort(e.alpha))
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
        })
        .start();
        },


        // 
        // 
        // 
        departmentLayout: function () {

            var that = this;
            this.force
        .gravity(-0.01)
        .charge(that.defaultCharge)
        .friction(0.9)
        .on("tick", function (e) {
            that.circle
            .each(that.departmentSort(e.alpha))
            .each(that.buoyancy(e.alpha))
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
        })
        .start();
        },
        // 
        // 
        // 
        comparisonLayout: function () {
            var that = this;
            this.force
        .gravity(0)
        .charge(that.defaultCharge)
        .friction(0.9)
        .on("tick", function (e) {
            that.circle
            .each(that.comparisonSort(e.alpha))
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
        })
        .start();

        },


        // ----------------------------------------------------------------------------------------
        // FORCES
        // ----------------------------------------------------------------------------------------


        // 
        // 
        // 
        totalSort: function (alpha) {
            var that = this;
            return function (d) {
                var targetY = that.centerY;
                var targetX = that.width / 2;


                if (d.isNegative) {
                    if (d.changeCategory > 0) {
                        d.x = -200
                    } else {
                        d.x = 1100
                    }
                }
                d.y = d.y + (targetY - d.y) * (that.defaultGravity + 0.02) * alpha
                d.x = d.x + (targetX - d.x) * (that.defaultGravity + 0.02) * alpha

            };
        },

        // 
        // 
        // 
        buoyancy: function (alpha) {
            var that = this;
            return function (d) {
                var targetY = that.centerY - (d.changeCategory / 3) * that.boundingRadius
                d.y = d.y + (targetY - d.y) * (that.defaultGravity) * alpha * alpha * alpha * 100



            };
        },



        // 
        // 
        // 
        mandatorySort: function (alpha) {
            var that = this;
            return function (d) {
                var targetY = that.centerY;
                var targetX = 0;

                if (d.isNegative) {
                    if (d.changeCategory > 0) {
                        d.x = -200
                    } else {
                        d.x = 1100
                    }
                    return;
                }

                //俩页分开
                if (d.discretion === that.DISCRETIONARY) {
                    targetX = 550
                } else if ((d.discretion === that.MANDATORY) || (d.discretion === that.NET_INTEREST)) {
                    targetX = 400
                } else {
                    targetX = 1500
                };




                d.y = d.y + (targetY - d.y) * (that.defaultGravity) * alpha * 1.1
                d.x = d.x + (targetX - d.x) * (that.defaultGravity) * alpha * 1.1
            };
        },


        // 
        // 
        // 
        discretionarySort: function (alpha) {
            var that = this;
            return function (d) {
                var targetY = that.height / 2;
                var targetX = 0;

                if (d.isNegative) {
                    if (d.changeCategory > 0) {
                        d.x = -200
                    } else {
                        d.x = 1100
                    }
                    return;
                }
                //---------------Changs 显示线图
                targetY = that.changeScale(d.change/4);
                targetX = 100 + that.groupScale(d.group) * (that.width - 180);
                if (isNaN(targetY)) { targetY = that.centerY };
                if (targetY > (that.height - 80)) { targetY = that.height - 80 };
                if (targetY < 80) { targetY = 80 };

                d.y = d.y + (targetY - d.y) * Math.sin(Math.PI * (1 - alpha * 10)) * 0.2
                d.x = d.x + (targetX - d.x) * Math.sin(Math.PI * (1 - alpha * 10)) * 0.1
            };
        },


        // 
        // 
        // 
        departmentSort: function (alpha) {
            var that = this;
            return function (d, i) {
                var targetY = -100;
                var targetX = -100;
                var s = that.categoryPositionLookup[d.group];
                if (s) {
                	 targetY = s.y + 160/2-24;
                    var w = 0
                    switch (s.positionInRow) {
                        case 0:
                            w = s.w / 2;
                            break;
                        case 1:
                            w = s.w / 4;
                            break;
                        case 3:
                            w = 0;
                            break;
                        case 4:
                            w = -s.w / 4;
                            break;
                        case 5:
                            w = 0;
                            break;
                    }
                   
                    targetX = s.x+w;
                } else {
                    if (d.positions&&d.positions.department) {
                        targetX = d.positions.department.x;
                        targetY = d.positions.department.y;
                    };
                };
                d.y = d.y + (targetY - d.y) * (that.defaultGravity + 0.02) * alpha
                d.x = d.x + (targetX - d.x) * (that.defaultGravity + 0.02) * alpha

            };
        },




        // 
        // 
        // 
        staticDepartment: function (alpha) {
            var that = this;
            return function (d) {
                var targetY = 0;
                var targetX = 0;

                if (d.positions.department) {
                    targetX = d.positions.department.x;
                    targetY = d.positions.department.y;
                };

                d.y += (targetY - d.y) * Math.sin(Math.PI * (1 - alpha * 10)) * 0.6
                d.x += (targetX - d.x) * Math.sin(Math.PI * (1 - alpha * 10)) * 0.4
            };
        },

        // 
        // 
        // 
        comparisonSort: function (alpha) {
            var that = this;
            return function (d) {
                var targetY = that.height / 2;
                var targetX = 650;


                d.y = d.y + (targetY - d.y) * (that.defaultGravity) * alpha
                d.x = d.x + (targetX - d.x) * (that.defaultGravity) * alpha
            };
        },



        // 
        // 
        // 
        collide: function (alpha) {
            var that = this;
            var padding = 6;
            var quadtree = d3.geom.quadtree(this.nodes);
            return function (d) {
                var r = d.radius + that.maxRadius + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
                quadtree.visit(function (quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d) && (d.group === quad.point.group)) {
                        var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + quad.point.radius;
                        if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l;
                            d.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }
                    return x1 > nx2
              || x2 < nx1
              || y1 > ny2
              || y2 < ny1;
                });
            };

        }

    }
};
