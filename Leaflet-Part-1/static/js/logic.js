// Store the API endpoint as queryUrl.
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  // Log the data:
  console.log(data)
  // Run a function we'll create below and give it the data we just collected:
  variables(data.features)
});

// Create the map variable.
let myMap = L.map("map", {
  center: [37.862999, -122.2423325],
  zoom: 7
});
  
// Add a tile layer (the background map image) to the map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create a function that collects/passes along the main JSON data and creates the variables.
function variables(earthquake) {
  
  // Initialie the variables.
  let coordinates = []
  let lat = []
  let lon = []
  let properties = []
  let mag = []
  let place = []
  let depth = []
  let depthList = []
  
  //Log the last variable to check it.
  console.log(depthList)

  // Loop through the data to create the variables.
  for (let i = 0; i < earthquake.length; i++) {
    coordinates = earthquake[i].geometry.coordinates;
    lat = coordinates[1]
    lon = coordinates[0]
    depth = coordinates[2]
    depthList.push(depth)
      
    properties = earthquake[i].properties
    mag = properties.mag
    place = properties.place

    // While still in the for loop, create the circle markers for each entry
    L.circleMarker([lat, lon], {
    fillOpacity: 0.85,
    color: 'black',
    weight: 0.25,
    // Make the fill color correspond to the depth using a function we'll create below.
    fillColor: colorDepth(depth),
    // Make the marker size correspond to the magnitude using a function we'll create below.
    radius: markerSize(mag)
  }).bindPopup(`<h3>${place}</h3> <hr> <h4>Magnitude: ${mag}<br>Depth: ${depth}</h4>`).addTo(myMap);
  };

  // Create the function to associate the color with the depth.
  function colorDepth(d) {
    let colors = ['#ffffb2','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026']
  
    if (d <= 10) {
      return colors[0]
    }
    else if (d <= 30) {
      return colors[1]
    }
    else if (d <= 50) {
      return colors[2]
    }
    else if (d <= 70) {
      return colors[3]
    }
    else if (d <= 90) {
      return colors[4]
    }
    else return colors[5]
  };

  // Create the function to associate the marker size with the magnitude.
  // Note that some magnitudes may be 0, missing, or even negative, and trying to get a square root of those will result in an error.
  function markerSize(arg) {
    if (arg > 0) {
      return (Math.sqrt(arg) * 8)
    }
    else if (arg < 0) {
      let pos = arg * -1
      return (Math.sqrt(pos) * 8)
    }
    else if (arg == 0) {
      return 0.00001
    }
  };

  // Create the function for the legend.
  function mapLegend() {
    // The code below comes from Leaflet's tutorial on making a choropleth map
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend')
        // Set the grades to match the majority of the depth data.
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // Loop through the grades and generate a label with a colored square for each grade.
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
        '<i style="background:' + colorDepth(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
    };

    legend.addTo(myMap);
};

// Run the map legend function.
mapLegend();

};