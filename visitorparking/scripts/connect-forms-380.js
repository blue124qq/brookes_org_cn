
(function () {

    // Setup ajax error handling
    var ignore401 = false;

    $(document).ajaxError(function (event, jqxhr, settings, thrownError) {

        // 401 Unauthorized - Redirect to login page
        if (jqxhr.status === 401) {
            if (ignore401)
                return;
            ignore401 = true;
            window.location.href =
                window.base_url +
                "SignIn.aspx?ReturnUrl=" +
                encodeURIComponent(window.location.pathname + window.location.hash);
        }
        else {
            var error = JSON.parse(jqxhr.responseText).Message || "Error";
            alert(error);
        }
    });

})();

$(document).ready(function () {

    FreezePageScrollOnDialog();

    // Set the current culture
    var culture = $("html").prop("lang");
    if (culture) {
        Globalize.culture(culture);
    }

    // Placeholder polyfill for IE 9 and below (placeholder not supported) and for all other IE because placeholder gets hidden on focus
    var isIE = navigator.userAgent.match(/MSIE/) || navigator.userAgent.match(/Trident/);
    $('input[placeholder],textarea[placeholder]').placeholder({ force: isIE });
    
    // Date controls
    $.datepicker.regional[''].buttonText =
    $.datepicker.regional['en-US'].buttonText =
    $.datepicker.regional['en-GB'].buttonText = 'Pick date';
    $.datepicker.regional['de'].buttonText = 'Geben Sie ein Datum an';
    
    var regionSettings =
        $.datepicker.regional[culture] ||
        $.datepicker.regional[culture.substring(0, 2)] ||
        $.datepicker.regional[""];
    
    $.datepicker.setDefaults(regionSettings);

    $.datepicker.setDefaults({
        showOn: 'button',
        buttonImage: window.base_url + 'images/datepicker.gif',
        buttonImageOnly: true,
        buttonText: regionSettings.buttonText,
        constrainInput: false,
    });

    $('input.datefield').datepicker();

    //TODO PG
    //.focus(selectTextOnFocus);
    
    // Date pager and Date picker controls
    $('input.datepager, input.datepicker').datepicker({
        buttonImage: window.base_url + 'images/datepicker-coloured.png',
        beforeShow: function (textbox, instance) { 
            instance.dpDiv.css({ marginTop: '18px', marginLeft: -(instance.dpDiv.width() - 16) / 2 + 'px' }); 
        }
    });

    // Timepicker controls
    var timeFormat = Globalize.culture().calendars.standard.patterns.t;

    // Convert .NET time format into PHP time format
    timeFormat = timeFormat
        .replace('HH', 'H')
        .replace('h', 'g')
        .replace('mm', 'i')
        .replace('tt', 'A');

    $('.timepicker').timepicker({ 'scrollDefaultNow': true, 'timeFormat': timeFormat });

    // Popover info
    $('input[data-toggle="popover"]').popover({ trigger: 'focus', html: true, placement: 'auto right', container: '#content' });

    // Popover help
    var touchDevice = IsTouch();
    var popoverTrigger = touchDevice ? 'click' : 'hover';

    $('.help-item[data-toggle="popover"]').popover({ trigger: popoverTrigger, html: true, placement: 'auto right', container: 'body' });

    // Money controls
    $('.moneyfield').change(function () {

        var number = Globalize.parseFloat($(this).val());
        
        if (isNaN(number))
            return;

        var string = Globalize.format(number, "c");

        $(this).val(string);

    }).focus(selectTextOnFocus);

    // Percent controls
    $('.percentfield').change(function () {

        var number = Globalize.parseFloat($(this).val());

        if (isNaN(number))
            return;

        var string = Globalize.format((number/100), "P");

        $(this).val(string);

    }).focus(selectTextOnFocus);

    $('a[data-showless]').each(function () {
        var $this =     $(this),
            count =     $this.data('count') - 1,
            expanded =  $this.prev('input'),
            list =      $(expanded).prev('ul');
            
        if (expanded.val() == "0") {
            var liToHide = $('li:gt(' + count + ')', list);
            liToHide.each(function () {
                if ($(this).children("input[type='checkbox']").is(':checked') == false)
                    $(this).hide();
            });
            $this.addClass('show-more');
        }
        else {
            var text = $this.data('showless');
            $this.data('showless', $this.html());
            $this.html(text);
            $this.addClass('show-less');
        }
        $this.show();

     }).click(function (e) {
         var $this =    $(this),
             count =    $this.data('count') - 1,
             expanded = $this.prev('input'),
             list =     $(expanded).prev('ul');

        if (expanded.val() == "0") {
            $('li', list).show();
            expanded.val("1");
            $this.removeClass('show-more');
            $this.addClass('show-less');
        } else {
            var liToHide = $('li:gt(' + count + ')', list);
            liToHide.each(function () {
                if ($(this).children("input[type='checkbox']").is(':checked') == false)
                    $(this).hide();
            });
            expanded.val("0");
            $this.removeClass('show-less');
            $this.addClass('show-more');
        }
        var text = $this.data('showless');
        $this.data('showless', $this.html());
        $this.html(text);

        e.preventDefault();
    });

    $("table.grouped").on("click", "td.opener", function (e) {

        // This code only works for expanding at one level
        var row = $(this).closest('tr'),
            link = row.children(1).find('a'),
            rows = row.nextUntil('tr.group-row').not('.spacer'),
            showing = link.hasClass('closed');
        
        if (showing) {
            link.removeClass('closed').addClass('open');
            row.removeClass('closed').addClass('open');
            rows.fadeIn();
        }
        else {
            link.removeClass('open').addClass('closed');
            row.removeClass('open').addClass('closed');
            rows.hide();
        }
        e.preventDefault();
    });

});

(function ($) {

    $.fn.focusAndSelect = function () {

        var elem = this[0],
            elemLen = elem.value.length;

        if (elemLen > 0) {
            elem.select();
        }
        elem.focus();
    };

    $.fn.clearFileInput = function () {

        return this.each(function () {
            // val works in FF, replaceWith works in IE & Chrome
            $(this).replaceWith($(this).val("").clone(true));
        });
    };

})(jQuery);

window.C2 = window.C2 || {};

C2.Partial = (function () {

    var load = function (url, elementSelector) {

        var $element = $(elementSelector);

        $.ajax({
            url: url,
            cache: false,
            success: function (data) {
                $element.replaceWith(data);
            }
        });
    };

    return {
        load: load
    }

})(jQuery);

C2.Modal = (function ($) {

    var callback,
        showing = false,
        callbackNeeded = false,
        passedData,
        canShowBusy = true,

        show = function (url, refreshCallback, title, data, busyText) {

            if (showing || $("#c2modal").length > 0) {
                return;
            }

            showing = true;
            callback = refreshCallback;
            callbackNeeded = false;
            passedData = data;
            canShowBusy = true;

            if (busyText != null) {
                setTimeout(function () {
                    if (canShowBusy)
                        C2.Busy.show(busyText);
                }, 1000);
            }

            $.ajax({
                url: url,
                cache: false,
                complete: function () {
                    showing = false;
                    canShowBusy = false;
                    C2.Busy.hide();
                },
                success: function (html) {

                    canShowBusy = false;
                    C2.Busy.hide();
                    //C2.DirtyPage.off();

                    $(document.body).append(html);

                    //C2.Partial.setupInputs();
                    //C2.Partial.setupValidation();

                    if (title) {
                        $("#c2modal .modal-title").html(title);
                    }

                    $("#c2modal").one("shown.bs.modal", function () {
                        setTimeout(
                            function () {
                                //var cursorFocusAtEnd = $('#c2modal .cursorFocusAtEnd');

                                //if (cursorFocusAtEnd.length === 0) {
                                $("#c2modal").find(':text,textarea,select').filter(':visible:enabled:first').focus();
                                //} else {
                                //    cursorFocusAtEnd.focusEnd();
                                //}
                            }, 0);
                    });

                    $("#c2modal").one("hidden.bs.modal", function () {
                        $("#c2modal").remove();
                        if (callbackNeeded) {
                            callback();
                        }
                        //C2.DirtyPage.on();
                    });

                    $("#c2modal").modal("show");
                }
            });
        },

        close = function (data) {
            passedData = data;
            $("#c2modal").modal("hide");
        },

        refreshRequired = function (refresh) {
            callbackNeeded = refresh;
        },

        replaceContent = function (data) {
            var content = $(data.trim()).find(".modal-content").html();
            $("#c2modal .modal-content").html(content);
        },

        replaceBody = function (data) {
            var content = $(data.trim()).find(".modal-body").html();
            $("#c2modal .modal-body").html(content);
        },

        getPassedData = function () {
            return passedData;
        }

        handleFormSubmit = function (formSelector, modalUpdatedCallback) {

            formSelector = formSelector.replace("#c2modal", "");

            $("#c2modal").on("submit", formSelector, function (e) {
                e.preventDefault();
                $(".disableOnSubmit").prop("disabled", true);
                var $form = $(this);

                //if ($form.valid()) {
                    $.ajax({
                        type: $form.attr("method"),
                        url: $form.attr("action"),
                        data: $form.serialize(),
                        success: function (data) {
                            if (data === "") {
                                C2.Modal.refreshRequired(true);
                                C2.Modal.close();
                            } else if (data.redirectUrl) {
                                window.location.href = data.redirectUrl;
                            } else {
                                C2.Modal.replaceBody(data);
                                //C2.Partial.setupInputs();
                                //C2.Partial.setupValidation();
                                $(".disableOnSubmit").prop("disabled", false);
                                if (modalUpdatedCallback)
                                    modalUpdatedCallback();
                            }
                        }
                    });
                //}
            });
        };

    return {
        show: show,
        close: close,
        refreshRequired: refreshRequired,
        replaceContent: replaceContent,
        replaceBody: replaceBody,
        handleFormSubmit: handleFormSubmit,
        getPassedData : getPassedData
    }

})(jQuery);

C2.Busy = (function ($) {

    var $body,
        $busy,
        busyIcon = window.base_url + "icons/busy.gif",
        template = '<div class="busy" style="display:none"><div class="busy-content"><img src="' + busyIcon + '" alt="" /><p></p></div></div>';

    // Mac shows the busy dialog when navigating back to a page that had it displayed so remove it
    $(window).bind("pageshow", function (event) {
        if (event.originalEvent.persisted) {
            $(".busy.open").remove();
        }
    });

    return {
        add: function () {
            if (!$busy) {
                $body = $(document.body);
                $busy = $(template).appendTo($body);
            }
        },

        show: function (message) {
            if ($busy) {
                $busy.find("p").text(message);
                $busy.addClass("open").show();

                // IE freezes gif amination after a post so reset the image source to fix this
                if (/msie|trident/i.test(navigator.userAgent))
                    $busy.find("img")[0].src = busyIcon;
            }
        },

        hide: function () {
            if ($busy) {
                $busy.removeClass("open").hide();
            }
        }
    };

})(jQuery);

// Method to select all text on focus method that works reliably with keyboard, tab and mouse inputs with all browsers
var selectTextOnFocus = function () {

    $(this).select().one('mouseup', function (e) {
        $(this).unbind('keyup');
        e.preventDefault();
    }).one('keyup', function () {
        $(this).select().unbind('mouseup');
    });
};

/* function to delay execution of another function */
var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

/*
* Function which opens a window with the specified url of the specified size.
*/
var photoWindow = null;
function displayPhoto(url, width, height) {
    try {
        photoWindow.close();
    } catch (e) { }
    photoWindow = window.open(url, "photoWindow", 'width=' + width + ',height=' + height + ',status=no,scrollbars=no,location=no,toolbar=no,resizable=no');
    photoWindow.focus();
}

/*
* Set focus on the specified element, or if no element is specified try to set 
* focus on the first text field on the page.
*/
function setFocus(eid) {

    try {
        if (eid != null) {
            var control = document.getElementById(eid);
            if (control != null) {

                if (control.tagName.toLowerCase() === "input" ||
                    control.tagName.toLowerCase() === "select") {
                    control.focus();
                    return;
                } else if (control.tagName.toLowerCase() === "p") {
                    control.scrollIntoView(false);
                    return;
                } else {
                    var elems = $('#' + eid + ' :input:enabled:visible:first').get();
                    if (elems.length > 0) {
                        elems[0].focus();
                        return;
                    }
                }
            }
        }

        $(':input:enabled:visible:first').focus();

    } catch (e) { }
}

/*
* Copy the value from one input field to another.
*/
function copyValue(fid, tid) {
    try {
        var from = document.getElementById(fid);
        var to = document.getElementById(tid);
        if (to.value.length == 0) {
            to.value = from.value;
        }
    } catch (e) { }
}

/**********************************/
/* javascript for Bubble Tooltips */
/**********************************/

function enableTooltips() {
    var links, i, h;
    if (!document.getElementById || !document.getElementsByTagName) {
        return;
    }
    h = document.createElement("span");
    h.id = "btc";
    h.setAttribute("id", "btc");
    h.style.position = "absolute";
    document.getElementsByTagName("body")[0].appendChild(h);
    links = $("table, img");
    for (i = 0; i < links.length; i++) {
        if (links[i].title.indexOf("tip:") >= 0) {
            Prepare(links[i]);
        }
    }
}

function Prepare(el) {
    var tooltip, t, b, s;

    t = el.getAttribute("title");

    if (t == null || t.length == 0) {
        return;
    }

    el.removeAttribute("title");
    tooltip = CreateEl("span", "tooltip2");
    s = CreateEl("div", "top");

    var thisMatch = t.split(":");
    if (thisMatch[1]) {
        var testNode = document.getElementById(thisMatch[1]);
        var newNode = testNode.cloneNode(1);
        s.appendChild(newNode);
    } else {
        s.appendChild(document.createTextNode(t));
    }

    tooltip.appendChild(s);
    b = CreateEl("b", "bottom");

    tooltip.appendChild(b);
    setOpacity(tooltip);
    el.tooltip = tooltip;
    el.onmouseover = showTooltip;
    el.onmouseout = hideTooltip;
    el.onmousemove = showTooltip;
}

function showTooltip(e) {
    var d = document.getElementById("btc");
    if (d.childNodes.length == 0) {
        d.appendChild(this.tooltip);
    }
    Locate(d, e);
}

function hideTooltip() {
    var d = document.getElementById("btc");
    if (d.childNodes.length > 0) {
        d.removeChild(d.firstChild);
    }
}

function setOpacity(el) {
    el.style.filter = "alpha(opacity:95)";
    el.style.KHTMLOpacity = "0.95";
    el.style.MozOpacity = "0.95";
    el.style.opacity = "0.95";
}

function CreateEl(t, c) {
    var x = document.createElement(t);
    x.className = c;
    x.style.display = "block";
    return (x);
}

function Locate(obj, e) {
    var fxy = xy(e);
    var x = fxy.x, y = fxy.y;
    if (y < getWindowHeight() / 2) {
        $(obj).removeClass("tooltipv").addClass("tooltip2");
        obj.style.top = y + 7 + 'px';
    }
    else {
        $(obj).removeClass("tooltip2").addClass("tooltipv");
        obj.style.top = y - obj.offsetHeight - 1 + 'px';
    }
    obj.style.left = x - 65 + 'px';
    obj.style.zIndex = "10000";

}


/********************************************************************************************************/
/********************************************************************************************************/
/********************************************************************************************************/

function clickThrough(obj, e) {
    $(obj).hide();
    var receiver = document.elementFromPoint(e.clientX, e.clientY);
    $(receiver).click();
    $(obj).show();
}

/******************************************************************************************************/

function Cart(basketContainer, basketContent, basketLink, cartShowing, cartPosition) {

    var basketContainerSel = '#' + basketContainer,
        basketContentSel = '#' + basketContent,
        basketLinkSel = '#' + basketLink,
        cartShowingSel = '#' + cartShowing,
        cartPositionSel = '#' + cartPosition;

    var div = $(basketContentSel);
    var position = parseInt($(cartPositionSel).val());

    if (isNaN(position)) {
        position = 0;
    }

    div.scrollTop(position);
    div.scroll(function () {
        var positionFld = $(cartPositionSel);
        var divscroll = $(basketContentSel);
        positionFld.val(divscroll.scrollTop());
    });

    if ($(cartShowingSel).val() == '1')
        $(basketContentSel).show();

    $(basketLinkSel).click(function () {
        toggleCart(basketContentSel, cartShowingSel);
        return false;
    });

    $("a[href*='#basket']").click(function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        showCart(basketContentSel, cartShowingSel);
        return false;
    });

    var touchDevice = IsTouch();

    if (!touchDevice) {
        $(basketContainerSel).lazybind(
            'mouseout',
            function () {
                if ($(cartShowingSel).val() == '1') {
                    toggleCart(basketContentSel, cartShowingSel);
                }
            },
            2500,
            'mouseover');
    }
}

function toggleCart(basketContent, hiddenControlId) {
    
    if ($(hiddenControlId).val() == '0') {
        $(hiddenControlId).val('1');
        $(basketContent).fadeIn(100);
    } else {
        $(hiddenControlId).val('0');
        $(basketContent).fadeOut(200);
    }
}

function showCart(basketContent, hiddenControlId) {
    
    $(hiddenControlId).val('1');
    $(basketContent).fadeIn(100);
    
}


function toggleVisibility(controlId) {
    $(controlId).fadeToggle("slow");

}

function toggle(controlId) {
    $(controlId).slideToggle("slow");
}

function initiateToggle(controlToToggle, controlToSwap, resolvedUrl) {

    toggle(controlToToggle);
    var i = $(controlToSwap).children("img");
    if (i[0].src.indexOf("icons/shrink.png") != -1) {
        i[0].setAttribute("src", resolvedUrl + "icons/expand.png");
    } else {
        i[0].setAttribute("src", resolvedUrl + "icons/shrink.png");
    }
}

function showHideProps(linkControl, controlToToggle, showStr, hideStr) {
    toggle(controlToToggle);
    var control = $(linkControl);
    if (control.text() == showStr) {
        control.text(hideStr);
        control.prop("title", hideStr);
    } else {
        control.text(showStr);
        control.prop("title", showStr);
    }
}

function editCalQuestionToggle(controlToToggle, link1Control, link2Control, url, titleControl, title) {

    $(titleControl).text(title);
    $(link1Control).attr("href", url + "&SingleDay=true");
    $(link2Control).attr("href", url + "&SingleDay=false");
    if ($(controlToToggle).css('display') == 'none') {
        toggle(controlToToggle);
    }
}

function editCalHeaderToggle(headerToToggle, questionToHide, editControl, editText, closeText, editIcon) {

    if ($(questionToHide).css('display') != 'none') {
        toggle(questionToHide);
    }
    toggleVisibility(headerToToggle);

    var str = $(editControl).text();
    if (str == editText) {
        $(editControl).html('<img src=\"'+ editIcon +'\" alt=\"' + closeText + '\">'  + closeText);
    } else {
        $(editControl).html('<img src=\"' + editIcon + '\" alt=\"' + editText + '\">' + editText);
    }
}


function xy(e) {
    /// <summary>Returns the coordinates of the event e.</summary>
    /// <param name="e">The event to calculate the coordinates.</param>
    /// <returns>The event coordinates x,y.</returns>
    var posx = 0;
    var posy = 0;
    if (!e) e = window.event;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop
            + document.documentElement.scrollTop;
    }
    return { x: posx, y: posy };
}

function xyTrue(e) {
    /// <summary>Returns the coordinates of the event e.</summary>
    /// <param name="e">The event to calculate the coordinates.</param>
    /// <returns>The event coordinates x,y.</returns>
    var posx = 0;
    var posy = 0;
    if (!e) e = window.event;
    if (e.clientX || e.clientY) {
        posx = e.clientX;
        posy = e.clientY;
    }
    return { x: posx, y: posy };
}

function getWindowHeight() {
    var winH = 460;
    if (document.body && document.body.offsetHeight) {
        winH = document.body.offsetHeight;
    }
    if (document.compatMode == 'CSS1Compat' &&
    document.documentElement &&
    document.documentElement.offsetHeight) {
        winH = document.documentElement.offsetHeight;
    }
    if (window.innerHeight) {
        winH = window.innerHeight;
    }
    return winH;
}

function radioButtonUncheckOn2ndClick(source) {
    var lastChecked = $(source).attr('lastChecked');

    if (lastChecked == 'true') {
        $(source).prop('checked', false);
    } 

    $(source).attr('lastChecked', $(source).prop('checked'));
}

function updateInvContents() {
    $('.invContent').slideUp("slow");
    var invoices = $("[id$='invoiceDiv']");
    for (var i = 0, len = invoices.length; i < len; i++) {
        var invoice = invoices[i];
        var divs = $(invoice).find('div');
        var radio = $(divs[0]).find('input');
        if ($(radio).is(":checked")) {
            var content = divs[1];
            $(content).slideDown("slow");
            break;
        }
    }
}

function tempChangeTargetToBlank() {

    document.getElementById("aspnetForm").target = '_blank';

    setTimeout(function () { document.getElementById("aspnetForm").target = ''; }, 500);
}

function Stringformat () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

function loadListExpander(listId, expandButtonId, shrinkButtonId, maxCountOnShrink) {
    /// <summary>Shrink and expand HTML lists like ul. Execute after the DOM is ready. Use the last two items of the list as buttons: the 1st to expand and the 2nd to shrink.</summary> 
    /// <param name="listId" type="String">The id of the HTML list to expand.</param>
    /// <param name="expandButtonId" type="String">The id of the li item used as a button to expand.</param>
    /// <param name="shrinkButtonId" type="String">The id of the li item used as a button to shrink.</param>
    /// <param name="maxCountOnShrink" type="Number">The maximum number of list items to be visible on shrink.</param>

    var expandItemsList = $('#' + expandButtonId);
    var shrinkItemsList = $('#' + shrinkButtonId);
    shrinkItemsListFunction();

    expandItemsList.click(function () {
        $('#' + listId + ' li').not(':visible').show('slow');
        expandItemsList.hide();
        shrinkItemsList.show();
    });

    shrinkItemsList.click(function () {
        shrinkItemsListFunction();
    });

    function shrinkItemsListFunction() {
        shrinkItemsList.hide();
        var toHideItems = $('#' + listId + ' li:gt(' + (maxCountOnShrink - 1) + ')');
        if (toHideItems.length > 2) {
            toHideItems.hide();
            expandItemsList.show();
        }
        else
            expandItemsList.hide();
    }



}


function IsTouch() {
    return ("ontouchstart" in window)
        || window.DocumentTouch && document instanceof DocumentTouch
        || window.touch
        || navigator.userAgent.toLowerCase().indexOf("touch") != -1;
}
// lazy bind event for jquery.   will add an event which fires the given function after a time out
// the abort event will cancel the timer
(function ($) {
    $.fn.lazybind = function (event, fn, timeout, abort) {
        var timer = null;
        $(this).bind(event, function (e) {
            var ev = e;
            timer = setTimeout(function () {
                fn(ev);
            }, timeout);
        });
        if (abort == undefined) {
            return;
        }
        $(this).bind(abort, function () {
            if (timer != null) {
                clearTimeout(timer);
            }
        });
    };
})(jQuery);

// called on doc ready to freeze scrolling when a dialog div is visible
// could be applied to event on any dialog divs that dont use 
// post back to show/hide. but none exist at the moment 
function FreezePageScrollOnDialog()
{
    var anyDialogsVisible = $('.dialog:visible');
    if (anyDialogsVisible.length > 0) {
        $('body').addClass('stopScrolling');
    } else {
        $('body').removeClass('stopScrolling');
    }
}

function getPopover($parent) {
    return $parent.popover().data('bs.popover').tip();
}

function ellipsis(id) {
    var $element = $(id);
    var width = $element.first().width();
    $element.addClass("ellipsis");
    $element.css('max-width', width);
}

function scrollTopDelayed() {
    $(window).on("load", function () {
        setTimeout(function () {
            $('html,body').scrollTop(0);
        }, 80);
    });
}

function isInputOfTypeSupported(type) {
    var isSupported = false;
    var input = document.createElement('input');
    try {
        input.type = type;
        input.setAttribute("type", type);
        isSupported = (input.type === type);

    } catch (e) {
    }
    delete input;
    return isSupported;
}