
var map;
var markers = [];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 40.7313779, lng: -73.9546765},
		zoom: 13
	});
	var locations = [
	{title: 'park ave penthouse', location: {lat: 40.7713024, lng: -73.9632293}},
	 {title: 'Chelsea loft', location: {lat: 40.7444883, lng: -73.9949465}},
	 {title: 'union square loft', location: {lat: 40.7347062, lng: -73.9895759}}
	 ];

	 var largeInfowindow = new google.maps.InfoWindow();
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

}

function populateInfoWindow(marker, infowindow) {
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
		infowindow.open(map, marker);
		infowindow.addListener('closeclick', function() {
			infowindow.setMarker(null);
			
		});
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
