Hi
I hope this helps you all get started with phonegap and sqlite in your
application

Dean-O

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>

<!--
This is an example that shows how to create an application that uses
an embedded sqlite database
in a mobile device (iphone,ipod,ipad,android using phonegap, jquery
and sqlite.

Your phonegap project will already contain the phonegap.js.

You will need to download and add to your project the jquery.min.js
file

The application will create a database called WebSqlDb with a
table in it called User, which contains three fields  UserId,
FirstName and LastName

When the application is run the firsttime, if the local database does
not exist, the application
will create the database and the table.

The application shows two text boxes which you can use to add values
to the database using the add record button

The application also has a refresh button which will get the data from
the database and show it on the screen

When the application is run on the device the onBodyLoad() function is
called, which sets up the database and table

The Add Record button calls the AddValueToDB() function

The Refresh button calls the ListDBValues() function

There are a few alert statements in this application, which are only
there for debuggin purposes.  They look like this
alert("DEBUGGING: followed by some text");

These are only in the application to indicate where the application is
at when it is processing functions, etc

You will need to comment these out before you deploy/sell your
application

-->

<!-- Change this if you want to allow scaling -->
   <meta name="viewport" content="width=default-width; user-
scalable=no" />
   <meta http-equiv="Content-type" content="text/html;charset=utf-8">

   <title>Embedded Sql Example</title>

<!-- include the next line to use phonegap javascript functions -->
    <script type="text/javascript" charset="utf-8" src="phonegap.js"></
script>

<!-- include the next line to use jquery functions in your application
you must download this and include the directory your html file is in
-->
        <script type="text/javascript" charset="utf-8" src="jquery.min.js"></
script>

<!-- main scripts used in this example -->
 <script type="text/javascript" charset="utf-8">

// global variables
var db;
var shortName = 'WebSqlDB';
var version = '1.0';
var displayName = 'WebSqlDB';
var maxSize = 65535;

// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
   alert('Error: ' + error.message + ' code: ' + error.code);

}

// this is called when a successful transaction happens
function successCallBack() {
   alert("DEBUGGING: success");

}

function nullHandler(){};

// called when the application loads
function onBodyLoad(){

// This alert is used to make sure the application is loaded correctly
// you can comment this out once you have the application working
alert("DEBUGGING: we are in the onBodyLoad() function");

 if (!window.openDatabase) {
   // not all mobile devices support databases  if it does not, the
following alert will display
   // indicating the device will not be albe to run this application
   alert('Databases are not supported in this browser.');
   return;
 }

// this line tries to open the database base locally on the device
// if it does not exist, it will create it and return a database
object stored in variable db
 db = openDatabase(shortName, version, displayName,maxSize);

// this line will try to create the table User in the database just
created/openned
 db.transaction(function(tx){

  // you can uncomment this next line if you want the User table to be
empty each time the application runs
  // tx.executeSql( 'DROP TABLE User',nullHandler,nullHandler);

  // this line actually creates the table User if it does not exist
and sets up the three columns and their types
  // note the UserId column is an auto incrementing column which is
useful if you want to pull back distinct rows
  // easily from the table.
   tx.executeSql( 'CREATE TABLE IF NOT EXISTS User(UserId INTEGER NOT
NULL PRIMARY KEY, FirstName TEXT NOT NULL, LastName TEXT NOT NULL)',
[],nullHandler,errorHandler);
 },errorHandler,successCallBack);

}

// list the values in the database to the screen using jquery to
update the #lbUsers element
function ListDBValues() {

 if (!window.openDatabase) {
  alert('Databases are not supported in this browser.');
  return;
 }

// this line clears out any content in the #lbUsers element on the
page so that the next few lines will show updated
// content and not just keep repeating lines
 $('#lbUsers').html('');

// this next section will select all the content from the User table
and then go through it row by row
// appending the UserId  FirstName  LastName to the  #lbUsers element
on the page
 db.transaction(function(transaction) {
   transaction.executeSql('SELECT * FROM User;', [],
     function(transaction, result) {
      if (result != null && result.rows != null) {
        for (var i = 0; i < result.rows.length; i++) {
          var row = result.rows.item(i);
          $('#lbUsers').append('<br>' + row.UserId + '. ' +
row.FirstName+ ' ' + row.LastName);
        }
      }
     },errorHandler);
 },errorHandler,nullHandler);

 return;

}

// this is the function that puts values into the database using the
values from the text boxes on the screen
function AddValueToDB() {

 if (!window.openDatabase) {
   alert('Databases are not supported in this browser.');
   return;
 }

// this is the section that actually inserts the values into the User
table
 db.transaction(function(transaction) {
   transaction.executeSql('INSERT INTO User(FirstName, LastName)
VALUES (?,?)',[$('#txFirstName').val(), $('#txLastName').val()],
     nullHandler,errorHandler);
   });

// this calls the function that will show what is in the User table in
the database
 ListDBValues();

 return false;

}

</script>
</head>
<body onload="onBodyLoad()">
<h1>WebSQL</h1>
<input id="txFirstName" type="text" placeholder="FirstName">
<input id="txLastName" type="text" placeholder="Last Name">
<input type="button" value="Add record" onClick="AddValueToDB()">
<input type="button" value="Refresh" onClick="ListDBValues()"> <br>
<br>
<span style="font-weight:bold;">Currently stored values:</span>
<span id="lbUsers"></span>
</body>
</html> 