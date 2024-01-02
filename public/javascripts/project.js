$(document).ready(function () {
    $.getJSON("/movies/fetch_state", function (data) {
      var data = data.result;
  
      data.map((item, i) => {
        
        $("#stateid").append(
          $("<option>").text(item.statename).val(item.stateid)
        );
      });
    });
  
  $('#stateid').change(function(){
  
      $.getJSON("/movies/fetch_city",{typeid:$('#stateid').val()} ,function (data) {
          var data = data.result;
          $("#cityid").empty()
          $("#cityid").append(
              $("<option>").text('-Select City-'))
          data.map((item, i) => {
            
            $("#cityid").append(
              $("<option>").text(item.cityname).val(item.cityid)
            );
          });
        });
  })
  });

  $(document).ready(function () {
    $.getJSON("/movies/fetch_cinema", function (data) {
      var data = data.result;
  
      data.map((item, i) => {
        
        $("#cinemaid").append(
          $("<option>").text(item.cinemaname).val(item.cinemaid)
        );
      });
    });
  
  $('#cinemaid').change(function(){
  
      $.getJSON("/movies/fetch_screen",{typeid:$('#cinemaid').val()} ,function (data) {
          var data = data.result;
          $("#screenid").empty()
          $("#screenid").append(
              $("<option>").text('-Select Screen-'))
          data.map((item, i) => {
            
            $("#screenid").append(
              $("<option>").text(item.screenname).val(item.screenid)
            );
          });
        });
  })
  });