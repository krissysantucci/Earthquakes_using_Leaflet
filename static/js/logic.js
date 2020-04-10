
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeInfo) {
console.log(earthquakeInfo);


  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var grayscale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: API_KEY
    });

    var outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.outdoors',
        accessToken: API_KEY
    });
  
var circles = [];

 for (var i = 0; i < earthquakeInfo.length; i++) {
   coords = [earthquakeInfo[i].geometry.coordinates[1], earthquakeInfo[i].geometry.coordinates[0]]
   properties = earthquakeInfo[i].properties;

   var color = "maroon";

    if (properties.mag < 1) {
       color = "limegreen";
    }
    else if (properties.mag < 2) {
       color = "yellow"
    }
    else if (properties.mag < 3) {
        color = "gold"
    }
    else if (properties.mag < 4) {
        color = "darkorange"
    } 
    else if (properties.mag < 5) {
        color = "red"
    }     
//console.log(circles)

   var myCircles = L.circle(coords, {
            fillOpacity: 0.75,
            color: color,
            fillColor: color,
            radius: (properties.mag *10000)
    })
    myCircles.bindPopup(`<h3>${properties.place}</h3> <hr> <h3>Magnitude: ${properties.mag}</h3><hr> <h3>Type: ${properties.type}</h3>`)
    circles.push(myCircles);
  }
console.log(myCircles)

  var earthquakes = L.layerGroup(circles);

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Gray Map": grayscale,
    "Outdoors Map": outdoors
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };
//////////
  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes, grayscale, outdoors]
    });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);
// }
  //legend

  var info = L.control ({
    position: "bottomright"
  });
  
  // When the layer control is added, insert a div with the class of "legend"
  
  info.onAdd = function() {
      var div = L.DomUtil.create("div", "legend");
      var mags = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    
  var color = ["limegreen", "yellow", "gold", "darkorange", "red", "maroon"];
    
  for (var i = 0; i < mags.length; i++) {
    div.innerHTML +=
      '<p style="margin-left: 15px">' + '<i style="background:' + color[i] + ' "></i>' + '&nbsp;&nbsp;' + mags[i]+ '<\p>';
  }

    return div;
  };
  // Add the info legend to the map
  info.addTo(myMap);

  myMap.on("overlayadd", function() {
    info.addTo(myMap);
  });

  myMap.on('overlayremove', function() {
    //Remove the legend
    myMap.removeControl(legend);
  });


// Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, info, {
    collapsed: false
  }).addTo(myMap)
}