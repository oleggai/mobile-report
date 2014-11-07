var app = {
    // Application Constructor
    initialize: function() {
        //this.bindEvents();
        
        app.setSettings();
    },
    
    bindEvents: function() {
        //document.addEventListener('deviceready', this.onDeviceReady, false);
        this.onDeviceReady();
    },
    
    onDeviceReady: function() {
        app.setSettings();
    }, 
            
    clearDB: function(tx){
        tx.executeSql('DELETE FROM GRAPH_GROUP');
        tx.executeSql('DELETE FROM GRAPH');
        tx.executeSql('DELETE FROM GRAPH_OPTIONS');
        tx.executeSql('DELETE FROM GRAPH_FILTER');
        tx.executeSql('DELETE FROM GRAPH_FILTER_TYPE');
        tx.executeSql('DELETE FROM GRAPH_FILTER_ITEMS');
        saveInfo.init();
    },
    
    confSavePass: function(buttonIndex){
        //alert(buttonIndex);
        if(buttonIndex == 1) app1.saveLogin();
    },
            
    changeIconsHeight: function(){
        if($('div.ui-page-active').attr('id') === 'types'){
            var i = $('.block').width();
            $('.block').height(i);
        }
    },
    
    //setting application settings
    setSettings: function(){
        notif = navigator.notification;
        localStorage = window.localStorage;
        
        dataBase.init();
        //app.setVersions();
        //app1.start();
    },
            
    setVersions: function(){
        if($.mobile.activePage.attr('id') === 'index'){
            $.mobile.changePage( "#main" );
        }
        
        //dataBase.init();
        app1.start();
    }
};

dataBase = {
    firstStart: true,
    
    init: function(){
        db = window.openDatabase('graphs', '1.0', 'graphs', 1000000);
        
        dataBase.firstStart = localStorage.getItem('start') ? true : false;
        if(!dataBase.firstStart){
            db.transaction(dataBase.createDB, dataBase.errorCB);
        } else {
            dataBase.start();
        }
    },
            
    errorCB: function(err){
        /*alert('ErrorCB');
        for(var i in err){
            alert(err[i]);
        }*/
        
    },
       
    createDB: function(tx){
        
        tx.executeSql('CREATE TABLE IF NOT EXISTS LOGIN (id unique, login, pass)');
        
        tx.executeSql('CREATE TABLE IF NOT EXISTS GRAPH_GROUP (id unique,'+
                        ' group_name, logo_path, version, deleted)');
        
        tx.executeSql('CREATE TABLE IF NOT EXISTS GRAPH (id unique,'+
                ' graph_group_id, graph_name, logo_path, type, version, deleted)');
        
        tx.executeSql("CREATE TABLE IF NOT EXISTS GRAPH_OPTIONS (id unique, comp_id, version, isdeleted, "+
                    "graph, title, subtitle, sql_command, colors, background_color, "+
                    "border_color, border_radius, border_width, margin_bottom, "+
                    "margin_left, margin_right, margin_top, plot_background_color, "+
                    "plot_border_color, plot_border_width, show_axes, spacing_bottom, "+
                    "spacing_left, spacing_right, spacing_top, legend_align, "+
                    "legend_background_color, legend_border_color, legend_border_radius, "+
                    "legend_border_width, legend_enabled, legend_floating, "+
                    "legend_item_distance, legend_item_margin_bottom, "+
                    "legend_item_margin_top, legend_layout, legend_line_height, "+
                    "legend_margin, legend_padding, legend_reversed, legend_shadow, "+
                    "legend_title, legend_vertical_align, legend_width, legend_x, "+
                    "legend_y, title_align, title_color, xAxis_lineColor, "+
                    "xAxis_lineWidth, xAxis_gridLineColor, xAxis_gridLineWidth, "+
                    "xAxis_title_enabled, xAxis_text, xAxis_align, yAxis_lineColor, "+
                    "yAxis_lineWidth, yAxis_gridLineColor, yAxis_gridLineWidth, "+
                    "yAxis_text, yAxis_align, enableMouseTracking, markerEnabled, "+
                    "pie_series_name, yAxis_title_enabled, table_name)");
         
        
        tx.executeSql('CREATE TABLE IF NOT EXISTS GRAPH_FILTER (id unique,'+
                        ' graph, filter_type, default_value, name, var_name, user_value, version, deleted)');
        
        tx.executeSql('CREATE TABLE IF NOT EXISTS GRAPH_FILTER_TYPE (id unique,'+
                        ' name, version, deleted)');
                
        tx.executeSql('CREATE TABLE IF NOT EXISTS GRAPH_FILTER_ITEMS (id unique,'+
                        ' graph_filter, list_value, display_value, version, deleted)');

        tx.executeSql('CREATE TABLE IF NOT EXISTS GRAPH_FIELD (id unique, ' +
                        'name, graph, length, data_type, align, mask, version, deleted)');
        
        localStorage.setItem('start', 'true');
        dataBase.start();
    },
    
    start: function(){
        db.transaction(dataBase.setIDs, dataBase.errorCB);
        db.transaction(dataBase.setVersions, dataBase.errorCB);
        if($('section.active').attr('id') == 'main')
        	app1.setLogin();
    },
            
    setIDs: function(tx){
        tx.executeSql('SELECT id AS id FROM GRAPH_GROUP', [], parseIDs.parseGGIds, dataBase.errorCB);
        tx.executeSql('SELECT id AS id FROM GRAPH', [], parseIDs.parseGIds, dataBase.errorCB);
        tx.executeSql('SELECT id AS id FROM GRAPH_OPTIONS', [], parseIDs.parseGOIds, dataBase.errorCB);
        tx.executeSql('SELECT id AS id FROM GRAPH_FILTER', [], parseIDs.parseGFIds, dataBase.errorCB);
        tx.executeSql('SELECT id AS id FROM GRAPH_FILTER_TYPE', [], parseIDs.parseGFTIds, dataBase.errorCB);
        tx.executeSql('SELECT id AS id FROM GRAPH_FILTER_ITEMS', [], parseIDs.parseGFIIds, dataBase.errorCB);
        tx.executeSql('SELECT id AS id FROM GRAPH_FIELD', [], parseIDs.parseGFieldIds, dataBase.errorCB);
    },
            
    setVersions: function(tx){
        tx.executeSql('SELECT MAX(version) AS version FROM GRAPH_GROUP', [], parseVersions.setGGVersion, dataBase.errorCB);
        tx.executeSql('SELECT MAX(version) AS version FROM GRAPH', [], parseVersions.setGVersion, dataBase.errorCB);
        tx.executeSql('SELECT MAX(version) AS version FROM GRAPH_OPTIONS', [], parseVersions.setGOVersion, dataBase.errorCB);
        tx.executeSql('SELECT MAX(version) AS version FROM GRAPH_FILTER', [], parseVersions.setGFVersion, dataBase.errorCB);
        tx.executeSql('SELECT MAX(version) AS version FROM GRAPH_FILTER_TYPE', [], parseVersions.setGFTVersion, dataBase.errorCB);
        tx.executeSql('SELECT MAX(version) AS version FROM GRAPH_FIELD', [], parseVersions.setGFieldVersion, dataBase.errorCB);
    }
};

var parseIDs = {
    parseGGIds: function(tx, results) {
        var len = results.rows.length, i = 0;
        GGIds = [0];
        for (i; i < len; i++) {
            GGIds[i] = results.rows.item(i).id;
        }
    },
    
    parseGIds: function(tx, results) {
        var len = results.rows.length, i = 0;
        GIds = [0];
        for (i; i < len; i++) {
            GIds[i] = results.rows.item(i).id;
        }
    },
    
    parseGOIds: function(tx, results) {
        var len = results.rows.length, i = 0;
        GOIds = [0];
        for (i; i < len; i++) {
            GOIds[i] = results.rows.item(i).id;
        }
    },
    
    parseGFIds: function(tx, results) {
        var len = results.rows.length, i = 0;
        GFIds = [0];
        for (i; i < len; i++) {
            GFIds[i] = results.rows.item(i).id;
        }
    },
    
    parseGFTIds: function(tx, results) {
        var len = results.rows.length, i = 0;
        GFTIds = [0];
        for (i; i < len; i++) {
            GFTIds[i] = results.rows.item(i).id;
        }
    },
            
    parseGFIIds: function(tx, results) {
        var len = results.rows.length, i = 0;
        GFIIds = [0];
        for (i; i < len; i++) {
            GFIIds[i] = results.rows.item(i).id;
        }
    },

    parseGFieldIds: function(tx, results) {
        var len = results.rows.length, i = 0;
        GFieldIds = [0];
        for (i; i < len; i++) {
            GFIIds[i] = results.rows.item(i).id;
        }
    }
};

parseVersions = {
    setGGVersion: function(tx, results){
        var len = results.rows.length;
            for(var i=0; i<len; i++){
                var m = results.rows.item(i).version;
                graph_group_version = m ? m : 0;
            }
            //alert('gg version '+graph_group_version);
     },
             
    setGVersion: function(tx, results){
        var len = results.rows.length;
            for(var i=0; i<len; i++){
                var m = results.rows.item(i).version;
                graph_version = m ? m : 0;
            }
            //alert('g version '+graph_version);
     },
             
    setGOVersion: function(tx, results){
        var len = results.rows.length;
            for(var i=0; i<len; i++){
                var m = results.rows.item(i).version;
                graph_options_version = m ? m : 0;
            }
            //alert('go version '+graph_options_version);
     },
        
    setGFVersion: function(tx, results){
        var len = results.rows.length;
            for(var i=0; i<len; i++){
                var m = results.rows.item(i).version;
                graph_filter_version = m ? m : 0;
            }
            //alert('gf version '+graph_filter_version);
     },
             
    setGFTVersion: function(tx, results){
        var len = results.rows.length;
            for(var i=0; i<len; i++){
                var m = results.rows.item(i).version;
                graph_filter_type_version = m ? m : 0;
            }
            //alert('graph_filter_type_version = '+graph_filter_type_version);
            //app1.start();
     },
             
    setGFIVersion: function(tx, results){
        var len = results.rows.length;
            for(var i=0; i<len; i++){
                var m = results.rows.item(i).version;
                graph_filter_items_version = m ? m : 0;
            }
            //alert('graph_filter_items_version = '+graph_filter_items_version);
            //app1.start();
     },

    setGFieldVersion: function(tx, results){
        var len = results.rows.length;
        for(var i=0; i<len; i++){
            var m = results.rows.item(i).version;
            graph_field_version = m ? m : 0;
        }
        //alert('graph_field_version = '+ graph_field_version);
        //app1.start();
    }
};

saveInfo = {
    init: function(){
        if(info.graph_groups){
            db.transaction(saveInfo.updateGG, dataBase.errorCB);
        } else {
            db.transaction(selectInfo.selectGGs, dataBase.errorCB);
        }
        //save and select info from graph table
        if(info.graphs){
            db.transaction(saveInfo.updateG, dataBase.errorCB);
        } else {
            db.transaction(selectInfo.selectGs, dataBase.errorCB);
        }
        
        //save and select info from graph options table
        if(info.graph_options){
            db.transaction(saveInfo.updateGO, dataBase.errorCB);
        } else {
            db.transaction(selectInfo.selectGOs, dataBase.errorCB);
        }
        
        if(info.graph_filter){
            db.transaction(saveInfo.updateGF, dataBase.errorCB);
        } else {
            db.transaction(selectInfo.selectGFs, dataBase.errorCB);
        }
        
        if(info.graph_filter_type){
            db.transaction(saveInfo.updateGFT, dataBase.errorCB);
        } else {
            db.transaction(selectInfo.selectGFTs, dataBase.errorCB);
        }
        
        if(info.graph_filter_items){
            db.transaction(saveInfo.updateGFI, dataBase.errorCB);
        } else {
            db.transaction(selectInfo.selectGFIs, dataBase.errorCB);
        }

        if(info.graph_field){
            db.transaction(saveInfo.updateGField, dataBase.errorCB);
        } else {
            db.transaction(selectInfo.selectGField, dataBase.errorCB);
        }
    },
            
    updateGG: function(tx){
        var sql;
        info.graph_groups.forEach(function(element, index){
            element.id = parseInt(element.id);
            if(GGIds.indexOf(element.id) != -1){
                sql = 'UPDATE GRAPH_GROUP SET '+
                                                    ' group_name="'+element.group_name+
                                                    '", logo_path="'+element.logo_path+
                                                    '", version='+element.version+
                                                    ', deleted='+element.isdeleted+
                                                ' WHERE id='+element.id;
            
                //alert('update gg '+ sql);
                
                tx.executeSql(sql);
                
            } else {
                sql = 'INSERT INTO GRAPH_GROUP(id, group_name, logo_path, version, deleted) '+
                      'VALUES('+element.id+', "'+element.group_name+'", "'+element.logo_path+'", '
                      +element.version+', '+element.isdeleted+')';
                //alert('insert gg '+ sql);
                
                tx.executeSql(sql);
                      
            }
            
        });
        
        db.transaction(selectInfo.selectGGs, dataBase.errorCB);
    },
            
    updateG: function(tx){
        var sql;
        info.graphs.forEach(function(element, index){
            element.id = parseInt(element.id);
            if(GIds.indexOf(element.id) != -1){
                sql = 'UPDATE GRAPH SET '+
                            ' graph_group_id='+element.graph_group_id+
                            ', graph_name="'+element.graph_name+
                            '", logo_path="'+element.logo_path+
                            '", type='+element.type+
                            ', version='+element.version+
                            ', deleted='+element.isdeleted+
                        ' WHERE id='+element.id;
                //alert('update g = ' + sql);
            
                tx.executeSql(sql);
                
            } else {
                sql = 'INSERT INTO GRAPH(id,'+
                ' graph_group_id, graph_name, logo_path, type, version, deleted) '+
                      'VALUES('+element.id+', '+element.graph_group_id+', "'
                      +element.graph_name+'", "'+element.logo_path+'", '
                      +element.type+', '+element.version+', '+element.isdeleted+')';
                
                //alert('insert g = ' + sql);
                tx.executeSql(sql);
                      
            }
            
        });
        
        db.transaction(selectInfo.selectGs, dataBase.errorCB);
    },
            
    updateGO: function(tx){
        var sql,
            expr = new RegExp("'", 'g');
        
        info.graph_options.forEach(function(element, index){
            element.id = parseInt(element.id);
            if(GOIds.indexOf(element.id) != -1){
                sql = "UPDATE GRAPH_OPTIONS SET "
                        +"comp_id = '"+element.comp_id+"', "
                        +"version = '"+element.version+"', "
                        +"graph = '"+element.id+"', "
                        +"title = '"+element.title+"', "
                        +"subtitle = '"+element.subtitle+"', "
                        +"sql_command = '"+element.sql_command.replace(expr, "''")+"', "
                        +"colors = '"+element.colors+"', "
                        +"background_color = '"+element.background_color+"', "
                        +"border_color = '"+element.border_color+"', "
                        +"border_radius = '"+element.border_radius+"', "
                        +"border_width = '"+element.border_width+"', "
                        +"margin_bottom = '"+element.margin_bottom+"', "
                        +"margin_left = '"+element.margin_left+"', "
                        +"margin_right = '"+element.margin_right+"', "
                        +"margin_top = '"+element.margin_top+"', "
                        +"plot_background_color = '"+element.plot_background_color+"', "
                        +"plot_border_color = '"+element.plot_border_color+"', "
                        +"plot_border_width = '"+element.plot_border_width+"', "
                        +"show_axes = '"+element.show_axes+"', "
                        +"spacing_bottom = '"+element.spacing_bottom+"', "
                        +"spacing_left = '"+element.spacing_left+"', "
                        +"spacing_right = '"+element.spacing_right+"', "
                        +"spacing_top = '"+element.spacing_top+"', "
                        +"legend_align = '"+element.legend_align+"', "
                        +"legend_background_color = '"+element.legend_background_color+"', "
                        +"legend_border_color = '"+element.legend_border_color+"', "
                        +"legend_border_radius = '"+element.legend_border_radius+"', "
                        +"legend_border_width = '"+element.legend_border_width+"', "
                        +"legend_enabled = '"+element.legend_enabled+"', "
                        +"legend_floating = '"+element.legend_floating+"', "
                        +"legend_item_distance = '"+element.legend_item_distance+"', "
                        +"legend_item_margin_bottom = '"+element.legend_item_margin_bottom+"', "
                        +"legend_item_margin_top = '"+element.legend_item_margin_top+"', "
                        +"legend_layout = '"+element.legend_layout+"', "
                        +"legend_line_height = '"+element.legend_line_height+"', "
                        +"legend_margin = '"+element.legend_margin+"', "
                        +"legend_padding = '"+element.legend_padding+"', "
                        +"legend_reversed = '"+element.legend_reversed+"', "
                        +"legend_shadow = '"+element.legend_shadow+"', "
                        +"legend_title = '"+element.legend_title+"', "
                        +"legend_vertical_align = '"+element.legend_vertical_align+"', "
                        +"legend_width = '"+element.legend_width+"', "
                        +"legend_x = '"+element.legend_x+"', "
                        +"legend_y = '"+element.legend_y+"', "
                        +"title_align = '"+element.title_align+"', "
                        +"title_color = '"+element.title_color+"', "
                        +"xAxis_lineColor = '"+element.xAxis_lineColor+"', "
                        +"xAxis_lineWidth = '"+element.xAxis_lineWidth+"', "
                        +"xAxis_gridLineColor = '"+element.xAxis_gridLineColor+"', "
                        +"xAxis_gridLineWidth = '"+element.xAxis_gridLineWidth+"', "
                        +"xAxis_title_enabled = '"+element.xAxis_title_enabled+"', "
                        +"xAxis_text = '"+element.xAxis_text+"', "
                        +"xAxis_align = '"+element.xAxis_align+"', "
                        +"yAxis_lineColor = '"+element.yAxis_lineColor+"', "
                        +"yAxis_lineWidth = '"+element.yAxis_lineWidth+"', "
                        +"yAxis_gridLineColor = '"+element.yAxis_gridLineColor+"', "
                        +"yAxis_gridLineWidth = '"+element.yAxis_gridLineWidth+"', "
                        +"yAxis_text = '"+element.yAxis_text+"', "
                        +"yAxis_align = '"+element.yAxis_align+"', "
                        +"enableMouseTracking = '"+element.enableMouseTracking+"', "
                        +"markerEnabled = '"+element.markerEnabled+"', "
                        +"pie_series_name = '"+element.pie_series_name+"', "
                        +"table_name = '"+element.table_name+"', "
                        +"yAxis_title_enabled = '"+element.yAxis_title_enabled+"'"
                    +" WHERE id = "+element.id;
                //alert('update go = ' + sql);
                tx.executeSql(sql);
                
            } else {
                sql = "INSERT INTO GRAPH_OPTIONS(id, comp_id, version, isdeleted, "+
                    "graph, title, subtitle, sql_command, colors, background_color, "+
                    "border_color, border_radius, border_width, margin_bottom, "+
                    "margin_left, margin_right, margin_top, plot_background_color, "+
                    "plot_border_color, plot_border_width, show_axes, spacing_bottom, "+
                    "spacing_left, spacing_right, spacing_top, legend_align, "+
                    "legend_background_color, legend_border_color, legend_border_radius, "+
                    "legend_border_width, legend_enabled, legend_floating, "+
                    "legend_item_distance, legend_item_margin_bottom, "+
                    "legend_item_margin_top, legend_layout, legend_line_height, "+
                    "legend_margin, legend_padding, legend_reversed, legend_shadow, "+
                    "legend_title, legend_vertical_align, legend_width, legend_x, "+
                    "legend_y, title_align, title_color, xAxis_lineColor, "+
                    "xAxis_lineWidth, xAxis_gridLineColor, xAxis_gridLineWidth, "+
                    "xAxis_title_enabled, xAxis_text, xAxis_align, yAxis_lineColor, "+
                    "yAxis_lineWidth, yAxis_gridLineColor, yAxis_gridLineWidth, "+
                    "yAxis_text, yAxis_align, enableMouseTracking, markerEnabled, "+
                    "pie_series_name, yAxis_title_enabled, table_name) "+
                    
                    
                    "VALUES("+element.id+", '"+element.comp_id+"', '"+element.version+"', '"+element.isdeleted+"', "+
                    "'"+element.id+"', '"+element.title+"', '"+element.subtitle+"', '"+element.sql_command.replace(expr, "''")+"', '"+element.colors+"', '"+element.background_color+"', "+
                    "'"+element.border_color+"', '"+element.border_radius+"', '"+element.border_width+"', '"+element.margin_bottom+"', "+
                    "'"+element.margin_left+"', '"+element.margin_right+"', '"+element.margin_top+"', '"+element.plot_background_color+"', "+
                    "'"+element.plot_border_color+"', '"+element.plot_border_width+"', '"+element.show_axes+"', '"+element.spacing_bottom+"', "+
                    "'"+element.spacing_left+"', '"+element.spacing_right+"', '"+element.spacing_top+"', '"+element.legend_align+"', "+
                    "'"+element.legend_background_color+"', '"+element.legend_border_color+"', '"+element.legend_border_radius+"', "+
                    "'"+element.legend_border_width+"', '"+element.legend_enabled+"', '"+element.legend_floating+"', "+
                    "'"+element.legend_item_distance+"', '"+element.legend_item_margin_bottom+"', "+
                    "'"+element.legend_item_margin_top+"', '"+element.legend_layout+"', '"+element.legend_line_height+"', "+
                    "'"+element.legend_margin+"', '"+element.legend_padding+"', '"+element.legend_reversed+"', '"+element.legend_shadow+"', "+
                    "'"+element.legend_title+"', '"+element.legend_vertical_align+"', '"+element.legend_width+"', '"+element.legend_x+"', "+
                    "'"+element.legend_y+"', '"+element.title_align+"', '"+element.title_color+"', '"+element.xAxis_lineColor+"', "+
                    "'"+element.xAxis_lineWidth+"', '"+element.xAxis_gridLineColor+"', '"+element.xAxis_gridLineWidth+"', "+
                    "'"+element.xAxis_title_enabled+"', '"+element.xAxis_text+"', '"+element.xAxis_align+"', '"+element.yAxis_lineColor+"', "+
                    "'"+element.yAxis_lineWidth+"', '"+element.yAxis_gridLineColor+"', '"+element.yAxis_gridLineWidth+"', "+
                    "'"+element.yAxis_text+"', '"+element.yAxis_align+"', '"+element.enableMouseTracking+"', '"+element.markerEnabled+"', "+
                    "'"+element.pie_series_name+"', '"+element.yAxis_title_enabled+"', '"+element.table_name+"')";
                
                //alert('insert go = ' + sql);
                tx.executeSql(sql);
                      
            }
            
        });
        
        db.transaction(selectInfo.selectGOs, dataBase.errorCB);
    },
            
    updateGF: function(tx){
        var sql;
        info.graph_filter.forEach(function(element, index){
            element.id = parseInt(element.id);
            if(GFIds.indexOf(element.id) != -1){
                sql = 'UPDATE GRAPH_FILTER SET '+
                                'graph = "'+element.graph+'", '+
                                'filter_type = "'+element.filter_type+'", '+
                                'default_value = "'+element.default_value+'", '+
                                'name = "'+element.name+'", '+
                                'var_name = "'+element.var_name+'", '+
                                'version = "'+element.version+'", '+
                                'deleted = "'+element.isdeleted+'" '+
                                ' WHERE id='+element.id;
                //alert('update go = ' + sql);
                tx.executeSql(sql);
                
            } else {
                sql = 'INSERT INTO GRAPH_FILTER(id,'+
                        ' graph, filter_type, default_value, name, var_name, version,'+
                        ' deleted) '+
                      'VALUES('+element.id+', '+
                ' "'+element.graph+'", "'+element.filter_type+'", "'+element.default_value+'", "'
                +element.name+'", "'+element.var_name+'", "'+element.version+'",'+
                ' '+element.isdeleted+')';
                //alert('insert go = ' + sql);
                tx.executeSql(sql);
                      
            }
            
        });
        
        db.transaction(selectInfo.selectGFs, dataBase.errorCB);
    },
    
    updateGFValue: function(tx){
    	var sql;
    	user_filter.forEach(function(element, index){
            element.id = parseInt(element.id);
            if(!element.saved){
                sql = 'UPDATE GRAPH_FILTER SET '+
                    'user_value = "'+element.user_value+'" '+
                    ' WHERE id='+element.id;
                
                tx.executeSql(sql);
                element.saved = true;
            }
         });
    
    	db.transaction(selectInfo.selectGFs, dataBase.errorCB);
    },
            
    updateGFT: function(tx){
        var sql;
        info.graph_filter_type.forEach(function(element, index){
            element.id = parseInt(element.id);
            if(GFTIds.indexOf(element.id) != -1){
                sql = 'UPDATE GRAPH_FILTER_TYPE SET '+
                                'name = "'+element.name+'", '+
                                'version = "'+element.version+'", '+
                                'deleted = "'+element.isdeleted+'", '+
                                ' WHERE id='+element.id;
                //alert('update gft = ' + sql);
                tx.executeSql(sql);
                
            } else {
                sql = 'INSERT INTO GRAPH_FILTER_TYPE  (id,'+
                        ' name, version, deleted) '+
                      'VALUES('+element.id+', '+
                ' "' +element.name+'", "'+element.version+'", '+element.isdeleted+')';
                //alert('insert gft = ' + sql);
                tx.executeSql(sql);
                      
            }
            
        });
        
        db.transaction(selectInfo.selectGFTs, dataBase.errorCB);
    },
            
    updateGFI: function(tx){
        var sql;
        info.graph_filter_items.forEach(function(element, index){
            element.id = parseInt(element.id);
            if(GFIIds.indexOf(element.id) != -1){
                sql = 'UPDATE GRAPH_FILTER_ITEMS SET '+
                                'graph_filter = "'+element.graph_filter+'", '+
                                'list_value = "'+element.list_value+'", '+
                                'display_value = "'+element.display_value+'", '+
                                'version = "'+element.version+'", '+
                                'deleted = "'+element.isdeleted+'" '+
                                ' WHERE id='+element.id;
                //alert('update gfi = ' + sql);
                tx.executeSql(sql);
                
            } else {
                sql = 'INSERT INTO GRAPH_FILTER_ITEMS  (id,'+
                        ' graph_filter, list_value, display_value, version, deleted) '+
                      'VALUES('+element.id+', '+
                ' "' +element.graph_filter+'", "' +element.list_value+ '", "' +element.display_value+
                '", "' +element.version+'", '+element.isdeleted+')';
                //alert('insert gfi = ' + sql);
                tx.executeSql(sql);
                      
            }
            
        });
        
        db.transaction(selectInfo.selectGFIs, dataBase.errorCB);
    },

    updateGField: function(tx){
        var sql;
        info.graph_field.forEach(function(element, index){
            element.id = parseInt(element.id);
            if(GFieldIds.indexOf(element.id) != -1){
                sql = 'UPDATE GRAPH_FIELD SET '+
                'name = "'+ element.name +'", '+
                'graph = "'+element.graph+'", '+
                'length = "'+element.length+'", '+
                'data_type = "'+element.data_type+'", '+
                'align = "'+element.align+'", '+
                'mask = "'+element.mask+'", '+
                'version = "'+element.version+'", '+
                'deleted = "'+element.isdeleted+'" '+
                ' WHERE id='+element.id;
                //alert('update gfi = ' + sql);
                tx.executeSql(sql);

            } else {
                sql = 'INSERT INTO GRAPH_FIELD(id, name, graph, length, data_type, align, mask, version, deleted) ' +
                'VALUES ('+element.id+',"'+element.name+'",'+element.graph+','+element.length+',"'+element.data_type+'",' +
                ' "'+element.align+'", "'+element.mask+'",'+element.version+','+element.isdeleted+')';
                //alert('insert gfi = ' + sql);
                tx.executeSql(sql);

            }

        });

        db.transaction(selectInfo.selectGField, dataBase.errorCB);
    }
};

selectInfo = {
    selectGGs: function(tx){
        tx.executeSql('SELECT * FROM GRAPH_GROUP', [], selectInfo.parseGGs, app.errorCB);  
    },
            
    selectGs: function(tx){
        tx.executeSql('SELECT * FROM GRAPH', [], selectInfo.parseGs, app.errorCB);
    },
            
    selectGOs: function(tx){
        tx.executeSql('SELECT * FROM GRAPH_OPTIONS', [], selectInfo.parseGOs, app.errorCB);
    },
            
    selectGFs: function(tx){
        tx.executeSql('SELECT * FROM GRAPH_FILTER', [], selectInfo.parseGFs, app.errorCB);
    },
            
    selectGFTs: function(tx){
        tx.executeSql('SELECT * FROM GRAPH_FILTER_TYPE', [], selectInfo.parseGFTs, app.errorCB);
    },
            
    selectGFIs: function(tx){
        tx.executeSql('SELECT * FROM GRAPH_FILTER_ITEMS', [], selectInfo.parseGFIs, app.errorCB);
    },

    selectGField: function(tx){
        tx.executeSql('SELECT * FROM GRAPH_FIELD', [], selectInfo.parseGField, app.errorCB);
    },
            
    parseGGs: function(tx, results){
        var len = results.rows.length, i = 0;
//        alert('parse gg');
            info.graph_groups = [0];
            for(i; i<len; i++){
                info.graph_groups[i] = results.rows.item(i);
            }
    },
            
    parseGs: function(tx, results){
        var len = results.rows.length, i = 0;
//        alert('parse g');
            info.graphs = [0];
            for(i; i<len; i++){
                info.graphs[i] = results.rows.item(i);
            }
     },
             
    parseGOs: function(tx, results){
        var len = results.rows.length, i = 0;
//        alert('parse go');
            info.graph_options = [0];
            for(i; i<len; i++){
                info.graph_options[i] = results.rows.item(i);
//                alert(info.graph_options[i].sql_command);
            }
     },
             
    parseGFs: function(tx, results){
        var len = results.rows.length, i = 0;
//        alert('parse gf');
            info.graph_filter = [0];
            for(i; i<len; i++){
                info.graph_filter[i] = results.rows.item(i);
            }
     },
             
    parseGFTs: function(tx, results){
        var len = results.rows.length, i = 0;
//        alert('parse gft');
            info.graph_filter_type = [0];
            for(i; i<len; i++){
                info.graph_filter_type[i] = results.rows.item(i);
            }
            
        //$.mobile.changePage("#categories");
     },
    
    parseGFIs: function(tx, results){
        var len = results.rows.length, i = 0;
//        alert('parse gfi');
            info.graph_filter_items = [0];
            for(i; i<len; i++){
                info.graph_filter_items[i] = results.rows.item(i);
            }
        //$.mobile.changePage("#categories");
     },

    parseGField: function(tx, results){
        var len = results.rows.length, i = 0;
//        alert('parse gfi');
        info.graph_field = [0];
        for(i; i<len; i++){
            info.graph_field[i] = results.rows.item(i);
        }
        infoSelected = true;
        //$.mobile.changePage("#categories");
    }
};

app1 = {
    start: function(){
        
    },

    setEmail: function(){
        try {
            var email = localStorage.getItem('email') ? localStorage.getItem('email') : '';
            $("#mail-from").val(email);
        } catch (e) {
            //NOP
        }

    },
    
    setLogin: function(){
        app1.setEmail();
        var login = localStorage.getItem('login') ? localStorage.getItem('login') : '',
            pass = localStorage.getItem('pass') ? localStorage.getItem('pass') : '';
    
        if(login && pass){
            $('input#login').val(login);
            $('input#pass').val(pass);
            auth = 1;
            $('button#sign-in').trigger('click');
        }
    },
            
    saveLogin: function(){
        var login = $('input#login').val(),
            pass = $('input#pass').val();
    
        localStorage.setItem('login', login);
        localStorage.setItem('pass', pass);
    },
    
    logout: function(){
        $('input#login').val(''),
        $('input#pass').val('');
		localStorage.setItem('login', '');
        localStorage.setItem('pass', '');
        auth = 0;
        infoSelected = false;
        
        $.ajax({
                async: true,
                type: "POST",
                url: AJAX_file,
                error: function() {},
                timeout: 10000,
                data: {
                    type: "logout",
                    uuid: uuid
                    }
            }).done(function(msg) {
                //alert('logged out ' + msg);
            });
    }
};