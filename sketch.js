//Variables for reading in data
var heartData;
var mortality_rate = [];
var years = [];
//Variables for first text appearances
var timestep1 = 5000; // time between steps, in milliseconds (5 seconds)
var nextPlay1 = 5000; // time when second screen appears
var textDisplay = 0; // Variable to control which text to display
//Variables for sequential graph drawing
var timestep = 900;
var nextPlay = 500;
var currentRow = 0;
var doneDrawing = false; // Flag to indicate if the user is done drawing
var doneButton; // Button for indicating "DONE"


function preload() {
  heartData = loadTable("heart_disease.csv", "csv", "header");
}

//read in the data
function setup() {
  createCanvas(1220, 620);
  background(255, 170, 170); // Light red background
  // Specify the text font
  textFont("Helvetica");
  // years are in column 1
  for (var i = 0; i < heartData.getRowCount(); i++) {
    years[i] = heartData.get(i, 0);
  }
  // mortality rate is in the 10th column
  for (var i = 0; i < heartData.getRowCount(); i++) {
    mortality_rate[i] = heartData.get(i, 10);
  }
}

function draw() {
  // This gets the computer’s clock time
  var currentTime1 = millis();

  // First screen to display
  if (textDisplay === 0) {
    // Display initial text
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(24);
    text("Did you know that heart disease is the leading cause of death globally?", width / 2, height / 2);
  } // Second screen
	else if (textDisplay === 1) {
    // Display the second text after a few seconds
	background(255, 170, 170);
    text("Heart disease takes an estimated 17.9 million lives each year.", width / 2, height / 2);
  } else if (textDisplay === 2) {
    // Display the third text before showing the graph
	  background(255, 170, 170);
    text("Next, a graph will show the heart disease mortality rate in Walla Walla, Washington from 1980-2018.", width / 2, height / 2);
  } 
	//get rid of text fast
	else if (textDisplay === 3) {
    	background(255, 170, 170);
		textDisplay++;
	}
	else if (textDisplay > 3) {
	  textSize(21);
	  // Chart title
	  fill(0);
	  noStroke();
	  text("Heart rate mortality in Walla Walla, Washington", 240, 20);
	  // Chart description
	  textSize(16);
	  text("Draw what you think the last few years' heart disease mortality rates should look like. Press DONE when finished drawing.",455,45);
	  // Draw the graph when textDisplay is 3
		drawGraph();
  	}

  // Increment textDisplay when a certain duration has passed
  if (currentTime1 > nextPlay1) {
    // Update the next play timestamp
	textDisplay++;
	nextPlay1 += timestep1;
  }
}

function drawGraph() {
  // Draw x and y axes
  stroke(0); // Set stroke color to black
  // Make y - axis
  line(100, 500, 100, 100);
  // Make x - axis
  line(100, 500, 750, 500);

  // axes labels
  fill(0); // Set fill color to black
  textAlign(CENTER, CENTER);
	textSize(15);
	noStroke();
  text("Mortality Rate", 50, 280);
	textSize(10);
  text("(# deaths/population)", 50, 300);
	textSize(15);
  text("Year", 430, 550);

  // Calculate the range of mortality rates
  var minRate = Math.min(...mortality_rate);
  var maxRate = Math.max(...mortality_rate);
textSize(14);
  // Draw unit labels on the y-axis
  for (var i = 0; i <= 5; i++) {
    var label = map(i, 0, 5, minRate, maxRate);
    var yPosition = map(i, 0, 5, 490, 100);
    text(label.toFixed(2), 70, yPosition);
  }
  for (var i = 0; i < heartData.getRowCount(); i += 4) {
    text(years[i], i * 20 + 129, 520);
  }

	// Create a "DONE" button
  doneButton = createButton("DONE");
  doneButton.position(700, 70); // Adjust the button position here
  doneButton.mousePressed(onDoneButtonClick);
	
 if (mouseIsPressed == true && !doneDrawing) {
    stroke(255, 0, 0); // Set stroke color to red when drawing
    line(mouseX, mouseY, pmouseX, pmouseY);
  }

  // Draw the data points and lines
// Draw the data points and filled heart shapes
var limit = doneDrawing ? currentRow : Math.min(20, currentRow);

// Inside the drawGraph function, draw filled hearts
for (var i = 0; i < limit; i++) {
  fill(255, 0, 0); // Set fill color to red
  noStroke(); // No outline for the filled shape

  drawHeart(i * 20 + 100, 500 - mortality_rate[i], 5); // Draw filled heart shape

  if (i > 0) {
    // Draw a thin line connecting this dot to the previous dot
    stroke(0); // Set stroke color to red
    line(
      i * 20 + 100, 500 - mortality_rate[i], // Current position
      (i - 1) * 20 + 100, 500 - mortality_rate[i - 1] // Previous position
    );
  }
}

// Custom function to draw a filled heart shape at x, y with a given size
function drawHeart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size, y - size, x - 2 * size, y + size, x, y + 2 * size);
  bezierVertex(x + 2 * size, y + size, x + size, y - size, x, y);
  endShape(CLOSE);
}


// This gets the computer’s clock time
  var currentTime = millis();
  // Each time we hit the next timestep
  // Update the nextPlay and currentRow values
  if (currentTime > nextPlay && currentRow < heartData.getRowCount()) {
    // Update the next play timestamp
    nextPlay += timestep;
    // Update our row counter
    currentRow = currentRow + 1;
  }
}

// Function to handle "DONE" button click
function onDoneButtonClick() {
  doneDrawing = true;
	text("How accurate was your prediction?",650,200);
}

