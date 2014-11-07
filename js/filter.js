user_filter = new Array();

function buildBarFilter(table_id) {
    try {
        if (!table_id) {
            table_id = 'filters-list';
        }
        
        

        var filter = info.graph_filter,
                tbody = '',
                filter_val = '';
        $('ul#' + table_id + '').html(tbody);
        for (var i in filter) {
            if (filter[i].graph == graph_id) {
                filter_val = (filter[i].user_value !== null) ? filter[i].user_value : filter[i].default_value;

                var filter_type = (filter[i].filter_type == 1) ? 'text' : 'date';
                filter_type = (filter[i].filter_type > 3) ? 'number' : filter_type;

                tbody += '<tr>' +
                        '<td>' + filter[i].name + '</td>' +
                        '<td><input data-name="" data-id="' + filter[i].id + '" type="' + filter_type + '" value="' +
                        filter_val + '" /></td>' +
                        '</tr>';
            }

        }

        $('#' + table_id + ' tbody').html(tbody);
        //return createFilterString(table_id);
    } catch (e) {
        //alert(e);
        return '';
    }
}

function createFilterString(table_id) {
    try {
        user_filter = new Array();
        var sql = '',
                filter = info.graph_filter;

        var tr = $('#' + table_id + ' tbody input');

        if (tr.length <= 0) {
            return sql;
        }
        sql = ' WHERE ';
        tr.each(function(i, val) {
            var filter_id = $(val).attr('data-id');

            for (var j in filter) {
                if (filter[j].id == filter_id) {
                    sql += filter[j].column;

                    switch (filter[j].filter_type) {
                        case '1':
                            sql += ' = ';
                            break;
                        case '2':
                        case '4':
                            sql += ' < ';
                            break;
                        case '3':
                        case '5':
                            sql += ' > ';
                            break;
                        default:
                            sql += ' = ';
                    }

                    var filter_value = $(val).val();
                    sql += filter_value;

                    user_filter[user_filter.length] = {
                        id: filter_id,
                        user_value: filter_value,
                        saved: false
                    };
                }
            }

            if (tr.length - 1 != i) {
                sql += ' AND ';
            }
        });
        //db.transaction(saveInfo.updateGFValue, dataBase.errorCB);
        return sql;
    } catch (e) {
        //alert(e);
        return '';
    }
}


function createFilterTable(table_id, filter, filter_items, graph_id, sql, create_table) {
    if (create_table === true) {
        console.log('createFilterTable');
        try{
            var tbody = buildFilterTable(table_id, filter, filter_items, graph_id);
        } catch(e){
            //alert('104 = ' + e);
        }
        $('#' + table_id).html(tbody);
         //return tbody;
        $('#' + table_id + ' li').bind('touchstart', function(){
             $(this).find('.shadow-li').show();
        });
        
        $('#' + table_id + ' li').bind('touchend', function(){
            $(this).find('.shadow-li').hide();
        });
    }
    try{
        var values = createFilterArray(table_id),
            new_sql = parseSQL(0, sql, values);
    } catch(e){
        //('120 = ' + e);
    }
    if(values.length <= 0){
        $('button.filter-btn').hide();
    } else {
        $('button.filter-btn').show();
    }

    //alert(new_sql);
    return new_sql;


}



function parseSQL(index, sql, values) {
    try{
        //alert('138 = '+sql);
    if (index >= sql.length) {
        return '';
    }

    var i = -1,
            sql1 = '',
            var_name = '';

    if ((i = sql.indexOf('{', index)) >= 0) {
        sql1 = sql.slice(index, i);
        while (sql[++i] != '}') {
            if (i >= sql.length) {
                return '';
            }
            var_name += sql[i];
        }
        //console.log(var_name);
        return sql1 + findVarValue(var_name, values) + parseSQL(++i, sql, values);
    } else {
        return sql.slice(index, sql.length);
    }
    } catch(e){
        //alert('160 = ' + e);
    }
}

function findVarValue(var_name, values) {
    //console.log(values, var_name);
    for (var i in values) {
        //console.log(values[i].name, var_name);
        if (values[i].name == var_name) {
            return values[i].val;
        }
    }

    return '';
}

function buildFilterTable(table_id, filter, filter_items, graph_id) {
    console.log('buildFilterTable');
    if (!table_id) {
        return '';
    }

    var tbody = '',
            filter_val = '',
            filter_type = '',
    counter = 0;

    for (var i in filter) {
        if (false && (filter[i].graph == graph_id) && (filter[i].filter_type != 4)) {
            filter_val = (filter[i].user_value !== null) ?
                    filter[i].user_value :
                    filter[i].default_value;
			counter++;
            filter_type = findFilterType(filter[i].filter_type);
            /*
            tbody += '<tr data-var-name="' + filter[i].var_name + '">';
            tbody += '<td>' + filter[i].name + '</td>';
            tbody += '<td><input type="' + filter_type + '" value="' + filter_val
                    + '" /></td>';
            tbody += '</tr>';
            */
        } else if ((filter[i].graph == graph_id) && (filter[i].filter_type >= 0)) {//==4
            counter++;
            tbody += createSelectFilter(filter[i], filter_items, counter);
        }
    }
    //alert(tbody);
    return tbody;
    //$('#' + table_id + ' tbody').html(tbody);
}

function findFilterType(filter_type) {
    switch (filter_type) {
        case '1':
            return 'text';
            break;
        case '2':
            return 'date';
            break;
        case '3':
            return 'number';
            break;
        default:
            return 'text';
            break;
    }

    return '';
}

function createSelectFilter(filter, filter_items, counter) {
    console.log('createSelectFilter');
    if(!filter){ return ''; }
    var res = '',
        defaultFilter = filter.user_value ? filter.user_value : filter.default_value,
    	class_name = 'color1',
        filter_type = filter.filter_type;

    switch (counter % 4) {
        case 0:
            class_name = 'color4';
            break;
        case 1:
            class_name = 'color3';
            break;
        case 2:
            class_name = 'color2';
            break;
        case 3:
            class_name = 'color1';
            break;
    }
    
    if (filter_type == 4) {
        //alert(filter_type);
        for (var i in filter_items) {
            if (filter.id == filter_items[i].graph_filter
                    && filter_items[i].id == defaultFilter) {
                

                
                res += '<li onclick="openOneSlot(this)" data-value="' + filter_items[i].list_value +
                        '" data-filter="' + filter.id + '" class="' + class_name + '" data-var-name="' + filter.var_name + '">' +
                        '<div class="shadow-li"></div>' +
                        '<div class="innerLi">' +
                        '<div class="var-name">' + filter.name + '</div>' +
                        '<div class="var-value">' +
                        filter_items[i].display_value +
                        '</div>' +
                        '</div>' +
                        '</li>';
                    
            } 
        }
    } else if (filter_type == 2) {
        try{
           var now = new Date(),
                today = now.getDate() + '/' + (now.getMonth()+1) + '/' + now.getFullYear();
                //alert(today);
                res += '<li onclick="openBirthDate(this)" data-value="' + today +
                    '" data-filter="' + filter.id + '" class="' + class_name + '" data-var-name="' + filter.var_name + '">' +
                    '<div class="shadow-li"></div>' +
                    '<div class="innerLi">' +
                        '<div class="var-name">' + filter.name + '</div>' +
                        '<div class="var-value">' +
                        today +
                        '</div>' +
                    '</div>' +
                '</li>';
        } catch (e){
            //alert(e);
        }
        
        
    }
    
    return res;
    /*
    
    res += '<tr data-var-name="' + filter.var_name + '">';
    res += '<td>' + filter.name + '</td>';
    res += '<td><select>';

    for (var i in filter_items) {
        if (filter.id == filter_items[i].graph_filter) {
            item_selected = (filter.user_value == filter_items[i].id) ?
                    ' selected ' : '';

            res += '<option ' + item_selected + ' value="'
                    + filter_items[i].list_value
                    + '">' + filter_items[i].display_value + '</option>';
        }
    }

    res += '</select></td></tr>';
    */
    
}

function createFilterArray(table_id) {
    var tr = $('ul#' + table_id + ' li'),
            res = [],
            tmp;

    tr.each(function(index, value) {
        tmp = {
            name: '',
            val: ''
        };
        tmp.name = $(value).attr('data-var-name');
        tmp.val = $(value).attr('data-value');
        /*
        if ($(value).find('select').length > 0) {
            if ($(value).find('select option:selected').length > 0)
                tmp.val = $(value).find('select option:selected').val();
            else
                tmp.val = $(value).find('select option:first-child').val();
        } else if ($(value).find('input').length > 0) {
            tmp.val = $(value).find('input').val();
        }
        */
        //alert(tmp.val);
        res.push(tmp);


    });

    return res;
}

function openWeight() {

    var numbers = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9};
    SpinningWheel.addSlot(numbers, 'right');
    SpinningWheel.addSlot(numbers, 'right');
    SpinningWheel.addSlot(numbers, 'right');
    SpinningWheel.addSlot({separator: '.'}, 'readonly shrink');
    SpinningWheel.addSlot(numbers, 'right');
    SpinningWheel.addSlot({Kg: 'Kg', Lb: 'Lb', St: 'St'}, 'shrink');

    SpinningWheel.setCancelAction(cancel);
    SpinningWheel.setDoneAction(done);

    SpinningWheel.open();
}

function openBirthDate(obj) {
    try {
        SpinningWheel.destroy();
    } catch (e) {
        //alert(e);
    } finally {
        var now = $(obj).find('.var-value').text().split('/');
        var date = new Date();
        var days = {};
        var years = {};
        var months = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'};

        for (var i = 1; i < 32; i += 1) {
            days[i] = i;
        }

        for (i = date.getFullYear() - 20; i < date.getFullYear() + 10; i += 1) {
            years[i] = i;
        }
        try{
            SpinningWheel.addSlot(days, '', parseInt(now[0]));
            SpinningWheel.addSlot(months, '', parseInt(now[1]));
            SpinningWheel.addSlot(years, '', parseInt(now[2]));
        }catch(e){
            //alert(e);
        }
        
        

        SpinningWheel.setCancelAction(cancel);
        SpinningWheel.setDoneAction(function() {
            var results = SpinningWheel.getSelectedValues(),
                res = results.keys[0] + '/' + results.keys[1] + '/' + results.keys[2];
            $(obj).find('.var-value').text(res);
            $(obj).attr('data-value', res);
        });

        SpinningWheel.open();
    }
}

function openOneSlot(obj) {
    try {
        SpinningWheel.destroy();
    } catch (e) {
        //alert(e);
    } finally {
        var filter_id = $(obj).attr('data-filter');
        var list = createWheelList(filter_id);
        
        if(!list){ return; }

        SpinningWheel.addSlot(list, null, $(obj).attr('data-value'));

        SpinningWheel.setCancelAction(cancel);

        SpinningWheel.setDoneAction(function() {
            var results = SpinningWheel.getSelectedValues();
            $(obj).find('.var-value').text(results.values[0]);
            $(obj).attr('data-value', results.keys[0]);
        });

        SpinningWheel.open();

    }

}

function createWheelList(filter_id){
    if(!filter_id){ return null; }
    
    var list = {},
        key = "",
        items = info.graph_filter_items;

    for (var i in items) {
        if (filter_id == items[i].graph_filter) {
            key = items[i].list_value;
            list[key] = items[i].display_value;
        }
    }
    
    return list;
}

function done() {
    var results = SpinningWheel.getSelectedValues();
    //alert('values: ' + results.values.join(' ') + ' keys: ' + results.keys.join(', '));
}

function cancel() {
}