var canvas = document.getElementById("canvas");
var messages = document.getElementById("messages");

var view_width = view.size.width;
var view_height = view.size.height;

project.currentStyle = {
	strokeWidth: 2,
	strokeColor: "black",
};

var grid_size = 3;
var cell_width = view_width/grid_size;

//creating grid
for(var i=1; i<3; i++){
	new Path(new Point(0, cell_width*i), new Point(view_height, cell_width*i));
	new Path(new Point(cell_width*i, 0), new Point(cell_width*i, view_height));
}

//creating the cross
var cross_path = new Path(new Point(0, 0), new Point(cell_width, cell_width));
cross_path.add(new Point(cell_width/2, cell_width/2));
cross_path.add(new Point(0, cell_width));
cross_path.add(new Point(cell_width, 0));

//creating like a stamp for the noughts and crosses
var cross_symbol = new Symbol(cross_path);
var nought_symbol = new Symbol(new Path.Circle(new Point(cell_width/2, cell_width/2), cell_width/2));



function grid_to_pixel_coords(grid_x, grid_y){
	return new Point((grid_x+0.5)*cell_width, (grid_y+0.5)*cell_width);
}
function pixel_to_grid_coords(pixel_x, pixel_y){
	return {x: Math.round(pixel_x/cell_width-0.5), y: Math.round(pixel_y/cell_width-0.5)};
}
var grid = [];
for(var i=0; i<grid_size; i++){
	grid[i] = [];
	for(var j=0; j<grid_size; j++){
		grid[i][j] = "-";
	}
}
function display_grid(){
	for(var i=0; i<grid_size; i++){
		for(var j=0; j<grid_size; j++){
			console.log(grid[i][j]);
		}
		console.log("new line");
	}
}

var valid_move = false;
var game_tool = new Tool();
game_tool.onMouseMove = function(event){

	if(event.point.x>0 && event.point.x < view_width && event.point.y>0 && event.point.y<view_height){
		var grid_coords = pixel_to_grid_coords(event.point.x, event.point.y);
		if(grid[grid_coords.x][grid_coords.y] == "-"){
	    	canvas.style.cursor = "pointer";
	    	valid_move = true;
		}else{
	    	canvas.style.cursor = "default";
	    	valid_move = false;

		}
	}
}

game_tool.onMouseDown = function(event){
	if(valid_move){
		var grid_coords = pixel_to_grid_coords(event.point.x, event.point.y);
		var pixel_coords = grid_to_pixel_coords(grid_coords.x, grid_coords.y);

		if(player1_turn){
			grid[grid_coords.x][grid_coords.y] = "x";
			cross_symbol.place(pixel_coords);
		}else{
			grid[grid_coords.x][grid_coords.y] = "o";
			nought_symbol.place(pixel_coords);
		}

		// display_grid();
		var winner = checkWinner();

		if(winner){
			messages.innerHTML = displayPlayerMessage(player1_turn, "wins!");
		}else{
			var draw = checkDraw();
			if(draw){
				messages.innerHTML = "Draw!";
			}else{
				player1_turn = !player1_turn;
				messages.innerHTML = displayPlayerMessage(player1_turn, "turn");
			}
		}


	}
}


function displayPlayerMessage(player1_turn, text){
		var message = "Player ";

		if(player1_turn){
			message += "1 ";
		}else{
			message += "2 ";
		}

		message += text;
		return message;
}

function createGameOverLine(start_point, end_point){
	var game_over_line = new Path(start_point, end_point);
	game_over_line.strokeColor = "green";
	game_over_line.strokeWidth = 10;
}

var player1_turn = true;
function checkWinner(){
	//horizontally
	for(var i=0; i<grid_size; i++){
		if(grid[i][0] == grid[i][1] && grid[i][1] == grid[i][2]){
			if(grid[i][0] != "-"){
				var start_point = grid_to_pixel_coords(i, 0);
				var end_point = grid_to_pixel_coords(i, 2);
				createGameOverLine(start_point, end_point);

				return true;
			}
		}
	}

	//vertically
	for(var i=0; i<grid_size; i++){
		if(grid[0][i] == grid[1][i] && grid[1][i] == grid[2][i]){
			if(grid[0][i] != "-"){
				var start_point = grid_to_pixel_coords(0, i);
				var end_point = grid_to_pixel_coords(2, i);
				createGameOverLine(start_point, end_point);

				return true;
			}

		}
	}

	//diagonal from top left to bottom right
	var corner = grid[0][0];
	var in_row_diag = 0;
	for(var i=0; i<grid_size; i++){
		if(corner!="-"){
			if(grid[i][i] == corner){
				in_row_diag++;
			}else{
				break;
			}
		}
	}
	if(in_row_diag == 3){
		var start_point = grid_to_pixel_coords(0, 0);
		var end_point = grid_to_pixel_coords(grid_size-1, grid_size-1);
		createGameOverLine(start_point, end_point);
		return true;
	}

	//diagonal from bottom left to top right
	in_row_diag = 0;
	corner = grid[0][grid_size-1];
	for(var i=0; i<grid_size; i++){
		if(corner!="-"){
			if(grid[i][grid_size-i-1] == corner){
				in_row_diag++;
			}else{
				break;
			}
		}
	}
	if(in_row_diag == 3){
		var start_point = grid_to_pixel_coords(0, grid_size-1);
		var end_point = grid_to_pixel_coords(grid_size-1, 0);
		createGameOverLine(start_point, end_point);
		return true;
	}
}

function checkDraw(){
	var num_hyphens = 0;
	for(var i=0; i<grid_size; i++){
		for(var j=0; j<grid_size; j++){
			if(grid[i][j]=="-"){
				num_hyphens ++;
			}
		}
	}
	//grid is full with noughts and crosses
	if(num_hyphens == 0){
		return true;
	}
}