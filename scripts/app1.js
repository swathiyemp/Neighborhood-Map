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
    var styles = [{
            "elementType": "geometry",
            "stylers": [{
                "color": "#212121"
            }]
        },
        {
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#757575"
            }]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#212121"
            }]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [{
                "color": "#757575"
            }]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#9e9e9e"
            }]
        },
        {
            "featureType": "administrative.land_parcel",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#bdbdbd"
            }]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#757575"
            }]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{
                "color": "#181818"
            }]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#616161"
            }]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#1b1b1b"
            }]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#2c2c2c"
            }]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#8a8a8a"
            }]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#373737"
            }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{
                "color": "#3c3c3c"
            }]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [{
                "color": "#4e4e4e"
            }]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#616161"
            }]
        },
        {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#757575"
            }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#00cece"
            }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#3d3d3d"
            }]
        }
    ];
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 36.936234,
            lng: -119.444914
        },
        gestureHandling: 'greedy',
        zoom: 6,
        styles: styles,
        mapTypeControl: false
    });


    // Styling the Markers
    var defaultIcon = makeMarkerIcon('CD5C5C');
    var highlightedIcon = makeMarkerIcon('FFFFFF');

    largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });

        viewModel.locItemlist()[i].marker = marker;
        markers.push(marker);


        marker.addListener('click', function() {
            var marker = this;
            populateInfoWindow(this, largeInfowindow);
        });

        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });

        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
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
            if (data.error) {
                alert("Wikipedia have some problem loading.Please try again.");
                return;
            }
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
        .fail(function() {
            alert("Sorry Wikipedia Could'nt Load!");
        });
}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
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
        if (largeInfowindow) {
            largeInfowindow.close();
        }
        return ko.utils.arrayFilter(self.locItemlist(), function(locitem) {
            var string = locitem.title.toLowerCase();
            var result = string.search(filter) >= 0;
            if (locitem.marker) {
                locitem.marker.setVisible(result);
            }
            return result;
        });
    });
};

viewModel = new ViewModel();
ko.applyBindings(viewModel);

//Error Handling for Google Maps
function showerror() {
    alert('Google Maps have trouble loading.Please try later.');
}
