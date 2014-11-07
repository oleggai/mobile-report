var Logining = function(callback) {
    $('#shadow').show();
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

    
    var company = localStorage.getItem('company') ? parseInt(localStorage.getItem('company')) : '';
    uuid = localStorage.getItem('uuid');
    
    if(false && (uuid == null || uuid == '' || uuid.length < 10)) {
        notif.alert("Please connect to Internet and restart the application!", null, ' ');
        uuid = null;
        localStorage.setItem('uuid', '');
        clearTimeout(registrationTimeout);
        $('#shadow').hide();
        return;
    }
    
    if (!login || !pass) {
        $('#shadow').hide();
        notif.alert('Insert login and password!', null, ' ');
        auth = 0;
        
    } else {
        if (navigator.connection.type === Connection.NONE) {//11.12.2013
            //якщо немає з'єднання з інтернетом
            $('#shadow').hide();
            auth = 0;
            notif.alert('No Internet connection!', null, ' ');
        } else {
            $.ajax({
                async: true,
                type: "POST",
                url: AJAX_file,
                error: function() {
                    $('#shadow').hide();
                    notif.alert("Can't connect to server!", null, ' ');
                },
                timeout: 5000,
                data: {
                    type: "login",
                    login: login,
                    pass: pass,
                    company: company,
                    uuid: uuid,
                    serial: serial,
                    gg_version: graph_group_version,
                    g_version: graph_version,
                    go_version: graph_options_version,
                    gf_version: graph_filter_version,
                    gft_version: graph_filter_type_version,
                    gfi_version: graph_filter_items_version
                }
            }).done(function(msg) {
                //alert(msg);
                if (msg) {
                    
                    info = JSON.parse(msg);
                    if (info.info) {
                        if(info.serial === false) {
                            $('#shadow').hide();
                            auth = 0;
                            localStorage.setItem('serial', '');
                            notif.alert('Serial number is invalid!', null, ' ');
                            return;
                        }
                        
                        localStorage.setItem('company', info.info.id);
                        try{
                            if(!company || company == info.info.id)
                                saveInfo.init();
                            else
                                db.transaction(app.clearDB);
                        } catch(e){
                    		//alert(e);
                    	}
                        
                        InfoURL = (info.info.direct_connection == 1) ? "http://" + info.info.ip_adress :
                                "http://mobilerpt.com/service/mobile/fetching.php";
                        
                        $('#shadow').hide();
                    
                    	if (auth === 0) {
                    		notif.confirm('Save password?', app.confSavePass, ' ', ['YES', 'NO']);
                    	}
                    
                    	loginInterval = setInterval(function(){
                            //alert(infoSelected);
                            if(infoSelected){
                            	clearInterval(loginInterval);
                                updateCategoriesList();
                            	vOut.addEventListener('webkitAnimationEnd', onAnimationEnd, false);
                            	vOut.addEventListener('animationend', onAnimationEnd);
                            	if (callback && typeof(callback) === 'function') {
                            	    callback();
                            	}
                            	vOut.classList.remove('active');
                            	vIn.classList.remove('hidden');
                            	vIn.classList.add(slideOpts[slideType][0]);
                            	vOut.classList.add(slideOpts[slideType][1]);
                                dataBase.start();
                            }
                        }, 100);
                    

                    

                    } else {
                    
                        $('#shadow').hide();
                    	auth = 0;
                        notif.alert('Login or password is incorrect!', null, ' ');
                        
                    }
                } else {
                    $('#shadow').hide();
                    auth = 0;
                    notif.alert('Login or password is incorrect!', null, ' ');
                }
            });
        }
    }

};