/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function getAllInterventionsReturnFunction(transaction, result) {
	if (result != null && result.rows != null && result.rows.length > 0) {
		for (var i = 0; i < result.rows.length; i++) {
			var row = result.rows.item(i);
			$('#interventions').append('<br>' + row.Id + '. ' + row.RegisterDate + ' ' + row.Type);
		}
	}
}

function getLastInterventionReturnFunction(transaction, result) {
	console.log(result);
	if (result != null && result.rows != null && result.rows.length > 0) {
		var row = result.rows.item(0);
		window.localStorage.setItem("lastIntervention", row.Id);

		if ($('#interventionDetails').length) {
			var type = "Surgery";
			if (row.Type == 2)
				type = "Radiology";
			else if (row.Type == 3)
				type = "Endoscopy";
			else if (row.Type == 4)
				type = "WARD";
			$('#interventionDetails').text(type + " - " + row.Id + " - " + row.RegisterDate)
		}

		if($('#interventionDetailsInPage').length > 0){
			$('#interventionDetailsInPage').append('<tr> <td>Procedure date:</td> <td>'+row.RegisterDate+'</td> </tr> <tr> <td>Site:</td> <td>Guy&#39;s Hospital</td> </tr> <tr> <td>Checklist:</td> <td class="checkList_name">WHO Patient Safety</td> </tr>');
		}
	}
}

function getPatientByInterventionIdReturnFunction(transaction, result) {
if (result != null && result.rows != null && result.rows.length > 0) {
		var row = result.rows.item(0);
		$('#patientDetails').append('<span class="green-title text-center"> ' + row.Name + ' ' + row.Surname + ' </span>' + '<table class="patienttable">' + '<tr>' + '<td class="lcol">' + 'DOB:' + '</td>' + '<td class="lcol">' + row.BirthDate.substr(0, 4) + " / " + row.BirthDate.substr(4, 2) + " / " + row.BirthDate.substr(6, 2) + '</td>' + '</tr>' + '<tr>' + '<td class="lcol">' + "Hospital No:" + '</td>' + '<td class="lcol">' + row.HospitalNr + '</td>' + '</tr>' + '<tr><td>Ward:</td><td>Richard Bright, Guy&#39;s Hospital</td></tr></table>');
	}
}

function getTeamByInterventionIdReturnFunction(transaction, result) {

	if (result != null && result.rows != null && result.rows.length > 0) {
		for (var i = 0; i < result.rows.length; i++) {
			var row = result.rows.item(i);
			var teamMember ='<strong>' +  row.Name + '</strong><br/>' + row.Surname + '<br/>' +row.Role + '<br/>';
			if (row.IsLeader == '1'){
				$('.safety_team_lead').append(teamMember);
			}else{
				$('.team_members').append(teamMember);
			}
		}
	}
}
function getTeamByInterventionIdReturnFunctionForSummary(transaction, result) {
	if (result != null && result.rows != null && result.rows.length > 0) {
		for (var i = 0; i < result.rows.length; i++) {
			var row = result.rows.item(i);
			var teamMember = row.Name;
			if (row.IsLeader == '1'){
				$('.safety_team_lead').append(teamMember);
			}else{
				if($('.team_members').text() ==""){
					$('.team_members').append(teamMember);
				}else{
					$('.team_members').append(', ' +teamMember);
				}

			}
		}
	}
}
function getCheckListByInterventionIdReturnFunction(transaction, result) {
	if (result != null && result.rows != null && result.rows.length > 0) {
		for (var i = 0; i < result.rows.length; i++) {
			var row = result.rows.item(i);
			var checkList = '<tr><td>' + row.Name + '</td><td> ' + row.SignDate + '</td><td>' + row.Status + ' </td></tr>';
			$(checkList).insertAfter($('#checkListItems'));
			//stefan
   			//$(checkList).insertAfter($('.a-data thead'));
		}
	}
}

function getAllCheckListsReturnFunction(transaction, result) {
	if (result != null && result.rows != null && result.rows.length > 0) {
		for (var i = 0; i < result.rows.length; i++) {
			var row = result.rows.item(i);
			var checkNames = row.CheckName.split(',');
			var checkDates = row.CheckDate.split(',');
			var checkStatus = row.CheckStatus.split(',');

			var type = "Surgery";
			if (row.interventionType == 2)
				type = "Radiology";
			else if (row.interventionType == 3)
				type = "Endoscopy";
			else if (row.interventionType == 4)
				type = "WARD";

			var final_stauts = "COMPLETE";
			if(checkStatus[0] != "COMPLETED" || checkStatus[1] != "COMPLETED" || checkStatus[2] != "COMPLETED" ){
				final_stauts = "incomplete";
			}
			var sign_date = checkDates[0].split(' T ')[1].split(':');
			var time_out_date = checkDates[2].split(' T ')[1].split(':');
			var sign_out_date = checkDates[1].split(' T ')[1].split(':');
			var html = '<tr>';
			html += '<td>'+row.interventionDate.split(' T ')[0]+'</td>';
			html += '<td>'+type+'</td>';
			html += '<td>Guy&#39;s Hospital</td>';
			html += '<td>' +sign_date[0] + ':' + sign_date[1] + '</td>';
			html += '<td>' +time_out_date[0] + ':' + time_out_date[1] + '</td>';
			html += '<td>' +sign_out_date[0] + ':' + sign_out_date[1] + '</td>';
			html += '<td>'+final_stauts+'</td>';
			html += '<td>'+row.TeamSafetyLead+'</td>';
			html += '</tr>';
			$('#allCheckListItems').append(html);
		}
	}
}

function addInterventionReturnFunction() {
	dbWrapper.initialize();
	dbWrapper.getAllInterventions(getAllInterventionsReturnFunction);
	setTimeout(function () {
		window.open('scan-patient.html', '_self', 'location=yes');
	}, 1000);
}

function addPatientReturnFunction() {
	window.open('scan-completed.html', '_self', 'location=yes');
}

function addTeamReturnFunction() {
	window.open('scan-completed2.html', '_self', 'location=yes');
}

function signInActionReturnFunction() {
	window.open('time-out.html', '_self', 'location=yes');
}

function timeOutActionReturnFunction() {
	window.open('sign-out.html', '_self', 'location=yes');
}

function signOutActionReturnFunction() {

	window.open('who-checklist.html', '_self', 'location=yes');
}


// VLAD JS



function checkfield(fieldname) {

	var radios = document.getElementsByName(fieldname);
	var formValid = false;

	var i = 0;
	while (!formValid && i < radios.length) {
		if (radios[i].checked) formValid = true;
		i++;
	}

	return formValid;
}

function validateForm() {
	var formValid = true;
	//SIGN-IN.HTML
	if (document.getElementsByName("o161").length > 0 && !checkfield("o161"))
		formValid = false;
	if (document.getElementsByName("o182").length > 0 && !checkfield("o182"))
		formValid = false;
	if (document.getElementsByName("o201").length > 0 && !checkfield("o201"))
		formValid = false;
	// TIME-OUT.HTML
	if (document.getElementsByName("o60").length > 0 && !checkfield("o60"))
		formValid = false;
	if (document.getElementsByName("o80").length > 0 && !checkfield("o80"))
		formValid = false;

	return formValid;
}

// Checkbox Function

function checkCheckbox() {
	var cbx = document.getElementsByName("cbox");
	var formValid = true;
	for (i = 0; i < cbx.length; i++) {
		if (!cbx[i].checked) {
			formValid = false;
		}
	}
	return formValid;
}

function validatefunctions() {
	var validation = true;
	if (!validateForm())
		validation = false;
	if (!checkCheckbox())
		validation = false;

	return validation;
}
// END VLAD JS


var app = {
	// Application Constructor
	initialize: function () {
		dbWrapper.initialize();
		dbWrapper.getLastIntervention(getLastInterventionReturnFunction);
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// `load`, `deviceready`, `offline`, and `online`.
	bindEvents: function () {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		if ($('#scan').length)
			document.getElementById('scan').addEventListener('click', this.scan, false);
		if ($('#scanTeamLeader').length)
			document.getElementById('scanTeamLeader').addEventListener('click', this.scanTeamLeader, false);
		if ($('#scanTeamMember').length)
			document.getElementById('scanTeamMember').addEventListener('click', this.scanTeamMember, false);
		if ($('#signInAction').length)
			document.getElementById('signInAction').addEventListener('click', this.signInAction, false);
		if ($('#signOutAction').length)
			document.getElementById('signOutAction').addEventListener('click', this.signOutAction, false);
		if ($('#timeOutAction').length)
			document.getElementById('timeOutAction').addEventListener('click', this.timeOutAction, false);
		if ($('#printReport').length)
			document.getElementById('printReport').addEventListener('click', this.printReport, false);
		if ($('#sendPdf').length)
			document.getElementById('sendPdf').addEventListener('click', this.sendPdf, false);
	},

	// deviceready Event Handler
	//
	// The scope of `this` is the event. In order to call the `receivedEvent`
	// function, we must explicity call `app.receivedEvent(...);`
	onDeviceReady: function () {
		app.receivedEvent('deviceready');
	},

	// Update DOM on a Received Event
	receivedEvent: function (id) {
		var parentElement = document.getElementById(id);
		var listeningElement = parentElement.querySelector('.listening');
		var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');

		console.log('Received Event: ' + id);
	},

	getPatientDetails: function () {
		dbWrapper.initialize();
		if (window.localStorage.getItem("lastIntervention") != null && window.localStorage.getItem("lastIntervention").length > 0)
			dbWrapper.getPatientByInterventionId(window.localStorage.getItem("lastIntervention"), getPatientByInterventionIdReturnFunction);
		else
			alert("There isn't defined any intervention");
	},

	getTeamDetails: function () {
		dbWrapper.initialize();
		if (window.localStorage.getItem("lastIntervention") != null && window.localStorage.getItem("lastIntervention").length > 0)
			dbWrapper.getTeamByInterventionId(window.localStorage.getItem("lastIntervention"), getTeamByInterventionIdReturnFunction);
		else
			alert("There isn't defined any intervention");
	},

	getTeamDetailsForSummary: function () {
		dbWrapper.initialize();
		if (window.localStorage.getItem("lastIntervention") != null && window.localStorage.getItem("lastIntervention").length > 0)
			dbWrapper.getTeamByInterventionId(window.localStorage.getItem("lastIntervention"), getTeamByInterventionIdReturnFunctionForSummary);
		else
			alert("There isn't defined any intervention");
	},

	getCheckListItems: function () {
		dbWrapper.initialize();
		if (window.localStorage.getItem("lastIntervention") != null && window.localStorage.getItem("lastIntervention").length > 0)
			dbWrapper.getCheckListByInterventionId(window.localStorage.getItem("lastIntervention"), getCheckListByInterventionIdReturnFunction);
		else
			alert("There isn't defined any intervention");
	},

	getAllCheckLists: function () {
		dbWrapper.initialize();
		if (window.localStorage.getItem("lastIntervention") != null && window.localStorage.getItem("lastIntervention").length > 0)
			dbWrapper.dbGetAllCheckLists(getAllCheckListsReturnFunction);
		else
			alert("There isn't defined any intervention");
	},

	createIntervention: function (type) {
		dbWrapper.initialize();
		dbWrapper.addIntervention(type, addInterventionReturnFunction);
	},

	scan: function () {
		console.log('scanning');
		if (window.localStorage.getItem("lastIntervention") == null || window.localStorage.getItem("lastIntervention").length < 1)
			alert("There isn't defined any intervention");

		var scanner = cordova.require("cordova/plugin/BarcodeScanner");

		scanner.scan(function (result) {
			var res = result.text.split("|");
			if (res.length == 4) {
				dbWrapper.initialize();
				dbWrapper.addPatient(window.localStorage.getItem("lastIntervention"), res[0].trim(), res[1].trim(), res[2].trim(), res[3].trim(), addPatientReturnFunction);
			} else {
				alert("QRCode do not contains valid information");
			}
		}, function (error) {
			console.log("Scanning failed: ", error);
		});
	},

	scanTeamLeader: function () {
		console.log('scanning');
		if (window.localStorage.getItem("lastIntervention") == null || window.localStorage.getItem("lastIntervention").length < 1)
			alert("There isn't defined any intervention");

		var scanner = cordova.require("cordova/plugin/BarcodeScanner");

		scanner.scan(function (result) {
			var res = result.text.split("|");
			if (res.length == 3) {
				dbWrapper.initialize();
				dbWrapper.addTeam(window.localStorage.getItem("lastIntervention"), res[0].trim(), res[1].trim(), res[2].trim(), "1", addTeamReturnFunction);
			} else {
				alert("QRCode do not contains valid information");
			}
		}, function (error) {
			console.log("Scanning failed: ", error);
		});
	},

	scanTeamMember: function () {
		console.log('scanning');
		if (window.localStorage.getItem("lastIntervention") == null || window.localStorage.getItem("lastIntervention").length < 1)
			alert("There isn't defined any intervention");

		var scanner = cordova.require("cordova/plugin/BarcodeScanner");

		scanner.scan(function (result) {
			var res = result.text.split("|");
			if (res.length == 3) {
				dbWrapper.initialize();
				dbWrapper.addTeam(window.localStorage.getItem("lastIntervention"), res[0].trim(), res[1].trim(), res[2].trim(), "0", addTeamReturnFunction);
			} else {
				alert("QRCode do not contains valid information");
			}
		}, function (error) {
			console.log("Scanning failed: ", error);
		});
	},

	signInAction: function (type) {
		if (validatefunctions()) {
			if (window.localStorage.getItem("lastIntervention") == null || window.localStorage.getItem("lastIntervention").length < 1)
				alert("There isn't defined any intervention");
			dbWrapper.initialize();
			dbWrapper.addCheckList(window.localStorage.getItem("lastIntervention"), "Sign in", signInActionReturnFunction);
		} else
			alert("Make sure you've checked all the checkboxes!")
	},

	signOutAction: function (type) {
		if (validatefunctions()) {
			if (window.localStorage.getItem("lastIntervention") == null || window.localStorage.getItem("lastIntervention").length < 1)
				alert("There isn't defined any intervention");
			dbWrapper.initialize();
			dbWrapper.addCheckList(window.localStorage.getItem("lastIntervention"), "Sign out", signOutActionReturnFunction);
		} else
			alert("Make sure you've checked all the checkboxes!");
	},

	timeOutAction: function (type) {
		if (validatefunctions()) {
			if (window.localStorage.getItem("lastIntervention") == null || window.localStorage.getItem("lastIntervention").length < 1)
				alert("There isn't defined any intervention");
			dbWrapper.initialize();
			dbWrapper.addCheckList(window.localStorage.getItem("lastIntervention"), "Time out", timeOutActionReturnFunction);
		} else
			alert("Make sure you've checked all the checkboxes!");
	},

	printReport: function (type) {
		var page = location.href;
		cordova.plugins.printer.print(page, 'who-checklist.html', function () {
			alert('printing finished or canceled');
		});
	},

	sendPdf: function (type) {
		var doc = new jsPDF();
		doc.setFontSize(14);

		doc.fromHTML($('.to-pdf').get(0), 15, 15);
		//doc.text(20, 20, 'Hello world!');
		var checklist_name = $('.checkList_name').text();
		var checklist_name_pdf = checklist_name.replace(/\s+/g, '-');

		var uristring = doc.output('datauristring');
		var uristringparts = uristring.split(',');
		uristringparts[0] = "base64:" + escape(checklist_name_pdf + ' - checklist.pdf') + "//";

		var moddeduristring =  uristringparts.join("");


		cordova.plugins.email.open({
			to:      '',
			cc:      '',
			subject: checklist_name + ' - Checklist',
			body:    checklist_name + ' - Checklist Pdf',
			isHTML: false,
			attachments: [moddeduristring]
		});


		//not used, save pdf to phone
		//window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    //function fail(evt){
		//	alert('fail');
		//	alert(evt.target.error.code);
		//}
		//function gotFS(fileSystem) {
		//	alert('gotfs');
		//	fileSystem.root.getFile("test.pdf", {create: true, exclusive: false}, gotFileEntry, fail);
		//}
    //
		//function gotFileEntry(fileEntry) {
		//	fileEntry.createWriter(gotFileWriter, fail);
		//}
    //
		//function gotFileWriter(writer) {
		//	alert('write doc start');
		//	var doc = new jsPDF();
		//	doc.setFontSize(14);
    //
		//	doc.text(20, 20, 'Hello world!');
		//	writer.write(doc.output());
		//}
	},

	encode: function () {
		var scanner = cordova.require("cordova/plugin/BarcodeScanner");
		scanner.encode(scanner.Encode.TEXT_TYPE, "marius rata : 5 sept 1975", function (success) {
			alert("encode success: " + success);
		}, function (fail) {
			alert("encoding failed: " + fail);
		});

	}

};