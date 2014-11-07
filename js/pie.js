function showPieGraph(sql) {
    try {
    $('#shadow').show();
    $('#line #container, table.details thead, table.details tbody').html('');
    if (!sql)
        sql = createFilterTable('filters-list', info.graph_filter,
                info.graph_filter_items, graph_id, graph_options.sql_command, true);
    else
        sql = createFilterTable('filters-list', info.graph_filter,
                info.graph_filter_items, graph_id, graph_options.sql_command, false);

        
    graph_options.legend_x = (graph_options.legend_x / 100) * $(document).width();
    graph_options.legend_width = 0.5 * $(document).width();


    //alert(sql);

    var series = [];

    //$('div.ui-loader').show();
    $.ajax({
        async: true,
        type: 'POST',
        url: InfoURL,
        timeout: 20000,
        error: function() {
            //$('div.ui-loader').hide();
            $('#shadow').hide();

            notif.alert('Error!', null, ' ');
            noData(false);
        },
        data: {sql: sql, //graph_options.sql_command,
            info: JSON.stringify(info.info),
                db: graph_options.table_name}
    }).success(function(msg) {
        //$('div.ui-loader').hide();
        if (msg.length > 2) {
               //alert(msg);
            try{
                var data = JSON.parse(msg);
                   //alert(data);
                for (var i = 0; i < data.x.length; i++) {
                    series[i] = [data.x[i].toString(), data.val[i]];
                   //alert(series[i]);
                }

                $('#shadow').hide();
                //noData(true);
                buildPieGraph(series);
            } finally {
                $('#shadow').hide();
            }

        } else {
            //alert('No data!', null, ' ');
            //buildPieGraph();
            $('#shadow').hide();
            noData(true);
        }
    });
    } catch (e){
        $('#shadow').hide();
        noData(true);
    	//alert(e);
    }

}

function buildPieGraph(series) {

    var max_w = innerWidth;//$(document).width();
    var max_h = innerHeight;//$(document).height();

    $('#line #container').css('width', max_w * 0.9);
    $('#container').css('height', max_h * 0.75);

//        var kk = readObject(options);
//    
//        $('#line #info').css('color', 'white');
//        $('#line #info').html(kk);

    options.tooltip = {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    };
    options.plotOptions = {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    };

    
    
    buildPieDetails(series);
    
    for (var j  in series){
    	series[j][1] = parseFloat(series[j][1].toString().replace(/,/g, ''));
    	//alert(series[j][1]);
    }
    
    options.series = [{
            type: 'pie',
            name: graph_options.pie_series_name,
            data: series
    }];

    $('#line #container').highcharts(options);
    
    
}

function buildPieDetails(series) {
    var thead = '<tr class="ui-bar-d"><th><b>'+graph_options.xAxis_text+'</b></th><th><b>'+graph_options.yAxis_text+'</b></th></tr>';
    var tbody = '';

    for (var i in series) {
        tbody += '<tr>';
        tbody += '<td><b>' + series[i][0] + '</b></td>';
        tbody += '<td>' + series[i][1] + '</td>';
        tbody += '</tr>';
    }

    $('#line-details table.details thead').html(thead);
    $('#line-details table.details tbody').html(tbody);
}