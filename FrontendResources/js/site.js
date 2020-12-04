/*------------------------------------*\

Title:		Oxford Brookes University Global JavaScript
Author:		Web Team, Communication Services
Created:	Version 1.0 - 6 August 2015 BMD
Modified:	29 August 2018 BMD

\*------------------------------------*/

/* LINK TO TOP */
jQuery.extend(jQuery.easing, {
    easeOutQuart: function (x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
});
(function ($) {
    $.fn.UItoTop = function (options) {
        var defaults = {
            text: ' ',
            min: 200,
            inDelay: 600,
            outDelay: 400,
            containerID: 'totop',
            containerHoverID: 'totophover',
            scrollSpeed: 1200,
            easingType: 'linear'
        },
            settings = $.extend(defaults, options),
            containerIDhash = '#' + settings.containerID,
            containerHoverIDHash = '#' + settings.containerHoverID;

        $('body').append('<div><a href="#" id="' + settings.containerID + '">' + settings.text + '</a></div>');
        $(containerIDhash).hide().on('click.UItoTop', function () {
            $('html, body').animate({
                scrollTop: 0
            }, settings.scrollSpeed, settings.easingType);
            //$('#'+settings.containerHoverID, this).stop().animate({'opacity': 0 }, settings.inDelay, settings.easingType);
            return false;
        })
            .prepend('<span id="' + settings.containerHoverID + '"></span>')
        $(window).scroll(function () {
            var sd = $(window).scrollTop();
            if (typeof document.body.style.maxHeight === "undefined") {
                $(containerIDhash).css({
                    'position': 'absolute',
                    'top': sd + $(window).height() - 50
                });
            }
            if (sd > settings.min)
                $(containerIDhash).fadeIn(settings.inDelay);
            else
                $(containerIDhash).fadeOut(settings.Outdelay);
        });
    };
})(jQuery);

$(document).ready(function () {
    $().UItoTop({
        easingType: 'easeOutQuart'
    });
});

/* COOKIE CHOICE */
// sort out the cookie when someone clicks a button on the popup
function cookieset(choice) {
    if (choice == 'done') {
        setCookie("cookieconsent", choice, 180);
    }
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path = /;domain = .brookes.ac.uk";
}
// check if cookie exists. If not, display popup.
function getCookie() {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf('cookieconsent' + "=");
        if (c_start != -1) {
        }
        else {
            document.getElementById("PopUp").style.display = "block";
        }
    }
    else {
        document.getElementById("PopUp").style.display = "block";
    }
}

/* MOBILE NAVIGATION */
$(document).ready(function () {
    (function () {
        $(document).ready(function () {
            $('body').addClass('js');
            var $submenu = $('#submenu'),
            $submenulink = $('.submenu-link');
            $submenulink.click(function () {
                $submenulink.toggleClass('active');
                $submenu.toggleClass('active');
                return false;
            });
        });
    })();
});

/* FIT TEXT */
(function ($) {
    $.fn.fitText = function (kompressor, options) {
        // Setup options
        var compressor = kompressor || 1,
        settings = $.extend({
            'minFontSize': Number.NEGATIVE_INFINITY,
            'maxFontSize': Number.POSITIVE_INFINITY
        }, options);
        return this.each(function () {
            // Store the object
            var $this = $(this);
            // Resizer() resizes items based on the object width divided by the compressor * 10
            var resizer = function () {
                $this.css('font-size', Math.max(Math.min($this.width() / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
            };
            // Call once to set.
            resizer();
            // Call on resize. Opera debounces their resize by default.
            $(window).on('resize', resizer);
        });
    };
})(jQuery);

// Written by Ashit Gajwani on 26th of August, 2016. 
$(document).ready(function () {
    if (window.location.href.indexOf("research-blogs") > -1) {

        console.log("only executing on research-blogs");

        $("div.row ul.media li.col-md-3").each(function (i) {
            $(this).prependTo(".widgetBody");
            $(this).append("<div class='grid-inner'><p class='image-wrapper'></p></div>");
            $(this).find("div.grid-inner").append($(this).contents());
            $(this).replaceWith(function () {
               return $("<div class='grid-item bg-lightgrey'>").append($(this).contents());
            });
        });

        $("div.grid-inner").each(function () {
            $(this).find("a.media-imgrev").appendTo($(this).find("p.image-wrapper"));
        });

        $(".widgetBody").attr("class", "grid");

        $("div.grid-item div.media-body p span.misc-1").each(function (i) {
            var friendly_names = {'drmolecule.org':'Dr Molecule',
                'anneosterrieder.com':'Dr Anne Osterrieder',
                'davealdridge.brookesblogs.net':'Dr David Aldridge',
                'jbailey2013.wordpress.com':'Professor Joanne Begiato',
                'internationalpoliticsfromthemargin.net':'Dr Stephen Hurt',
                'www.cycleboom.org':'cycle BOOM',
                'openbrookes.net':'Brookes Teaching Fellowship Writing',
                'www.miniaturehorizons.com':'Dr Louise Hughes',
                'sliceofcakeandapocketofpins.wordpress.com':'Dr Alysa Levene',
                'anacanhoto.com':'Dr Ana Canhoto',
                'smartgirlstv.wordpress.com':'Dr Michele Paule',
                'ob1architecture.blogspot.com': 'Year 1 Architecture & Interior Architecture',
                'www.christianapayne.com': 'Professor Christiana Payne',
                'junegirvin2.wordpress.com': 'Professor June Girvin',
                'publicpolicypast.blogspot.com': 'Public Policy and the Past',
                'throughtheacademiclookingglass.wordpress.com': 'Dr Sian Jones',
                'obertobrookes.com': 'OBERTO',
                'hugoshirley.blogspot.com': 'Dr Hugo Shirley',
                'www.alexandrawilson.org': 'Dr Alexandra Wilson',
                'sonicartresearch.co.uk': 'Sonic Art Research Unit',
                'hotpropertyatbrookes.blogspot.com': 'Real Estate and Construction',
                'brightcluboxford.blogspot.com': 'Bright Club Oxford'
            };

            for (var i in friendly_names)
            {
                if ($(this).text().indexOf(i) > 0)
                {
                    $(this).text(friendly_names[i]);
                }
            }
        });

        //$("head").append("<style>.grid-item {width:200px; padding:10px}</style>");
        $("head").append("<style>.grid,.grid-item{background:#fff}html{overflow-y:scroll}.grid:after{content:'';display:block;clear:both}.grid-item,.grid-sizer{width:100%}@media (min-width:768px){.grid-item,.grid-sizer{width:50%}}@media (min-width:992px){.grid-item,.grid-sizer{width:33.333%}}@media (min-width:1400px){.grid-item,.grid-sizer{width:25%}}.grid-item{float:left;margin:0;padding:0 5px 10px;color:#262524;overflow:hidden;display:block}.grid-item img{display:block;max-width:100%}.grid-inner{background:#eee;padding:10px;border:1px solid #ccc}.grid-inner img{width:100%}</style>");

        $("head").append("<script src='/frontendresources/js/isotope-docs.min.js'></script>");

        $(".grid").isotope({
            itemSelector: ".grid-item",

            layoutMode: "packery",
            //cellsByRow: {columnWidth: 200, rowHeight: 650},
            masonry: {
                columnWidth: '.grid-sizer'
            }
        });
        $(".grid").parent().append($("section.grid-row div.sm-gutter"));
        $("section.grid-row").remove();
        $("div.grid").parent().parent().prepend("<h1>Research blogs</h1><p>The latest blog posts from Brookes' research staff.</p>");
        console.log('ending now...');
    }
});