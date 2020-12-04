function refreshDepartures(destination_div, location_key, max_departures, refresh_type) {
  // Set next refresh (default of 30 secs) before fetching departures as well as after to
  // prevent multiple fetches happening if first fetch takes longer than 1 second
  var d = new Date();
  $(destination_div).data("next_refresh", d.valueOf() + 30000);

  var destination_id = $(destination_div).attr("id");
  var feedURL = '/' + location_key + '?format=json&destination=' + destination_id.replace(/_/g, '%20');

  // Fetch departure list
  $.getJSON(feedURL, function(data) {
    var departure_rows = '';
    if (data.errors.length > 0 ) {
      if (data.errors.indexOf('unavailable') > -1) {
        $('#unavailable').show();
        $('#destinations').hide();
      } else {
        $('#unavailable').hide();
        $('#destinations').show();
		if (data.errors.indexOf('oxontime_down') > -1) {
          var message_page = $(destination_div).data("message_page");
          if (!message_page || message_page == 1) {
            departure_rows = '<tr><td class="noinfo mdl-data-table__cell--non-numeric">Sorry, no info from buses</td></tr>';
            $(destination_div).data("message_page", 2);
          } else {
            departure_rows = '<tr><td class="noinfo mdl-data-table__cell--non-numeric">Sorry, no info from buses, trying again...</td></tr>';
            $(destination_div).data("message_page", 1);
		  }
        }
      }
    } else {
      $('#unavailable').hide();
      $('#destinations').show();
      if (data.departures.length == 0) {
        $(destination_div).data("message_page", 1);
        departure_rows = '<tr><td class="noinfo mdl-data-table__cell--non-numeric">No upcoming departures</td></tr>';
      } else {
        $(destination_div).data("message_page", 1);
        var num_departures = data.departures.length;
        if (num_departures > max_departures) num_departures = max_departures;
        for (i=0; i<num_departures; i++) {
          var departure = data.departures[i];
          departure_rows += '<tr><td class="bus_service mdl-data-table__cell--non-numeric">'
          departure_rows += departure[1];
          departure_rows += '</td><td class="bus_dest mdl-data-table__cell--non-numeric">'
          departure_rows += departure[0];
          departure_rows += '</td><td class="bus_time mdl-data-table__cell--non-numeric">'
          departure_rows += departure[2];
          departure_rows += '</td></tr>';
		}
      }
    }
    $(destination_div).children("table").html(departure_rows);
    // Set next refresh time
    var d = new Date();
    if (refresh_type == 'fast') {
      var next_refresh = d.valueOf() + 5000;
    } else {
      var next_refresh = d.valueOf() + data.refresh_in * 1000;
    }
    $(destination_div).data("next_refresh", next_refresh);
  });

  // Send refresh event to Google Analytics
  if (ga) {
    ga('send', 'event', 'data', 'refresh', location_key + ' ' + destination_id);
  }
}


// Check through running destinations and refresh departures for each one that needs it
function checkRefresh(location_key, ui_type) {
  switch (ui_type) {
    case 'web':
      var max_departures = 100;
      var refresh_type = 'normal';
      break;
    case 'large':
      var max_departures = 4;
      var refresh_type = 'normal';
      break;
    case 'widget':
      var max_departures = 4;
      var refresh_type = 'fast';
      var start_next_dest = false;
      break;
  }

  $("div.dest").each(function() {
    if ($(this).hasClass("running")) {
      var next_refresh = $(this).data("next_refresh");
      var d = new Date();
      if (!next_refresh || next_refresh <= d.valueOf()) {
        if (ui_type == 'widget') {
          var populated = $(this).data("populated");
          if (!populated) {
            refreshDepartures(this, location_key, max_departures, refresh_type);
            $(this).data("populated", true);
          } else {
            stopRunning(this);
            start_next_dest = true;
          }
        } else {
          refreshDepartures(this, location_key, max_departures, refresh_type);
        }
      }
    } else {
      if (ui_type == 'widget' && start_next_dest) {
        startRunning(this);
        start_next_dest = false;
      }
    }
  });

  if (ui_type == 'widget' && start_next_dest) {
    startRunning( $("div.dest:first") );
  }
}


function startRunning(destination_div) {
  $(destination_div).addClass('running');
  $(destination_div).children("table").addClass("mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp");
  $(destination_div).children("table").html('<tr><td class="loading mdl-data-table__cell--non-numeric">Loading departures <div class="sp sp-circle"></div></td></tr>');
  $(destination_div).data("populated", false);
}


function stopRunning(destination_div) {
  $(destination_div).removeClass('running');
  $(destination_div).data("next_refresh", 0);
}


function localStorageSupported() {
  try {
    return "localStorage" in window && window["localStorage"] !== null;
  } catch (e) {
    return false;
  }
}


// Get array of running destinations from local storage for passed location
function getRunningDests(location_key) {
  if (!localStorageSupported()) return null;
  var running_dests_str = localStorage.getItem(location_key);
  if (!running_dests_str) return null;
  return JSON.parse(running_dests_str);
}


// Add destination to list of running destination for passed location
function addRunningDest(location_key, dest_id) {
  if (!localStorageSupported()) return false;
  var running_dests = getRunningDests(location_key);
  if (!running_dests) running_dests = [];
  if (running_dests.indexOf(dest_id) == -1) running_dests.push(dest_id);
  // Running destination array stored as string in local storage
  localStorage.setItem(location_key, JSON.stringify(running_dests));
  return true;
}


// Remove destination from list of running destinations for passed location
function removeRunningDest(location_key, dest_id) {
  if (!localStorageSupported()) return false;
  var running_dests = getRunningDests(location_key);
  if (running_dests) {
    var idx = running_dests.indexOf(dest_id);
    if (idx != -1) running_dests.splice(idx, 1);
    localStorage.setItem(location_key, JSON.stringify(running_dests));
  }
  return true;
}


$(function() {
  // Current location
  var location_key = $("#location_key").text();
  var ui_type = $("#ui_type").text();
  // Get running destinations from previous page view
  var running_dests = getRunningDests(location_key);

  var first = true;
  $("div.dest").each(function() {
    switch (ui_type) {
      case 'web':
        // Add click event listener to each destination that handles starting and
        // stopping loading of departures
        $(this).click(function() {
          if (!$(this).hasClass('running')) {
            startRunning(this);
            addRunningDest(location_key, $(this).attr("id") );
          } else {
            stopRunning(this);
            removeRunningDest(location_key, $(this).attr("id") );
          }
        });
        // If this destination was started on a previous page view, restart it
        if (running_dests && running_dests.indexOf( $(this).attr("id") ) != -1) {
          startRunning(this);
        }
        break;
      case 'large':
        startRunning(this);
        break;
      case 'widget':
        if (first) startRunning(this);
        break;
    }
    first = false;
  });

  checkRefresh(location_key, ui_type);
  setInterval(function(){checkRefresh(location_key, ui_type);}, 1000);
});
