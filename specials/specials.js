// attach filter action on document ready
$(document).ready(function(){
  $("#sFilter").on("keyup", function() {
    var ftext = $(this).val().toLowerCase();
    refreshFilter(ftext)
  });
});

function refreshFilter(ftext) {
  console.log(ftext)
  $("#locationdiv>li:not(.btn)").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(ftext) > -1)
  });

  // Toggle No Results pane depending on whether there are results
  var numVisible = $("#locationdiv>li:not(.btn):visible").length;
  if(numVisible > 0) {
    $("#noResults").addClass("d-none");
  }
  else {
    $("#noResults").removeClass("d-none");
  }

  // hide categories for which there are no results:

  // first, hide stations:
  $('[aria-controls^="sta"]').each(function(i){
    if( hideCatIfEmpty($(this)) ) {
        $(this).parent().addClass("d-none");
    }
    else {
        $(this).parent().removeClass("d-none");
    }
  });

  // Then the locations:
  $('[aria-controls^="loc"]').each(function(i){
    hideCatIfEmpty($(this));
  });
}

// hide a category if all <li> elements "controlled" by it are invisible;
// return true if the category was hidden
function hideCatIfEmpty(elem){
    var cat_id = elem.attr('aria-controls') // the id which this category controls
    var num_sub_items = $("#locationdiv>li:visible#"+cat_id).length // the number of sub-category items that are visible
    console.log(cat_id, num_sub_items)
    if(num_sub_items > 0) {
      elem.removeClass("d-none");
      return false;
    }
    else {
      elem.addClass("d-none");
      return true;
    }
}

// cycles through weekdays based off button click in either direction
function getWeekDays() {

  var d = new Date();
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  //Today
  let index = 1;
  var currentDate = weekday[index];
  document.getElementById("today").innerHTML = currentDate;
  displayData(currentDate);

  //Yesterday
  document.getElementById("button1").addEventListener("click", e => {
    e.preventDefault();
    if (index <= 0) {
      index = 7;
    }
    currentDate = weekday[index - 1];
    index = index - 1;
    document.getElementById("today").innerHTML = currentDate;
    document.getElementById("locationdiv").innerHTML = "";
    displayData(currentDate);
    return false;
  });

  //Tomorrow
  document.getElementById("button2").addEventListener("click", e => {
    e.preventDefault();
    if (index >= 6) {
      index = -1;
    }
    currentDate = weekday[index + 1];
    index = index + 1
    // document.getElementById("today").innerHTML = currentDate;
    $("#today").text(currentDate);
    document.getElementById("locationdiv").innerHTML = "";
    displayData(currentDate);
    return false;
  });
}

getWeekDays()

function displayData(currentDate) {

  $.getJSON("https://esabherwal.github.io/danforks/menu_scrape/specials_data.json", function (json) {
    var locations = Object.keys(json);
    //***********************************************
    //Debug: This isn't updating asynchronously
    //***********************************************
    var d = currentDate;
    var dictionary = [];
    var dictionary_stations = [];
    var location_stations = [];
    var food_url_array = [];
    var food_url_array_stations = [];
    var nutrition = [];
    var nutrition_s = [];
    for (var i = 0; i < locations.length; i++) {
      var x = locations[i];

      //checks if the index is referecing the DUC, BD, or the Village
      //those 3 have different json structure
      if (i != 2 && i != 9 && i != 10) {
        var data = json[x][""].menus;
        var date = Object.keys(data);
        for (var q = 0; q < date.length; q++) {
          var split_date = date[q].split(",")[0]; //@ 0 will give the weekDAY
          if (d == split_date) {
            var day_data = data[date[q]];
            var day_data_keys = Object.keys(day_data.menu);
            for (var v = 0; v < day_data_keys.length; v++) {
              var vv = day_data_keys[v];
              var special_types = day_data.menu[vv];
              var special_types_keys = Object.keys(special_types);
              for (var h = 0; h < special_types_keys.length; h++) {
                var hh = special_types_keys[h];
                var types_data = special_types[hh];
                var types_data_keys = Object.keys(types_data);
                for (var f = 0; f < types_data_keys.length; f++) {
                  var food_item = types_data_keys[f];
                  var food_items = types_data[food_item];
                  var cals = food_items.calories;
                  var carbs = food_items.carbs;
                  var fat = food_items.fat;
                  var protein = food_items.protein;
                  var url = food_items.nutrition_url;
                  const labels = food_items.labels;
                  nutrition = {//}.push({
                    key: food_item,
                    value: [cals, carbs, fat, protein, url, labels]
                  }//);
                  dictionary.push({
                    key: locations[i],
                    value: nutrition
                  });
                }
              }
            }

          }
        }
      }
      else {  //now we are looking @ the DUC, Bear's Den, and the Village
        var stations = Object.keys(json[x]);// array of stations
        for (var s = 0; s < stations.length; s++) {
          var data = json[x][stations[s]].menus;
          var date = Object.keys(data);
          for (var q = 0; q < date.length; q++) {
            var split_date = date[q].split(",")[0]; //@ 0 will give the weekDAY
            if (d == split_date) {
              var day_data = data[date[q]];
              var day_data_keys = Object.keys(day_data.menu);
              for (var v = 0; v < day_data_keys.length; v++) {
                var vv = day_data_keys[v];
                var special_types = day_data.menu[vv];
                var special_types_keys = Object.keys(special_types);
                for (var h = 0; h < special_types_keys.length; h++) {
                  var hh = special_types_keys[h];
                  var types_data = special_types[hh];
                  var types_data_keys = Object.keys(types_data);
                  for (var f = 0; f < types_data_keys.length; f++) {
                    var food_item = types_data_keys[f];
                    var food_items = types_data[food_item];
                    var cals = food_items.calories;
                    var carbs = food_items.carbs;
                    var fat = food_items.fat;
                    var protein = food_items.protein;
                    var url = food_items.nutrition_url;
                    const labels = food_items.labels;
                    //console.log(food_items)
                    nutrition_s = {//}.push({
                      key: food_item,
                      value: [cals, carbs, fat, protein, url, labels]
                    }//);
                    dictionary_stations = {//}.push({
                      key: stations[s],
                      value: nutrition_s
                    }//);
                    location_stations.push({
                      key: locations[i],
                      value: dictionary_stations
                    });

                  }
                }
              }
            }
          }
        }
      }
    }


    Array.prototype.contains = function (arr) {
      for (i in this) {
        if (this[i] == arr) return true;
      }
      return false;
    }

    var array = ["empty_string"];

    // console.log(dictionary);
    /////////////////// Locations without stations
    for (var aa = 0; aa < (Object.keys(dictionary)).length; aa++) {
      var loc = dictionary[aa].key;
      var locStr = loc.replace(/\s+/g, '');
      locStr = locStr.replace('&', '');
      console.log(locStr);
      if (!(array.contains(loc))) {
        //appends locations
        const listItem = document.createElement('h6');
        listItem.innerHTML = '<a class="btn btn-primary btn-block text-center" data-toggle="collapse" href="#loc' + locStr + '"role="button" aria-expanded="true" aria-controls="loc' + locStr + '">' + loc + '</a>';
        locationdiv.appendChild(listItem);
        array.push(loc);
      }

      const location = dictionary[aa];
      const locationName = location.key;
      const food = location.value;
      locationdiv.appendChild(createListItem("loc" + locStr, locationName, food));

    }

    //  console.log(location_stations);
    /////////////////// Locations with stations
    var array_loc = ["empty_string"];
    var array_stations = ["empty_string"];
    var location_stations_keys = Object.keys(location_stations);

    for (var aa = 0; aa < Object.keys(location_stations).length; aa++) {
      var loc = location_stations[aa].key;
      var locStr = loc.replace(/\s+/g, ''); //console.log(loc);
      var sta = location_stations[aa].value.key;// console.log(sta,"-------------------");
      var staStr = sta.replace(/\s+/g, '');
      if (!(array.contains(loc))) {
        //appends locations
        var listItem = document.createElement('h6');
        listItem.innerHTML = '<a class="btn btn-primary btn-block text-center" data-toggle="collapse" href="#loc' + locStr + '"role="button" aria-expanded="true" aria-controls="loc' + locStr + '">' + loc + '</a>';
        locationdiv.appendChild(listItem);
        array.push(loc);
      }
      if (!(array.contains(sta))) {
        //appends stations
        var listItem = document.createElement('li');
        listItem.innerHTML = '<a data-toggle="collapse" href="#sta' + staStr + '"role="button" aria-expanded="true" aria-controls="sta' + staStr + '">' + sta + "</a>";
        listItem.className = 'btn btn-light btn-group btn-sm text-center collapse show';
        listItem.id = "loc" + locStr;
        locationdiv.appendChild(listItem);
        array.push(sta);
      }

      const id = "sta" + staStr;
      const locationStation = location_stations[aa];
      const locationName = locationStation.key;
      const station = locationStation.value;
      const stationName = station.key;
      const food = station.value;
      locationdiv.appendChild(createListItem(id, stationName + " \u00b7 " + locationName, food));

    }
    var br = document.createElement('br');
    locationdiv.appendChild(br);

    var ftext = $("#sFilter").val().toLowerCase();
    refreshFilter(ftext)
  });
}

function createListItem(id, locationName, food) {
  const li = document.createElement("li");
  li.id = id;
  li.classList.add("collapse");
  li.classList.add("show");

  const link = document.createElement("a");
  const foodName = food.key;
  const macros = food.value;
  const nutritionUrl = macros[4];
  link.href = nutritionUrl;
  link.innerText = foodName;
  link.addEventListener("click", e => {
    e.preventDefault();
    $("#modal-title").text(foodName);
    $("#modal-location").text(locationName);
    const labels = macros[5];
    const iconBox = document.getElementById("icon-anchor");
    if (labels.length) {
      iconBox.innerHTML = "";
      for (const label of labels) {
        const icon = document.createElement("img");
        icon.src = "../menus/" + label + ".jpg";
        iconBox.appendChild(icon);
        iconBox.appendChild(document.createTextNode(" "));
      }
      iconBox.addEventListener("click", e => {
        e.preventDefault();
        $("#icon-modal").modal("show");
        return false;
      });
      $(iconBox).show();
    } else {
      $(iconBox).hide();
    }
    const cals = macros[0];
    $("#td-cals").text(cals);
    const carbs = macros[1];
    $("#td-carbs").text(carbs);
    const fat = macros[2];
    $("#td-fat").text(fat);
    const protein = macros[3];
    $("#td-protein").text(protein);
    document.getElementById("modal-button").href = nutritionUrl;
    $("#macro-modal").modal("show");
    return false;
  });

  li.appendChild(link);
  return li;
}
