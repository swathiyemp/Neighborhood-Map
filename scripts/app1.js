var map;
var markers = [];
var largeInfowindow;
var viewModel;

var locations = [{
	title: 'Golden Gate Bridge',
	location: {
		lat: 37.820174,
		lng: -122.478180
	}
}, {
	title: 'Alcatraz Island',
	location: {
		lat: 37.827206,
		lng: -122.42302
	}
}, {
	title: 'Glacier Point',
	location: {
		lat: 37.730670,
		lng: -119.573671
	}
}, {
	title: 'Palm Springs Aerial Tramway',
	location: {
		lat: 33.837283,
		lng: -116.614135
	}
}, {
	title: 'USS Midway Museum',
	location: {
		lat: 32.713868,
		lng: -117.175154
	}
}, {
	title: 'Point Lobos',
	location: {
		lat: 36.522455,
		lng: -121.952905
	}
}, {
	title: 'Los Padres National Forest',
	location: {
		lat: 34.742170,
		lng: -119.681856
	}
}, {
	title: 'Death Valley National Park',
	location: {
		lat: 36.495427,
		lng: -117.154668
	}
}];

var locItem = function(data) {
	this.title = data.title;
	this.location = ko.observable(data.location);
	this.visible = ko.observable(true);
};

//Initializing the map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 36.936234,
			lng: -119.444914
		},
		gestureHandling: 'greedy',
		zoom: 6
	});
	largeInfowindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < locations.length; i++) {
		// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
		});
		viewModel.locItemlist()[i].marker = marker;
		markers.push(marker);

		marker.addListener('click', function() {
			var marker = this;
			populateInfoWindow(this, largeInfowindow);
		});
		bounds.extend(markers[i].position);
	}
	// Extend the boundaries of the map for each marker
	map.fitBounds(bounds);
}

//The Infowindow function that show location title and wiki info of that title.
function populateInfoWindow(marker, infowindow) {
	var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&imlimit=5&format=json&callback=wikiCallback';
	// Wikipedia AJAX Request to show wiki information when clicked on a marker
	$.ajax({
		url: wikiUrl,
		dataType: 'jsonp'
	}).done(function(data) {
		console.log(data);
		var infoUrl = data[3][0];
		var infoDesc = data[2][0];
		if (infoUrl === undefined) {
			infowindow.setContent('<div>' + '<h3>' + marker.title + '</h3>' + '<p>' + 'Sorry no wikipedia information is available' + '</p>' + '</div>');
			infowindow.open(map, marker);
		} else {
			infowindow.marker = marker;
			infowindow.setContent('<div class="info">' + '<h3>' + marker.title + '</h3>' + '<p>' + infoDesc + '<a href="' + infoUrl + '" target="blank">' + '..' + 'Click Here' + '</a>' + '</p>' + '</div>');
     //Setting animation for map for a particular time
      marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
				marker.setAnimation(null);
			}, 2000);
			infowindow.open(map, marker);
			map.setCenter();
      //Closing the Infowindow
			infowindow.addListener('closeclick', function() {
				infowindow.setMarker = null;
			});
		}
	})
}

var ViewModel = function() {
	var self = this;
	this.searchTerm = ko.observable('');
	this.locItemlist = ko.observableArray([]);
	locations.forEach(function(locitem) {
		self.locItemlist.push(new locItem(locitem));
	});
	this.show = function(location) {
		google.maps.event.trigger(location.marker, 'click');
	};

  //Search filter to filter the list options.
	this.filteredList = ko.computed(function() {
		var filter = self.searchTerm().toLowerCase();
		if (!filter) {
			self.locItemlist().forEach(function(locitem) {
				locitem.visible(true);
			});
			return self.locItemlist();
		} else {
			return ko.utils.arrayFilter(self.locItemlist(), function(locitem) {
                         var string = locitem.title.toLowerCase();
                         var result = string.search(filter) >= 0;
                         locitem.marker.setVisible(result);
                          return result;
			});
		}
	});
};

viewModel = new ViewModel();
ko.applyBindings(viewModel);

//Error Handling for Google Maps
function showerror() {
	document.getElementById('showerror').innerHTML = 'Google Maps have trouble loading.Please try later.';
}
