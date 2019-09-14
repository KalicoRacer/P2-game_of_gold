
        var myGeoJSONPath = 'data/countries_lowres.json';
        var myCustomStyle = {
            stroke: false,
            fill: true,
            fillColor: '#fff',
            fillOpacity: 1
        }
        $.getJSON(myGeoJSONPath,function(data){
            var map = L.map('map').setView([39.74739, -105], 4);

            L.geoJson(data, {
                clickable: false,
                style: myCustomStyle
            }).addTo(map);
        })
    