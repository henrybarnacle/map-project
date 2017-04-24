
var map;
function initMap () {
	map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 40.7313779, lng: -73.9546765},
		zoom: 15
	});
		var home = {lat: 40.7259861, lng: -73.9555063};
		var marker = new google.maps.Marker({
			position: home,
			map: map,
			title: 'first marker'
		});
}


	
