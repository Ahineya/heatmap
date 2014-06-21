(function () {

    // Register utils namespace
    window.utils = window.utils || {};

    $(function () {

        // Load widget data
        $.get('data/sample.json').done(function (data) {

            /*
                Don't forget to run this app within a web server (such as IIS) otherwise, sample.json won't load.
                This project already comes with a web.config file that has the JSON MIME type.
                If you use a different web server, you might need to add the ".json" extension to your IIS MIME types yourself for this to work.
                It's OK to change the sample.json file to a different format but it must be loaded via an AJAX request, NOT attached as a .js file.
                You'll know you got it right when the line below works!
             */
            //console.log(data);

            function parse(arr) {
                return {
                    date: moment(arr[0].data),
                    value: typeof(arr[1]) !== "undefined" ? arr[1].data || -1 : -1
                };
            }

            data = data.values.map(parse);

            var t = new Heatmap(data,{
                lowColor: '#b8b3f2',
                highColor: '#0b1189',
                container: '#test',
                dayClass: 'day',
                year: 2013,
                cellSize: 20,
                monthCaptionClass: 'mcap',
                width: "80%",
                height: "320px"
            });

            //t.refresh({ container: 'body',year: 2013 , width: "700px", cellSize: 25});

            var t1 = new Heatmap(null,{
                container: '#test2',
                wrapperClass: "test-wrapper",
                dayClass: 'day',
                year: 2012,
                cellSize: 11,
                monthCaptionClass: 'mcap',
                width: "100%",
                height: "200px"
            });

            t1.refresh({ year: 2013, data: data});

            $('.js-first-heatmap-update').on("click", function() {
                t.refresh({
                    lowColor: '#' + $.jPicker.List[0].color.active.val('hex'),
                    highColor: '#' + $.jPicker.List[1].color.active.val('hex')
                });
            });
            $('.js-second-heatmap-update').on("click", function() {
                t1.refresh({
                    lowColor: '#' + $.jPicker.List[0].color.active.val('hex'),
                    highColor: '#' + $.jPicker.List[1].color.active.val('hex')
                });
            });

            $('#start-color').jPicker({
                    window:
                    {
                        expandable: true,
                        position: {
                            y: 0
                        }
                    },
                    color:
                    {
                        active: new $.jPicker.Color({ hex: '00ff00' })
                    }
             });
            $('#end-color').jPicker({
                    window: {
                        expandable: true,
                        position: {
                            y: 0
                        }
                    },
                    color: {
                        active: new $.jPicker.Color({ hex: 'ff0000' })
                    }
             });

            //t1.rr({ year: 2013 , width: "700px", cellSize: 25});

        });
    });
})();