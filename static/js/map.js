
// Creating map object
var map = L.map("map", {
  center: [40.7128, -74.0059],
  zoom: 2.5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

var link = "countries_medres.json";

// Function that will determine the color of a country
function chooseColor(country) {
  switch (country) {
  case "United States":
    return "red";
  case "Germany":
    return "orange";
  case "United Kingdom":
    return "blue";
  case "Russia":
    return "yellow";
  case "China":
    return "crimson";
  case "France":
    return "green";
  case "Australia":
    return"blueviolet";
  case "Italy":
    return "olive";
  case "Canada":
    return "aqua";
  case "Japan":
    return "darkred";
  case "Brazil":
    return "darkorange";
  case "Netherlands":
    return "deeppink";
  case "Spain":
    return "hotpink";
  case "Denmark":
    return "plum";
  case "New Zealand":
    return "Salmon";
  case "Jamaica":
    return "Sienna";
  case "Sweden":
    return "chocolate";
  case "Korea":
    return "violet";
  case "Croatia":
    return "teal";
  case "South Africa":
    return "forestgreen";
  }
}

// Grabbing our GeoJSON data..

d3.json(link, function(data) {
  // TODO: replace the CSV_FILE_NAME
  d3.csv("../data/Top20Countries.csv", function (csvData) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a country)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: chooseColor(feature.properties.name),
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          map.fitBounds(event.target.getBounds());
        }
      });
      // Giving each feature a pop-up with information pertinent to it
      // layer.bindPopup("<h1>" + feature.properties.name + "</h1>");
      // csv_data contains the data from a *.csv file
      for (i = 0; i < csvData.length; ++i) {
        var row = csvData[i];
        if (row.country === feature.properties.name) {
          // row.gdp
          layer.bindPopup("<h1>" + row.country + "</h1> <hr> <h2>" + " Gold: " + row.Gold + "</h2> <h3>" + " Silver: " + row.Silver + "</h3> <h4>" + " Bronze: " + row.Bronze + "</h4>");
          break;
        }
      }

    }
  }).addTo(map);
})});
