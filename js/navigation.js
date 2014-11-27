/**
 * Created by олег on 19.11.14.
 */

var divFilterTable;
$(document).ready(function() {
    //var screenWidth = screen.width;
    var screenWidth = $(document).width();
    var screenHeight = $(document).height();
    $("#button-login").bind("click", function() {
        $("#categories").css("z-index", "2");
        $("#categories").css("left", screenWidth);
        $("#categories").removeClass("hidden");
        $("#categories").addClass("active");
        $("#categories").animate({
            left: "0px"
        },300, function() {
            $("#login").removeClass("active");
            $("#login").addClass("hidden");
            $("#categories").css("z-index", "0");
        });
    });

    $("#categories-img").bind("click", function() {
        $("#login").css("z-index", "2");
        $("#login").css("left", -screenWidth);
        $("#login").removeClass("hidden");
        $("#login").addClass("active");
        $("#login").animate({
            left: "0px"
        },300, function() {
            $("#categories").removeClass("active");
            $("#categories").addClass("hidden");
            $("#login").css("z-index", "0");
        });
    });

    $(".elem-list").bind("click", function() {
       /* $("#groups").removeClass("hidden");
        $("#groups").addClass("active");
        $("#categories").removeClass("active");
        $("#categories").addClass("hidden");*/
        $("#groups").css("z-index", "2");
        $("#groups").css("left", screenWidth);
        $("#groups").removeClass("hidden");
        $("#groups").addClass("active");
        $("#groups").animate({
            left: "0px"
        },300, function() {
            $("#categories").removeClass("active");
            $("#categories").addClass("hidden");
            $("#groups").css("z-index", "0");
        });
    });
    $("#back-groups").bind("click", function() {
/*        $("#groups").removeClass("active");
        $("#groups").addClass("hidden");
        $("#categories").removeClass("hidden");
        $("#categories").addClass("active");*/
        $("#categories").css("z-index", "2");
        $("#categories").css("left", -screenWidth);
        $("#categories").removeClass("hidden");
        $("#categories").addClass("active");
        $("#categories").animate({
            left: "0px"
        },300, function() {
            $("#groups").removeClass("active");
            $("#groups").addClass("hidden");
            $("#categories").css("z-index", "0");
        });
    });

    $(".category").bind("click", function() {
/*        $("#orders").removeClass("hidden");
        $("#orders").addClass("active");
        $("#groups").removeClass("active");
        $("#groups").addClass("hidden");*/
        $("#orders").css("z-index", "2");
        $("#orders").css("left", screenWidth);
        $("#orders").removeClass("hidden");
        $("#orders").addClass("active");
        $("#orders").animate({
            left: "0px"
        },300, function() {
            $("#groups").removeClass("active");
            $("#groups").addClass("hidden");
            $("#orders").css("z-index", "0");
        });
    });

    $("#back-orders").bind("click", function() {
/*        $("#orders").removeClass("active");
        $("#orders").addClass("hidden");
        $("#groups").removeClass("hidden");
        $("#groups").addClass("active");*/
        $("#groups").css("z-index", "2");
        $("#groups").css("left", -screenWidth);
        $("#groups").removeClass("hidden");
        $("#groups").addClass("active");
        $("#groups").animate({
            left: "0px"
        },300, function() {
            $("#orders").removeClass("active");
            $("#orders").addClass("hidden");
            $("#groups").css("z-index", "0");
        });
    });

    $("#mail-orders").bind("click", function() {
        $("#mail").css("z-index", "2");
        $("#mail").css("left", screenWidth);
        $("#mail").removeClass("hidden");
        $("#mail").addClass("active");
        $("#mail").animate({
            left: "0px"
        },300, function() {
            $("#orders").removeClass("active");
            $("#orders").addClass("hidden");
            $("#mail").css("z-index", "0");
        });
    });

    $("#back-mail").bind("click", function() {
        $("#orders").css("z-index", "2");
        $("#orders").css("left", -screenWidth);
        $("#orders").removeClass("hidden");
        $("#orders").addClass("active");
        $("#orders").animate({
            left: "0px"
        },300, function() {
            $("#mail").removeClass("active");
            $("#mail").addClass("hidden");
            $("#orders").css("z-index", "0");
        });
    });

    $("#filter-orders").bind("click", function() {
        $("#filter").css("z-index", "2");
        $("#filter").css("left", screenWidth);
        $("#filter").removeClass("hidden");
        $("#filter").addClass("active");
        $("#filter").animate({
            left: "0px"
        },300, function() {
            $("#orders").removeClass("active");
            $("#orders").addClass("hidden");
            $("#filter").css("z-index", "0");
        });
    });

    $("#cross-filter").bind("click", function() {
        $("#orders").css("z-index", "2");
        $("#orders").css("left", -screenWidth);
        $("#orders").removeClass("hidden");
        $("#orders").addClass("active");
        $("#orders").animate({
            left: "0px"
        },300, function() {
            $("#filter").removeClass("active");
            $("#filter").addClass("hidden");
            $("#orders").css("z-index", "0");
        });
    });

    $(".filter-table").bind("click", function() {
        addToTop($(this));
        var heightFilter = $("#div-filter").height();
        $("#div-filter").css("z-index", "2");
        $("#div-filter").css("bottom", -heightFilter);
        $("#div-filter").css("display", "block");
        $("#div-filter").animate({
            bottom: "10"
        },300, function() {
            $("#div-filter").css("z-index", "0");
        });

    });

    $("#orders-graph").bind("click", function() {
        $("#graph").removeClass("hidden");
        $("#graph").addClass("active");
        $("#orders").removeClass("active");
        $("#orders").addClass("hidden");

    });

    $("#back-graph").bind("click", function() {
        $("#orders").removeClass("hidden");
        $("#orders").addClass("active");
        $("#graph").removeClass("active");
        $("#graph").addClass("hidden");
    });

    $("#mail-graph").bind("click", function() {
        $("#mail").css("z-index", "2");
        $("#mail").css("left", screenWidth);
        $("#mail").removeClass("hidden");
        $("#mail").addClass("active");
        $("#mail").animate({
            left: "0px"
        },300, function() {
            $("#graph").removeClass("active");
            $("#graph").addClass("hidden");
            $("#mail").css("z-index", "0");
        });
    });

    $("#filter-graph").bind("click", function() {
        $("#filter").css("z-index", "2");
        $("#filter").css("left", screenWidth);
        $("#filter").removeClass("hidden");
        $("#filter").addClass("active");
        $("#filter").animate({
            left: "0px"
        },300, function() {
            $("#graph").removeClass("active");
            $("#graph").addClass("hidden");
            $("#filter").css("z-index", "0");
        });
    });

});


function addToTop(div) {
    divFilterTable = $(div).detach();
    $(".filter-table-div").prepend(divFilterTable);
}