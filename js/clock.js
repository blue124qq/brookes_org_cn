function updateClock() {
  var d = new Date();
  var currTime = d.toTimeString().substring(0,8)
  $("#currtime").text(currTime);
}

$(function() {
  var ui_type = $("#ui_type").text();

  if (ui_type == 'large') {
    updateClock();
    setInterval(function(){updateClock();}, 1000);
  }
});
