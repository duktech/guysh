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
	if (result != null && result.rows != null) {
		for (var i = 0; i < result.rows.length; i++) {
			var row = result.rows.item(i);
			$('#interventions').append('<br>' + row.Id + '. ' + row.RegisterDate+ ' ' + row.Type);
		}
	}
}

function getLastInterventionReturnFunction(transaction, result){
	if (result != null && result.rows != null && result.rows.length>0) {
		window.localStorage.setItem("lastIntervention", result.rows.item(0).Id);
	}
}

function getPatientByInterventionIdReturnFunction(transaction, result)
{
	if (result != null && result.rows != null && result.rows.length>0) {
		var row = result.rows.item(0);
		$('#patientDetails').append('<br/> Name: ' + row.Name + ' <br /> Surname: ' + row.Surname + ' <br /> BirthDate' + row.BirthDate.substr(0,4)+" / "+row.BirthDate.substr(4,2)+" / "+row.BirthDate.substr(6,2));
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
        if($('#encode').length)
			document.getElementById('encode').addEventListener('click', this.encode, false);
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
