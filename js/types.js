var SlideTypes = function(callback) {
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

    updateTypesList($(this).attr('id'));

    vOut.addEventListener('webkitAnimationEnd', onAnimationEnd, false);
    vOut.addEventListener('animationend', onAnimationEnd);
    if (callback && typeof(callback) === 'function') {
        callback();
    }
    vOut.classList.remove('active');
    vIn.classList.remove('hidden');
    vIn.classList.add(slideOpts[slideType][0]);
    vOut.classList.add(slideOpts[slideType][1]);
};

function updateTypesList(category) {
    list = '';
        
    if (info.graphs) {
        $('div#types-list').html('');
        info.graphs.forEach(function(element, index) {
            isGraphImgExists(element.logo_path, element, index, category);
        });
        
    }
}

function setTypesList(index){
    if((index+1) == info.graphs.length){
        $('div#types-list').html(list);

            $('.grid-1, .grid-2, .grid-3').bind('touchstart', function() {
                $(this).find('div.shadow').show();
            });

            $('.grid-1, .grid-2, .grid-3').bind('touchend', function() {
                $(this).find('div.shadow').hide();
            });

            var listitems = $$('.grid-1, .grid-2, .grid-3');
            for (var i = 0; i < listitems.length; i++)
                listitems[i].addEventListener('click', SlideLineGraph, false);
    }
}