// Disable scroll down when spacebar is pressed
$(document).keydown(function(e) {
    if (e.which == 32) {
        return false;
    }
});

function btnOnClick(btn,action,user) {
    // console.log(btn+" "+action);

    var video = $("#video_part1").get(0);
    var currentTime = video.currentTime;

    totalSeconds = Math.floor(currentTime);
    minutes = Math.floor(totalSeconds / 60);
    seconds = totalSeconds % 60;
    
    secondRow = Math.floor(seconds - seconds % 3);

    rowid = minutes+"\""+secondRow.pad(2);


    if (user == 'u1') {
    	rowid = 'u1_'+rowid;

    	var targetRow = document.getElementById(rowid);
    	// console.log(action+" "+seconds+"->"+rowid);
    	// console.log(targetRow);

    	switch(action) {
		    case "iconic":
		        var col = targetRow.cells[1];
		    	var oriValue = col.innerHTML;

		    	if (oriValue == "") {
		    		oriValue = 1;
		    	} else {
		    		oriValue = parseInt(col.innerHTML) + 1
		    	}
		    	col.innerHTML = oriValue;
		        break;
		    case "meta":
		    	var col = targetRow.cells[2];
		    	var oriValue = col.innerHTML;

		    	if (oriValue == "") {
		    		oriValue = 1;
		    	} else {
		    		oriValue = parseInt(col.innerHTML) + 1
		    	}
		    	col.innerHTML = oriValue;
		        break;
		    case "noniconic":
		    	var col = targetRow.cells[3];
		    	var oriValue = col.innerHTML;

		    	if (oriValue == "") {
		    		oriValue = 1;
		    	} else {
		    		oriValue = parseInt(col.innerHTML) + 1
		    	}
		    	col.innerHTML = oriValue;
		        break;
		    case "point":
		    	var col = targetRow.cells[4];
		    	var oriValue = col.innerHTML;

		    	if (oriValue == "") {
		    		oriValue = 1;
		    	} else {
		    		oriValue = parseInt(col.innerHTML) + 1
		    	}
		    	col.innerHTML = oriValue;
		        break;
		}
    }


    else if (user == 'u2'){
    	rowid = 'u2_'+rowid;

    	var targetRow = document.getElementById(rowid);
    	// console.log(action+" "+seconds+"->"+rowid);
    	// console.log(targetRow);

    	switch(action) {
		    case "iconic":
		        var col = targetRow.cells[1];
		    	var oriValue = col.innerHTML;

		    	if (oriValue == "") {
		    		oriValue = 1;
		    	} else {
		    		oriValue = parseInt(col.innerHTML) + 1
		    	}
		    	col.innerHTML = oriValue;
		        break;
		    case "meta":
		    	var col = targetRow.cells[2];
		    	var oriValue = col.innerHTML;

		    	if (oriValue == "") {
		    		oriValue = 1;
		    	} else {
		    		oriValue = parseInt(col.innerHTML) + 1
		    	}
		    	col.innerHTML = oriValue;
		        break;
		    case "noniconic":
		    	var col = targetRow.cells[3];
		    	var oriValue = col.innerHTML;

		    	if (oriValue == "") {
		    		oriValue = 1;
		    	} else {
		    		oriValue = parseInt(col.innerHTML) + 1
		    	}
		    	col.innerHTML = oriValue;
		        break;
		    case "point":
		    	var col = targetRow.cells[4];
		    	var oriValue = col.innerHTML;

		    	if (oriValue == "") {
		    		oriValue = 1;
		    	} else {
		    		oriValue = parseInt(col.innerHTML) + 1
		    	}
		    	col.innerHTML = oriValue;
		        break;
		}

    }
    
}

function ideaBtnOnClick(user) {
    // console.log(btn+" "+action);

    var video = $("#video_part1").get(0);
    var currentTime = video.currentTime;

    totalSeconds = Math.floor(currentTime);
    minutes = Math.floor(totalSeconds / 60);
    seconds = totalSeconds % 60;
    
    secondRow = Math.floor(seconds - seconds % 3);

    rowid = minutes+"\""+secondRow.pad(2);

    rowid = 'u1_'+rowid;
	var targetRow = document.getElementById(rowid);
	var col = targetRow.cells[5];

    if (user == 'u1') {
    	col.innerHTML = 'A';
    }else {
    	col.innerHTML = 'B';
    }
}
$(document).ready(function() {
	addTable("U1-table","u1");
	addTable("U2-table","u2");
});

function addTable(tableID,tag){
	var u1table = document.getElementById(tableID);

	for (m=0; m<=11; m++){
		//minutes
		for (s=0;s<60;s+=3){
			timeLabel = m+"\""+s.pad(2);

			var row = u1table.insertRow(u1table.rows.length);
			row.id = tag+"_"+timeLabel;

			//row content
			var col1 = row.insertCell(0);
			row.insertCell(1);
			row.insertCell(2);
			row.insertCell(3);
			row.insertCell(4);

			if (tag == "u1") {
				row.insertCell(5);
			}
			//column 1st time label
			col1.innerHTML = timeLabel;
			
		}
	}
}

function exportBtnOnClick(user) {
	var targetID = "";
	if (user == 'u1'){
		targetID = 'U1-table-data';
	} else {
		targetID = 'U2-table-data';
	}

	var blob = new Blob([document.getElementById(targetID).innerHTML], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
    });
    var strFile = groupName+targetID+".xls";
    saveAs(blob, strFile);
    return false;
}

