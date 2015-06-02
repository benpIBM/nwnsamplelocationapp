    /** @jsx React.DOM */

    var db = new PouchDB('env_hazmat_wgs84'),
    remote = 'https://bsp:demoPass@bsp.cloudant.com/env_hazmat_wgs84',
    opts = {
      continuous: true
    };
	db.replicate.to(remote, opts);
	db.replicate.from(remote, opts);

	var leftViewImage = '';
	var JSONdoc ='';
	var markerPoints = [["one", 37.7889, -122.4002], ["two", 37.7, -122.3], ["three", 37.6, -122.5]];

	var BuildMap = React.createClass({displayName: "BuildMap",

	  dbGet: function(){
			db.allDocs({
  				include_docs: true,
  				limit: 100
			}).then(function (result) {
  				// handle result
  				for (var iter = 0; iter < result.rows.length; iter++) {
  					var FACILITY_N = result.rows[iter]["doc"]["properties"]["FACILITY_N"];
  					var ADDRESS = result.rows[iter]["doc"]["properties"]["ADDRESS"];
  					var CITY_NAME = result.rows[iter]["doc"]["properties"]["CITY_NAME"];
  					var State = result.rows[iter]["doc"]["properties"]["State"];
  					var lon = result.rows[iter]["doc"]["geometry"]["coordinates"][0];
  					var lat = result.rows[iter]["doc"]["geometry"]["coordinates"][1];
  					var locationString = FACILITY_N+" - "+ADDRESS+", "+CITY_NAME+", "+State;
  					markerPoints[iter] = [locationString, lon, lat];
  					// console.log(markerPoints[iter][1]);
  					// console.log(markerPoints[iter][2]);
  					// console.log(markerPoints[iter][0]);
  				}
			}).catch(function (err) {
  				console.log(err);
			});
		},

  	  componentDidMount: function() {
  	  	var map = L.map('map').setView([45.5599, -122.3249], 3);
  	  	var marker;
  	  	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    		maxZoom: 18,
    		id: 'benperlmutter.ff237855',
    		accessToken: 'pk.eyJ1IjoiYmVucGVybG11dHRlciIsImEiOiI2Mjc5ZDlhN2MxMWM1ZjM2YmQzMzNiMzA0MmJiYmVmNyJ9.PYFo8l3wRlCIVlUiMjW1Bw'
		}).addTo(map);
  	  	// var marker = L.marker([37.7889, -122.4002]).bindPopup("one").addTo(map);
  	  	for (var i = 0; i < markerPoints.length; i++) {
					marker = new L.marker([markerPoints[i][1],markerPoints[i][2]])
					.bindPopup(markerPoints[i][0])
					.addTo(map);
				console.log('marker added '+i);
				}
  	  },

  	  componentWillMount: function() {
  	  },

	  render: function(){
		
	  	var mapStyle = {
	  		height: '500px'
	  	};
	  	
	    return (
	      React.createElement("div", {className: "my-component"}, 
	        React.createElement("img", {src: "images/nwnatural_logo.jpg", "max-width": "50%", "max-height": "50%"}), 
	      	React.createElement("h3", null, "Service Locations"), 
	      	React.createElement("div", {id: "map", style: mapStyle})
	      )
	    );
	  }
	});

	React.render(React.createElement(BuildMap, null), document.getElementById('mount-point'));