function showLineGraph(sql) {
    try {
        //alert(graph_options.sql_command);
        $('#shadow').show();
        $('#line #container, table.details thead, table.details tbody').html('');
        try{
         if(!sql)
            sql = createFilterTable('filters-list', info.graph_filter, 
                            info.graph_filter_items, graph_id, graph_options.sql_command, true);
         else
            sql = createFilterTable('filters-list', info.graph_filter, 
                            info.graph_filter_items, graph_id, graph_options.sql_command, false);
         
        } catch(e){
            //alert('14 = '+e);
        }
        //---------------------------
        var data;
        var xAxis = {
            categories: []
        };
        var series = [];
        var j = 0;
        //---------------------------



        //------------------------------------------------------------------
        //$('div.ui-loader').show();
        
        $.ajax({
            async: true,
            type: 'POST',
            url: InfoURL,
            timeout: 20000,
            error: function() {
                $('#shadow').hide();
               	notif.alert('Error!', null, ' ');
               	noData(false);
            },
            data: {sql: sql,//graph_options.sql_command,
                info: JSON.stringify(info.info),
                    db: graph_options.table_name}
        }).success(function(msg) {
            //$('div.ui-loader').hide();

            if (msg.length > 2) {
                try {
                    data = JSON.parse(msg);
                    for (var i in data) {
                        if (i == 'x') {
                            xAxis.categories = data[i];
                        } else {
                            series[j] = {
                                name: i,
                                data: data[i]
                            };



                                    j++;
                        }
                    }
                
                    buildLineGraph(xAxis, series);
                } finally {
                    $('#shadow').hide();
                }
            } else {
                $('#shadow').hide();
                noData(true);
            }
        });
    } catch (e) {
        //alert(e);
        $('#shadow').hide();
        noData(true);
    }

    //------------------------------------------------------------------

}

function buildLineGraph(xAxis, series) {

    var max_w = innerWidth;//$(document).width();
    var max_h = innerHeight;//$(document).height();
    //alert(max_w + ' - ' + max_h);
    $('#line #container').css('width', max_w * 0.9);
    if (max_w < max_h) {
        $('#line #container').css('height', max_h * 0.75);
    } else {
        $('#line #container').css('height', max_w * 1.2);
    }

    //----------------------------------------------------------
    options.xAxis.categories = xAxis.categories;
    /*
    options.tooltip = {
        valueSuffix: ''
    };
    */
    

    //----------------------------------------------------------

	buildLineDetails(xAxis, series);
    //var kk = readObject(options);
    
    for (var j  in series){
    	for (var val in series[j].data){
        	series[j].data[val] = parseFloat(series[j].data[val].toString().replace(/,/g, ''));
    	}
    }
    
    options.series = series;
    options.chart.type = 'line';
    
    $('#line #container').highcharts(options);
    $('#line #info').css('color', 'white');
    //$('#line #info').html(kk);

    
}

function readObject(obj, j) {
    var res = '',
            tab = '';
    j = j ? j : 0;
    for (var k = 0; k < j; k++) {
        tab += '&nbsp';
    }

    if(typeof obj == 'object'){
        for(var i in obj){
            res += tab + i +' = ' + obj[i] + ' type:' + typeof obj[i] + '<br>';
            if(typeof obj[i] == 'object'){
                res += tab + '{<br>';
                res += readObject(obj[i], ++j);
                res += tab + '}<br>';
            }
        }
    }
    return res;
}

function buildLineDetails(xAxis, series) {
    var thead = '<tr class="ui-bar-d"><th>'+graph_options.xAxis_text+'</th>';
    var tbody = '';
    var data = [];
    for (var i in series) {
        thead += '<th>' + series[i].name + '</th>';
        for (var j in series[i].data) {
            i = parseInt(i);
            if (i == 0) {
                data[j] = [];
            }
            data[j][0] = xAxis.categories[j];
            data[j][i + 1] = series[i].data[j];
        }
    }
    thead += '</tr>';

    for (var i in data) {
        tbody += '<tr>';
        for (var j in data[i]) {
            tbody += '<td>';
            if (j == 0) {
                tbody += '<b>' + data[i][j] + '</b>';
            } else {
                tbody += data[i][j];
            }
            tbody += '</td>';
        }
        tbody += '</tr>';
    }

    $('#line-details table.details thead').html(thead);
    $('#line-details table.details tbody').html(tbody);
}

var SlideLineGraph = function(callback) {
    try {
        var vIn = $$$('#' + this.dataset.vin),
                vOut = $$$('section.active'),
                slideType = this.dataset.sd,
                onAnimationEnd = function() {
            vOut.classList.add('hidden');
            vIn.classList.add('active');
            vIn.classList.remove(slideOpts[slideType][0]);
            vOut.classList.remove(slideOpts[slideType][1]);
            vOut.removeEventListener('webkitAnimationEnd', onAnimationEnd, false);
            vOut.removeEventListener('animationend', onAnimationEnd);
        };


        var type = $(this).attr('data-type');
        graph_id = parseInt($(this).attr('data-id'));
        
        graph_options = [];
        try{
            for (var item in info.graph_options) {
                if (info.graph_options[item].graph == graph_id) {
                    graph_options = info.graph_options[item];

                }
            }
        
        for (var item in defaultOptions) {
            var val = graph_options[item];
            if (item === 'colors' && val) {
                val = val.toString();
                console.log(val);
                console.log(typeof val);
                val = val.replace(/\s+/g, '').split(",");
                val = $.grep(val, function(n) {
                    return(n)
                });
                //alert(typeof val);
            } else if (item === 'colors') {
                
                val = new Array(
                                        '#2f7ed8',
                                        '#0d233a',
                                        '#8bbc21',
                                        '#910000',
                                        '#1aadce',
                                        '#492970',
                                        '#f28f43',
                                        '#77a1e5',
                                        '#c42525',
                                        '#a6c96a'
                                        );
                
            } else if (boolNames.indexOf(item) >= 0) {
                val = (parseInt(val) === 1) ? true : false;
            } else if (numNames.indexOf(item) >= 0) {
                val = parseInt(val);
            }
            if ((!val && val !== 0 && val !== '0') || val === undefined) {
                graph_options[item] = defaultOptions[item];
            } else {
                graph_options[item] = (val === '0') ? 0 : val;
            }
        }
        } catch(e){
            //alert('232 = ' + e);
        }
        options = {};
        
            setOptions();
        try{
            options.legend.x = (parseInt(graph_options.legend_x) / 100) * $(document).width();
            options.legend.width = parseInt(graph_options.legend_width);
            //alert('240 = ' + graph_options.sql_command);
        } catch(e){
            //alert('241' + e);
        }

        switch (parseInt(type)) {
            case 1:
                console.log('type = 1');
                graph_type = 1;
                showLineGraph();
                break;
            case 2:
                console.log('type = 2');
                graph_type = 2;
                showBarGraph();
                break;
            case 3:
                console.log('type = 3');
                graph_type = 3;
                showPieGraph();
                break;
            default:
                return;
        }
        




        vOut.addEventListener('webkitAnimationEnd', onAnimationEnd, false);
        vOut.addEventListener('animationend', onAnimationEnd);
        if (callback && typeof(callback) === 'function') {
            callback();
        }
        vOut.classList.remove('active');
        vIn.classList.remove('hidden');
        vIn.classList.add(slideOpts[slideType][0]);
        vOut.classList.add(slideOpts[slideType][1]);
    } catch (e) {
        //alert('272'+e);
    }
};

function setOptions() {
    try {
        options = {};
        if(typeof graph_options.colors == 'object'){
            graph_options.colors = $.map(graph_options.colors, function(value, index){
                return [value];
            });
            graph_options.colors = graph_options.colors.join();
            //alert(graph_options.colors);
         }   
   options = {
       colors: graph_options.colors.replace(/\s+/g, '').split(","),
       title: {
           text: graph_options.title,
           align: graph_options.title_align,
           style: {
               color: graph_options.title_color
           }
       },
       subtitle: {
           text: graph_options.subtitle,
           align: graph_options.title_align,
           style: {
               color: graph_options.title_color
           }
       },
       chart: {
           backgroundColor: graph_options.background_color,
           borderColor: graph_options.border_color,
           borderRadius: parseInt(graph_options.border_radius),
           borderWidth: parseInt(graph_options.border_width),
           marginBottom: parseInt(graph_options.margin_bottom),
           marginLeft: parseInt(graph_options.margin_left),
           marginRight: parseInt(graph_options.margin_right),
           marginTop: parseInt(graph_options.margin_top),
           plotBackgroundColor: graph_options.plot_background_color,
           plotBorderColor: graph_options.plot_border_color,
           plotBorderWidth: parseInt(graph_options.plot_border_width),
           showAxes: graph_options.show_axes == 0 ? false : true,
           spacingBottom: parseInt(graph_options.spacing_bottom),
           spacingLeft: parseInt(graph_options.spacing_left),
           spacingRight: parseInt(graph_options.spacing_right),
           spacingTop: parseInt(graph_options.spacing_top)
       },
       legend: {
           align: graph_options.legend_align,
           backgroundColor: graph_options.legend_background_color,
           borderColor: graph_options.legend_border_color,
           borderRadius: parseInt(graph_options.legend_border_radius),
           borderWidth: parseInt(graph_options.legend_border_width),
           enabled: graph_options.legend_enabled == 0 ? false : true,
           floating: graph_options.legend_floating == 0 ? false : true,
           itemDistance: parseInt(graph_options.legend_item_distance),
           itemMarginBottom: parseInt(graph_options.legend_item_margin_bottom),
           itemMarginTop: parseInt(graph_options.legend_item_margin_top),
           layout: graph_options.legend_layout,
           lineHeight: parseInt(graph_options.legend_line_height),
           margin: parseInt(graph_options.legend_margin),
           padding: parseInt(graph_options.legend_padding),
           reversed: graph_options.legend_reversed == 0 ? false : true,
           shadow: graph_options.legend_shadow == 0 ? false : true,
           title: {
               text: graph_options.legend_title

           },
           verticalAlign: graph_options.legend_vertical_align,
           width: parseInt(graph_options.legend_width),
           x: parseInt(graph_options.legend_x),
           y: parseInt(graph_options.legend_y),
           style: {
               align: 'center'
           }


       },
       xAxis: {
           lineColor: graph_options.xAxis_lineColor,
           lineWidth: parseInt(graph_options.xAxis_lineWidth),
           gridLineColor: graph_options.xAxis_gridLineColor,
           gridLineWidth: parseInt(graph_options.xAxis_gridLineWidth),
           title: {
               enabled: true,
               text: graph_options.xAxis_text,
               align: graph_options.xAxis_align
           }
       },
       yAxis: {
           lineColor: graph_options.yAxis_lineColor,
           lineWidth: parseInt(graph_options.yAxis_lineWidth),
           gridLineColor: graph_options.yAxis_gridLineColor,
           gridLineWidth: parseInt(graph_options.yAxis_gridLineWidth),
           title: {
               enabled: true,
               text: graph_options.yAxis_text,
               align: graph_options.yAxis_align
           }
       },
       plotOptions: {
           series: {
               enableMouseTracking: graph_options.enableMouseTracking == 0 ? false : true,
               marker: {
                   enabled: graph_options.markerEnabled == 0 ? false : true
               }
           }
       }
   };
   
   for(var i in graph_options){
       //alert(i + ' = ' + graph_options[i] + ' ' + typeof graph_options[i]);
   }
   options.legend.width = parseInt(graph_options.legend_width);
        /*
        options = {
        	colors: graph_options.colors ? graph_options.colors : new Array(
                                                                        '#2f7ed8',
                                                                        '#0d233a',
                                                                        '#8bbc21',
                                                                        '#910000',
                                                                        '#1aadce',
                                                                        '#492970',
                                                                        '#f28f43',
                                                                        '#77a1e5',
                                                                        '#c42525',
                                                                        '#a6c96a'
                                                                        ),
            title: {
                text: graph_options.title,
            },
            subtitle: {
                text: graph_options.subtitle,
            },
            chart: {
                backgroundColor: graph_options.background_color,
                borderColor: graph_options.border_color,
                borderRadius: graph_options.border_radius,
                borderWidth: graph_options.border_width,
                marginBottom: graph_options.margin_bottom,
                marginLeft: graph_options.margin_left,
                marginRight: graph_options.margin_right,
                marginTop: graph_options.margin_top,
                plotBackgroundColor: graph_options.plot_background_color,
                plotBorderColor: graph_options.plot_border_color,
                plotBorderWidth: graph_options.plot_border_width,
                showAxes: graph_options.show_axes,
                spacingBottom: graph_options.spacing_bottom,
                spacingLeft: graph_options.spacing_left,
                spacingRight: graph_options.spacing_right,
                spacingTop: graph_options.spacing_top
            },
            legend: {
                align: graph_options.legend_align,
                backgroundColor: graph_options.legend_background_color,
                borderColor: graph_options.legend_border_color,
                borderRadius: graph_options.legend_border_radius,
                borderWidth: graph_options.legend_border_width,
                enabled: graph_options.legend_enabled,
                floating: graph_options.legend_floating,
                itemDistance: graph_options.legend_item_distance,
                itemMarginBottom: graph_options.legend_item_margin_bottom,
                itemMarginTop: graph_options.legend_item_margin_top,
                layout: graph_options.legend_layout,
                lineHeight: graph_options.legend_line_height,
                margin: graph_options.legend_margin,
                padding: graph_options.legend_padding,
                reversed: graph_options.legend_reversed,
                shadow: graph_options.legend_shadow,
                title: {
                    text: graph_options.legend_title
                },
                verticalAlign: graph_options.legend_vertical_align,
                width: graph_options.legend_width,
                x: graph_options.legend_x,
                y: graph_options.legend_y,
                style: {
                    align: 'center'
                }
            }
        };
        */
        //alert(options.colors);
    } catch (e) {
        //alert('458 = ' + e);
    }

}

function noData(msg){
	//alert($('#line button[data-vin="types"]').length);
    $('#container').html('');
    setTimeout(function(){
    	$('#line button[data-vin="types"]').click();
    }, 300);
    
    if(msg)
    	notif.alert('No data!', null, ' ');

}