var hardCodeLocation = [{
	name: "Dutch Bros. Coffee",
	lat: 44.62933649650506,
	lng: -124.06172633171082,
	id: "ChIJBa5tM7jXwVQRc3CeBMMkxQc",
	foursquare_id: "50b8cc92e4b080f3ff4ad831"
}];
var map;

// initializes the map and knockout

function initMap() {
	"use strict";
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 44.635371,
			lng: -124.053291
		},
		zoom: 14,
		disableDefaultUI: true
	});

// Start the ViewModel here so it doesn't initialize before Google Maps loads

	ko.applyBindings(new AppViewModel());
}
// this class holds marker information
var Place = function(data) {
	"use strict";
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.id = ko.observable(data.id);
	this.marker = ko.observable();
	this.foursquare_id = ko.observable(data.foursquare_id);
	this.isVisible = ko.observable(true);
};

// viewmodel for knockout
function toggleBounce(marker) {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}
function AppViewModel() {
	self.infowindow = new google.maps.InfoWindow();
	self.userInput = ko.observable('');
	self.locations = ko.observableArray([]);
	// filters markers based on query
    self.filterMarkers = function() {
		var searchInput = self.userInput().toLowerCase();
		self.locations().forEach(function(location) {
			if (location.name().toLowerCase().indexOf(searchInput) !== -1) {
				location.marker.setVisible(true);
				location.isVisible(true);
				console.log(location.isVisible());
			} else {
				location.marker.setVisible(false);
				location.isVisible(false);
				console.log(location.isVisible());
			}
		});
	};
	// show detail on inforwindow
	self.showInfoWindow = function(place) {
		var marker = place.marker;
		toggleBounce(marker);
		var url = "https://api.foursquare.com/v2/venues/" + place.foursquare_id() + "?client_id=E3ETMDUJM0LZP4L00WIGO1RTOWQDTTVBRYWN3QVNHF0MUCW2&client_secret=SHZXK04FLSM32PYAW55ZLEHSJDGU5EMXCVSUGVWXHDW1O0CD&v=20170705&m=foursquare"
		$.ajax({url: url, success: function(result){
			var venue = result.response.venue;
			var content = "Name: " + venue.name + "</br>Website: " + venue.url + "<br>Rating: " + venue.rating;
			self.infowindow.setContent(content);
			self.infowindow.open(map, marker);
		}});
	}
	// handle a click event on a list item
	self.handleClickedListItem = function(event) {
		showInfoWindow(event);
	};
    // creates google markers
	self.createMarker = function(place) {
		console.log(place.isVisible());
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(place.lat(), place.lng()),
			map: map,
			animation: google.maps.Animation.DROP
		});
		place.marker = marker;
		place.marker.setVisible(true);

		// displays info window when marker is clicked
        google.maps.event.addListener(marker, 'click', function() {
			showInfoWindow(place);
		});
		return place;
	}
	hardCodeLocation.forEach(function(placeItem) {
		self.locations.push(createMarker(new Place(placeItem)));
	});
}