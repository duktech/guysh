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

function getAllInterventionsReturnFunction(transaction, result){
	if (result != null && result.rows != null && result.rows.length>0) {
		for (var i = 0; i < result.rows.length; i++) {
			var row = result.rows.item(i);
			$('#interventions').append('<br>' + row.Id + '. ' + row.RegisterDate+ ' ' + row.Type);
		}
	}
}

function getLastInterventionReturnFunction(transaction, result){
	if (result != null && result.rows != null && result.rows.length>0) {
		var row = result.rows.item(0);
		window.localStorage.setItem("lastIntervention", row.Id);
		
		if($('#interventionDetails').length){
			var type="Surgery";
			if(row.Type==2)
				type="Radiology";
			else if(row.Type==3)
				type="Endoscopy";
			else if(row.Type==4)
				type="WARD";
			$('#interventionDetails').text(type + " - " + row.Id + " - " + row.RegisterDate)
		}
	}
}

function getPatientByInterventionIdReturnFunction(transaction, result)
{
	if (result != null && result.rows != null && result.rows.length>0) {
		var row = result.rows.item(0);
		$('#patientDetails').append('<br/> Name: ' + row.Name + ' <br /> Surname: ' + row.Surname + ' <br /> BirthDate: ' + row.BirthDate.substr(0,4)+" / "+row.BirthDate.substr(4,2)+" / "+row.BirthDate.substr(6,2) + "<br /> Hospital No: " + row.HospitalNr);
	}
}

function getTeamByInterventionIdReturnFunction(transaction, result)
{
	if (result != null && result.rows != null && result.rows.length>0) {
		for (var i = 0; i < result.rows.length; i++) {
			var row = result.rows.item(i);
			var teamMember = '<li>' + row.Name + ' ' + row.Surname + ' - ' + row.Role + ' </li>';
			if(row.IsLeader == '1')
				teamMember = '<li>' + row.Name + ' ' + row.Surname + ' - ' + row.Role + ' - Team safety leader </li>';
			$('#teamDetails').append(teamMember);
		}
	}
}

function getCheckListByInterventionIdReturnFunction(transaction, result)
{
	if (result != null && result.rows != null && result.rows.length>0) {
		for (var i = 0; i < result.rows.length; i++) {
			var row = result.rows.item(i);
			var checkList = '<tr><td>' + row.Name + '</td><td> ' + row.SignDate + '</td><td>' + row.Status + ' </td></tr>';
			$(checkList).insertAfter( $('#checkListItems'));
		}
	}
}
 
function addInterventionReturnFunction()
{
	dbWrapper.initialize();
	dbWrapper.getAllInterventions(getAllInterventionsReturnFunction);	
	setTimeout(function(){
		window.open('scan-patient.html', '_self', 'location=yes');
	}, 1000);	
}

function addPatientReturnFunction()
{
	window.open('scan-completed.html', '_self', 'location=yes');
}

function addTeamReturnFunction()
{
	window.open('scan-completed2.html', '_self', 'location=yes');
}

function signInActionReturnFunction()
{
	window.open('time-out.html', '_self', 'location=yes');
}

function timeOutActionReturnFunction()
{
	window.open('sign-out.html', '_self', 'location=yes');
}

function signOutActionReturnFunction()
{
	window.open('who-checklist.html', '_self', 'location=yes');
}
 
var app = {
    // Application Constructor
    initialize: function() {
		dbWrapper.initialize();
		dbWrapper.getLastIntervention(getLastInterventionReturnFunction);
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		if($('#scan').length)
			document.getElementById('scan').addEventListener('click', this.scan, false);
        if($('#scanTeamLeader').length)
			document.getElementById('scanTeamLeader').addEventListener('click', this.scanTeamLeader, false);
		if($('#scanTeamMember').length)
			document.getElementById('scanTeamMember').addEventListener('click', this.scanTeamMember, false);
		if($('#signInAction').length)
			document.getElementById('signInAction').addEventListener('click', this.signInAction, false);
		if($('#signOutAction').length)
			document.getElementById('signOutAction').addEventListener('click', this.signOutAction, false);
		if($('#timeOutAction').length)
			document.getElementById('timeOutAction').addEventListener('click', this.timeOutAction, false);
		if($('#printReport').length)
			document.getElementById('printReport').addEventListener('click', this.printReport, false);
		if($('#sendPdf').length)
			document.getElementById('sendPdf').addEventListener('click', this.sendPdf, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
	
	getPatientDetails: function(){	
		dbWrapper.initialize();
		if(window.localStorage.getItem("lastIntervention")!= null && window.localStorage.getItem("lastIntervention").length>0)
			dbWrapper.getPatientByInterventionId(window.localStorage.getItem("lastIntervention"), getPatientByInterventionIdReturnFunction);		
		else
			alert("There isn't defined any intervention");
	},
	
	getTeamDetails: function(){	
		dbWrapper.initialize();
		if(window.localStorage.getItem("lastIntervention")!= null && window.localStorage.getItem("lastIntervention").length>0)
			dbWrapper.getTeamByInterventionId(window.localStorage.getItem("lastIntervention"), getTeamByInterventionIdReturnFunction);		
		else
			alert("There isn't defined any intervention");
	},
	
	getCheckListItems: function(){	
		dbWrapper.initialize();
		if(window.localStorage.getItem("lastIntervention")!= null && window.localStorage.getItem("lastIntervention").length>0)
			dbWrapper.getCheckListByInterventionId(window.localStorage.getItem("lastIntervention"), getCheckListByInterventionIdReturnFunction);		
		else
			alert("There isn't defined any intervention");
	},
	
	createIntervention: function(type){
		dbWrapper.initialize();
		dbWrapper.addIntervention(type, addInterventionReturnFunction);		
	},

    scan: function() {
        console.log('scanning');		
		if(window.localStorage.getItem("lastIntervention")== null || window.localStorage.getItem("lastIntervention").length<1)
			alert("There isn't defined any intervention");

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) { 	
			var res = result.text.split("|");
			if(res.length == 4) 
			{
				dbWrapper.initialize();
				dbWrapper.addPatient(window.localStorage.getItem("lastIntervention"), res[0].trim(), res[1].trim(), res[2].trim(), res[3].trim(), addPatientReturnFunction);
			}
			else{
				alert ("QRCode do not contains valid information");
			}
        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
    },
	
	scanTeamLeader: function() {
        console.log('scanning');		
		if(window.localStorage.getItem("lastIntervention")== null || window.localStorage.getItem("lastIntervention").length<1)
			alert("There isn't defined any intervention");

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) { 	
			var res = result.text.split("|");
			if(res.length == 3) 
			{
				dbWrapper.initialize();
				dbWrapper.addTeam(window.localStorage.getItem("lastIntervention"), res[0].trim(), res[1].trim(), res[2].trim(), "1", addTeamReturnFunction);
			}
			else{
				alert ("QRCode do not contains valid information");
			}
        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
    },
	
	scanTeamMember: function() {
         console.log('scanning');		
		if(window.localStorage.getItem("lastIntervention")== null || window.localStorage.getItem("lastIntervention").length<1)
			alert("There isn't defined any intervention");

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) { 	
			var res = result.text.split("|");
			if(res.length == 3) 
			{
				dbWrapper.initialize();
				dbWrapper.addTeam(window.localStorage.getItem("lastIntervention"), res[0].trim(), res[1].trim(), res[2].trim(), "0", addTeamReturnFunction);
			}
			else{
				alert ("QRCode do not contains valid information");
			}
        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
    },
	
	signInAction: function(type){
	
		if(window.localStorage.getItem("lastIntervention")== null || window.localStorage.getItem("lastIntervention").length<1)
			alert("There isn't defined any intervention");			
		dbWrapper.initialize();
		dbWrapper.addCheckList(window.localStorage.getItem("lastIntervention"), "Sign in", signInActionReturnFunction);
	},
	
	signOutAction: function(type){
		if(window.localStorage.getItem("lastIntervention")== null || window.localStorage.getItem("lastIntervention").length<1)
			alert("There isn't defined any intervention");
		dbWrapper.initialize();
		dbWrapper.addCheckList(window.localStorage.getItem("lastIntervention"), "Sign out", signOutActionReturnFunction);		
	},
	
	timeOutAction: function(type){
		if(window.localStorage.getItem("lastIntervention")== null || window.localStorage.getItem("lastIntervention").length<1)
			alert("There isn't defined any intervention");
		dbWrapper.initialize();
		dbWrapper.addCheckList(window.localStorage.getItem("lastIntervention"), "Time out", timeOutActionReturnFunction);		
	},
	
	printReport: function(type){
		var page = location.href;
		cordova.plugins.printer.print(page, 'who-checklist.html', function () {
			alert('printing finished or canceled');
		});
	},
	
	sendPdf: function(type){
		
		function onFileSystemSuccess(fileSystem) {
			alert(fileSystem.name);
			var successPdf = function(status) {
				alert('Message: ' + status);
				window.open('mailto:mugurel.rata@duk-tech.com?subject=report&body=see attachment&attachment="\\myhost\myfolder\myfile.lis"', '_self', 'location=yes');;
			}
		}

		function onResolveSuccess(fileEntry) {
			alert(fileEntry.name);
			var successPdf = function(status) {
				alert('Message: ' + status);
				window.open('mailto:mugurel.rata@duk-tech.com?subject=report&body=see attachment&attachment="\\myhost\myfolder\myfile.lis"', '_self', 'location=yes');;
			}
		}

		function fail(evt) {
			console.log(evt.target.error.code);
		}
		alert("before file requests");
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
        window.resolveLocalFileSystemURI("file:///test.pdf", onResolveSuccess, fail);

		
		var successPdf = function(status) {
            alert('Message: ' + status);
			window.open('mailto:mugurel.rata@duk-tech.com?subject=report&body=see attachment&attachment="test.pdf"', '_self', 'location=yes');;
        }

        var errorPdf = function(status) {
            alert('Error: ' + status);
        }
		var page = location.href;
		
		window.html2pdf.create(
            page,
            //"~/Documents/test.pdf", // on iOS,
             "test.pdf", //on Android (will be stored in /mnt/sdcard/at.modalog.cordova.plugin.html2pdf/test.pdf)
            successPdf,
            errorPdf
        );
	},

    encode: function() {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        scanner.encode(scanner.Encode.TEXT_TYPE, "marius rata : 5 sept 1975", function(success) {
            alert("encode success: " + success);
          }, function(fail) {
            alert("encoding failed: " + fail);
          }
        );

    }

};
