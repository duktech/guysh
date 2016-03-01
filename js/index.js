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
var lastIntervention = null;

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
		lastIntervention = result.rows[0];		
	}
}

function getPatientByInterventionIdReturnFunction(transaction, result)
{
	if (result != null && result.rows != null && result.rows.length>0) {
		var row = result.rows.item(0);
		$('#patientDetails').append('<br/> Name: ' + row.Name + ' <br /> Surname' + row.Surname + ' <br /> ' + row.BirthDate);
	}
}
 
function addInterventionReturnFunction()
{
	dbWrapper.initialize();
	dbWrapper.getAllInterventions(getAllInterventionsReturnFunction);	
	setTimeout(function(){
		window.open('scan-patient.html', '_self', 'location=yes');
	}, 2000);
	
}

function addPatientReturnFunction()
{
	window.open('scan-completed.html', '_self', 'location=yes');
}


 
var app = {
    // Application Constructor
    initialize: function() {
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
	
	getPatientDetails: function(type){		
		dbWrapper.getPatientByInterventionId(interventionId, getPatientByInterventionIdReturnFunction);		
	},
	
	createIntervention: function(type){
		dbWrapper.initialize();
		dbWrapper.addIntervention(type, addInterventionReturnFunction);		
	},

    scan: function() {
        console.log('scanning');
		console.log(lastIntervention);
		console.log('lastINtevention: ' + lastIntervention.Id);
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        scanner.scan( function (result) { 

            /*alert("We got a barcode\n" + 
            "Result: " + result.text + "\n" + 
            "Format: " + result.format + "\n" + 
            "Cancelled: " + result.cancelled);  */

           /*console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");*/
            //document.getElementById("info").innerHTML = result.text;
			
			var res = result.text.split("|");
			if(res.length == 4)
			{
				dbWrapper.addPatient(lastIntervention, res[0].trim(), res[1].trim, res[2].trim, res[3].trim(), addPatientReturnFunction);
			}
			else{
				alert ("QRCode do not contains valid information");
			}
			
            console.log(result);
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
    },

    encode: function() {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
		alert("GUYS seems to wrok");
        scanner.encode(scanner.Encode.TEXT_TYPE, "marius rata : 5 sept 1975", function(success) {
            alert("encode success: " + success);
          }, function(fail) {
            alert("encoding failed: " + fail);
          }
        );

    }

};
