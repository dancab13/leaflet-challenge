// Store our API endpoint as queryUrl.
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  console.log(data)

  variables(data.features)
});

  // let earthquake = data.features
  // console.log(earthquake)

  let myMap = L.map("map", {
    center: [37.862999, -122.2423325],
    zoom: 7
  });
  
  // Adding a tile layer (the background map image) to our map:
  // We use the addTo() method to add objects to our map.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  function variables(earthquake) {
    let coordinates = []
    let lat = []
    let lon = []
    let properties = []
    let mag = []
    let place = []
    let depth = []
    let depthList = []
    console.log(depthList)

    for (let i = 0; i < earthquake.length; i++) {
      coordinates = earthquake[i].geometry.coordinates;
      lat = coordinates[1]
      lon = coordinates[0]
      depth = coordinates[2]
      depthList.push(depth)
        
      properties = earthquake[i].properties
      mag = properties.mag
      place = properties.place
    //}

    //maxMin(depthList)

    // Stack Overflow helped me get the following code to find the max and min of a JavaScript array.
    //function maxMin(arg) {
        var sorted = depthList.sort(function(a, b) {
          return a - b;
          });
        console.log(sorted)
        var smallest = sorted[0],                                       
            largest  = sorted[sorted.length - 1];
        
        console.log('Smallest: ' + smallest);
        console.log('Largest: ' + largest);
  
        let depthRange = largest - smallest
        console.log(depthRange)

        let firstSixth = []
        let secondSixth = []
        let thirdSixth = []
        let fourthSixth = []
        let fifthSixth = []
        
      //  colorDepth(depthRange, depth)
      //};

      //function colorDepth(arg1, arg2) {
        let colors = ['#fef0d9','#fdd49e','#fdbb84','#fc8d59','#e34a33','#b30000']
        firstSixth = depthRange * (1/6)
        secondSixth = depthRange * (1/3)
        thirdSixth = depthRange * (1/2)
        fourthSixth = depthRange * (2/3)
        fifthSixth = depthRange * (5/6)
      function colorDepth() {  
        if (depth <= firstSixth) {
          return colors[0]
        }
        else if (depth <= secondSixth) {
          return colors[1]
        }
        else if (depth <= thirdSixth) {
          return colors[2]
        }
        else if (depth <= fourthSixth) {
          return colors[3]
        }
        else if (depth <= fifthSixth) {
          return colors[4]
        }
        else return colors[5]
      };

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
        }}

    for (let i = 0; i < earthquake.length; i++) {
      //function circle() {
      L.circleMarker([lat, lon], {
      fillOpacity: 0.75,
      color: 'black',
      weight: 0.25,
      fillColor: colorDepth(),
      // Setting our circle's radius to equal the output of our markerSize() function:
      // This will make our marker's size proportionate to its population.
      radius: markerSize(mag)
    }).bindPopup(`<h1>${place}</h1> <hr> <h3>Magnitude: ${mag} | Depth: ${depth}</h3>`).addTo(myMap);
    }

};}