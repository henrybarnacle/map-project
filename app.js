
var map;
var markers = [];
var polygon = null;


function initMap() {

	var styles =  [
          {
            elementType: 'geometry',
            stylers: [{color: '#f5f5f5'}]
          },
          {
            elementType: 'labels.icon',
            stylers: [{visibility: 'off'}]
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{color: '#616161'}]
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [{color: '#f5f5f5'}]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{color: '#bdbdbd'}]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{color: '#eeeeee'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#757575'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#e5e5e5'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#ffffff'}]
          },
          {
            featureType: 'road.arterial',
            elementType: 'labels.text.fill',
            stylers: [{color: '#757575'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#dadada'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#616161'}]
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{color: '#e5e5e5'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{color: '#eeeeee'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#c9c9c9'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          }
        ];

	map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 40.7313779, lng: -73.9646765},
		zoom: 13,
		styles: styles,
		mapTypeControl: false
	});

	var locations = [
	{title: 'park ave penthouse', location: {lat: 40.7713024, lng: -73.9632293}},
	 {title: 'Chelsea loft', location: {lat: 40.7444883, lng: -73.9949465}},
	 {title: 'union square loft', location: {lat: 40.7347062, lng: -73.9895759}},
	 {title: 'west village house', location: {lat: 40.7347063, lng: -73.9996859}}
	 ];

	 var largeInfowindow = new google.maps.InfoWindow();

	 var drawingManager = new google.maps.drawing.DrawingManager({
	 	drawingMode: google.maps.drawing.OverlayType.POLYGON,
	 	drawingControl: true,
	 	drawingControlOptions: {
	 		position: google.maps.ControlPosition.TOP_LEFT,
	 		drawingModes: [
	 		google.maps.drawing.OverlayType.POLYGON
	 		]
	 	}
	 });




	 var bounds = new google.maps.LatLngBounds();

	

	 for (var i = 0; i < locations.length; i++) {

	 	var position = locations[i].location;
	 	var title = locations[i].title;

		var marker = new google.maps.Marker({
		
		position: position,
		title: title,
		animation: google.maps.Animation.DROP,
		id: i
		});

		markers.push(marker);
		bounds.extend(marker.position);

		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);

		});
	}
	

		document.getElementById('show-listings').addEventListener('click', showListings);
		document.getElementById('hide-listings').addEventListener('click', hideListings);

		document.getElementById('toggle-drawing').addEventListener('click', function() {
			toggleDrawing(drawingManager);
		});

		document.getElementById('zoom-to-area').addEventListener('click', function() {
			zoomToArea();
		});


drawingManager.addListener('overlaycomplete', function(event) {

	if (polygon) {
		polygon.setMap(null);
		hideListings();
	}

	drawingManager.setDrawingMode(null);

	polygon = event.overlay;
	polygon.setEditable(true);

	searchWithinPolygon();

	polygon.getPath().addListener('set_at', searchWithinPolygon);
	polygon.getPath().addListener('insert_at', searchWithinPolygon);
});

//drawingManager.addListener('overlaycomplete', function(event) {

	//var area = google.maps.geometry.spherical.computeArea(polygon.getPath().getArray());
//window.alert(area + " Square Meters");

//});

}


function populateInfoWindow(marker, infowindow) {
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
		infowindow.open(map, marker);
		//infowindow.addListener('closeclick', function() {
			//infowindow.setMarker(null);
			
		//});
	}
}

function showListings() {
	var bounds = new google.maps.LatLngBounds();

	for (i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
		bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
}
	
	function hideListings() {
		for (i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
	}

function toggleDrawing(drawingManager) {
	if (drawingManager.map) {
		drawingManager.setMap(null);
		if (polygon) {
			polygon.setMap(null);
		}

	} else {
		drawingManager.setMap(map);

	}
}

function searchWithinPolygon() {
	for (var i = 0;  i < markers.length; i ++) {
		if (google.maps.geometry.poly.containsLocation(markers[i].position,polygon)) {
			markers[i].setMap(map);
		} else {
			markers[i].setMap(null);
		
		}
	}
}

function zoomToArea() {
	var geocoder = new google.maps.Geocoder();

	var address = document.getElementById('zoom-to-area-text').value;

	if (address == '') {
		window.alert('You must enter an area, or address.');
	} else {
		geocoder.geocode(
			{ address: address
				//componentRestrictions: {locality: 'New York'}
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					map.setCenter(results[0].geometry.location);
					map.setZoom(15);
				} else {
					window.alert('We could not find that location - try entering a more specific place');
				}
			});
		}
	}
