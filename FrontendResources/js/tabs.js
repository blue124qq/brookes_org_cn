/*------------------------------------*\
Title:		Oxford Brookes University Tabs JavaScript
Author:		Web Team, Creative Services
Created:	Version 1.0 - 21 March 2013 BMD
Modified:	21 March 2013 BMD

// http://www.entheosweb.com/tutorials/css/tabs.asp
\*------------------------------------*/

$(document).ready(function () {
    $(".tab_content:first").addClass("displayblock");

    /* Tabs */
    $("ul.tabs li").click(function () {
        $("ul.tabs li").removeClass("active");
        $(".tab_content").removeClass("displayblock");
        $(this).addClass("active");
        var activeTab = $(this).attr("rel");
        $("#" + activeTab).addClass("displayblock");

        $(".tab_drawer_heading").removeClass("tab_active");
        $(".tab_drawer_heading[rel^='" + activeTab + "']").addClass("tab_active");
    });

    /* Accordion */
    $(".tab_drawer_heading").click(function () {
        $('.tab_drawer_heading').not(this).removeClass('tab_active');
        $(this).toggleClass('tab_active');

        var tab_activeTab = $(this).attr("rel");
        $(".tab_content").not("#" + tab_activeTab).removeClass("displayblock");
        $("#" + tab_activeTab).toggleClass("displayblock");
    })

    /* Accordion */
    $(".acc_drawer_heading").click(function () {
        $('.acc_drawer_heading').not(this).removeClass('acc_active');
        $(this).toggleClass('acc_active');

        var acc_activeTab = $(this).attr("rel");
        $(".acc_content").not("#" + acc_activeTab).removeClass("displayblock");
        $("#" + acc_activeTab).toggleClass("displayblock");
    })
});