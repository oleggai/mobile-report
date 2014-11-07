function updateCategoriesList() {
    try{
        list = '';
        if (info.graph_groups.length > 0) {
            $('ul#categories-list').html('');
            info.graph_groups.forEach(function(element, index) {

                isFileExists(element.logo_path, element, index);

            });

            

        }
    }catch(e){
        //alert(e);
    }
}

function setCategoriesList(index){
    if((index+1) == info.graph_groups.length){
        $('ul#categories-list').html(list);

        $('ul#categories-list li').bind('touchstart', function() {
                                            $(this).find('div.shadow-li').show();
                                            });

        $('ul#categories-list li').bind('touchend', function() {
                                            $(this).find('div.shadow-li').hide();
                                            });

        var listitems = $$('#categories li');
        for (var i = 0; i < listitems.length; i++)
            listitems[i].addEventListener('click', SlideTypes, false);
    }
}