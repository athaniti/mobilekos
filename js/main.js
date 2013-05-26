var baseapiurl='ath.dataverse.gr:18090/api/';
var basepoifolder = 'xml/';
var baselat = 38.00411;
var baselong = 23.720673;
var map; 
var firstTime = true;
var basemap;
var latlng;
var currentTimestamp = new Array();
var currentLat;
var currentLong;
var marker1;
var marker2;
var xmlDoc,xmlDoc1,xmlDoc2,xmlDoc3;
var currentMarkers= new Array();
var db;
var itineraryFilename = new Array();
var isOffline;
var language;
var langstr = 'en';
var currentEmail;
var filepath;
var firstTime=true;
var langchanged = false;
var xmlpathcat;
var fromselectedplaces = false;
var itId;
var itTitle;
var itActive;
var itCompleted;
var category = new Array();
var placesVisited = new Array();
var ifVisited = new Array();
var tempCategory = new Array();
var tempPoi = new Array();
var timestamp;
var fileNameToBeMoved;
var tempFound = false;
var mapAppFound = false;
var upToDate = false;
var fromMainPage = false;
var nameCat= new Array();
var categId = new Array();
var timestampa, timestampb, timestampc, timestampd;
//var xmlFileName;
var track, control, info, tourXmlName, dd, sname, fillhtml, catId;

function onDeviceReady() {
	db = window.openDatabase("KosMobile", "1.0", "Kos Db", 1000000);
//	db.transaction(populateDB, errorCB, successCB);
	document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("searchbutton", onSearchKeyDown, false);
	document.addEventListener("offline", function() {isOffline = true;}, false);
	document.addEventListener("online", function() {isOffline = false;}, false);
	if(navigator.network && navigator.network.connection.type != Connection.NONE){
		isOffline = false;
	}
	checkDb();
}

function populateDB(tx)
{
	tx.executeSql('DROP TABLE IF EXISTS SETTINGS');
	tx.executeSql('DROP TABLE IF EXISTS POINTS');
	tx.executeSql('DROP TABLE IF EXISTS CATEGORIESEN');
	tx.executeSql('DROP TABLE IF EXISTS CATEGORIESGR');
	tx.executeSql('DROP TABLE IF EXISTS SUBCATEGORIESEN');
	tx.executeSql('DROP TABLE IF EXISTS SUBCATEGORIESGR');
	tx.executeSql('DROP TABLE IF EXISTS POIEN');
	tx.executeSql('DROP TABLE IF EXISTS POIGR');
	tx.executeSql('DROP TABLE IF EXISTS TIMESTAMP');
	tx.executeSql('DROP TABLE IF EXISTS ITINERARIES');
	tx.executeSql('DROP TABLE IF EXISTS ROUTES');
	tx.executeSql('DROP TABLE IF EXISTS TEMP');
	tx.executeSql('CREATE TABLE IF NOT EXISTS SETTINGS (id unique, data)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS POINTS (id, Id_Portal, routeId, isActive, visited)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS CATEGORIESEN (id unique, name, guid)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS CATEGORIESGR (id unique, name, guid)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS SUBCATEGORIESEN (id unique, name, catid)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS SUBCATEGORIESGR (id unique, name, catid)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS POIEN (name, descr, category, subcategory, long, lat)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS POIGR (name, descr, category, subcategory, long, lat)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS TIMESTAMP (id unique, timestamp)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ITINERARIES (id, title, isActive, completed)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ROUTES (id, title, itineraryId, isActive, completed)');
}

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

function successCB() {
    //alert('successCB!');
}

function onBackKeyDown(e) {
	if ($.mobile.activePage.is('#firstpage')) {
		e.preventDefault();
		navigator.app.exitApp();
	}
	else if ($.mobile.activePage.is('#mainpage')){	
		fromMainPage = true;
		navigator.app.backHistory();
	}
	else {
		navigator.app.backHistory();
	}
}

function initFiles(){
/*\	createDb();
|*|	loadXmlCat();
|*|	loadXmlpoi();
|*|	xmlpathcat = 'xml/categories.en.xml';
|*|	copyFile();
|*|	xmlpathcat = 'xml/categories.gr.xml';
|*|	copyFile();
|*|	xmlpathcat = 'xml/poi.en.xml';
|*|	copyFile();
|*|	xmlpathcat = 'xml/poi.gr.xml';
|*|	copyFile();
|*|	xmlpathcat = 'xml/itinerary2_2.xml';
|*|	copyFile();
|*|	xmlpathcat = 'xml/itinerary3_3.xml';
|*|	copyFile();
|*|	xmlpathcat = 'kml/itinerary_2_1.kml';
|*|	copyFile();
|*|	xmlpathcat = 'kml/itinerary_2_2.kml';
|*|	copyFile();
|*|	xmlpathcat = 'kml/Itinerary_3_1.kml';
|*|	copyFile();
|*|	xmlpathcat = 'kml/Itinerary_3_2.kml';
|*|	copyFile();
|*|	xmlpathcat = 'kml/Itinerary_3_3.kml';
|*|	copyFile();
|*|	alert("files copied successfully!");
\*/
}

function sync(){
	dbdb.transaction(function (tx) {
		tx.executeSql('SELECT * FROM TIMESTAMP', [], function (tx, results) {
			var len = results.rows.length, i;
			for (i = 0; i < len; i++){
				currentTimestamp.push(results.rows.item(i).timestamp);
			}
			downloadXmlFiles();	
		}, errorCB);
	});
	
//	if (upToDate == false){
//		compareXml();	
//	}
//	else{
//	moveXml();
//	}
}

function checkDb(){
	var len;
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM CATEGORIESEN', [], function (tx, results) {
			len = results.rows.length;
//			alert("len_beggining: "+len);
			if (len == null){
				createDb();
			}
		}, error0CB);
	});
//	sync();
}

function error0CB(){
	alert("error0CB");
	createDb();
}

function createDb(){
	db.transaction(populateDB, errorCB, successCB);
	setTimeout(populateDatabases(),2000);
}

function populateDatabases(){
	console.log("in populateDatabases");
	loadXmlCat(1);
//	popCategoriesEnDb();
	popSubCategoriesEnDb();
	loadXmlCat(2);
//	popCategoriesGrDb();
	popSubCategoriesGrDb();
	loadXmlPoi(1);
//	popPoiEnDb();
	loadXmlPoi(2);
//	popPoiGrDb();
//	popTimestampDb();
	popTimestampDb();
//	setTimeout(function(){sync();},1000);
}

/*
function populateDataBases(){
	popCategoriesEnDb();
	popCategoriesGrDb();
	popSubCategoriesEnDb();
	popSubCategoriesGrDb();
	popPoiEnDb();
	popPoiGrDb();
	popTimestampDb();
}
*/

function popCategoriesEnDb(){
	db.transaction(function(tx) {
		var cat =  xmlDoc.getElementsByTagName("Category");
		var  guid, catName;
//		alert(xmlDoc.documentElement);
		timestampa = $(xmlDoc).find("timestamp").text();
		for (var i=0; i< cat.length; i++){
			catId = xmlDoc.getElementsByTagName("Category")[i].getAttribute('id');
			catName = xmlDoc.getElementsByTagName("Category")[i].getElementsByTagName("Name")[0].textContent;
			guid = xmlDoc.getElementsByTagName("Category")[i].getAttribute('guid');
//			alert(catId+ " "+ guid+" "+catName+" "+timestamp);
			tx.executeSql('INSERT INTO CATEGORIESEN (id, name, guid) VALUES (?,?,?)',[catId,catName,guid], success3CB, error3CB);
		}
//		alert("1: "+catName);
	});
}

function success3CB(){
//	popSubCategoriesEnDb();
}

function popSubCategoriesEnDb(){
	db.transaction(function(tx) {
		var cat =  xmlDoc.getElementsByTagName("Category");
		var sub, subId, subName;
		for (var i=0; i< cat.length; i++){
			catId = xmlDoc.getElementsByTagName("Category")[i].getAttribute('id');
			sub = cat[i].getElementsByTagName("Subcategories")[0].getElementsByTagName("Subcategory");
			for (var j=0; j<sub.length; j++){
				subName = sub[j].getElementsByTagName("Name")[0].textContent;
				subId = sub[j].getAttribute('id');
//				alert(subId +" __ "+subName +" __ "+ catId);
				tx.executeSql('INSERT INTO SUBCATEGORIESEN (id, name, catid) VALUES (?,?,?)',[subId,subName,catId], success4CB, error4CB);
			}			
		}
//		alert("3: "+subName);
	});
}

function success4CB(){
//	loadXmlCat(2);
}

function popCategoriesGrDb(){
	db.transaction(function(tx) {
		var cat =  xmlDoc1.getElementsByTagName("Category");
		var  guid, catName;
		var sub, subId, subName;
//		alert(xmlDoc.documentElement);
		timestampb = $(xmlDoc1).find("timestamp").text();
		for (var i=0; i< cat.length; i++){
			catId = xmlDoc1.getElementsByTagName("Category")[i].getAttribute('id');
			catName = xmlDoc1.getElementsByTagName("Category")[i].getElementsByTagName("Name")[0].textContent;
			guid = xmlDoc1.getElementsByTagName("Category")[i].getAttribute('guid');
//			alert(catId+ " "+ guid+" "+catName+" "+timestamp);
			tx.executeSql('INSERT INTO CATEGORIESGR (id, name, guid) VALUES (?,?,?)',[catId,catName,guid], success5CB, error5CB);
		}
//		alert("2: "+catName);
	});
}

function success5CB(){
//	popSubCategoriesGrDb();	
}

function error5CB(){
	alert("error5CB");
}

function popSubCategoriesGrDb(){
	db.transaction(function(tx) {
		var cat =  xmlDoc1.getElementsByTagName("Category");
		var sub, subId, subName;
		for (var i=0; i< cat.length; i++){
			catId = xmlDoc1.getElementsByTagName("Category")[i].getAttribute('id');
			sub = cat[i].getElementsByTagName("Subcategories")[0].getElementsByTagName("Subcategory");
			for (var j=0; j<sub.length; j++){
				subName = sub[j].getElementsByTagName("Name")[0].textContent;
//				alert(subName);
				subId = sub[j].getAttribute('id');
//				alert(subId +" __ "+subName +" __ "+ catId);
				tx.executeSql('INSERT INTO SUBCATEGORIESGR (id, name, catid) VALUES (?,?,?)',[subId,subName,catId], successCB, error4CB);
			}
		}
//		alert("4: "+subName);
	});
}

function popPoiEnDb(){
	db.transaction(function(tx) {
		var LenCat =  xmlDoc2.getElementsByTagName("Poi").length;
//		alert('LenCat: '+LenCat);
		var subCatId, poiName, poiDescr, poiLong, poiLat, timestamp, poiCat, poiSubCat, pois;
//		pois = xmlDoc.getElementsByTagName("Pois")[0];
		timestampc = $(xmlDoc2).find("timestamp").text();
		for(var i = 0; i < LenCat; i++)	
		{
			poiName = xmlDoc2.getElementsByTagName("pois")[0].getElementsByTagName("Poi")[i].getElementsByTagName("Name")[0].textContent;
			poiDescr = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Description")[0].textContent;
			poiLong = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Longitude")[0].textContent;
			poiLat = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Latitude")[0].textContent;
			poiCat = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Category")[0].textContent;
			poiSubCat = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Sucategories");
			for(var x = 0; x < poiSubCat.length; x++) 		//creating list of places
			{
				subCatId =  poiSubCat[0].getElementsByTagName("Sucategory")[x].textContent;
			}
//			alert(poiName+" "+poiDescr+" "+poiLong+" "+poiLat+" "+poiCat+" "+subCatId+" time: "+timestamp);
			tx.executeSql('INSERT INTO POIEN (name, descr, category, subcategory, long, lat) VALUES (?,?,?,?,?,?)'
					,[poiName, poiDescr, poiCat, subCatId, poiLong, poiLat], success6CB, error6CB);
		}
//		alert("5: "+poiName);
	});	
}

function success6CB(){
//	loadXmlPoi(2);
}

function error6CB(){
	alert("error6CB");
}

function popPoiGrDb(){
	db.transaction(function(tx) {
		var LenCat =  xmlDoc3.getElementsByTagName("Poi").length;
//		alert('LenCat: '+LenCat);
		var subCatId, poiName, poiDescr, poiLong, poiLat, timestamp, poiCat, poiSubCat , pois;
//		pois = xmlDoc.getElementsByTagName("Pois")[0];
		timestampd = $(xmlDoc3).find("timestamp").text();
		for(var i = 0; i < LenCat; i++)	{
			poiName = xmlDoc3.getElementsByTagName("pois")[0].getElementsByTagName("Poi")[i].getElementsByTagName("Name")[0].textContent;
			poiDescr = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Description")[0].textContent;
			poiLong = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Longitude")[0].textContent;
			poiLat = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Latitude")[0].textContent;
			poiCat = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Category")[0].textContent;
			poiSubCat = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Sucategories");
			for(var x = 0; x < poiSubCat.length; x++) 		//creating list of places
			{
				subCatId =  poiSubCat[0].getElementsByTagName("Sucategory")[x].textContent;
			}
//			alert(poiName+" "+poiDescr+" "+poiLong+" "+poiLat+" "+poiCat+" "+subCatId+" time: "+timestamp);
			tx.executeSql('INSERT INTO POIGR (name, descr, category, subcategory, long, lat) VALUES (?,?,?,?,?,?)'
					,[poiName, poiDescr, poiCat, subCatId, poiLong, poiLat], successCB, error2CB);
		}
//		alert("6: "+poiName);
	});	
}

function error2CB(){
	alert('error2CB');
}

function popTimestampDb(){
	db.transaction(function(tx) {
//		alert(timestampa+" "+timestampb+" "+timestampc+" "+timestampd);
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[1,timestampa],successCB,error7CB);
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[2,timestampb],successCB,error7CB);
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[3,timestampc],successCB,error7CB);
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[4,timestampd],successCB,error7CB);
	});
}

function error7CB(err){
	alert("error7CB"+err.code);
}

function copyCatToDb(){
			sub = cat[i].getElementsByTagName("Subcategories")[0].getElementsByTagName("Subcategory");
			db.transaction(function(tx) {
			});
		
	
//	db.transaction(function (tx) {
//		tx.executeSql('SELECT * FROM CATEGORIES', [], function (tx, results) {
//			var len = results.rows.length, i;
//			for (i = 0; i < len; i++){
//				alert('categoriesDb['+i+']: '+results.rows.item(i).id+", "+results.rows.item(i).name+", "
//						+results.rows.item(i).guid+", "+results.rows.item(i).timestamp );
//			}
//		}, errorCB);
//	});
	loadXmlpoi();
}

function error3CB(){
	alert('error db 3');
}

function error4CB(){
	alert('error db 4');
}

function searchForDirectories(){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
		var directoryReader = fs.root.createReader();
		directoryReader.readEntries(function(entries){
			for (var i=0; i<entries.length; i++){
//				alert(entries[i].name);
				if (entries[i].name == "MapApp"){
					mapAppFound = true;
//					alert("found MapApp!");
//					onFileSystemSuccess();
				}
				if (entries[i].name == "TempMapApp"){
					tempFound = true;
//					alert("found tempMapApp!");
				}
			}
//			if (tempFound == false){
//				createTempFolder();
//				onFileSystemSuccess();
//			}
			if (mapAppFound == false){
//				alert("MapAppFound== false");
				upToDate = true;
				createMapAppFolder();
				initFiles();
//				createXmlFilesFolder();
			}
		});
	});
}

function createTempFolder(){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess2, null); 
	function onRequestFileSystemSuccess2(fileSystem) { 
	        var entry=fileSystem.root;
	        entry.getDirectory("TempMapApp", {create: true, exclusive: false}, onGetDirectorySuccess2, onGetDirectoryFail2); 
	}
	function onGetDirectorySuccess2(dir) {
	      console.log("Created dir "+dir.name);
	}
	function onGetDirectoryFail2(error) {
		console.log("Error creating directory "+error.code); 
	}
}

function createMapAppFolder(){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess3, null); 
	function onRequestFileSystemSuccess3(fileSystem) {
	        var entry=fileSystem.root;
	        entry.getDirectory("MapApp", {create: true, exclusive: false}, onGetDirectorySuccess3, onGetDirectoryFail3); 
	}
	function onGetDirectorySuccess3(dir) {
	      console.log("Created dir "+dir.name);
	}
	function onGetDirectoryFail3(error) {
	     console.log("Error creating directory "+error.code); 
	}
}

function moveXml(){
//	alert('inMoveXml');
	window.resolveLocalFileSystemURI('file:///mnt/sdcard/TempMapApp', resOnSuccess, resOnError);
}

function resOnSuccess(entry){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
//		alert('4!'+entry.name);
		fileSys.root.getDirectory("MapApp", {create: false, exclusive: false}, function(directory) {
//			alert('43'+directory.name);		
//			alert('234'+xmlFileName);
			entry.copyTo(directory, "MapApp", success, resOnError);			
		}, resOnError);
	}, resOnError);
}

function resOnError(entry){
	alert("error code: "+entry.code);
}

function success(xmlFileName) {
    console.log("New Path: " + xmlFileName.fullPath);
}

function onSearchKeyDown()
{
	alert('button search');
}

function copyFile(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", xmlpathcat, false);
	xmlhttp.setRequestHeader('Content-Type', 'text/xml');
	xmlhttp.send("");
	xmlDoc = xmlhttp.responseText;
//	alert(xmlpathcat +" fetched successfully");
	if ((xmlhttp.status != 200) && (xmlhttp.status != 0)){
		alert("Error loading Xml file0: "+ xmlhttp.status);
	}
//	createMapAppFolder();
	createFile();
}

function createFile(){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

function gotFS(fileSystem) {
	xmlpathcat = xmlpathcat.slice(4);
//	alert(xmlpathcat +" file created in SDCard");
	fileSystem.root.getFile(xmlpathcat, {create: true, exclusive: false}, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
    writer.onwrite = function(evt) {
        console.log("write Success: "+xmlpathcat);
    };
//    alert(xmlDoc);
    writer.write(xmlDoc);
//    alert("Copy Completed");
}

function downloadXmlFiles(){
//	alert('in downloadXmlFiles');
	var data;	
	$.ajax({ 
		dataType: "json",
//		url:  baseapiurl+"/basefile",
//		contentType: "application/json; charset=utf-8",
		url: "http://ath.dataverse.gr:18090/api/basefile",
		type: "GET",
		async: true,
		data: "{}",
		success: function (data){
//			alert("got it!");
//			getTimestamps(data);
			json2xml(data);
//			if (upToDate == false){
//			compareXml();
//			}
//			else{
//			moveXml();
//			}
		},
		error: function (error){
			alert('failed to connect to server');
		}
	});
}

var po=0;
function getTimestamp(data){
	var a = data.indexOf("<timestamp>")+11;
	var b = data.indexOf("</timestamp>");
	var timestampf = data.slice(a,b);
	if ( timestampf > currentTimestamp(po)){
		alert("new Timestamp Found! " + timestampf);
		//updateCurrentDatabase
	}
	po++;
}

function json2xml(o, tab){
//	alert('in json2xml');
	var toXml = function(v, name, ind) {
		var xml = "";
		if (v instanceof Array) {
			for (var i=0, n=v.length; i<n; i++)
				xml += ind + toXml(v[i], name, ind+"\t") + "\n";
		}
		else if (typeof(v) == "object") {
			var hasChild = false;
			xml += ind + "<" + name;
			for (var m in v) {
				if (m.charAt(0) == "@")
					xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
				else
					hasChild = true;
			}
			xml += hasChild ? ">" : "/>";
			if (hasChild) {
				for (var m in v) {
					if (m == "#text")
						xml += v[m];
					else if (m == "#cdata")
						xml += "<![CDATA[" + v[m] + "]]>";
					else if (m.charAt(0) != "@")
						xml += toXml(v[m], m, ind+"\t");
				}
				xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
			}
		}
		else {
			xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
		}
		return xml;
	}, xml="";
	for (var m in o){
		xml = toXml(o[m], m, "");
		getTimestamp(xml);
//		createXmlString(xml);
	}
//	return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
	var tab1 = tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
//	compareXml();
}

function createXmlString(xmlString){
	var fileNameStartPosition = xmlString.search( '<BaseFileName>' )+14;
	var fileNameEndPosition = xmlString.search( '</');
	var newXmlFileName = xmlString.substring( fileNameStartPosition, fileNameEndPosition);
	var xmlStart = xmlString.search('<?xml version') - 2;
	var xmlEnd = xmlString.length -14;
	xmlString = xmlString.substring( xmlStart, xmlEnd);
	console.log("newXmlFileName: "+newXmlFileName); 
//	alert(xmlString);
//	xmlFileCreate(newXmlFileName, xmlString);
	compareVersions(newXmlFileName, xmlString);
}

//function createTempDb(){
//	db.transaction(function(tx) {
//		tx.executeSql('DROP TABLE IF EXISTS TEMP');
//		tx.executeSql('CREATE TABLE IF NOT EXISTS TEMP (id unique, data)');
//	});
//}

function compareVersions(newXmlFileName, xmlString){
	var cat;
	alert("987 "+xmlString);
	if (newXmlFileName == "categories.en.xml"){
		alert("newXmlFileName0: "+ newXmlFileName);
		xmlDoc = xmlString;
		cat =  xmlDoc.getElementsByTagName("Category");
		alert("0 "+cat.length);
	}
	else if (newXmlFileName == "categories.gr.xml"){
		alert("newXmlFileName1: "+ newXmlFileName);
		xmlDoc1 = xmlString;
		cat =  xmlDoc1.getElementsByTagName("Category");
		alert("1 "+cat.length);
	}
	else if (newXmlFileName == "poi.en.xml"){
		alert("newXmlFileName2: "+ newXmlFileName);
		xmlDoc = xmlString;
		cat =  xmlDoc.getElementsByTagName("Category");
		alert("2 "+cat.length);
	}
	else if (newXmlFileName == "poi.gr.xml"){
		alert("newXmlFileName3: "+ newXmlFileName);
		xmlDoc = xmlString;
		cat =  xmlDoc.getElementsByTagName("Category");
		alert("3 "+cat.length);
	}
}

function xmlFileCreate(fileName, xmlString){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
		console.log("Root = " + fs.root.fullPath);
		fs.root.getDirectory("TempMapApp", {create: false, exclusive: false},
				function(dirEntry) {
			dirEntry.getFile(fileName, {create: true,exclusive: false}, function (fileEntry) {
					fileEntry.createWriter(win, fail);
					console.log("File = " + fileEntry.fs.root);
				}, function (error) {
					alert('1'+error.code);
				});
// Writing into the new xmlFile	
			function win(writer) {
				writer.onwrite = function(evt) {
					console.log("write success");
				};
				writer.write(xmlString);
			};
			var fail = function(evt) {
				console.log(error.code);
			};
		}, function (error) {
			alert('2'+error.code);
		}
		);
	}, function (error) {
		alert(+error.code);
	});
}

function compareXml(){		//Reading all entries in TempMapApp folder & their Timestamp
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
		var directoryReader = fs.root.createReader();
		directoryReader.readEntries(function(entries){
			for (var i=0; i<entries.length-3; i++)
			{
				var filepath = fs.root.fullPath +'/TempMapApp/';
//				alert (filepath);
				if (entries[i].name && entries[i].name.indexOf('categories') > -1)
				{
//					alert(entries[i].name);
					tempCategory[i] = entries[i].name;
					filepath += tempCategory[i];
//					alert(filepath+''+tempCategory[i]);
					var xmlhttp = new XMLHttpRequest();
					xmlhttp.open("GET", filepath, false);
					xmlhttp.setRequestHeader('Content-Type', 'text/xml');
					xmlhttp.send("");
					
					xmlDoc = xmlhttp.responseXML;
					if ((xmlhttp.status != 200) && (xmlhttp.status != 0)){
						alert("Error loading Xml file1: "+ xmlhttp.status);
					}
					timestamp = $(xmlDoc).find("timestamp").text();
//					alert('timestamp1 '+timestamp);
					fileNameToBeMoved = tempCategory[i];
					checkXmlVersion(timestamp);
				}
				else if(entries[i].name && entries[i].name.indexOf('poi') > -1){
					tempPoi[i] = entries[i].name;
//					alert(tempPoi[i]);
					filepath += tempPoi[i];
//					alert(filepath+''+tempPoi[i]);
					var xmlhttp = new XMLHttpRequest();
					xmlhttp.open("GET", filepath, false);
					xmlhttp.setRequestHeader('Content-Type', 'text/xml');
					xmlhttp.send("");
					xmlDoc = xmlhttp.responseXML;
					if ((xmlhttp.status != 200) && (xmlhttp.status != 0)){
						alert("Error loading Xml file2: "+ xmlhttp.status);
					}
					timestamp = $(xmlDoc).find("timestamp").text();
//					alert('timestamp2 '+timestamp);
					fileNameToBeMoved = tempPoi[i];
					checkXmlVersion(timestamp);
				}
			}
		},function (error) {
			alert(error.code);
		});
	},
	function (error) {
		alert(error.code);
	});
}

function checkXmlVersion(newTimeStamp){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
		var directoryReader = fs.root.createReader();
		directoryReader.readEntries(function(entries){
			var moveFilePath = fs.root.fullPath +'/MapApp/xmlFiles/'+fileNameToBeMoved;
//			alert("moveFilePath: "+moveFilePath);
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("GET", moveFilePath, false);
			xmlhttp.setRequestHeader('Content-Type', 'text/xml');
			xmlhttp.send("");
			xmlDoc = xmlhttp.responseXML;
			if ((xmlhttp.status != 200) && (xmlhttp.status != 0)){
				alert("Error loading Xml file3: "+ xmlhttp.status);
			}
			timestamp = $(xmlDoc).find("timestamp").text();
//			alert('newTS '+newTimeStamp+ ' '+ "timestamp"+timestamp);
			if (newTimeStamp > timestamp){
//				alert('mfp'+ moveFilePath);
//				moveFile(moveFilePath);
				moveXml(moveFilePath);
			}
		});
	});
}

function loadXmlCat(x) {
	if (x == 1){
//		xmlpathcat = 'file:///mnt/sdcard/MapApp/xmlFiles/categories.en.xml';
//		xmlpathcat = 'file:///mnt/sdcard/categories.en.xml';
		xmlpathcat = 'xml/categories.en.xml';
//		alert("x1= "+x);
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", xmlpathcat, false);
		xmlhttp.setRequestHeader('Content-Type', 'text/xml');
		xmlhttp.send("");
		xmlDoc = xmlhttp.responseXML;
		if ((xmlhttp.status != 200) && (xmlhttp.status != 0)){
			alert("Error loading Xml file4: "+ xmlhttp.status);
		}
		popCategoriesEnDb();
	}
	else {
//		xmlpathcat = 'file:///mnt/sdcard/MapApp/xmlFiles/categories.gr.xml';
//		xmlpathcat = 'file:///mnt/sdcard/categories.gr.xml';
		xmlpathcat = 'xml/categories.gr.xml';
//		alert("x2= "+x);

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", xmlpathcat, false);
		xmlhttp.setRequestHeader('Content-Type', 'text/xml');
		xmlhttp.send("");
		xmlDoc1 = xmlhttp.responseXML;
		if ((xmlhttp.status != 200) && (xmlhttp.status != 0)){
			alert("Error loading Xml file4: "+ xmlhttp.status);
		}
		popCategoriesGrDb();
	}
//	if (fromselectedplaces == false){
////	readXML();	
//	}
}

function readCatDbEn(){
	var divplaces = document.getElementById('placesContent');
	fillhtml='';
	nameCat = new Array();
	categId = new Array();
	var len;
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM CATEGORIESEN', [], function (tx, results) {
			len = results.rows.length;
			for (var i = 0; i < len; i++){
				nameCat.push(results.rows.item(i).name);
				categId.push(results.rows.item(i).id);
			}
			len = nameCat.length;
			drawPlacesPageEn(len);
		}, error9CB);
	});
}

function error9CB(){
	alert("error9CB");
}

function drawPlacesPageEn(len){
	var fillhtml='';
//	var divplaces = document.getElementById('placesContent');
	var subLen;
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM SUBCATEGORIESEN', [], function (tx, results) {			
			var subId;
			for (var k=0; k<len; k++){
//				alert("12 "+nameCat[k]);
				fillhtml += "<fieldset data-role='collapsible' data-theme='a' data-content-theme='d'>";
				fillhtml += "<legend>" + nameCat[k] + "</legend>";
				fillhtml += "<div data-role='controlgroup'>";
				subLen = results.rows.length;
//				alert("sublen: "+sublen);
				for(var j=0; j<subLen ; j++){
//					alert("13 "+results.rows.item(j).catid);
					subId = results.rows.item(j).catid;
					sname = results.rows.item(j).name;
					if ( categId[k] == subId){
//						alert("sname2: "+sname);
						fillhtml += "<input type='checkbox' class='checkbox' name='"+sname+"' id='"+sname+"' />";
						fillhtml += "<label for='"+ sname+"'>"+ sname +"</label>";
					}
				}
				fillhtml += "</div>";
				fillhtml += "</fieldset>";
//				alert(fillhtml);
			}
//			divplaces.innerHTML = fillhtml;
			$("#placesContent").html(fillhtml);
			$('#placespage').trigger("create");
			$.mobile.changePage($('#placespage'), 'pop');
		});
	});
}

function readCatDbGr(){
//	var divplaces = document.getElementById('placesContent');
	fillhtml='';
	nameCat = new Array();
	categId = new Array();
	var len;
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM CATEGORIESGR', [], function (tx, results) {
			len = results.rows.length;
			for (var i = 0; i < len; i++){
				nameCat.push(results.rows.item(i).name);
				categId.push(results.rows.item(i).id);
			}
			len = nameCat.length;
			drawPlacesPageGr(len);
		}, error9CB);
	});
}

function drawPlacesPageGr(len){
	var fillhtml='';
//	var divplaces = document.getElementById('placesContent');
	var subLen;
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM SUBCATEGORIESGR', [], function (tx, results) {			
			var subId;
			for (var k=0; k<len; k++){
//				alert("12 "+nameCat[k]);
				fillhtml += "<fieldset data-role='collapsible' data-theme='a' data-content-theme='d'>";
				fillhtml += "<legend>" + nameCat[k] + "</legend>";
				fillhtml += "<div data-role='controlgroup'>";
				subLen = results.rows.length;
//				alert("sublen: "+sublen);
				for(var j=0; j<subLen ; j++){
//					alert("13 "+results.rows.item(j).catid);
					subId = results.rows.item(j).catid;
					sname = results.rows.item(j).name;
					if ( categId[k] == subId){
//						alert("sname2: "+sname);
						fillhtml += "<input type='checkbox' class='checkbox' name='"+sname+"' id='"+sname+"' />";
						fillhtml += "<label for='"+ sname+"'>"+ sname +"</label>";
					}
				}
				fillhtml += "</div>";
				fillhtml += "</fieldset>";
//				alert(fillhtml);
			}
			$("#placesContent").html(fillhtml);
			$('#placespage').trigger("create");
			$.mobile.changePage($('#placespage'), 'pop');
		});
	});
}

function onClickbtnFilterPlaces()
{
//	var hasChilds = document.getElementById('placesContent').hasChildNodes();
//	if(!hasChilds)
//	{
		if (langstr == 'en'){
			readCatDbEn();
		}
		else {
			readCatDbGr();
		}
//	}
//		$('#placespage').trigger("create");
//		$.mobile.changePage($('#placespage'), 'pop');
}

function readXML()
{
	var fillhtml='';
	var divplaces = document.getElementById('placesContent');
	var cat =  xmlDoc.getElementsByTagName("Category");
	var sub;
	var place;
	for (var i=0; i< cat.length; i++){
		fillhtml += "<fieldset data-role='collapsible' data-theme='a' data-content-theme='d'>";
		fillhtml += "<legend>" + xmlDoc.getElementsByTagName("Category")[i].getElementsByTagName("Name")[0].textContent + "</legend>";
		fillhtml += "<div data-role='controlgroup'>";		
		sub = cat[i].getElementsByTagName("Subcategories")[0].getElementsByTagName("Subcategory");
		for (var j=0; j<sub.length; j++){
			place = sub[j].getElementsByTagName("Name")[0].textContent;
			place=$.trim(place);
			fillhtml += "<input type='checkbox' class='checkbox' name='"+place+"' id='"+place+"' />";
			fillhtml += "<label for='"+place+"'>"+ place +"</label>";
		}
		fillhtml += "</div>";
		fillhtml += "</fieldset>";
	}
	divplaces.innerHTML = fillhtml;
//	$("#placesContent").html(fillhtml);
	$.mobile.changePage($('#placespage'), 'pop');
}


function loadXmlPoi(x)
{
	var xmlpath;
	if (x == 1){
//		xmlpath = 'file:///mnt/sdcard/poi.en.xml';
		xmlpath = 'xml/poi.en.xml';
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", xmlpath, false);
		xmlhttp.setRequestHeader('Content-Type', 'text/xml');
		xmlhttp.send("");
		xmlDoc2 = xmlhttp.responseXML;
		if ((xmlhttp.status != 200) && (xmlhttp.status != 0)){
			alert("Error loading Xml file5:"+ xmlhttp.status);
		}
		popPoiEnDb();
	}
	else{
//		xmlpath = 'file:///mnt/sdcard/poi.gr.xml';
		xmlpath = 'xml/poi.gr.xml';
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", xmlpath, false);
		xmlhttp.setRequestHeader('Content-Type', 'text/xml');
		xmlhttp.send("");
		xmlDoc3 = xmlhttp.responseXML;
//		alert(xmlhttp.responseXML);
		if ((xmlhttp.status != 200) && (xmlhttp.status != 0)){
			alert("Error loading Xml file5:"+ xmlhttp.status);
		}
		popPoiGrDb();
	}
//	copyPoiToDb();
}

function readXMLpoi() 
{
	var LenCat =  xmlDoc.getElementsByTagName("POI").length;
	//var cat =  xmlDoc.getElementsByTagName("Category");
	var divplaces = document.getElementById('placesContent');
	var fillhtml='';
	var subcatId;
	alert('LenCat: '+LenCat);
	for(var i = 0; i < LenCat; ++i)	{
	//	if (langchanged == false) {
		//	alert('langchanged: '+langchanged);
		// appendOptionLast(xmlDoc.getElementsByTagName("Type")[i].attributes.getNamedItem("name").nodeValue, xmlDoc.getElementsByTagName("Type")[i].attributes.getNamedItem("id").nodeValue);
		fillhtml += "<fieldset data-role='collapsible' data-theme='a' data-content-theme='d'>";
		fillhtml += "<legend>" + xmlDoc.getElementsByTagName("POI")[i].attributes.getNamedItem("id").nodeValue + "</legend>";
		fillhtml += "<div data-role='controlgroup'>";
		for(var x = 0; x < xmlDoc.getElementsByTagName("Name")[i].length; ++x) //creating list of places
		{
			alert('in');
			alert(xmlDoc.getElementsByTagName("POI")[i].length);
			//subcatId = xmlDoc.getElementsByTagName("POI")[i].getElementsByTagName("Subcategory")[x].attributes.getNamedItem("id").nodeValue;
			//alert(xmlDoc.getElementsByTagName("POI")[i].getElementsByTagName("Subcategory").length);
			//alert(xmlDoc.getElementsByTagName("POI")[x].getElementByTagName("Name").nodeValue);
			subcatId = xmlDoc.getElementsByTagName("POI")[i].getElementsByTagName("Name").attributes.nodeValue;
			//alert(subcatId);
			fillhtml += "<input type='checkbox' name='"+subcatId+"' id='"+subcatId+"' checked='checked'>";
			fillhtml += "<label for='"+subcatId+"'>"+ xmlDoc.getElementsByTagName("Category")[i].getElementsByTagName("Subcategory")[x].attributes.getNamedItem("name").nodeValue +"</label>";
		}
		fillhtml += "</div>";
		fillhtml += "</fieldset>";
//-------------....
//addGroupMarker(xmlDoc.getElementsByTagName("Latitude").item(k).firstChild.nodeValue, xmlDoc.getElementsByTagName("Longitude").item(k).firstChild.nodeValue,
//		xmlDoc.getElementsByTagName("Name").item(k).firstChild.nodeValue, 
//		xmlDoc.getElementsByTagName("Description").item(k).firstChild.nodeValue);
	}
	divplaces.innerHTML = fillhtml;
	//  	 $.mobile.changePage($('#placespage'), 'pop');
}

function typeSelectChanged()
{
	if (currentMarkers != null)
	{
		for(var i = 0; i < currentMarkers.length; ++i)
		{
			map.removeLayer(currentMarkers[i]);
		}
		currentMarkers = new Array();
	}
	var value = $(this).id();
	x=xmlDoc.getElementsByTagName("Type")[value -1].getElementsByTagName("Destination");
	for(var i = 0; i < x.length; ++i)
	{
		//appendOptionLast(x.length,10)
		addGroupMarker(x[i].attributes.getNamedItem("lat").nodeValue, x[i].attributes.getNamedItem("long").nodeValue, x[i].attributes.getNamedItem("name").nodeValue, x[i].attributes.getNamedItem("descr").nodeValue);
	}
}

function optionSelectChanged()
{
	var value = $('#slider').val();
	if (value == "no")
	{
		$('#ownSelections').addClass('ui-disabled');
		$('#thirdOptions').removeClass('ui-disabled');
		if (currentMarkers != null)
		{
			for(var i = 0; i < currentMarkers.length; ++i)
			{
				map.removeLayer(currentMarkers[i]);
			}
			currentMarkers = new Array();
			$('#type_select').val('0');
		}
	}
	else
	{
		$('#ownSelections').removeClass('ui-disabled');
		$('#thirdOptions').addClass('ui-disabled');
	}
}
    
function appendOptionLast(text, value)
{
	var elOptNew = document.createElement('option');
	elOptNew.text = text;
	elOptNew.value = value;
	var elSel = document.getElementById('type_select');
	try 
	{
		elSel.add(elOptNew, null);
	}
	catch(ex) 
	{
		elSel.add(elOptNew);
	} 
}

function removeOptionSelected()
{
  var elSel = document.getElementById('type_select');
  var i; 
  for (i = elSel.length - 1; i>=0; i--) {
    if (elSel.options[i].selected) {
      elSel.remove(i);
    }
  }
}

function appendOptionListLast(text, value)
{
	var elOptNew = document.createElement('option');
	elOptNew.text = text;
	elOptNew.value = value;
	var elSel = document.getElementById('destination_select');
	if ($('#destination_select option:contains('+ text +')').length)
	{
		alert('This option already exists!');
	}
	else
	{
		try
		{
			elSel.add(elOptNew, null);
		}
		catch(ex) 
		{
			elSel.add(elOptNew);
		}
	}
}

function removeOptionListSelected()
{
	var elSel = document.getElementById('destination_select');
	var i;
	for (i = elSel.length - 1; i>=0; i--) 
	{
		if (elSel.options[i].selected) 
		{
			elSel.remove(i);
		}
	}
}

function generateMap(lat, long)
{
	var cloudmadeUrl =   'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png';
	basemap = new L.TileLayer(cloudmadeUrl, {maxZoom: 12});
	//basemap = new L.TileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 14});
	latlng = new L.LatLng(lat,long);
	var mapOptions = { 
			center: latlng,
			zoom: 12,
			layers: [basemap],
			boxZoom: true
			};
	map = new L.Map('map',mapOptions);
    document.getElementById('map').style.display = 'block';
    map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.
}

function generateKmlMap()
{
	if (isOffline == false){
		map = new L.Map('map', {center: new L.LatLng(36.8939,27.2884), zoom: 13});
		var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
		map.addLayer(osm);
		document.getElementById('map').style.display = 'block';
		map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.
	}
	if (isOffline == true){
		map = new L.Map('map', {center: new L.LatLng(36.8939,27.2884), zoom: 13});
		var osm = new L.TileLayer('map/{z}/{x}/{y}.png');
		map.addLayer(osm);
		document.getElementById('map').style.display = 'block';
		map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.
	}
}

function onClickbtnCurrent()
{
	$('#abtnCurrentPosition').attr("data-theme", "b").removeClass("ui-btn-up-c").addClass("ui-btn-up-b");
	$('#abtnPlaces').attr("data-theme", "c").removeClass("ui-btn-up-b").addClass("ui-btn-up-c");
   	$('#abtnTour').attr("data-theme", "c").removeClass("ui-btn-up-b").addClass("ui-btn-up-c");
	$("#abtnFilterTour").hide();
	$("#abtnFilterPlaces").hide();
// 	navigator.geolocation.getCurrentPosition(onSuccess, onError,{frequency:5000,maximumAge: 0, 
// 											 timeout: 5000, enableHighAccuracy:true});
}

function onSuccess(position) 
{
	currentLat = position.coords.latitude;
//	alert("currentLat: "+currentLat);
	currentLong = position.coords.longitude;
//	alert("currentLong: "+currentLong);
	map.panTo([currentLat,currentLong ]);
	
	if (marker1 !=null)
	{
		 map.removeLayer(marker1);
	}
	map.setZoom(13);
	var markerLocation = new L.LatLng(currentLat,currentLong);
	var marker = new L.Marker(markerLocation).addTo(map)
	.bindPopup(MyApp.resources.CurrentPosition)
    .openPopup();
	map.addLayer(marker);
	marker1= marker;
}

function onError(error) 
{
//	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
	alert("Could not get your location");
}

function addMarker(lat, long)
{
	if (marker2 !=null)
	{
		map.removeLayer(marker2);
	}
	map.setZoom(12);
	var markerLocation = new L.LatLng(lat, long);
	var marker = new L.Marker(markerLocation).addTo(map)
    .bindPopup('new marker')
    .openPopup();
	marker2= marker;
	map.addLayer(marker);
    map.panTo([(currentLat + lat)/2, (currentLong + long)/2]);
}

function addGroupMarker(x, y, name, descr)
{
	x = x.replace(x.charAt(2), ".");
	y = y.replace(y.charAt(2), ".");
	var markerLocation = new L.LatLng(x, y);
	var marker = new L.Marker(markerLocation).addTo(map).bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>");
 //   .openPopup();
    map.removeLayer(marker);
    map.addLayer(marker);
    currentMarkers.push(marker);
}

function addMarkerToList(name)
{
	$('#yourList').removeClass('ui-disabled');
	appendOptionListLast(name,0);
}

function calculate()
{
	var linePts =[[currentLat, currentLong],[baselat,baselong]];
	for( i=0; i < linePts.length; i=i+1 ) 
	{
		linePts[ i ] = new L.LatLng( linePts[ i ][ 0 ], linePts[ i ][ 1 ] );
	}
	line = new L.Polyline(linePts,{color:'purple'});
	map.addLayer(line);
	map.panTo([38.00411,23.720673]);
}

function ClearAll(){
	$('#placespage input[type=checkbox]').each(function (){
		this.checked = false;
		});
	$("#placespage input[type=checkbox]").checkboxradio("refresh");
}

function switchToEmailPage(langid)
{
//    window.plugins.AccountList.get({
//    	type: 'account type' 	// if not specified get all accounts
//    							// google account example: 'com.google'
//            },function (result) {
//                alert("2@ "+result.length);
//                for (i in res)
//        			alert("4@ "+result[i]);
//            }, function (error) {
//            	alert("6@ "+error);
//    });
	language = langid;
	langstr = langid.toLowerCase();
    db.transaction(function(tx) {
//    	tx.executeSql('INSERT INTO SETTINGS(id, data) VALUES (?,?)',[1,langid], successCB, errorCB);
//    	tx.executeSql('UPDATE SETTINGS SET id = ? data = ? WHERE (?,?)',[1,langid], successCB, errorCB);
    	tx.executeSql('UPDATE SETTINGS SET DATA = ? WHERE ID= ?',[langid,1],successCB, errorCB);
    	});
    
    checkForLanguage();
    $.mobile.changePage($('#secondpage'), 'pop');
    setLabelsForEmailPage();
}

function setLabelsForEmailPage(lang)
{
	document.getElementById('emailheading').innerHTML=  MyApp.resources.EmailHeading;
	document.getElementById('btnOkEmail').innerText=  MyApp.resources.Ok;  
    document.getElementById('btnSkipEmail').innerHTML= MyApp.resources.Skip;  
    document.getElementById('btnBackEmail').innerHTML=  MyApp.resources.Back;  
    document.getElementById('divimportantEmail').innerHTML=  MyApp.resources.ImportantEmail;  
    document.getElementById('emailaccount').placeholder= MyApp.resources.EmailAccountPlaceholder;  
}

function setLabelsForMainPage()
{
	document.getElementById('btnCurrentPosition').innerHTML= MyApp.resources.CurrentPosition;  
    document.getElementById('btnPlaces').innerText= MyApp.resources.Places;  
    document.getElementById('btnTour').innerHTML= MyApp.resources.Tour;          
    document.getElementById('btnSettings').innerHTML= MyApp.resources.Settings; 
    document.getElementById('btnSBack').innerHTML=  MyApp.resources.Back;  
    document.getElementById('btnPBack').innerHTML= MyApp.resources.Back;   
    document.getElementById('btnLocalBack').innerHTML= MyApp.resources.Back;  
    document.getElementById('btnPortalBack').innerHTML= MyApp.resources.Back;  
    document.getElementById('settingsheading').innerHTML= MyApp.resources.SettingsHeading;   
    document.getElementById('lbllanguageselect').innerHTML= MyApp.resources.LanguageSelect;
    document.getElementById('lblemailaccount').innerHTML= MyApp.resources.EmailAccount;
    document.getElementById('btnFilterTour').innerHTML= MyApp.resources.FilterTour;        
    document.getElementById('btnFilterPlaces').innerHTML= MyApp.resources.FilterPlaces;  
    document.getElementById('btnExit').innerHTML= MyApp.resources.Exit;  
    document.getElementById('btnLoadfromportal').innerHTML= MyApp.resources.LoadFromPortal; 
    document.getElementById('btnLoadItinerary').innerHTML= MyApp.resources.LoadItinerary;  
    document.getElementById('btnLoadSelected').innerHTML= MyApp.resources.LoadSelected;  
    document.getElementById('btnEachItineraryBack').innerHTML= MyApp.resources.Back;  
    document.getElementById('itinerarypageheader').innerHTML= MyApp.resources.LoadAvailableTour;  
    document.getElementById('itineraryportalpageheader').innerHTML= MyApp.resources.LoadPortalTour;  
    document.getElementById('emailaccountitinerary').placeholder= MyApp.resources.EmailAccountPlaceholder;  
    document.getElementById('btnClearAll').innerHTML= MyApp.resources.ClearAll;
    document.getElementById('btnLoad').innerHTML= MyApp.resources.Load;
}

function backToMainPage()
{
	var newLanguage = $("#language_select").val();
    var newEmail =  $("#emailaccountchange").val();
    var newlangstr = $("#language_select").val();
    langstr = newlangstr.toLowerCase();
   // alert(langstr);
	fromselectedplaces = false;
    if (language != newLanguage)
    {
    	language = newLanguage;
    	langchanged = true;

    	db.transaction(function(tx) {
    		tx.executeSql('UPDATE SETTINGS SET DATA = ? WHERE ID= ?',[language,1]);
    		});
    }
    
    if (currentEmail== null && newEmail !='' )
    {
    	db.transaction(function(tx) {
    		tx.executeSql('INSERT INTO SETTINGS(id, data) VALUES (?,?)',[2,newEmail]);
    		});
    }
    else if (currentEmail != null && newEmail =='')
    {
    	db.transaction(function(tx) {
    		tx.executeSql('DELETE FROM SETTINGS WHERE ID=?',[2]);
    		});
    	currentEmail = null;
    }
    else if (currentEmail != newEmail)
    {
    	db.transaction(function(tx) {
    		tx.executeSql('UPDATE SETTINGS SET DATA =? WHERE ID=?',[newEmail,2]);
    		});
    	currentEmail = newEmail;
    }
   // loadXml();
    checkForLanguage();
    switchToMainPage();
}

function firstSwitchToMainPage(email){
	if (fromMainPage == false){
		generateKmlMap();
	}
	if (email !=null && email !='')
	{
		db.transaction(function(tx) {
			tx.executeSql('INSERT INTO SETTINGS(id, data) VALUES (?,?)',[2,email], successCB, errorCB);
		});
	}
	if (isOffline == true)
	{
		alert(MyApp.resources.NoInternetAccess);
	}
	$.mobile.changePage($('#mainpage'), 'pop');
	setTimeout(function(){
		map.invalidateSize();
	},1000);
	setLabelsForMainPage();
	if (firstTime == true){
		firstTime = false;
		onClickbtnCurrent();
	}
}

function switchToMainPage(email)
{
	if (email !=null && email !='')
	{
		db.transaction(function(tx) {
			tx.executeSql('INSERT INTO SETTINGS(id, data) VALUES (?,?)',[2,email], successCB, errorCB);
		});
	}
	$.mobile.changePage($('#mainpage'), 'pop');
	setTimeout(function(){
		map.invalidateSize();
	},1000);
	setLabelsForMainPage();
	if (firstTime == true){
		firstTime = false;
		onClickbtnCurrent();
	}
}

function switchToFirstPage()
{
	db.transaction(function(tx) {
		tx.executeSql('DELETE FROM SETTINGS WHERE id=?', [1], successCB, errorCB);
		});
	$.mobile.changePage($('#firstpage'), 'pop');
}

function switchToSettingPage()
{
	getSelectedSettings();
	$.mobile.changePage($('#settingspage'), 'pop'); 
}

function onClickbtnPlaces()
{
//	if (firstTime == true){
//		firstTime = false;
		showAllPlaces();
//	}
	$("#abtnFilterPlaces").show();
    $("#abtnFilterTour").hide();
    $('#abtnTour').attr("data-theme", "c").removeClass("ui-btn-up-b").addClass("ui-btn-up-c");
    $('#abtnPlaces').attr("data-theme", "b").removeClass("ui-btn-up-c").addClass("ui-btn-up-b");
    $('#abtnCurrentPosition').attr("data-theme", "c").removeClass("ui-btn-up-b").addClass("ui-btn-up-c");
}

function onClickbtnTour()
{
	$("#abtnFilterPlaces").hide();
    $("#abtnFilterTour").show();
    $('#abtnTour').attr("data-theme", "b").removeClass("ui-btn-up-c").addClass("ui-btn-up-b");
    $('#abtnPlaces').attr("data-theme", "c").removeClass("ui-btn-up-b").addClass("ui-btn-up-c");
    $('#abtnCurrentPosition').attr("data-theme", "c").removeClass("ui-btn-up-b").addClass("ui-btn-up-c");
}    

function getSelectedSettings()
{
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM SETTINGS',[], function(tx, rs){
			if (rs.rows.item(0)['data'] == 'GR')
			{
				$("#language_select").val("GR");
	//			langstr = 'gr';
			}
			else if (rs.rows.item(0)['data'] == 'EN')
			{
				$("#language_select").val("EN");
	//			langstr = 'en';
			}
			if (rs.rows.length > 1)
			{
				currentEmail = rs.rows.item(1)['data'];
				$('#emailaccountchange').val(currentEmail);
			}
		}, errorCB);
		});
}

function showKeyEmail()
{
	if(window.event.keyCode == 13)
	{
		switchToMainPage($('#emailaccount').val());
	}
}

//function submitSelectedPlaces()
//{
//	db.transaction(function (tx) {
//		tx.executeSql('SELECT * FROM POIEN', [], function (tx, results) {
//			var len = results.rows.length, i;
//			for (i = 0; i < len; i++){
//				alert(results.rows.item(i).subcategory);
//			}
//		}, errorCB);
//	});
//}


function submitSelectedPlaces()
{
	var checked = new Array();
	var descr;
	if (currentMarkers != null)
	{
		for(var i = 0; i < currentMarkers.length; ++i){
			map.removeLayer(currentMarkers[i]);
		}
		currentMarkers = new Array();
	}
	fromselectedplaces = true;
	$('#placesContent input[type=checkbox]:checked').each(function () {
		checked.push(this.name);		//push checked items into values list
//		alert(this.name);
	});
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM SUBCATEGORIESEN', [], function (tx, results) {
			var len = results.rows.length, subNew;
			for (var j=0; j<checked.length; j++){
//				alert("("+checked[j]+")");
				for (var i = 0; i < len; i++){
					
					subNew = $.trim(results.rows.item(i).name);
//					alert("_"+subNew+"_");
					if (checked[j] == subNew){
						checked[j] = results.rows.item(i).id;
//						alert("#"+checked[j]);
					}
				}
			}
			db.transaction(function (tx) {
				tx.executeSql('SELECT * FROM POIEN', [], function (tx, results) {
					var len = results.rows.length;
					for (var j=0; j<checked.length; j++){
//						alert("@: "+checked[j]);
						for (var i = 0; i < len; i++){
							if (checked[j] == results.rows.item(i).subcategory){
								descr = results.rows.item(i).descr;
								if (descr.length > 140){			//slicing the description to the first 140 charactes.
									descr = descr.slice(0,140);				
									descr += "...";
								}
								addGroupMarker(results.rows.item(i).lat , results.rows.item(i).long,
										results.rows.item(i).name, descr);
//								alert(results.rows.item(i).name);
							}
						}
					}
					$.mobile.changePage($('#mainpage'), 'pop');
				}, errorCB);
			});
		}, errorCB);
	});
	setTimeout(function(){
		map.invalidateSize();
		},1000);
}

function showAllPlaces(){
	var descr;
	if (langstr == 'en'){
//		alert("lang: en");
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM POIEN', [], function (tx, results) {
				var len = results.rows.length, i;
				for (i = 0; i < len; i++){
					descr = results.rows.item(i).descr;
					if (descr.length > 140){			//slicing the description to the first 140 charactes.
						descr = descr.slice(0,140);				
						descr += "...";
					}
					addGroupMarker(results.rows.item(i).lat , results.rows.item(i).long,
							results.rows.item(i).name, results.rows.item(i).descr);
					descr = results.rows.item(i).descr;
					}
				}
//				alert(dbtext);
			, errorCB);
		});
	}
	else{
//		alert("lang: gr");
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM POIGR', [], function (tx, results) {
				var len = results.rows.length, i;
				for (i = 0; i < len; i++){
					descr = results.rows.item(i).descr;
					if (descr.length > 140){			//slicing the description to the first 140 charactes.
						descr = descr.slice(0,140);				
						descr += "...";
					}
					addGroupMarker(results.rows.item(i).lat , results.rows.item(i).long,
							results.rows.item(i).name, results.rows.item(i).descr);
				}
//				alert(dbtext);
			}, errorCB);
		});
	}
}

function checkForLanguage()
{
	if  (language == 'EN')
	{
		langstr = 'en';
		$.extend(MyApp.resources, enResources);
	}
	else if (language =='GR')
	{
		langstr = 'gr';
		$.extend(MyApp.resources, grResources);
	}
}

function showKmlFile()
{
	db.transaction(function(tx) {
		tx.executeSql('INSERT INTO ITINERARIES(id, title, isActive, completed) VALUES (?,?,?,?)',[itId,itTitle,itActive,itCompleted], successCB, errorCB);
	});
	if (track != null)
	{
		map.removeLayer(track);
//		control.removeFrom(map);
		map.removeControl(control);
	}
	if (currentMarkers != null)
	{
		for(var i = 0; i < currentMarkers.length; ++i)
		{
			map.removeLayer(currentMarkers[i]);
		}
		currentMarkers = new Array();
	}
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
		var localtour;		
//		localtour = tourXmlName.split("_")[0];
		localtour = tourXmlName.substring(9).replace("x","k");
//		alert("3# "+tourXmlName);
		var indexToReplace = localtour.indexOf("_")+1;
		var startString = localtour.substr(0, indexToReplace);
		var endString = localtour.substring(indexToReplace+1);
		var stringToPutIn= dd;
		localtour = startString+stringToPutIn+endString;
		localtour = "_"+localtour;
		filepath = fs.root.fullPath;
//		filepath += "/MapApp/kmlFiles/";
		var i=0;
		var found=false;
		var directoryReader = fs.root.createReader();
		directoryReader.readEntries(function(entries){
			while (i<entries.length && found == false)
//			for (var i=0; i<entries.length; i++)
			{
//				alert("4% "+entries[i].name);
//				if (entries[i].name && entries[i].name.match(/Itinerary_[0-9_]+\.kml/))
				if (entries[i].name.indexOf(localtour)>-1)
				{
					found = true;
//					alert("9^ "+entries[i].name);
//					var map = new L.Map('map', {center: new L.LatLng(58.4, 43.0), zoom: 11});
//					var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
//					var track = new L.KML("KML_Samples.kml", {async: true});
//					track.on("loaded", function(e) { map.fitBounds(e.target.getBounds()); });
//					map.addLayer(track);
//					map.addLayer(osm);
//					map.addControl(new L.Control.Layers({}, {'Track':track}));
//					alert("9* "+filepath+"/"+entries[i].name);
					track = new L.KML(filepath+"/"+entries[i].name, {async: true});
					track.on("loaded", function(e) { map.fitBounds(e.target.getBounds());});
					map.addLayer(track);
//					map.addLayer(osm);
					control = new L.Control.Layers({}, {'Track':track});
//					map.addControl(new L.Control.Layers({}, {'Track':track}));
					map.addControl(control);
					switchToMainPage();
				}
				i++;
			}
			if (found == false){
				alert("No itineraries found in SdCard!");
			}
		});
	});
}

function loadItinerariesfromPortal()
{
	if (currentEmail == null)
	{
		db.transaction(function (tx)
		{
			tx.executeSql('SELECT * FROM SETTINGS',[], function(tx, rs)
			{
				if (rs.rows.length > 1)
				{
					currentEmail = rs.rows.item(1)['data'];
					$('#emailaccountitinerary').val(currentEmail);
				}
			}, errorCB);
		});
	}
	else
	{
		$('#emailaccountitinerary').val(currentEmail);
	}
	document.getElementById('portalItineraries').innerHTML='';
	$.mobile.changePage($('#itineraryportalpage'), 'pop'); 
}

function loadItineraries()
{
//	checkedPoints();
	
	document.getElementById('availableFiles').innerHTML='';
	var hasXml = false;
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
		filepath = fs.root.fullPath;
		var directoryReader = fs.root.createReader();
		directoryReader.readEntries(function(entries){
			var j=0;
			for (var i=0; i<entries.length; i++)
			{
//				alert(entries[i].name);
				if (entries[i].name.match(/itinerary[0-9_]+\.xml/))
				{
					itineraryFilename[j] = entries[i].name;
//					alert("filename: "+itineraryFilename[j]+" "+j);
					hasXml = true;
					
					$('<a data-icon="arrow-r" id="'+j+'" data-iconpos="right"  href="#" data-role="button">'+itineraryFilename[j].split("_")[0]+'</a>')
//					.click(function() {  })
					.click(function() {
						var k = $(this).attr("id");
						findItineraryPage(k); })
					.appendTo($('#availableFiles'));
					j++;
				}
			}
				},function (error) {
					alert(error.code);
				});
			}, 
			function (error) {
				alert(error.code);
			});

	if (hasXml)
	{
		document.getElementById('lblnotavailablefiles').innerHTML= '';
	}
	else
	{
		document.getElementById('lblnotavailablefiles').innerHTML= MyApp.resources.NotAvailableFiles;
	}
	$.mobile.changePage($('#itinerarypage'), 'pop');
	$('#itinerarypage').trigger('pagecreate');     
}

function findItineraryPage(j){
//	alert("j:"+j);
	tourXmlName = itineraryFilename[j];
//	globalIt = k;
//	alert("name_split: "+name);
	loadEachItineraryPage(tourXmlName.split("_")[0], tourXmlName);
}

function backToItineraryPage()
{
	$.mobile.changePage($('#itinerarypage'), 'pop');
}

function loadFromPortal(email)
{
	$('#abtnLoadSelected').addClass('ui-disabled');
	var divportal = document.getElementById('portalItineraries');
	divportal.innerHTML='';
	var fillhtml='';
	if (email!='')
	{
		$.ajax({
			url: baseapiurl+'/itinerary/GetByEmail/aaa?name='+email,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			type: "GET",
			data:"{}",
			success: function(data) {
				alert('inside1');
				if(data != '')
				{
					alert('inside2');
					for (var i in data) 
					{
						$('#portalItineraries').append("<label style='margin-top:10px;' for='chk_"+data[i].ItineraryId+"'>"+ data[i].ItineraryTitle +"</label><input name='"+data[i].ItineraryId+"' id='chk_"+data[i].ItineraryId+"' class='custom' type='checkbox' value='"+ data[i].ItineraryTitle +"' />" );
					}
					$('#abtnLoadSelected').removeClass('ui-disabled');
					$('#itineraryportalpage').trigger('pagecreate');
				}
				else
				{
					$('#abtnLoadSelected').addClass('ui-disabled');
					alert(MyApp.resources.AvailableInitiaries);
				}
			},
			error: function () {alert('failed');}
		});
	}
	else
	{
		alert(MyApp.resources.EmailValidator);
	}
}

function loadXmlFromPortal(){
	setTimeout(function(){$('#portalItineraries input[type="checkbox"]:checked').each(function (i, el)
			{
		getFilesFromPortal(el.name);
		}
	);},600);
	loadItineraries();
}

function getFilesFromPortal(id)
{
	$.ajax({
		url: baseapiurl+'/itinerary/'+id,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		type: "GET",
		data:"{}",
		success: function(data) {
			var xmlFile = data.Xmlfile;
			var filename = data.Itinerary.ItineraryTitle + "_" + data.Itinerary.ItineraryId + ".xml";
			fileWrite(filename, xmlFile);
			for (i in data.Kmlfiles)
			{
				var kmlFile = data.Kmlfiles[i];
				filename =  data.Kmlfiles[i].Kmlfilename;
				fileWrite(filename, kmlFile);
			}
		},
		error: function () {}
	}); 
}

function fileWrite(filePath, text) 
{
	var onFSWin = function(fileSystem) {
		fileSystem.root.getFile(filePath, {create: true, exclusive: false}, onGetFileWin, onFSFail);
	};
	
	var onGetFileWin = function(fileEntry) {
		fileEntry.createWriter(gotFileWriter, onFSFail);
	};
	
	var gotFileWriter = function(writer) {
		writer.write(text);
	};
	
	var onFSFail = function(error) {
		alert('error');
	};
	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSWin, onFSFail);
}

function loadEachItineraryPage(itineraryName, fileName)
{
	document.getElementById('headeritinerary').innerHTML =itineraryName;
	loadTourXml(fileName);
	$.mobile.changePage($('#eachitinerarypage'), 'pop');
}

function loadTourXml(xmlFile)
{
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
		fileSystem.root.getFile(xmlFile, null,function (fileEntry){
			fileEntry.file(function (file){
				var reader = new FileReader();
				reader.onloadend = function(evt) 
				{
//					alert('q: '+evt.target.result);
					readTourXML(evt.target.result);
				};
				reader.readAsText(file);
			}
			, fail);
		}
		, fail);
	});
}

function fail(evt) {
	alert(evt.target.error.code);
}

function readTourXML(xmlTourDoc)
{
	var code;
	var duration = [];
	info = $(xmlTourDoc).find("It_Title").text();	
	initializePoints(xmlTourDoc);
	document.getElementById('divItineraryInfo').innerHTML = '';
	$('#availablePois').text('');
	$('#availableDays').text('');
	$(xmlTourDoc).find("Duration").each(function (){
		duration.push($(this).text());
	});
	$(xmlTourDoc).find("Route").each(function (){
		$('#availableDays').append('<input type="radio" class="days" name="day-choice" id="'+$(this).attr("Kml")+'" value="'+$(this).attr("Kml")+'"  /><label for="'+$(this).attr("Kml")+'">'+$(this).attr("Name")+'</label>');
	});
	$(".days").click(function show(){
		dd = $(this).attr("id");
		$('#availablePois').text('');
		$(xmlTourDoc).find("Route[Kml='"+dd+"']").children().each(function(){
			$(this).find('Point').each(function(){
				$('#availablePois').append('<input type="checkbox" class="points" data-iconpos="right" name="poi-choice" id="'+$(this).attr("Code")+'" value="'+$(this).attr("Code")+'" /><label for="'+$(this).attr("Code")+'">'+$(this).text()+" | Visited"+'</label>');
				$('#availablePois').trigger('create');
				$(xmlTourDoc).find("Route[Kml='"+dd+"']").children().each(function(){
					$(this).find('Point').each(function(){
						code = $(this).attr('Code');
						for (var t=0; t<placesVisited.length; t++){
							if (code == placesVisited[t]){
							}
						}
					});
				});
			});
		});
//		checking all the boxes! ::	$(".points").each(function(){ this.checked = true; });
		document.getElementById('divItineraryInfo').innerHTML = "<p>"+ info +" | " + "Day " + dd + "</p>" + "<p>Duration: "+ duration[dd-1] +"</p>";
		$(".points").click(function(){
			if ($(this).is(':checked')){
				code = $(this).attr("id");
//				alert("654: !"+code+"!");
				db.transaction(function (tx){
					tx.executeSql("UPDATE POINTS SET visited = '1' WHERE id = ?",[code]);
				});
			}
			else{
//				alert("987: "+code);
				db.transaction(function(tx){
					tx.executeSql("UPDATE POINTS SET visited = '2' WHERE id = ?",[code]);
				});
			}
		});
	}).first().click();
	$('#'+$(this).attr("Code")+'').attr("checked",false).checkboxradio("refresh");
	$('#eachitinerarypage').trigger('pagecreate');
	$('#availablePois').trigger('create');
	$('#availableDays').trigger('create');
}

function checkedPoints(xmlTourDoc){
	$('#availablePois input[type=checkbox]:checked').each(function (){
		alert($(this).attr("Code"));
	});
}

function initializePoints(xmlTourDoc){
	var routeid = $(xmlTourDoc).filter(":first").attr("id");
	$(xmlTourDoc).find('Point').each(function(){
		var code = $(this).attr("Code");
		db.transaction(function(tx){
			tx.executeSql('INSERT INTO POINTS(id, Id_Portal, routeId, isActive, visited) VALUES (?,?,?,?,?)',[code,0,routeid,0,0], successCB, errorCB);
		});
	});
}

function testdb(){
	var msg;
	var dbtext = '';
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM POINTS', [], function (tx, results) {
			var len = results.rows.length, i;
			for (i = 0; i < len; i++){
				dbtext = dbtext + 'pointsDb['+i+']: !';
				placesVisited.push(results.rows.item(i).id);
				dbtext = dbtext + placesVisited[i]; 
				dbtext = dbtext +", ";
				ifVisited.push(results.rows.item(i).visited);
				dbtext = dbtext + ifVisited[i];
				dbtext = dbtext + '\n';
//				alert('pointsDb['+i+']: '+placesVisited[i]+", "+ifVisited[i]);
			}
			alert(dbtext);
		}, errorCB);
	});
}
