var map;
      // Create a new blank array for all the listing markers.
var markers = [];

var locations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

var locItem = function(data) {
  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);

this.visible = ko.observable(true);

}

function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 40.7413549, lng: -73.9980244},
  zoom: 13
});

        this.largeInfowindow = new google.maps.InfoWindow();
        this.bounds = new google.maps.LatLngBounds();
        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].title;
          // Create a marker per location, and put into markers array.
          this.marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });



         // Push the marker to our array of markers.
         this.markers.push(this.marker);

          // Create an onclick event to open an infowindow at each marker.
          this.marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
          bounds.extend(markers[i].position);
        }
        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);
      }


      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.

    this.populateInfoWindow = function(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
          });
        }
      }


  var ViewModel = function() {
   var self = this;

   self.query = ko.observable('');

   this.locItemlist = ko.observableArray([]);

   locations.forEach(function(location){
   self.locItemlist.push(new locItem(location));
   });

   this.filteredList = ko.computed( function() {
           var filter = self.searchTerm().toLowerCase();
           if (!filter) {
               self.locItemlist().forEach(function(location){
                   location.visible(true);
               });
               return self.locItemlist();
           } else {
               return ko.utils.arrayFilter(self.locItemlist(), function(location) {
                   var string = location.title.toLowerCase();
                   var result = (string.search(filter) >= 0);
                   location.visible(result);
                   return result;
               });
           }
       }, self);

  self.show = function(location) {
   google.maps.event.trigger(location, 'click');
};

   }

 ko.applyBindings(new ViewModel());
