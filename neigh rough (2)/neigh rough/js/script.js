var map;
var markers = [];
 var places = [
          {
			  "name": "Gateway Of India",
		      "location": {
				  "lat": 18.921984, 
				  "lng": 72.834654}
				  },
          {
			  "name": "Elephanta Caves", 
			  "location": {
				  "lat": 18.963347, 
				  "lng": 72.931486}
				  },
          {
			  "name": "Marine Drive", 
			  "location": {
				  "lat": 18.941482,
				  "lng": 72.823679}
				  },
          {
			  "name": "Chhatrapati Shivaji Terminus", 
			  "location": {
				  "lat": 18.940249, 
				  "lng": 72.833861}
				  },
          {
			  "name": "Nehru Planetarium", 
			  "location": {
				  "lat": 18.990059, 
				  "lng": 72.814797}
				  }
          
        ];
 function initMap() {
        
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 19.075984, lng: 72.877656},
          zoom: 13
        });
		       

        var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();

        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < places.length; i++) {
          // Get the position from the location array.
          var position = places[i].location;
          var title = places[i].name;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });
          // Push the marker to our array of markers.
          markers.push(marker);
		  places[i].marker = marker;
          // Create an onclick event to open an infowindow at each marker.
          marker.addListener('click', function() {
			  var mark = this;
			  loaddata(mark);
			   toggleBounce(this);
            setTimeout(function() {
                mark.setAnimation(null);
            }, 1000);
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
      function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker(null);
          });
        }
      
 }
 function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

var loaddata = function(place){
	var client_id = 'EQBP51VCVZ0DTN5M0GGJJG55FLO2J0EMMFWOJHKU4PKHMJVJ';
	var client_secret = 'EGLKWC2VIEI1K0H1EWNANPZ2I41KEDE30SCGYC0YRHWI1F0N';
	$.ajax({
		url: 'https://api.foursquare.com/v2/venues/search',
		dataType: 'json',
		data: {
			limit: '1',
			ll: '19.075984, 72.877656',
			client_id: client_id,
			client_secret: client_secret,
			v: '20130815'
		},
	async:true
	}).success(function(data){
	var total = data.response.venues[0];
	place.name = total.name;
	if(place.name !== undefined){
		place.name = 'name not found!!';
	} else {
		place.name = total.name;
	}
	console.log(place.name);
	
		
	    var infowindow = new google.maps.InfoWindow();
		
		
        infowindow.setContent('<h5>' + place.name + '</h5>');
		infowindow.open(map, place.marker);
}).fail(function(error){
	alert('failed to get fooursquare data');
});
function googleError(){
	alert('google error....');
}
}

var viewModel = function() {
    var self = this;
    this.markersArray = ko.observableArray(places);
    this.filter = ko.observable('');
	
    // filters the places array when searched in a query input
    this.search = ko.computed(function() {
        filtered = self.filter();
        if (!filtered) {
            
            return places;
        } else {
		    
            return ko.utils.arrayFilter(places, function(place) {
				self.res = place.name.toLowerCase().indexOf(self.filter().toLowerCase());
				if(self.res >= 0) {
					place.marker.setMap(map);
										return place;
				} else {
					place.marker.setMap(null);
				}

				
					
				
                
				
                
            });
        }
    });

    // when name of the location clicked displays infowindow
    this.viewPlace = function(place) {
		loaddata(place);
        
        
    };




};
var instance = new viewModel();
ko.applyBindings(instance);
