// function generateTable(e) {
// 	e.preventDefault();
// 	console.log('begin generate table');

// 	var numSpecies = document.getElementById('numSpecies').value;
// 	var numLevels = document.getElementById('numLevels').value;

// 	var tableDiv = document.getElementById('table-div');
// 	var table = document.createElement('table');

// 	for(var i = 0; i < numSpecies; i++){
//         var tr = table.insertRow();
//         for(var j = 0; j < numLevels; j++){
//             var td = tr.insertCell();
//             td.appendChild(document.createTextNode('Cell'));
//             td.style.border = '1px solid black';
//         }
//     }
//     table.classList.add("table");
//     table.classList.add("table-hover");
//     table.editableTableWidget();
//     tableDiv.appendChild(table);
// }

/*
	Results table generation
*/
function generateAndPostResultsTable(speciesArray, briArray) {
	console.log("hello from generate and post");
	var data_table = document.getElementById('data-table');
	var numSpecies = data_table.rows.length-1;

	//Create table
	var results_table = document.createElement('table');
	results_table.className += "table";
	results_table.id = "results-table";

	//Add headings
	var th = results_table.insertRow();
	var speciesLabelCell = th.insertCell();
	speciesLabelCell.appendChild(document.createTextNode('Species Name'));
	var briLabelCell = th.insertCell();
	briLabelCell.appendChild(document.createTextNode('BRI (%)'));

	//Add data
	for(var s = 0, b = 0; s < speciesArray.length; s++, b++) {
		var data_row = results_table.insertRow(-1);
		var speciesNameCell = data_row.insertCell();
		speciesNameCell.appendChild(document.createTextNode(speciesArray[s]));
		var briValueCell = data_row.insertCell();
		briValueCell.appendChild(document.createTextNode(briArray[b]));
	}

	// Add new row and column divs, then add table
	var row = document.createElement("div");
	row.className += "row";
	row.id = "data-row";
	document.getElementById('page-container').appendChild(row);

	var col = document.createElement("div");
	col.className += "col-lg-12";
	row.appendChild(col);

	// Add table
	col.appendChild(document.createElement('br'));
	col.appendChild(results_table);
}

/*
	Standardize helper functions
*/
function retrieveCoeffs() {
	var c_table = document.getElementById('c-table');
	var coeffs = []

	// position of coeff col
	var cColPos = c_table.rows[0].cells.length - 1;

	for(var i = 1; i < c_table.rows.length; i++) {
		coeffs.push(c_table.rows[i].cells[cColPos].innerHTML);
	}

	return coeffs;
}


/*
	Standardize the user-inputted data
*/ 
function standardize() {
	console.log('hello from standardize');
	// retrieve each c_i
	var coeffs = retrieveCoeffs();

	// for each row standardize and add
	var briArray = [];
	var speciesArray = [];
	var data_table = document.getElementById('data-table');

	for(var r = 1; r < data_table.rows.length; r++) {
		var bri = 0.0;
		speciesArray.push(data_table.rows[r].cells[0].children[0].value);
		for(var c = 1; c < data_table.rows[0].cells.length; c++) {
			// console.log("coeff: ", coeffs[c-1]);
			// console.log("r: ", r);
			// console.log("c: ", c)
			// console.log("value: ", data_table.rows[r].cells[c].innerHTML);
			// console.log("data: ", parseFloat(data_table.rows[r].cells[c].children[0].value));
			bri += coeffs[c-1] * parseFloat(data_table.rows[r].cells[c].children[0].value);
		}
		briArray.push(bri);
	}

	console.log("bri: ", briArray[0]);
	generateAndPostResultsTable(speciesArray, briArray);
}




function continueToAddData() {
	console.log("Hello from continue to add data!");

	data_table = document.createElement("table");
	data_table.className += "table";
	data_table.id = "data-table";
	c_table = document.getElementById("c-table");
	numLevels = c_table.rows.length - 1; // number of different severities

	// Create table headings
	var th = data_table.insertRow();
	var h_species = th.insertCell();
	h_species.appendChild(document.createTextNode("Species"));

	for(var i = 0; i < numLevels; i++) {
		var h = th.insertCell();
		h.appendChild(document.createTextNode("p"+(i+1)));
	}

	// Create first species row
	var tr = data_table.insertRow();
	for(var i = 0; i < (numLevels +1); i++) {
		var cell = tr.insertCell();
		var input = document.createElement("input");
		input.setAttribute("type", "text");
		if(i == 0) input.setAttribute("value", "Species Name");
		else input.setAttribute("value", "0.0");
		cell.appendChild(input);	
	}

	// Add new row and column divs, then add table
	var row = document.createElement("div");
	row.className += "row";
	row.id = "data-row";
	document.getElementById('page-container').appendChild(row);

	var col = document.createElement("div");
	col.className += "col-lg-12";
	row.appendChild(col);

	//setup and append instruction text
	var instructionText = document.createElement('p');
	instructionText.innerHTML = "Add your observed data in this table. To add a row for a new species, just click 'Add Species'";
	col.appendChild(document.createElement('br'));
	col.appendChild(instructionText);

	//setup and append add species button
	var addSpeciesButton = document.createElement("button");
	addSpeciesButton.setAttribute('onclick', 'addSpecies()');
	addSpeciesButton.appendChild(document.createTextNode('Add Species'));
	col.appendChild(document.createElement('br'));
	col.appendChild(addSpeciesButton);

	//append table
	col.appendChild(document.createElement('br'));
	col.appendChild(data_table);

	var standardizeButton = document.createElement('button');
	standardizeButton.setAttribute('onclick', 'standardize()');
	standardizeButton.appendChild(document.createTextNode('Standardize'));
	col.appendChild(standardizeButton);

}

function addContinueButton() {
	button = document.getElementById('continue-button');
	//c_table = document.getElementById('c-table');
	if(!button) {
		// Create continue button
		button = document.createElement("button");
		text = document.createTextNode("Continue");
		button.appendChild(text);
		button.setAttribute("type", "button");
		button.setAttribute("id", "continue-button");
		button.setAttribute("onclick", "continueToAddData()");

		// Create info alert
		alert = document.createElement("div");
		alert.className += "alert alert-info";
		alert.innerHTML = "If these values are correct, press Continue. Otherwise adjust and re-submit.";

		button_div = document.getElementById("button-div");
		button_div.insertBefore(alert, button_div.children[0]);
		button_div.appendChild(button);
	}
}

function calculateAndPostCi() {
	console.log("calculate c");
	table = document.getElementById("c-table");
	for (var i = 0, row; row = table.rows[i]; i++) {
		if(i == 0)
			continue;
		var lower = parseFloat(row.cells[1].children[0].value);
		var upper = parseFloat(row.cells[2].children[0].value);
		console.log("lower" + lower)
		var c_i = (lower + upper)/2.0;
		row.cells[3].innerHTML = c_i/100.0;
	}

	addContinueButton();
}

/*
	This function will add another species row to the data table
*/
function addSpecies() {
	console.log("Hello from add species");
	var data_table = document.getElementById('data-table');
	var row = data_table.insertRow(-1);

	var name_cell = row.insertCell();
	var name_cell_input = document.createElement('input');
	name_cell_input.setAttribute("type", "text");
	name_cell_input.setAttribute("value", "Species Name");
	name_cell.appendChild(name_cell_input);

	var numCols = data_table.rows[0].cells.length;

	for(var i = 0; i < (numCols-1); i++) {
		var cell = row.insertCell();
		cell_input = document.createElement('input');
		cell_input.setAttribute('type', 'text');
		cell_input.setAttribute('value', '0.0');
		cell.appendChild(cell_input);
	}
}


// Add a row to the table for a new category
function addCategory() {
	table = document.getElementById("c-table");
	var row = table.insertRow(-1);

	var numRows = table.rows.length;
	console.log(numRows);

	var category_id = row.insertCell(-1);
	category_id.innerHTML = "p" + (numRows-1);

	var lower = row.insertCell(-1);
	var lower_input = document.createElement("input");
	lower_input.setAttribute("type", "text");
	lower_input.setAttribute("value", "100.0");
	lower.appendChild(lower_input);

	var upper = row.insertCell(-1);
	var upper_input = document.createElement("input");
	upper_input.setAttribute("type", "text");
	upper_input.setAttribute("value", "100.0");
	upper.appendChild(upper_input);

	var c_i = row.insertCell(-1);
	c_i.innerHTML = "1.0";

	oldLastRow = table.rows[(table.rows.length-2)]
	oldLastRow.cells[1].children[0].value = "0.0";
	oldLastRow.cells[2].children[0].value = "0.0";
	oldLastRow.cells[3].innerHTML = "0.0"
}