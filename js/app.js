document.addEventListener('deviceready', onDeviceReady, false);

var $$$ = function(query) {
    return document.querySelector(query);
};
var $$ = function(query) {
    return document.querySelectorAll(query);
};

var slideOpts = {
    sl: ['slin', 'slout'],
    sr: ['srin', 'srout'],
    popin: ['popin', 'noanim'],
    popout: ['noanim', 'popout'],
};

var clearNode = function(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

var SwitchTabs = function() {
    try {
        var vIn = $$$('#' + this.dataset.vin),
                vOut = $$$('section.active'),
                vInCmd = this,
                vOutCmd = $$$('.nav button.active');
        vOut.classList.remove('active');
        vIn.classList.add('active');
        vIn.classList.remove('hidden');
        vOut.classList.add('hidden');
        vOutCmd.classList.remove('active');
        vInCmd.classList.add('active');
    } catch (e) {

    }
}

var Slide = function(callback) {
    try {
        SpinningWheel.destroy();
    } catch (e) {
        //alert(e);
    } finally {
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

        }
    }

};

var ScrollTop = function() {
    var el = this.parentNode.parentNode.childNodes[5].childNodes[1],
            offset = el.scrollTop,
            interval = setInterval(function() {
        el.scrollTop = offset;
        offset -= 24;
        if (offset <= -24) {
            clearInterval(interval);
        }
    }, 8);
};

var TextboxResize = function(el) {
    el.removeEventListener('click', ScrollTop, false);
    el.addEventListener('click', ScrollTop, false);
    var leftbtn = el.parentNode.querySelectorAll('button.left')[0];
    var rightbtn = el.parentNode.querySelectorAll('button.right')[0];
    if (typeof leftbtn === 'undefined') {
        leftbtn = {
            offsetWidth: 0,
            className: ''
        };
    }
    if (typeof rightbtn === 'undefined') {
        rightbtn = {
            offsetWidth: 0,
            className: ''
        };
    }
    var margin = Math.max(leftbtn.offsetWidth, rightbtn.offsetWidth);
    el.style.marginLeft = margin + 'px';
    el.style.marginRight = margin + 'px';
    var tooLong = (el.offsetWidth < el.scrollWidth) ? true : false;
    if (tooLong) {
        if (leftbtn.offsetWidth < rightbtn.offsetWidth) {
            el.style.marginLeft = leftbtn.offsetWidth + 'px';
            el.style.textAlign = 'right';
        } else {
            el.style.marginRight = rightbtn.offsetWidth + 'px';
            el.style.textAlign = 'left';
        }
        tooLong = (el.offsetWidth < el.scrollWidth) ? true : false;
        if (tooLong) {
            if (new RegExp('arrow').test(leftbtn.className)) {
                clearNode(leftbtn.childNodes[1]);
                el.style.marginLeft = '26px';
            }
            if (new RegExp('arrow').test(rightbtn.className)) {
                clearNode(rightbtn.childNodes[1]);
                el.style.marginRight = '26px';
            }
        }
    }
};

var App2 = {
    init: function() {
        FastClick.attach(document.body);

        var opts = {
            lines: 12, // The number of lines to draw
            length: 6, // The length of each line
            width: 3, // The line thickness
            radius: 10, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#FFFFFF', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: true, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 15, // Top position relative to parent in px
            left: 22 // Left position relative to parent in px
        };
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);

        var textboxes = $$('h1');
        for (var i = 0; i < textboxes.length; i++)
            TextboxResize(textboxes[i]);

        var tabbtns = $$('.nav>div:not(.nav-active)');
        for (var i = 0; i < tabbtns.length; i++)
            tabbtns[i].addEventListener('click', SwitchTabs, false);

        var navbtns = $$('header button');
        for (var i = 0; i < navbtns.length; i++)
            navbtns[i].addEventListener('click', Slide, false);




//        var signin = $$('#sign-in');
//        for (var i = 0; i < signin.length; i++)
//            signin[i].addEventListener('click', Logining, false);

        $('#apply-filter').bind('click', function() {
            switch (graph_type) {
                case 1:
                    showLineGraph(true);
                    break;
                case 2:
                    showBarGraph(true);
                    break;
                case 3:
                    showPieGraph(true);
                    break;
                default:
                    return;
            }
        });
        
        $('#sign-in').bind('click', function(){
            login = $('#login').val();
            pass = $('#pass').val();
            
            serial = localStorage.getItem('serial');
            
            //alert('uuid: ' + uuid);
            
            if((serial == null || serial == '') && (login != 'demo' || pass != 'demo') && login && pass) {
                navigator.notification.prompt(
                    'Please enter serial number',  // message
                    function (results) {
                        serial = results.input1;
                        localStorage.setItem('serial', serial);
                        $('#btn-login').click();
                    },                  // callback to invoke
                    'Serial ID',            // title
                    ['Ok'],             // buttonLabels
                    '1234567890'                 // defaultText
                );
            } else {
                $('#btn-login').click();
            }
            
        });
        
        $('#btn-login').bind('click', Logining);

        $('#send-mail').bind('click', sendMail);

        $('#logout').bind('click', app1.logout);

        $('.nav>div:not(.nav-active)').bind('touchstart', function() {
            $(this).find('.shadow-nav').show();
        });

        $('.nav>div:not(.nav-active)').bind('touchend', function() {
            setTimeout(function() {
                $('.nav>div:not(.nav-active) .shadow-nav').hide();
            }, 300)
            //$(this).find('.shadow-nav').show();
        })

    }
};
//App2.init();
$(function() {
    //onDeviceReady();
});

function onDeviceReady() {
    try {
        //$("section.hidden .nav").hide();
        /*
        if (parseInt(device.version) >= 7)
            $('body').css('padding-top', '20px');
        */
    } finally {
        try {
            $PATH = null,
                    options = {},
                    info = 0,
                    infoSelected = false;
            graph_types = 0,
                    graph_type = 0,
                    category = 0,
                    graph_options = 0,
                    AJAX_file = "http://mobilerpt.com/service/mobile/test.php",
                    img_path = "http://mobilerpt.com/service/uploader/files/thumbnail/",
                    InfoURL = "http://mobilerpt.com/service/mobile/fetching.php",
                    EmailURL = "http://matrix-soft.org/test/mail.php",
                    elem = 0, GGIds = new Array(0), GIds = new Array(0), GOIds = new Array(0),
                    GFIds = new Array(0), GFTIds = new Array(0), GFIIds = new Array(0),
                    localStorage = 0, db = 0, login = '', pass = '', auth = 0, serial = '', uuid = null,
                    graph_group_version = 0, graph_version = 0, graph_options_version = 0,
                    graph_filter_version = 0, graph_filter_type_version = 0, graph_filter_items_version = 0,
                    boolNames = Array('show_axes', 'legend_floating', 'legend_reversed', 'legend_shadow'),
                    numNames = Array('border_radius', 'border_width', 'margin_bottom',
                    'margin_left', 'margin_right', 'margin_top', 'plot_border_width', 'spacing_bottom',
                    'spacing_left', 'spacing_right', 'spacing_top', 'legend_border_radius',
                    'legend_border_width', 'legend_item_distance', 'legend_item_margin_bottom',
                    'legend_item_margin_top', 'legend_line_height', 'legend_margin',
                    'legend_padding', 'legend_enabled'),
                    
                    defaultOptions = {
                id: 0,
                comp_id: 0,
                graph_group_id: 0,
                image: 0,
                graph_name: '',
                type: 1,
                sql_command: '',
                //chart
                background_color: '#FFFFFF',
                border_color: '#4572A7',
                border_radius: 5,
                border_width: 0,
                margin_bottom: null,
                margin_left: null,
                margin_right: null,
                margin_top: null,
                plot_background_color: null,
                plot_border_color: '#C0C0C0',
                plot_border_width: 0,
                show_axes: false,
                spacing_bottom: 15,
                spacing_left: 10,
                spacing_right: 10,
                spacing_top: 10,
                //legend
                legend_align: 'center',
                legend_background_color: null,
                legend_border_color: '#909090',
                legend_border_radius: 5,
                legend_border_width: 1,
                legend_enabled: true,
                legend_floating: false,
                legend_item_distance: 8,
                legend_item_margin_bottom: 0,
                legend_item_margin_top: 0,
                legend_layout: 'horizontal',
                legend_line_height: 16,
                legend_margin: 15,
                legend_padding: 8,
                legend_reversed: false,
                legend_shadow: false,
                legend_title: null,
                legend_vertical_align: 'bottom',
                legend_width: null,
                legend_x: 0,
                legend_y: 0,
                //colors
                colors: [
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
                ],
                //title.text
                title: '',
                //subtitle.text
                subtitle: '',
                ////////////////////////////////////////////////////////////////////////

                title_align: 'right', //center, left, tight
                title_color: '#0000FF',
                xAxis_lineColor: '#00FF00',
                xAxis_lineWidth: 1,
                xAxis_gridLineColor: '',
                xAxis_gridLineWidth: 1,
                xAxis_title_enabled: true, //always must be true

                xAxis_text: 'sdfsd',
                xAxis_align: 'low', //low, middle, height

                yAxis_lineColor: '#00FF00',
                yAxis_lineWidth: 1,
                yAxis_gridLineColor: '',
                yAxis_gridLineWidth: 1,
                yAxis_title_enabled: true, //always must be true

                yAxis_text: '',
                yAxis_align: 'low', //low, middle, height

                enableMouseTracking: false,
                markerEnabled: false,
                pie_series_name: '',
                table_name: ''
            };

            fileEntry();
            App2.init();
            app.initialize();
        } catch (e) {
            //alert(e);
        } finally {
            navigator.splashscreen.hide();
        }
    }
}

function fileEntry() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, null);
}

function onFileSystemSuccess(fileSystem) {
    fileSystem.root.getFile("", {create: true, exclusive: false}, gotFileEntry, null);
}

function gotFileEntry(file_entry) {
    if (file_entry.fullPath.length > 3)
        $PATH = file_entry.fullPath + '/';
    else
        $PATH = "file:///storage/sdcard0/";
}

function isFileExists(fileSource, element, index) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getFile(fileSource, {create: false},
        function(file_entry) {
            if (element.deleted != 1) {
                var class_name = 'color1';
                switch (index % 4) {
                    case 0:
                        class_name = 'color1';
                        break;
                    case 1:
                        class_name = 'color2';
                        break;
                    case 2:
                        class_name = 'color3';
                        break;
                    default:
                        class_name = 'color4';
                        break;
                }


                list += '<li id=' + element.id + ' class="' + class_name + '" data-vin="types" data-sd="sl">' +
                        '<div class="shadow-li"></div>' +
                        '<div class="innerLi">' +
                        '<img src="' + $PATH + element.logo_path + '" />' +
                        '<div class="big">' + element.group_name.slice(0, 13) + '</div>' +
                        '<div class="light"></div>' +
                        '</div>' +
                        '</li>';
            }
            setCategoriesList(index);

        },
        function() {
            if (element.deleted != 1) {
                var class_name = 'color1';
                switch (index % 4) {
                    case 0:
                        class_name = 'color1';
                        break;
                    case 1:
                        class_name = 'color2';
                        break;
                    case 2:
                        class_name = 'color3';
                        break;
                    default:
                        class_name = 'color4';
                        break;
                }


                list += '<li id=' + element.id + ' class="' + class_name + '" data-vin="types" data-sd="sl">' +
                        '<div class="shadow-li"></div>' +
                        '<div class="innerLi">' +
                        '<img src="' + img_path + element.logo_path + '" />' +
                        '<div class="big">' + element.group_name.slice(0, 15) + '</div>' +
                        '<div class="light"></div>' +
                        '</div>' +
                        '</li>';


            }
            setCategoriesList(index);

            downloadFile(fileSource);
        });

    }, null);
}

function downloadFile(name) {
    window.requestFileSystem(
            LocalFileSystem.PERSISTENT, 0,
            function onSuccess(fileSystem) {
                fileSystem.root.getFile(
                        "tmp.html", {create: true, exclusive: false},
                function gotEntry(file_entry) {
                    var sPath = file_entry.fullPath.replace("tmp.html", "");
                    var fileTransfer = new FileTransfer();
                    file_entry.remove();
                    fileTransfer.download(
                            img_path + name,
                            $PATH + name,
                            function(theFile) {
                               //alert('downloaded ' + theFile.toURI());
                            },
                            function(error) {
                               //alert('error');
                            }
                    );
                }, null);
            }, null);
}

function isGraphImgExists(fileSource, element, index, category) {
    var counter = 0,
        graph_type = ' data-vin="line-details" data-sd="sl" ';
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getFile(fileSource, {create: false},
        function(file_entry) {
            if (element.graph_group_id == category && element.deleted != 1) {
                switch (counter % 3) {
                    case 0:
                        list += '<div class="main-grid"><div class="grid-1" data-id="'
                                + element.id + '" data-type="' + element.type + '" ' + graph_type + '>';
                        break;
                    case 1:
                        list += '<div class="grid-2" data-id="'
                                + element.id + '" data-type="' + element.type + '" ' + graph_type + '>';
                        break;
                    case 2:
                        list += '<div class="grid-3" data-id="'
                                + element.id + '" data-type="' + element.type + '" ' + graph_type + '>';
                        break;
                }
 
                list += '<div class="shadow"></div>' +
                        '<div class="type-icon">' +
                        '<img src="' + $PATH + element.logo_path + '" />' +
                        '</div>' +
                        '<div class="type-desc"><b>' + element.graph_name.slice(0, 23) + '</b></div>';

                switch (counter % 3) {
                    case 0:
                    case 1:
                        list += '</div>';
                        if (index == info.graphs.length)
                            list += '</div>';
                        break;
                    case 2:
                        list += '</div></div>';
                        break;
                }
                counter++;
            }
            setTypesList(index);

        },
                function() {
                    if (element.graph_group_id == category && element.deleted != 1) {
                        switch (counter % 3) {
                            case 0:
                                list += '<div class="main-grid"><div class="grid-1" data-id="'
                                        + element.id + '" data-type="' + element.type + '" ' + graph_type + '>';
                                break;
                            case 1:
                                list += '<div class="grid-2" data-id="'
                                        + element.id + '" data-type="' + element.type + '" ' + graph_type + '>';
                                break;
                            case 2:
                                list += '<div class="grid-3" data-id="'
                                        + element.id + '" data-type="' + element.type + '" ' + graph_type + '>';
                                break;
                        }

                        list += '<div class="shadow"></div>' +
                                '<div class="type-icon">' +
                                '<img src="' + img_path + element.logo_path + '" />' +
                                '</div>' +
                                '<div class="type-desc"><b>' + element.graph_name.slice(0, 23) + '</b></div>';

                        switch (counter % 3) {
                            case 0:
                            case 1:
                                list += '</div>';
                                if (index == info.graphs.length)
                                    list += '</div>';
                                break;
                            case 2:
                                list += '</div></div>';
                                break;
                        }
                        counter++;
                        downloadFile(fileSource);
                    }
                    setTypesList(index);
                });

    }, null);
}