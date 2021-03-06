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
			tx.executeSql( 'CREATE TABLE IF NOT EXISTS Team(Id INTEGER NOT NULL PRIMARY KEY,InterventionId INTEGER NOT NULL, Name TEXT NOT NULL, Surname TEXT NOT NULL, Role TEXT NOT NULL, IsLeader INTEGER NOT NULL)',[],this.nullHandler,this.errorHandler);
			tx.executeSql( 'CREATE TABLE IF NOT EXISTS CheckList(Id INTEGER NOT NULL PRIMARY KEY,InterventionId INTEGER NOT NULL, Name TEXT NOT NULL, SignDate TEXT NOT NULL, Status TEXT NOT NULL )',[],this.nullHandler,this.errorHandler);

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
		db.transaction(function(transaction) {
			transaction.executeSql('DELETE FROM Pacient WHERE InterventionId = ' + interventionId + ';',[],this.nullHandler,this.errorHandler);
			transaction.executeSql('INSERT INTO Pacient(InterventionId, Name, Surname, BirthDate, HospitalNr) VALUES (?,?,?,?,?)',[interventionId, name, surname, birthDate, hospitalNr], addPatientReturnFunction,this.errorHandler);
		});

		return false;
	},

	getAllPatients: function(getAllPatientsReturnFunction){
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM Pacient;', [], getAllPatientsReturnFunction
			,this.errorHandler);
		},this.errorHandler,this.nullHandler);
	},
	
	getPatientById: function(id, getPatientByIdReturnFunction){
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM Pacient WHERE Id = '+ id +';', [],
			getPatientByIdReturnFunction,this.errorHandler);
		},this.errorHandler,this.nullHandler);
	},
	
	getPatientByInterventionId: function(id, getPatientByInterventionIdReturnFunction){
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM Pacient WHERE InterventionId = '+ id +' ORDER BY Id DESC;', [],
			getPatientByInterventionIdReturnFunction ,this.errorHandler);
		},this.errorHandler,this.nullHandler);
	},
	
	addTeam: function(interventionId, name, surname, role, isLeader,addTeamReturnFunction){
		db.transaction(function(transaction) {
			if(isLeader=="1")				
				transaction.executeSql("DELETE FROM Team WHERE InterventionId = " + interventionId + " AND IsLeader = '1';",[],this.nullHandler,this.errorHandler);
			transaction.executeSql('INSERT INTO Team(InterventionId, Name, Surname, Role, IsLeader) VALUES (?,?,?,?,?)',[interventionId, name, surname, role, isLeader], addTeamReturnFunction, this.errorHandler);
		});

		return false;
	},
	
	getTeamById: function(id, getTeamByIdReturnFunction){
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM Team WHERE Id = '+ id +';', [],
			getTeamByIdReturnFunction,this.errorHandler);
		},this.errorHandler,this.nullHandler);
	},
	
	getTeamByInterventionId: function(id, getTeamByInterventionIdReturnFunction){
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM Team WHERE InterventionId = '+ id +' ORDER BY IsLeader DESC ;', [],
			getTeamByInterventionIdReturnFunction,this.errorHandler);
		},this.errorHandler,this.nullHandler);
	},
	
	addCheckList: function(interventionId, name, addCheckListReturnFunction){
		db.transaction(function(transaction) {		
			console.log(interventionId+name);
			transaction.executeSql("DELETE FROM CheckList WHERE InterventionId = " + interventionId + " AND Name = '" + name + "';",[],this.nullHandler,this.errorHandler);
			transaction.executeSql('INSERT INTO CheckList(InterventionId, Name, SignDate, Status) VALUES (?,?,?,?)',[interventionId, name, getDateTime(), "COMPLETED"], addCheckListReturnFunction, this.errorHandler);
		});

		return false;
	},
	
	getCheckListByInterventionId: function(id, getCheckListByInterventionIdReturnFunction){
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM CheckList WHERE InterventionId = '+ id +' ORDER BY Id ASC;', [], getCheckListByInterventionIdReturnFunction,this.errorHandler);
		},this.errorHandler,this.nullHandler);
	},

	dbGetAllCheckLists: function(getAllCheckListsReturnFunction){
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT Intervention.Id as interventionId, Intervention.RegisterDate as interventionDate, Intervention.Type as interventionType, Team.Name as TeamSafetyLead ,group_concat(DISTINCT CheckList.Id) as checks, group_concat(CheckList.name) as CheckName, group_concat(CheckList.SignDate) as CheckDate, group_concat(CheckList.Status) as CheckStatus  FROM Intervention INNER JOIN CheckList on Intervention.Id=CheckList.InterventionId LEFT JOIN Team on Intervention.id=Team.InterventionId AND Team.IsLeader = 1 GROUP BY Intervention.Id', [], getAllCheckListsReturnFunction,this.errorHandler);
		},this.errorHandler,this.nullHandler);
	}
};
