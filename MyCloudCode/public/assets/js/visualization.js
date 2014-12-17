var genreList = [];
var mapSize = 0;
var d3_genre = [];
var playlist_id;
var d3Map = d3.map();
var trackFields = { fields:'offset,next,items(track(name,artists))' };
var trackFields_2 = {};


function showTracks(tracks) {  
	// console.log(tracks);                              
	var genre;
    var list = $("#item-list");
    var entries = d3.entries(tracks.items); 
    var d3Map = d3.map();
    var genres = [];
    var force = d3.layout.force().gravity(0.13)
  								.charge(-30)
  								.size([600, 600]);
  	var	nodes = force.nodes(), centers = [];
	
    // console.log('d3 entries', entries);
    // console.log('show tracks', tracks);
    
    if (tracks.offset == 0) {
        $("#main").show();
        $("#intro").hide();
        $("#item-list").empty();
        info("");
    }
    _.each(tracks.items, function(item) {
        var artistName = item.track.artists[0].name;
		var spotify_artist_id = item.track.artists[0].uri;
		var track_id = item.track.id;
		var artist;
		var div;
		var itemElement;
		var echonest = "http://developer.echonest.com/api/v4/artist/profile?api_key=V67QTPVRZDSNCC4AW&id=spotify:artist:" + spotify_artist_id + "&bucket=genre";
		

		$.getJSON( echonest, {
		    format: "json"
		}).done(function(data) {
			genre = data.response.artist.genres;
			// console.log(genre.name);

			$(genre).each(function(i) {
                var gen = genre[i].name;
                var radius;
				
				if ((d3Map.get(gen) == undefined) || (!d3Map.has(gen))) {
					d3Map.set(gen, 1);
					radius = 1;
					// nodes.push({
		   //          	genre: g, r: gName, 
		   //          	x: 800 / 2 + offset(), 
		   //          	y: 800 / 2 + offset(), 
		   //          	color: d3.rgb(245, 135, 54) 
	    //        		});
					
				} else {
					var mapVal = d3Map.get(gen);
					mapVal++;
					d3Map.remove(gen);
					d3Map.set(gen, mapVal);
					radius = mapVal;
				}
				
				nodes.push ({	genre: gen, r: radius, 
				            	x: 800 / 2 + offset(), 
				            	y: 800 / 2 + offset(), 
				            	color: d3.rgb(245, 135, 54) 
							});

				// for (n in nodes) {
				// 	if(nodes[n].genre == gen) {
				// 			// nodes.remove();
				// 		nodes.push ({
				// 				genre: gen, r: d3Map.get(gen), 
				//             	x: 800 / 2 + offset(), 
				//             	y: 800 / 2 + offset(), 
				//             	color: d3.rgb(245, 135, 54) 
				// 			});
				// 			nodes[n].r = mapVal;
				// 			console.log(nodes[n].r);
				// 			console.log("hey");
				// 			// nodes.push(nodes[n]);
				// 	}
				// }

			});

			

			// console.log(d3Map.keys());
			// var keys = d3Map.keys();
			// 
		 //    var nodes = null;
		 //    
		 //    for (k in keys) {
		 //    	var g = keys[k];
		 //    	var gName = d3Map.get(g);
		    	
		 //    }
		    
		 function offset() {
			     	return Math.random() * 100;
		    	}
		    	
			svg.selectAll("circle")
				.data(nodes).enter()
				.append("circle")
				.attr("class", "node")
				// .attr("cx", function(d) {return d.x;})
				// .attr("cy", function(d) {return d.y;})
				.attr("fill", function(d){ return d.color; })
				.attr("r", 1e-6).transition()
				.attr("r", function(d) { 
					// console.log(d.genre);
					// console.log(d3Map.values());
					// console.log(d3Map.get(d.genre));
					// d3Map.get(d.genre)
					return d3Map.get(d.genre); 
				})
				
			svg.selectAll("circle")
				.on('mouseover', function (d){
					d3.select(this).style({opacity:'0.6'});
					d3.select("#genre_title").text(d.genre);
				})
				.on('mouseout', function (d){
					d3.select(this).style({opacity:'1'});
					d3.select("#genre_title").text("");
				})
			               
			force.on("tick", function(e) {
				svg.selectAll("circle")
					.attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; });
			});	
			force.start();
		});	
	});


    // if (tracks.next) {
    //     callSpotify(tracks.next, trackFields, function(tracks) {
    //         showTracks(tracks);
    //     });		
    // }

	// GET TOTAL GENRES IN PLAYLIST
	// var genre_menu = d3.map(Map);
	// var genre_values = genre_menu.values();
	// var count = 0;
	// for (var m = 0; m < genre_menu.size(); m++) {
	// 	var new_data = genre_values[m];
	// 	count += new_data;
	// }
}