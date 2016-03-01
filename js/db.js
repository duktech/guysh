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
 
 // global variables
var	db;
var	shortName = 'WebSqlDB';
var	version = '1.0';
var	displayName = 'WebSqlDB';
var	maxSize = 65535;

function getDateTime(){
	var currentdate = new Date(); 
	var datetime = currentdate.getDate() + "/"
				+ (currentdate.getMonth()+1)  + "/" 
				+ currentdate.getFullYear() + " T "  
				+ currentdate.getHours() + ":"  
				+ currentdate.getMinutes() + ":" 
				+ currentdate.getSeconds();
	return datetime;
}

var dbWrapper = {	
    
	errorHandler: function(error) {
        alert('Error: ' + error.message + ' code: ' + error.code);
    },
	
	successCallBack: function() {
	  // alert("DEBUGGING: success");
	},
	
	nullHandler: function(){
	},
	
	// Application Constructor
    initialize: function() {
		if (!window.openDatabase) {
		   // not all mobile devices support databases  if it does not, thefollowing alert will display
		   // indicating the device will not be albe to run this application
		   alert('Databases are not supported in this browser.');
		   return;
		}

			// this line tries to open the database base locally on the device
			// if it does not exist, it will create it and return a database object stored in variable db
			db = openDatabase(shortName, version, displayName, maxSize);

			// this line will try to create the table User in the database just created/openned
			db.transaction(function(tx){

			// you can uncomment this next line if you want the User table to be empty each time the application runs
			// tx.executeSql( 'DROP TABLE User',nullHandler,nullHandler);

			// this line actually creates the table User if it does not exist and sets up the three columns and their types
			// note the UserId column is an auto incrementing column which is useful if you want to pull back distinct rows
			// easily from the table.
			tx.executeSql( 'CREATE TABLE IF NOT EXISTS Intervention(Id INTEGER NOT NULL PRIMARY KEY, RegisterDate TEXT NOT NULL, Type TEXT NOT NULL)',[],this.nullHandler,this.errorHandler);
			tx.executeSql( 'CREATE TABLE IF NOT EXISTS Pacient(Id INTEGER NOT NULL PRIMARY KEY,InterventionId INTEGER NOT NULL, Name TEXT NOT NULL, Surname TEXT NOT NULL, BirthDate TEXT NOT NULL, HospitalNr TEXT NOT NULL)',[],this.nullHandler,this.errorHandler);
			tx.executeSql( 'CREATE TABLE IF NOT EXISTS Team(Id INTEGER NOT NULL PRIMARY KEY,InterventionId INTEGER NOT NULL, Name TEXT NOT NULL, Surname TEXT NOT NULL, Role TEXT NOT NULL)',[],this.ullHandler,this.errorHandler);

		},this.errorHandler,this.successCallBack);
    },
	
	addIntervention: function(type, addInterventionReturnFunction){
		var interventionId = -1;
		db.transaction(function(transaction) {
			transaction.executeSql('INSERT INTO Intervention(RegisterDate, Type) VALUES (?,?)',[getDateTime(), type], addInterventionReturnFunction,this.errorHandler);
		},this.errorHandler,this.nullHandler);
	},
	
	getAllInterventions: function(getAllInterventionReturnFunction){
		var row = null;
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM Intervention ORDER BY Id DESC;', [], getAllInterventionReturnFunction);			
		},this.errorHandler,this.nullHandler);		
	},
	
	getLastIntervention: function(getLastInterventionReturnFunction){
		var row = null;
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM Intervention ORDER BY Id DESC LIMIT 1;', [], getLastInterventionReturnFunction);			
		},this.errorHandler,this.nullHandler);		
	},
	
	addPatient: function(interventionId, name, surname, birthDate, hospitalNr, addPatientReturnFunction){
		//alert ("function: " + interventionId + " " + name + " " + surname + " " + birthDate + " " + hospitalNr);
		db.transaction(function(transaction) {
			//alert ("trans: " + interventionId + " " + name + " " + surname + " " + birthDate + " " + hospitalNr);
			transaction.executeSql('INSERT INTO Pacient(InterventionId, Name, Surname, BirthDate, HospitalNr) VALUES (?,?,?,?,?)',[interventionId, name, surname, birthDate, hospitalNr], addPatientReturnFunction,this.errorHandler);
		});

		return false;
	},

	getAllPatients: function(getAllPatientsReturnFunction){
		var rows = null;
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM Pacient;', [], getAllPatientsReturnFunction
			/*function(transaction, result) {
				if (result != null && result.rows != null) {
					rows = result.rows;
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						$('#lbUsers').append('<br>' + row.UserId + '. ' + row.FirstName+ ' ' + row.LastName);
					}
				}
			}*/
			,this.errorHandler);
		},this.errorHandler,this.nullHandler);

		return rows;
	},
	
	getPatientById: function(id, getPatientByIdReturnFunction){
		var rows = null;
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM Pacient WHERE Id = '+ id +';', [],
			getPatientByIdReturnFunction,this.errorHandler);
		},this.errorHandler,this.nullHandler);

		return row;
	},
	
	getPatientByInterventionId: function(id, getPatientByInterventionIdReturnFunction){
		var rows = null;
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM Pacient WHERE InterventionId = '+ id +';', [],
			getPatientByInterventionIdReturnFunction ,this.errorHandler);
		},this.errorHandler,this.nullHandler);

		return row;
	},
	
	addTeam: function(interventionId, name, surname, role){
		db.transaction(function(transaction) {
			transaction.executeSql('INSERT INTO Pacient(InterventionId, Name, Surname, Role) VALUES (?,?,?,?)',[interventionId, name, surname, role], this.nullHandler, this.errorHandler);
		});

		return false;
	},
	
	getTeamById: function(id, getTeamByIdReturnFunction){
		var rows = null;
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM Team WHERE Id = '+ id +';', [],
			getTeamByIdReturnFunction,this.errorHandler);
		},this.errorHandler,this.nullHandler);

		return rows;
	},
	
	getTeamByInterventionId: function(id, getTeamByInterventionIdReturnFunction){
		var rows = null;
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM Team WHERE InterventionId = '+ id +';', [],
			getTeamByInterventionIdReturnFunction,this.errorHandler);
		},this.errorHandler,this.nullHandler);

		return rows;
	}

};
