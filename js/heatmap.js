/*
 * Write your heatmap widget in this file!
 *
 * The widget should support AT LEAST these options:
 *
 * @ lowColor  : the color for lowest values
 * @ highColor : the color for highest values
 * @ dayClass  : the CSS class for day elements
 * @ monthClass: the CSS class for month title elements
 * @ year      : the year to display
 * @ width     : widget width
 * @ height    : widget height
 * @ cellSize  : the size of a single day element
 * @ container : the element to render to
 * @ data      : the data to render
 *
 * The widget should provide AT LEAST the following API:
 *
 * @ A constructor that will render the widget when it's called. It must work when provided any number of the options above (the options that are not provided, will fall back on defaults.)
 * @ A "refresh" function that can also be called with any number of the options above and will re-render the widget accordingly
 *
 * Note:
 * - Rendering the widget must work even if there is no data provided
 * - All options except "data" must have default fallback options
 * - The widget must be a closed object so that several heatmaps can be generated on one page without affecting each-other
 * - You MAY NOT use any existing heatmap implementation
 * */

/**
 * Constructs and dispays a heatmap for data. Needs {@link http://momentjs.com|Moment.js}
 *
 * @param data
 * @param options
 * @constructor
 *
 * @author Evsegneev Pavel
 */
function Heatmap(data, options) {
    "use strict";
    this.prepared = [];
    this.firstTime = true; //Needs to test right refreshing.
    this.options = {};

    this.min = 0;
    this.max = 0;

    this.data = [];

    var self = this;

    this.options = {
        lowColor: options.lowColor || "#00ff00",
        highColor: options.highColor || "#ff0000",
        dayClass: options.dayClass || "day",
        daysBorderColor: options.daysBorderColor || "lightgrey",
        monthClass: options.monthClass || "month",
        monthCaptionClass: options.monthCaptionClass || "month-caption",
        year: options.year || 2013,
        width: options.width || "100%",
        height: options.height || "",
        cellSize: options.cellSize || 15,
        wrapperClass: options.wrapperClass || "heatmap-wrapper"
    };

    self.options.container = (options && options.container) ?
        options.container :
        'body';

    this.setData = function (data) {
        self.data = data;
    };

    this.setData(data);

    this.prepare = function () {
        var days = [];
        var current = moment(self.options.year + '-01-01T00:00:00').add('days', -1);
        for (var i = 0; i < (self.options.year % 4 === 0 ? 366 : 365); i++) {
            current = moment(current).add('days', 1);
            days.push({date: current});
        }

        if (self.data) {
            var floatData = {};
            for (i = 0; i < self.data.length; i++) {
                floatData[self.data[i].date.format('DD-MM-YYYY')] = self.data[i].value;
            }

            for (i = 0; i < (self.options.year % 4 === 0 ? 366 : 365); i++) {
                var index = floatData[days[i].date.format("DD-MM-YYYY")];
                days[i].value = index !== -1 ? floatData[days[i].date.format("DD-MM-YYYY")] : undefined;
            }

            var parseForMax = function (arr) {
                return arr.value;
            };

            var minmax = self.data.map(parseForMax);

            self.min = Math.min.apply(Math, minmax);
            self.max = Math.max.apply(Math, minmax);
        }


        self.prepared = [];
        days.map(function (dt) {
            var date = new Date();
            date.setTime(dt.date);
            if (typeof(self.prepared[ date.getMonth() ]) === 'undefined') {
                self.prepared[ date.getMonth() ] = [];
            }
            self.prepared[ date.getMonth() ].push(dt);
        });

    };

    this.refresh = function (options) {

        if(options && options.data) {
            this.setData(options.data);
        }

        if (options && options.container) {
            self.options.
                container = options.container;
        }

        d3.select("." + self.options.wrapperClass).remove();

        if (options) {
            for (var option in options) {
                if (options.hasOwnProperty(option)) {
                    if (option !== "data") {
                        self.options[option] = options[option];
                    }
                }
            }
        }

        self.prepare();

        var color = d3.scale.linear()
            .domain([self.min, self.max])
            .interpolate(d3.interpolateLab)
            .range([self.options.lowColor, self.options.highColor]);

        var main = d3.select(self.options.container);

        self.firstTime = false;
        main = main.append("div")
            .attr("class", self.options.wrapperClass)
            .style({
                width: self.options.width,
                height: self.options.height
            });

        main = main.style("overflow-y", function () {
            return self.options.height !== "" ? "auto" : "";
        })
            .selectAll("div")
            .data(self.prepared)
            .enter()
            .append("div")
            .style({
                width: ( (self.options.cellSize + 2) * 7) + 1 + "px",
                height: ( (self.options.cellSize + 2) * 7) + 1 + "px",
                float: "left",
                "margin-left": "15px",
                border: "0px solid black"
            })
            .attr("class", "month");

        main.append("div")
            .attr("class", self.options.monthCaptionClass)
            .text(function (d) {
                return d[0].date.format('MMMM');
            });

        main.append("div")
            .style({
                float: "left",
                height: self.options.cellSize + "px",
                border: "0px",
                width: function (d) {
                    return ((d[0].date.format('d')) * (self.options.cellSize + 2)) + "px";
                }
            })
            .attr("class", "heatmap-align");

        main.selectAll("div." + self.options.dayClass)
            .data(function (d) {
                return d;
            })
            .enter()
            .append("div")
            .attr({
                class: self.options.dayClass,
                title: function (d) {
                    return d.date.format("ddd MMM D YYYY:") + " " +
                        (( typeof(d.value) === "undefined") ? "unknown" : d.value);
                }
            })
            .style({
                width: self.options.cellSize + "px",
                height: self.options.cellSize + "px",
                float: "left",
                border: "1px solid",
                'border-color': self.options.daysBorderColor,
                "background-color": function (d) {
                    return (d.value) ? color(d.value) : "white";
                }
            });
    };


    /**
     * I tried to create a rigth realisation of refresh via updating data
     * but encountered an unsolvable by me problem:
     *
     * title: function (d) { //I have no idea why d here is old data.
     *
     * I didn't want to ask stackoverflow community, because this is a test task.
     *
     * If you'll give me feedback on this function, I'll be very thankful.
     *
     * Usage:
     * create a heatmap for 2012 year
     * uncomment function below and call it from app.js:
     * t1.rr({ year: 2013 , width: "700px", cellSize: 25});
     */

    /*this.rr = function(options) {
     options && options.data ?
     this.setData(data) : false;

     var containerChanged = options && options.container && (self.options.container != options.container);

     if (containerChanged) {
     console.log(self.options.container);
     console.log(options.container);
     self.options.
     container = options.container || 'body'

     d3.select("." + self.options.wrapperClass).remove();
     }

     if (options) {
     for (option in options) {
     if (options.hasOwnProperty(option)) {
     if (option != 'container' && option != 'wrapperClass')
     self.options[option] = options[option];
     console.log(option, options[option]);
     }
     }
     }

     self.prepare();

     var color = d3.scale.quantize()
     .domain([self.min, self.max])
     .range(d3.range(255).map(function (d) {
     console.log(self.min);
     console.log(self.max);
     var r = d;
     var g = 255 - d;
     var b = 30;

     return 'rgb(' + r + ',' + g + ',' + b + ")";

     }));

     var main = d3.select(self.options.container);
     //main.data(self.data);

     if (containerChanged) {
     main = main.append("div")
     .attr("class", self.options.wrapperClass)
     .style({
     width: self.options.width,
     height: self.options.height
     })

     } else {
     main = main.select("." + self.options.wrapperClass)
     .style({
     width: self.options.width,
     height: self.options.height
     })

     }
     console.log(self.prepared);
     //var dd = self.data;

     main = main
     .data(self.prepared)

     .selectAll('.'+self.options.monthClass)
     .style({
     width: ( (self.options.cellSize + 2) * 7) + 1 + "px",
     height: ( (self.options.cellSize + 2) * 7) + 1 + "px",
     float: "left",
     "margin-left": "15px",
     border: "0px solid black"
     })

     main.select('.heatmap-align')
     .data(function(d){return d})
     .style({
     float: "left",
     height: self.options.cellSize + "px",
     border: "0px",
     width: function (d) {
     //console.log(d)
     return ((d.date.format('d')) * (self.options.cellSize + 2)) + "px";
     }
     })

     main = main.data(function(d){console.log(d); return d;})
     .selectAll('.'+self.options.dayClass)
     .text(1)
     .attr({
     title: function (d) { //I have no idea why d here is old data.
     console.log('here:',d.date.format("ddd MMM D YYYY:"));
     return d.date.format("ddd MMM D YYYY:") + " " + ((d.value === -1) ? 0 : d.value);
     }
     })
     .style({
     width: self.options.cellSize + "px",
     height: self.options.cellSize + "px",
     float: "left",
     border: "1px solid lightgray",
     "background-color": function (d) {
     if (d.value) {
     return color(d.value)
     }
     else return "white"
     }
     })


     }*/

    this.refresh();

}

