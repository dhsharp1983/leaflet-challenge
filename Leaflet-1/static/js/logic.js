

var QueryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

function CalcMarkerColour (EarthQuakeMagnitude) {
    if (EarthQuakeMagnitude <= 4) {
        console.log("less than 4")
        return "#ffff66"
    }
    else if (EarthQuakeMagnitude > 4 && EarthQuakeMagnitude <= 4.5) {
        console.log("4-4.5")
        return "#ffcc00"
    }
    else if (EarthQuakeMagnitude > 4.5 && EarthQuakeMagnitude <= 5) {
        console.log("4.5 - 5")
        return "#ff9900"
    }
    else if (EarthQuakeMagnitude > 5 && EarthQuakeMagnitude <= 5.5) {
        console.log("5 - 5.5")
        return "#ff6600"
    }
    else if (EarthQuakeMagnitude > 5.5 && EarthQuakeMagnitude <= 6) {
        console.log("5 - 5.5")
        return "#ff0000"
    }
    else if (EarthQuakeMagnitude > 6) {
        console.log("6++")
        return "#660066"
    }
    else {
        console.log("else")
    }
};


function CreateMap (earthquakes) {
    console.log("bar")
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Light Map": lightmap
    };

    var overlayMaps = {
    "Earthquakes": earthquakes
    };

    var map = L.map("map", {
        center: [0, 0],
        zoom: 2,
        layers: [lightmap, earthquakes]
      });

    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(map);
};



function CreateMarkers(response) {
    // console.log(response)
    var EarthquakesAll = response.features;
    var EarthquakeMarkers = [];
    for (var i = 0; i < EarthquakesAll.length; i++) {
        var EarthquakeLocation = EarthquakesAll[i].geometry.coordinates
        var EarthQuakeLocationLat = EarthquakesAll[i].geometry.coordinates[1]
        var EarthQuakeLocationLong = EarthquakesAll[i].geometry.coordinates[0]
        var EarthQuakeLocationDepth = EarthquakesAll[i].geometry.coordinates[2]
        var EarthQuakeIntensity = EarthquakesAll[i].properties.mni
        var EarthQuakeMagnitude = EarthquakesAll[i].properties.mag
        var EarthQuakePlace = EarthquakesAll[i].properties.place
        var EarthQuakeDateTime = new Date(EarthquakesAll[i].properties.time *1000).toGMTString()
        const EarthQuakeMarkerRadius = EarthQuakeMagnitude **3 * 3000
        var EarthQuakeMarkerColour = CalcMarkerColour(EarthQuakeMagnitude)
        var EarthQuakeMarker = L.circle([EarthQuakeLocationLat, EarthQuakeLocationLong], {
            radius: EarthQuakeMarkerRadius,
            color: EarthQuakeMarkerColour,
            stroke: false,
            fill: true,
            fillColor: EarthQuakeMarkerColour,
            fillOpacity: .4
            // opacity: 0
            })
            .bindPopup("<h6>Location: " + EarthQuakePlace + "<br>" + "Magnitude: " + EarthQuakeMagnitude + "</h6>");
        
        // console.log(`lat ${EarthQuakeLocationLat}, long ${EarthQuakeLocationLong}, depth ${EarthQuakeLocationDepth}, place ${EarthQuakePlace}`)

        EarthquakeMarkers.push(EarthQuakeMarker);
    }

    CreateMap(L.layerGroup(EarthquakeMarkers));
        

    };



    




d3.json(QueryURL, CreateMarkers)