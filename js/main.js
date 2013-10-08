var map;
var firstTime = true;
//var basemap;
var screenHeight;
//var fulldescription='';
var dbExistis = false;
var screenWidth;
var globalItId;
var globalI;
var currentTimestamp = [];
var hotelHtmlId = -2, restaurantHtmlId = -2, eraHtmlId = -2, musicHtmlId = -2, placeHtmlId = -2;
var placeHtml='';
var startPoint;
var currentLat;
var currentLong;
var deviceOSVersion;
var updateAppUrl;
var panToLat = 0;
var panToLong = 0;
var currentSubcategories = [];
var hotel = false;
var cuisine = false;
var era  = false;
var music = false;
//var currentVersionCode;
var markerCat = [], markerName = [], markerDescr = [], markerLong =[], markerLat = [], markerPlace = [], markerSSubCat = [], markerPoiId=[];
var tempmarkerCat = [], tempmarkerName = [], tempmarkerDescr = [], tempmarkerLong =[], tempmarkerLat = [],
	tempmarkerPoiid = [], tempmarkerPlace = [], tempmarkerSScat = [];
var subsubEn = [], subsubGr = [];
var reOrdered = false;
var currentVersionName;
//var testname, testdescr, testwebsite, testaddress,testplace,testphone,testemail;
var platformName;
var slideId = [], slideCat = [],slideName = [], slideDescr= [], slideWebsite= [], slideAddress= [], 
	slidePlace= [], slidePhone= [], slideEmail= [], slideImage = [];
var slideIdgr = [], slideCatgr = [], slideNamegr = [], slideDescrgr= [], slideWebsitegr= [], slideAddressgr= [], 
	slidePlacegr= [], slidePhonegr= [], slideEmailgr= [], slideImagegr = [];
var watchClear = false;
var marker1;
var cancelBackButton = false;
var watchID = null;
var fromLoadCoords = false;
var fromOrderPlaces = false;
var xmlDoc,xmlDoc1,xmlDoc2,xmlDoc3,xmlDoc4,xmlDoc5;
var currentMarkers = [];
var checked = [];
var catNameEn = [];
var catNameGr = [];
var catGuid = [];
var sCatId = [];
var sId = [];
var snameEn = [];
var snameGr = [];
var db;
var po=0;
//var showPlacesInfo = false;
var itineraryFilename = [];
var isOffline = true;
var language;
var langstr = 'en';
var currentEmail;
var langchanged = false;
var xmlpathcat;
var fromselectedplaces = false;
var itId;//, dayId;
var itinerariesId =[];
var itActive;
var itCompleted;
var fromMainPage = false;
//var nameCat= [];
//var categId = [];
var userFilters = new filters("","","","","","");
var newtimestamp = false;
var fromSettings = false;
//var enableTourButton = false;
var timestampa, timestampb, timestampc, timestampd;
var track, control, info, tourXmlName, dd, sname, fillhtml, catId;
var LeafIcon = L.Icon.extend({
    options: {
//        shadowUrl: 'marker-shadow.png',
        iconSize:     [29, 38], // size of the icon
//        shadowSize:   [30, 41], // size of the shadow
        iconAnchor:   [22, 38], // point of the icon which will correspond to marker's location
//        shadowAnchor: [4, 41],  // the same for the shadow
        popupAnchor:  [-3, -26] // point from which the popup should open relative to the iconAnchor
    }
});
var MarkerSights = new LeafIcon({iconUrl: 'dist/images/list2.png'}),
	MarkerAccommodation = new LeafIcon({iconUrl: 'dist/images/list10.png'}),
	MarkerActivities = new LeafIcon({iconUrl: 'dist/images/list14.png'}),
	MarkerSea = new LeafIcon({iconUrl: 'dist/images/list3.png'}),
	MarkerTransport = new LeafIcon({iconUrl: 'dist/images/list13.png'}),
	MarkerInfo = new LeafIcon({iconUrl: 'dist/images/list15_0_default.png'}),
	MarkerFood = new LeafIcon({iconUrl: 'dist/images/list12.png'});
	MarkerShopping = new LeafIcon({iconUrl: 'dist/images/shopping.png'});
	PublicServices = new LeafIcon({iconUrl: 'dist/images/list15_0_default.png'});
	HealthClinics = new LeafIcon({iconUrl: 'dist/images/list15_1_default.png'});
	Dispensaries = new LeafIcon({iconUrl: 'dist/images/list15_2_default.png'});
	Pharmacies = new LeafIcon({iconUrl: 'dist/images/list15_3_default.png'});
	CurrencyExchange = new LeafIcon({iconUrl: 'dist/images/list15_4_default.png'});
	Banks = new LeafIcon({iconUrl: 'dist/images/list15_5_default.png'});
	Parking = new LeafIcon({iconUrl: 'dist/images/list15_6_default.png'});
	GasStations = new LeafIcon({iconUrl: 'dist/images/list15_7_default.png'});
	Courier = new LeafIcon({iconUrl: 'dist/images/list15_8_default.png'});

function onDeviceReady() {
	db = window.openDatabase("KosMobile", "1.0", "Kos Db", 6000000);
//	db.transaction(populateDB, errorCB, successCB);
	document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("searchbutton", onSearchKeyDown, false);
//	document.addEventListener("abtnList", orderPlaces, false);
//	document.addEventListener("abtnMap", onClickbtnPlaces, false);
//	document.addEventListener("abtnFilter", function(){showFilterCategories(0);}, false);
	document.addEventListener("offline", function() {isOffline = true;}, false);
	document.addEventListener("online", function() {isOffline = false;}, false);
	$.mobile.defaultPageTransition = 'none';
	SetElementHeight();
	platformName = device.platform;
	deviceOSVersion = device.version;
	deviceOSVersion = parseInt(deviceOSVersion);
	//console.log("device.version "+device.version);
//	alert("platformName "+platformName);
	if(navigator.network && navigator.network.connection.type != Connection.NONE){
		isOffline = false;
	}
	window.plugins.version.getVersionName(
		    function(version_name) {		        //do something with version_name
		        ////console.log(version_name);
		        currentVersionName = version_name;
		        checkAppVersion();
		    },
		    function(errorMessage) {		        //do something with errorMessage
		        ////console.log(errorMessage);
		    }
		);
	setTimeout(function(){
		checkLanguageSettings();
	},1500);
//	error10CB();
//	checkItinerariesDb();
//	checkDb();
//	if (synchronizd == false){
//		sync();
//		synchronizd = true;
//	}
}

function filters(hotel, cuisine, music, era, radius){
	//The Filters Object to store users' specific filters//
//	var filters = new Object();
	this.hotel = hotel;
	this.cuisine = cuisine;
	this.music = music;
	this.era = era;
	this.radius = radius;
	//The Filters Object to store users' specific filters//
}

function checkForLanguage()
{
    langstr = 'en';
	if (language =='GR'  || language == 'gr')
	{
		langstr = 'gr';
		//console.log("langstr: "+langstr);
		$.extend(MyApp.resources, grResources);
	}
	else if (language =='EN'  || language == 'en')
	{
		langstr = 'en';
		//console.log("langstr: "+langstr);
		$.extend(MyApp.resources, enResources);
	}
}


function checkLanguageSettings()
{
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM SETTINGS', [], function (tx, results) {
			len = results.rows.length;
			//console.log("SETTINGS.length= "+len);
			if ((len == null) || (len == 0)){
				console.log("okook");
//				showPlacesInfo = true;
//				populateDB();
			}
			else{
//				langstr = language = results.rows.item(0).data;
				language = results.rows.item(0).data;
				console.log("langstr: "+language);
				checkForLanguage();
				cancelBackButton = true;
				if (isOffline == false){
//					sync();
				}
				dbExistis = true;
				createCatArraysEn();
				createSubCatArraysEn();
				createPoiArraysEn();
//				createCuisineArrayEn();
//				createCuisineArrayGr();
//				createSubCatArraysGr();
//				checkAppVersion();
				setTimeout(function(){
//					firstSwitchToMainPage();
//					firstSwitchToPlacesPage();
					switchToHomePage();
				},1500);
			}
		},success13CB, error13CB);
//		populateDB();
	});
}


function populateDB(tx)
{
	//console.log("IN POPULATE DB");
	db.transaction(function (tx) {
		////console.log("populateDB(tx)");
		tx.executeSql('DROP TABLE IF EXISTS SETTINGS');
//		tx.executeSql('DROP TABLE IF EXISTS POINTS');
		tx.executeSql('DROP TABLE IF EXISTS CATEGORIESEN');
		tx.executeSql('DROP TABLE IF EXISTS CATEGORIESGR');
		tx.executeSql('DROP TABLE IF EXISTS SUBCATEGORIESEN');
		tx.executeSql('DROP TABLE IF EXISTS SUBCATEGORIESGR');
		tx.executeSql('DROP TABLE IF EXISTS POIEN');
		tx.executeSql('DROP TABLE IF EXISTS POIGR');
		tx.executeSql('DROP TABLE IF EXISTS TIMESTAMP');
//		tx.executeSql('DROP TABLE IF EXISTS XMLDB');
//		tx.executeSql('DROP TABLE IF EXISTS ROUTES');
		tx.executeSql('DROP TABLE IF EXISTS TEMP');
		tx.executeSql('DROP TABLE IF EXISTS ITINERARIES');
		tx.executeSql('CREATE TABLE IF NOT EXISTS ITINERARIES (id, title, user, day, pointcode, pointname, coordinates, duration, isActive, completed)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS SETTINGS (id unique, data)');
//		tx.executeSql('CREATE TABLE IF NOT EXISTS XMLDB (id, xmlstring)');
//		tx.executeSql('CREATE TABLE IF NOT EXISTS POINTS (id, Id_Portal, routeId, isActive, visited, long, lat)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS CATEGORIESEN (id unique, name, guid)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS CATEGORIESGR (id unique, name, guid)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS SUBCATEGORIESEN (id, name, catid)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS SUBCATEGORIESGR (id, name, catid)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS POIEN (siteid, name, descr, category, subcategory, long, lat, website, address, place, phone, email, ssubcat, image)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS POIGR (siteid, name, descr, category, subcategory, long, lat, website, address, place, phone, email, ssubcat, image)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS TIMESTAMP (id unique, timestamp)');
//		tx.executeSql('CREATE TABLE IF NOT EXISTS ROUTES (id, title, itineraryId, isActive, completed)');
		////console.log("populateDB()2");
		populateDatabases();
	});
}

function createCatArraysEn(){
	catNameEn = [];
	catGuid = [];
	////console.log("in createCatArraysEn()");
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM CATEGORIESEN', [], function (tx, results) {
			for (var i = 0; i < results.rows.length; i++){
//				//console.log("catName1111: "+results.rows.item(i).name);
				catNameEn.push(results.rows.item(i).name);
				catGuid.push(results.rows.item(i).id);
			}
		}, error9CB);
	});
	createCatArraysGr();
}

function createCatArraysGr(){
	catNameGr = [];
	db.transaction(function (tx) {
		tx.executeSql('SELECT name FROM CATEGORIESGR', [], function (tx, results) {
			for (var i = 0; i < results.rows.length; i++){
				catNameGr.push(results.rows.item(i).name);
			}
		}, error9CB);
	});
}

function createSubCatArraysEn(){
	sCatId = [];
	snameEn = [];
	sId = [];
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM SUBCATEGORIESEN', [], function (tx, results) {
			for (var i = 0; i < results.rows.length; i++){
				sCatId.push(results.rows.item(i).catid);
				snameEn.push(results.rows.item(i).name);
				sId.push(results.rows.item(i).id);
			}
		}, error9CB);
	});
	createSubCatArraysGr();
}

function createSubCatArraysGr(){
	snameGr = [];
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM SUBCATEGORIESGR', [], function (tx, results) {
			for (var i = 0; i < results.rows.length; i++){
//				subCatId = results.rows.item(j).catid;
				snameGr.push(results.rows.item(i).name);
			}
		}, error9CB);
	});
}

function createPoiArraysEn(){
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM POIEN', [], function (tx, results) {
			var k = results.rows.length;
			////console.log("POIEN LENGTH"+ k);
			for (var p =0;p<k; p++){
				slideId.push(results.rows.item(p).siteid);
				slideCat.push(results.rows.item(p).category);
				slideName.push(results.rows.item(p).name);
				slideDescr.push(results.rows.item(p).descr);
				slideWebsite.push(results.rows.item(p).website);
				slideAddress.push(results.rows.item(p).address);
				slidePlace.push(results.rows.item(p).place);
				slidePhone.push(results.rows.item(p).phone);
				slideEmail.push(results.rows.item(p).email);			
				var str = results.rows.item(p).image;
				str = str.replace('src="','src="http://www.kos.gr');
				str = str.replace('style="border-width: 0px;','height="auto" width="100%');
//				console.log(str); 
				slideImage.push(str);
//				subsubEn.push(results.rows.item(p).ssubcat);
//				//console.log("09 "+results.rows.item(p).ssubcat);
			}
		});
	});
	createPoiArraysGr();
}

function createPoiArraysGr(){
	////console.log("in createPOIArraysEn()");
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM POIGR', [], function (tx, results) {
			var k = results.rows.length;
			////console.log("POIGR LENGTH"+ k);
			for (var p =0;p<k; p++){
				slideIdgr.push(results.rows.item(p).siteid);
				slideCatgr.push(results.rows.item(p).category);
				slideNamegr.push(results.rows.item(p).name);
				slideDescrgr.push(results.rows.item(p).descr);
				slideWebsitegr.push(results.rows.item(p).website);
				slideAddressgr.push(results.rows.item(p).address);
				slidePlacegr.push(results.rows.item(p).place);
				slidePhonegr.push(results.rows.item(p).phone);
				slideEmailgr.push(results.rows.item(p).email);
				var str = results.rows.item(p).image;
				str = str.replace('src="','src="http://www.kos.gr');
//				str = str.replace('style="border-width: 0px;','');
				str = str.replace('style="border-width: 0px;','height="auto" width="100%');
//				console.log(n);
				slideImagegr.push(str);
//				subsubGr.push(results.rows.item(p).ssubcat);
				//console.log("21 "+results.rows.item(p).ssubcat);
			}
		});
		if (cancelBackButton == false){
			switchToSecondPage(0);
		}
	});
}

function errorCB(err) {
    //console.log("Error processing SQL: "+err.code);
}

function successCB() {
    //alert('successCB!');
}

function switchToSecondPage()
{
//	if (dbExistis){
//		//do Nothing
//	}
//	else{
		$( ".loading_gif" ).css( "display", "none" );
		$('#secondpage').trigger("create");
		$.mobile.changePage($('#secondpage'), 'pop');
		console.log("in SwitchToSecondPage");
//	}
}

function success13CB(){
	console.log("success13CB");
	populateDB();
	//console.log("success13CB");
	setTimeout(function(){
//		switchToSecondPage();
	},4000);
//	showPlacesInfo = true;
}

function error13CB(){
	console.log("error13CB");
}

function onBackKeyDown(e) {
//	console.log("cancelBackButton "+cancelBackButton);
//	if (cancelBackButton == true){
//	Do Nothing!
//	console.log("doing nothing..");
//	}
//	else{
//	if ($.mobile.activePage.is('#firstpage')) {
//	e.preventDefault();
//	navigator.app.exitApp();
//	}
//	else if ($.mobile.activePage.is('#mainpage')){
//		fromMainPage = true;
//		navigator.app.backHistory();
//		exitApplication();
//	var fillHtml = '';
//	fillHtml  = '<div data-role="header" style="text-align:center"><h7>'+MyApp.resources.ExitApp+'</h7></div>';
//	fillHtml += '<div data-role="content">';
//	fillHtml += '<a href="#" data-role="button"data-inline="true" data-rel="back" data-theme="a">'+MyApp.resources.Cancel+'</a>'; 
//	fillHtml += '<a href="#" data-role="button" onclick = "exitApplication();" data-inline="true">'+MyApp.resources.Ok+'</a></div>';
//	$("#dialogtxt").html(fillHtml);
//	$.mobile.changePage( "#dialog", { role: "dialog" });
//	}
//	else {
//	navigator.app.backHistory();
//	}
//	}
	if (cancelBackButton == true){
	}
	else{
		if ($.mobile.activePage.is('#firstpage')) {
			e.preventDefault();
			navigator.app.exitApp();
		}
		else if ($.mobile.activePage.is('#mainpage')){
			fromMainPage = true;
//			navigator.app.backHistory();
			exitApplication();
		}
		else {
			navigator.app.backHistory();
		}
	}
}

function sync(){
	////console.log("in sync");
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM TIMESTAMP', [], function (tx, results){
			var len = results.rows.length, i;
			for (i = 0; i < len; i++){
				currentTimestamp.push(results.rows.item(i).timestamp);
			}
			popNewTimestampDb();
		}, errorCB);
	});
	////console.log("in sync2");
	downloadXmlFiles();
}

function checkAppVersion(){
	$.ajax({
		url: baseapiurl+'/mobileversion',
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		type: "GET",
		data:"{}",
		success: function(data) {
			data = JSON.stringify(data);
			var k = data.indexOf("VersionString") + 16; 
			var y = data.indexOf("AppLinkAndroid"); 
			var newVersion = data.slice(k,y-3);
			var update;
			////console.log("newVersion ="+newVersion);
//			var newerVersion = function compareVersionNumbers(newVersion, currentVersionName){
			var v1parts = newVersion.split('.');
			var v2parts = currentVersionName.split('.');
			////console.log(v1parts);
			////console.log(v2parts);
			for (var i = 0; i < v1parts.length; ++i) {
				if (v2parts.length === i) {
					update = 1;
				}
				if (v1parts[i] === v2parts[i]) {
					update = -1;
				}
				if (v1parts[i] > v2parts[i]) {
					update = 1;
				}
			}
			if (v1parts.length != v2parts.length) {
				update = -1;
			}
			if (update == 1){
				////console.log("newerVersion 1");
				udpateApp();
			}
			else if (update == -1){
				////console.log("newerVersion -1");
			}

		},
		error: function () {
			////console.log("Could NOT get new Version");
		}
	});
}

function udpateApp(){
	var r=confirm(MyApp.resources.UpdateApp);
	if (r==true){
		var k = platformName.indexOf("Android");
		if (k != -1){
			var url = 'http://www.kos.gr/mobileapp.apk';
			var ref = window.open(url, '_blank', 'location=no');
			clearCache();
		}
		k = platformName.indexOf("iOS");
		if (k != -1){
			//iOS link goes here!
			var ref = window.open(url, '_blank', 'location=no');
		}
		k = platformName.indexOf("Win");
		if (k != -1){
			//iOS link goes here!
			var ref = window.open(url, '_blank', 'location=no');
		}
	}
	else
	{
	}
}

function error0CB(){
//	alert("error0CB");
	populateDB();
}

function success0CB(){
	////console.log("success0CB");
}

function checkItinerariesDb(){
	var len;
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM ITINERARIES', [], function (tx, results) {
			len = results.rows.length;
			if (len == null){
//				error10CB();
			}
		});
	});
}

function createItDb(){
//	alert("error10CB()");
	db.transaction(function(tx) {
		tx.executeSql('DROP TABLE IF EXISTS ITINERARIES');
		tx.executeSql('CREATE TABLE IF NOT EXISTS ITINERARIES (id, title, user, day, pointcode, pointname, coordinates, duration, isActive, completed)');
	});
//	loadItineraryXml(2);
}


function populateDatabases(){
	////console.log("in populateDatabases");
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
	popTimestampDb();
//	setTimeout(function(){sync();},1000);
//	setTimeout(function(){
//		createCatArraysEn();
//	},500);
//	setTimeout(function(){
//		createSubCatArraysEn();
//	},500);
//	setTimeout(function(){
//		createPoiArraysEn();
//	},500);
}

function popCategoriesEnDb(){
	////console.log("in popCategoriesEnDb()");
	db.transaction(function(tx) {
		var cat =  xmlDoc.getElementsByTagName("Category");
		var  guid, catName;
//		alert(xmlDoc.documentElement);
		timestampa = $(xmlDoc).find("timestamp").text();
		for (var i=0; i< cat.length; i++){
			catId = xmlDoc.getElementsByTagName("Category")[i].getAttribute('id');
			catName = xmlDoc.getElementsByTagName("Category")[i].getElementsByTagName("Name")[0].textContent;
			////console.log("catName: "+catName);
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
	////console.log("in popSubCategoriesEnDb()");
	db.transaction(function(tx) {
		var cat =  xmlDoc.getElementsByTagName("Category");
		var sub, subId, subName;
		for (var i=0; i< cat.length; i++){
			catId = xmlDoc.getElementsByTagName("Category")[i].getAttribute('id');
			sub = cat[i].getElementsByTagName("Subcategories")[0].getElementsByTagName("Subcategory");
//			if (catId == 7){
//				tx.executeSql('INSERT INTO SUBCATEGORIESEN (id, name, catid) VALUES (?,?,?)',
//						['7_1','Villages',catId], success4CB, error4CB);
//			}
////			else if (catId == 9){
////				tx.executeSql('INSERT INTO SUBCATEGORIESEN (id, name, catid) VALUES (?,?,?)',
////						['0x010020858B5F00431840A5FF9BA2B0E92EAE','General Information',catId], success4CB, error4CB);
////			}
//			else{
				for (var j=0; j<sub.length; j++){
					subName = sub[j].getElementsByTagName("Name")[0].textContent;
					subId = sub[j].getAttribute('id');
//					alert(subId +" __ "+subName +" __ "+ catId);
					tx.executeSql('INSERT INTO SUBCATEGORIESEN (id, name, catid) VALUES (?,?,?)',[subId,subName,catId], success4CB, error4CB);
				}
//			}
		}
//		alert("3: "+subName);
	});
}

function success4CB(){
//	loadXmlCat(2);
}

function popCategoriesGrDb(){
	////console.log("in popCategoriesGrDb()");
	db.transaction(function(tx) {
		var cat =  xmlDoc1.getElementsByTagName("Category");
		var  guid, catName;
		var sub, subId, subName;
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
	////console.log("error5CB");
}

function popSubCategoriesGrDb(){
	////console.log("in popSubCategoriesGrDb()");
	db.transaction(function(tx) {
		var cat =  xmlDoc1.getElementsByTagName("Category");
		var sub, subId, subName;
		for (var i=0; i< cat.length; i++){
			catId = xmlDoc1.getElementsByTagName("Category")[i].getAttribute('id');
			sub = cat[i].getElementsByTagName("Subcategories")[0].getElementsByTagName("Subcategory");
//			if (catId == 7){
//				tx.executeSql('INSERT INTO SUBCATEGORIESGR (id, name, catid) VALUES (?,?,?)',
//						['7_1','Ξ§Ο‰Ο�ΞΉΞ¬',catId], success4CB, error4CB);
//			}
//			else if (catId == 9){
//				tx.executeSql('INSERT INTO SUBCATEGORIESGR (id, name, catid) VALUES (?,?,?)',
//						['0x010020858B5F00431840A5FF9BA2B0E92EAE','Ξ“ΞµΞ½ΞΉΞΊΞ­Ο‚ Ο€Ξ»Ξ·Ο�ΞΏΟ†ΞΏΟ�Ξ―ΞµΟ‚',catId], success4CB, error4CB);
//			}
//			else{
				for (var j=0; j<sub.length; j++){
					subName = sub[j].getElementsByTagName("Name")[0].textContent;
//					alert(subName);
					subId = sub[j].getAttribute('id');
//					alert(subId +" __ "+subName +" __ "+ catId);
					tx.executeSql('INSERT INTO SUBCATEGORIESGR (id, name, catid) VALUES (?,?,?)',[subId,subName,catId], successCB, error4CB);
				}
//			}
		}
//	alert("4: "+subName);
});
		}

function popPoiEnDb(){
	//console.log("in popPoiEnDb");
	db.transaction(function(tx) {
		var LenCat =  xmlDoc2.getElementsByTagName("Poi").length;
//		alert('LenCat: '+LenCat);
//		var subCatId, poiName, poiDescr, poiLong, poiLat, timestamp, poiCat, poiSubCat, pois;
		var subCatId, poiName, poiDescr, poiLong, poiLat, timestamp, poiCat, poiSubCat , pois, web, address, place, phone, email, ssub2, img;
//		pois = xmlDoc.getElementsByTagName("Pois")[0];
		timestampc = $(xmlDoc2).find("timestamp").text();
		for(var i = 0; i < LenCat; i++)	
		{
			ssub2 = '';
			poiName = xmlDoc2.getElementsByTagName("pois")[0].getElementsByTagName("Poi")[i].getElementsByTagName("Name")[0].textContent;
			poiId = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("SiteId")[0].textContent;
			poiDescr = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Description")[0].textContent;
			poiLong = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Longitude")[0].textContent;
			poiLat = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Latitude")[0].textContent;
			poiCat = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Category")[0].textContent;
			poiSubCat = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Sucategories");
			web = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Website")[0].textContent;
			address = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Address")[0].textContent;
			place = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Place")[0].textContent;
			phone = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Phone")[0].textContent;
			email = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("Email")[0].textContent;
			img = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("ImgLink")[0].textContent;
			ssub2 = xmlDoc2.getElementsByTagName("Poi")[i].getElementsByTagName("SubSucategories")[0].textContent;
			if ((ssub2 == null) || (ssub2 == '') || (ssub2 == undefined)){
				ssub2 = "none";
			}
			else {
				ssub2 = ssub2.trim();
			}
//			//console.log("222 "+ssub2);
			for(var x = 0; x < poiSubCat.length; x++) 		//creating list of places
			{
				subCatId =  poiSubCat[0].getElementsByTagName("Sucategory")[x].textContent;
			}
//			//console.log(poiId+" || "+poiName+" "+poiLong+" "+poiLat+" "+poiCat+" "+" time: "+timestampc+" "+web+ " "+address+ " "+place+ " "+phone+ " "+email);
			tx.executeSql('INSERT INTO POIEN (siteid,name, descr, category, subcategory, long, lat, website, address, place, phone, email, ssubcat, image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
					,[poiId, poiName, poiDescr, poiCat, subCatId, poiLong, poiLat, web, address, place, phone, email, ssub2, img], successCB, error2CB);
		}
//		alert("5: "+poiName);
	});	
}

function success6CB(){
//	loadXmlPoi(2);
}

function error6CB(){
	//console.log("error6CB");
}

function popPoiGrDb(){
	//console.log("popPoiGrDb");
	db.transaction(function(tx) {
		var LenCat =  xmlDoc3.getElementsByTagName("Poi").length;
		var subCatId, poiName, poiDescr, poiLong, poiLat, timestamp, poiCat, poiSubCat , pois, web, address, place, phone, email, ssub, img;
		timestampd = $(xmlDoc3).find("timestamp").text();
		for(var i = 0; i < LenCat; i++)	{
			ssub = '';
//			EXISTS POIGR (siteid, name, descr, category, subcategory, long, lat, website, address, place, phone, email)');
			poiName = xmlDoc3.getElementsByTagName("pois")[0].getElementsByTagName("Poi")[i].getElementsByTagName("Name")[0].textContent;
			poiId = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("SiteId")[0].textContent;
			poiDescr = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Description")[0].textContent;
			poiLong = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Longitude")[0].textContent;
			poiLat = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Latitude")[0].textContent;
			poiCat = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Category")[0].textContent;
			poiSubCat = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Sucategories");
			web = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Website")[0].textContent;
			address = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Address")[0].textContent;
			place = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Place")[0].textContent;
			phone = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Phone")[0].textContent;
			email = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Email")[0].textContent;
			img = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("ImgLink")[0].textContent;
			ssub = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("SubSucategories")[0].textContent;
			if ((ssub == null) || (ssub == '') || (ssub == undefined)){
				ssub = "none";
			}
			else {
				ssub = ssub.trim();
			}
//			//console.log("333 "+ssub);
			for(var x = 0; x < poiSubCat.length; x++) 		//creating list of places
			{
				subCatId =  poiSubCat[0].getElementsByTagName("Sucategory")[x].textContent;
			}
//			//console.log(poiName+" "+poiLong+" "+poiLat+" "+poiCat+" "+" time: "+timestampc+" "+web+ " "+address+ " "+place+ " "+phone+ " "+email);
			tx.executeSql('INSERT INTO POIGR (siteid,name, descr, category, subcategory, long, lat, website, address, place, phone, email, ssubcat, image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
					,[poiId, poiName, poiDescr, poiCat, subCatId, poiLong, poiLat, web, address, place, phone, email, ssub, img], sccssCB, error2CB);
		}
//		alert("6: "+poiName);
		createCatArraysEn();
		createSubCatArraysEn();
		createPoiArraysEn();
	});
}

function sccssCB(){

}

function error2CB(){
	//console.log('error2CB');
}

function popTimestampDb(){
	//console.log("in popTimestampDb");
	db.transaction(function(tx) {
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[1,timestampa],successCB,error7CB);
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[2,timestampb],successCB,error7CB);
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[3,timestampc],successCB,error7CB);
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[4,timestampd],successCB,error7CB);
	});
}

function popNewTimestampDb(){
	//console.log("in popNewTimestampDb");
	db.transaction(function(tx) {
		tx.executeSql('DROP TABLE IF EXISTS TIMESTAMP');
		tx.executeSql('CREATE TABLE IF NOT EXISTS TIMESTAMP (id unique, timestamp)');
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[1,currentTimestamp[0]],successCB,error9CB);
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[2,currentTimestamp[1]],successCB,error9CB);
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[3,currentTimestamp[2]],successCB,error9CB);
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[4,currentTimestamp[3]],successCB,error9CB);
	});
}

function error9CB(){
	//console.log("error9CB!");
}

function error7CB(err){
	//console.log("error7CB"+err.code);
}

function error3CB(){
	//console.log('error db 3');
}

function error4CB(){
	//console.log('error db 4');
}

function onSearchKeyDown()
{
	//console.log('button search');
}

function downloadXmlFiles(){
	//console.log('in downloadXmlFiles');
	var data;
	$.ajax({ 
		dataType: "json",
//		url:  baseapiurl+"/basefile",
//		contentType: "application/json; charset=utf-8",
		url:  baseapiurl+"basefile",
		type: "GET",
		async: true,
		data: "{}",
		success: function (data){
			json2xml(data);
		},
		error: function (error){
//			alert('failed to connect to server');
		}
	});
}

function getTimestamp(data){
	var a = data.indexOf("<timestamp>")+11;
	var b = data.indexOf("</timestamp>");
	var timestampf = data.slice(a,b);
	if ( timestampf > currentTimestamp[po] ){
		newtimestamp = true;
		if (po==0){
//			popNewCategoriesEnDb(data);
		}
		if (po==1){
			popNewCategoriesGrDb(data);
		}
		if (po==2){
			
		}
		if (po==3){
			popNewPoiGrDb(data);
		}
	}
	//console.log("po= "+po);
	po++;
}

function popNewCategoriesGrDb(data)
{
	var guid = [];
	var categName = [];
	var catId = [];
	$(data).find("Category").each(function (){
		catId.push($(this).attr("id"));
		guid.push($(this).attr("guid"));
	});
	$(data).find("category>name").each(function (){
		categName.push($(this).text());
	});
	db.transaction(function(tx) {
		tx.executeSql('DROP TABLE IF EXISTS CATEGORIESGR');
		tx.executeSql('CREATE TABLE IF NOT EXISTS CATEGORIESGR (id unique, name, guid)');
		for (var i=0 ; i < categName.length ; i++){
//			alert(guid[i]+" "+categName[i]+ " "+catName[i]);
			tx.executeSql('INSERT INTO CATEGORIESGR (id, name, guid) VALUES (?,?,?)',
					[catId[i],categName[i],guid[i]], success8CB, error8CB);
		}
		popNewSubCategoriesGrDb(data);
	});
}

function success8CB(){
//	alert("success8CB!");
}

function error8CB(){
	//console.log("error8CB!");
}

function popNewSubCategoriesGrDb(data)
{
	var catId = [];
	var subId = [];
	var subName = [];
	$(data).find("Subcategory").each(function (){
		subId.push($(this).attr("id"));
	});
	$(data).find("subcategory name").each(function (){
		subName.push($(this).text());
	});
	$(data).find("subcategory name").each(function (){
		catId.push($(this).parent().parent().parent().attr("id"));
	});
//	alert(catId.length +" "+subId.length+" "+subName.length);
	db.transaction(function(tx) {
		tx.executeSql('DROP TABLE IF EXISTS SUBCATEGORIESGR');
		tx.executeSql('CREATE TABLE IF NOT EXISTS SUBCATEGORIESGR (id unique, name, catid)');
		for (var j=0 ; j<catId.length ; j++){
			tx.executeSql('INSERT INTO SUBCATEGORIESGR (id, name, catid) VALUES (?,?,?)'
					,[subId[j],subName[j],catId[j]], success9CB, error9CB);		
		}
	});
}

function success9CB(){
//	alert("success9CB!");
}


//function error9CB(){
//	//console.log("error9CB!");
//}
//	db.transaction(function(tx) {
//	tx.executeSql('INSERT INTO SUBCATEGORIESGR (id, name, catid) VALUES (?,?,?)',[subId,subName,catId], successCB, error4CB);
//	}
//	}
//	});

function popNewPoiGrDb(data){
	//console.log("inpopNewPoiGrDb");
//	alert(data);
	var namePoi = [];
	var descrPoi = [];
	var catPoi = [];
	var subCatPoi = [];
	var poiLat = [];
	var poiLong = [];
	$(data).find("Name").each(function (){
		 namePoi.push($(this).text());
	});
	$(data).find("Description").each(function (){
		descrPoi.push($(this).text());
	});
	$(data).find("Category").each(function (){
		catPoi.push($(this).text());
	});
	$(data).find("Sucategory").each(function (){
		subCatPoi.push($(this).text());
	});
	$(data).find("Latitude").each(function (){
		poiLat.push($(this).text());
	});
	$(data).find("Longitude").each(function (){
		poiLong.push($(this).text());
	});
//	alert(descrPoi.length +" "+namePoi.length+" "+catPoi.length+" "+subCatPoi.length+" "+poiLat.length
//			+" "+poiLong.length);
	db.transaction(function(tx) {
		tx.executeSql('DROP TABLE IF EXISTS POIGR');
		tx.executeSql('CREATE TABLE IF NOT EXISTS POIGR (name, descr, category, subcategory, long, lat)');
		for (var j=0 ; j<namePoi.length ; j++){	
			tx.executeSql('INSERT INTO POIGR (name, descr, category, subcategory, long, lat) VALUES (?,?,?,?,?,?)'
				,[namePoi[j], descrPoi[j], catPoi[j], subCatPoi[j], poiLong[j], poiLat[j]], successCB, error2CB);
//			alert(poiLong[j]+" "+ poiLat[j]);
		}
	});	
}

function popNewCategoriesEnDb(data){
//	alert(data);
//	db.transaction(function(tx) {
//		var cat =  xmlDoc.getElementsByTagName("Category");
		var  guid, catName;
//		$(data).find("Category").each(function (){
//			catId = $(this).attr("id");
//			guid = $(this).attr("guid");
//		});
		//console.log(data);
		$(data).find("category subcategories subcategory name").each(function (){
			 //console.log($(this).text());
		});
//		catId = xmlDoc.getElementsByTagName("Category")[i].getAttribute('id');
			catName = xmlDoc.getElementsByTagName("Category")[i].getElementsByTagName("Name")[0].textContent;
			guid = xmlDoc.getElementsByTagName("Category")[i].getAttribute('guid');
			tx.executeSql('INSERT INTO CATEGORIESEN (id, name, guid) VALUES (?,?,?)',[catId,catName,guid], success3CB, error3CB);
//	});
}

function json2xml(o, tab){
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
		createXmlString(xml);
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
	//console.log("newXmlFileName: "+newXmlFileName); 
	getTimestamp(xmlString);
}

function loadXmlCat(x) {
	if (x == 1){
		xmlpathcat = 'xml/categories.en.xml';
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
		xmlpathcat = 'xml/categories.gr.xml';
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
}

function drawPlacesPageEn(len){
	var fillhtml='';
	var fillHeader= '<img src="images/info_icon.png" style="float:left;"><span>'+MyApp.resources.placesPageHeader+'</span>';
	len = catNameEn.length;
	for (var k=0; k <catNameEn.length ; k++){
//		//console.log("wwwww "+catNameEn[k]);
		fillhtml += "<fieldset data-role='collapsible' data-theme='g' data-content-theme='g'>";
		fillhtml += "<legend>" + catNameEn[k] + "</legend>";
		fillhtml += "<div data-role='controlgroup'>";
		for(var j=0; j<snameEn.length ; j++){
			if ( catGuid[k] == sCatId[j]){
				fillhtml += "<input type='checkbox' class='checkbox' name='"+snameEn[j]+"' id='"+snameEn[j]+"' />";
				fillhtml += "<label for='"+ snameEn[j] +"'>"+ snameEn[j] +"</label>";
			}
		}
		fillhtml += "</div>";
		fillhtml += "</fieldset>";
	}
	createPageHeader(2);
	$("#placesContent").html(fillhtml);
//	document.getElementById('btnSaveChanges2').innerHTML= MyApp.resources.SaveChanges;
	$('#placespage').trigger("create");
	$("#placesPageHeader").html(fillHeader);
	$( ".loading_gif" ).css( "display", "none" );
	$.mobile.changePage($('#placespage'), 'pop');
	customHeader(2);
	$('#abtnTour2').removeClass("active");
	$('#abtnPlaces2').addClass("active");
	$('#abtnCurrentPosition2').removeClass("active");
//	$('#abtnExit2').removeClass("active");
	$('.options').css({'display':'none'});
	setLabelsForMainPage();
	var email = $('#emailaccountchange2').val();
	//console.log("2222 email: "+email);
	if ( email == null || email == ""){
		var cm = "";
		if (currentEmail!=undefined) cm=currentEmail;
		$('#emailaccountchange2').val(cm);
		//console.log(cm);
	}
}

function customHeader(x){
	document.getElementById('btnPlaces'+x).innerText= MyApp.resources.Places;
	document.getElementById('abtnCurrentPosition'+x).innerText= MyApp.resources.CurrentPosition;
	document.getElementById('btnTour'+x).innerHTML= MyApp.resources.Tour;
//	document.getElementById('btnSaveChanges'+x).innerHTML= MyApp.resources.SaveChanges;
//	document.getElementById('btnExit'+x).innerHTML= MyApp.resources.Exit;
}

function drawPlacesPageGr(len){
	var fillhtml='';
	len = catNameGr.length;
	var fillHeader= '<img src="images/info_icon.png" style="float:left;"><span>'+MyApp.resources.placesPageHeader+'</span>';
	var subLen;
	for (var k=0; k <catNameGr.length ; k++){
		fillhtml += "<fieldset data-role='collapsible' data-theme='g' data-content-theme='g'>";
		fillhtml += "<legend>" + catNameGr[k] + "</legend>";
		fillhtml += "<div data-role='controlgroup'>";
		for(var j=0; j<snameGr.length ; j++){
			if ( catGuid[k] == sCatId[j]){
				fillhtml += "<input type='checkbox' class='checkbox' name='"+snameGr[j]+"' id='"+snameGr[j]+"' />";
				fillhtml += "<label for='"+ snameGr[j] +"'>"+ snameGr[j] +"</label>";
			}
		}
		fillhtml += "</div>";
		fillhtml += "</fieldset>";
	}
	createPageHeader(2);
	$("#placesContent").html(fillhtml);
	$('#placespage').trigger("create");
	$("#placesPageHeader").html(fillHeader);
//	document.getElementById("loading_gif").style.display = "none";
	$( ".loading_gif" ).css( "display", "none" );
	$.mobile.changePage($('#placespage'), 'pop');
	customHeader(2);
	var email = $('#emailaccountchange2').val();
	if ( email == null || email == ""){
		$('#emailaccountchange2').val(currentEmail);
		//console.log(currentEmail);
	}
	$('#abtnTour2').removeClass("active");
	$('#abtnPlaces2').addClass("active");
	$('#abtnCurrentPosition2').removeClass("active");
//	$('#abtnExit2').removeClass("active");
	$('.options').css({'display':'none'});
	setLabelsForMainPage();
//	document.getElementById('btnSaveChanges2').innerHTML= MyApp.resources.SaveChanges;
//	setLabelsForMainPage();
}

function onClickbtnFilterPlaces()
{
	$( ".loading_gif" ).css( "display", "block" );
//	slideBack(0);
	firstTime = false;
	hotelHtmlId = -2, restaurantHtmlId = -2, eraHtmlId = -2, musicHtmlId = -2, placeHtmlId = -2;
	if (langstr == 'en'){
//		readCatDbEn();
		drawPlacesPageEn();
	}
	else {
		drawPlacesPageGr();
	}
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

//function typeSelectChanged()
//{
//	if (currentMarkers != null)
//	{
//		for(var i = 0; i < currentMarkers.length; ++i)
//		{
//			map.removeLayer(currentMarkers[i]);
//		}
//		currentMarkers = [];
//	}
//	var value = $(this).id();
//	x=xmlDoc.getElementsByTagName("Type")[value -1].getElementsByTagName("Destination");
//	for(var i = 0; i < x.length; ++i)
//	{
//		//appendOptionLast(x.length,10)
//		addGroupMarker(x[i].attributes.getNamedItem("lat").nodeValue, 
//				x[i].attributes.getNamedItem("long").nodeValue, 
//				x[i].attributes.getNamedItem("name").nodeValue, 
//				x[i].attributes.getNamedItem("descr").nodeValue);
//	}
//}

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
			currentMarkers = [];
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

function generateMap()
{ 
		map = new L.Map('map', {center: new L.LatLng(36.8939,27.2884), zoom: 13, zoomControl: false});
//		var loadingControl = L.Control.loading({separate: true});
		var osm = new L.TileLayer('map/{z}/{x}/{y}.png', {unloadInvisibleTiles: true, reuseTiles: true});
		map.addLayer(osm);
		map._layersMaxZoom=17;
		map._layersMinZoom=12;
//		document.getElementById('map').style.display = 'block';
		map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.
		new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
//		map.addControl(clearControl(orderPlaces));
}

function onClickbtnCurrent()
{
//	slideBack(0);
	$('#abtnCurrentPosition').addClass("active");
	setTimeout(function(){
		$('#abtnCurrentPosition').removeClass("active");
	},800);
//	$('#abtnPlaces').removeClass("active");
//	$('#abtnTour').removeClass("active");
//	$("#abtnFilterTour").hide();
//	$("#abtnFilterPlaces").hide();
	if (watchClear == false){
		watchClear = true;
//		navigator.geolocation.getCurrentPosition(onSuccess, onError,{frequency:5000,maximumAge: 0, enableHighAccuracy:true});
//		navigator.geolocation.getCurrentPosition(onSuccess, onError,{timeout: 20000, enableHighAccuracy:true});
		var options = { timeout: 20000, enableHighAccuracy: true };
		watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
		switchToMainPage();
	}
	else{
		watchClear = false;
		clearWatch();
	}
}

function onSuccess(position)
{
	//console.log("in geolocation Success");
	currentLat = position.coords.latitude;
	//console.log("currentLat: "+currentLat);
	currentLong = position.coords.longitude;
	//console.log("currentLong: "+currentLong);
	if (fromLoadCoords == true){
		fromLoadCoords = false;
		getDirections();
	}
	else if (fromOrderPlaces == true){
		reOrdered = true;
		$( ".loading_gif" ).css( "display", "block" );
		var fillhtml = '';
		document.getElementById('orderedPlaces').innerHTML='';
		document.getElementById('showingInfo').innerHTML='';
		tempmarkerCat = [],	tempmarkerName = [], tempmarkerDescr = [], tempmarkerLong =[], tempmarkerLat = [], tempmarkerPlace = [];
		tempmarkerSScat = [];
		//console.log("inReadSlider");
		var radius = $("#slider-fill").val();
		//console.log("adadsa "+$("#slider-fill").val());
		for (var i=0; i<markerName.length; i++){
			reOrder(radius, markerLat[i], markerLong[i], markerCat[i], markerName[i], markerDescr[i], markerPlace[i], 
					markerSSubCat[i], markerPoiId[i] );
		}
		if (tempmarkerName.length==0) {
			fillhtml = MyApp.resources.NoPointsNearBy+radius+MyApp.resources.Kilometers+MyApp.resources.FromYourPosition;
		}
		else
		{
			for (var j=0; j<tempmarkerName.length; j++){
				var categ = $.trim(tempmarkerCat[j]);
				if (categ.indexOf("8_") == -1 ){
					categ = categ.slice(0,1);
					//console.log(categ);		
				}
				switch (categ)
				{
				case "1":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/shopping_0.png" alt="options">'+"  "+tempmarkerName[j]+'<br><h6>'+tempmarkerPlace[j]+'</h6></a>';
					break;
				case "2":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list2_0.png" alt="options">'+"  "+tempmarkerName[j]+' <br><h6> '+tempmarkerPlace[j]+' | '+tempmarkerSScat[j]+'</h6></a>';
					break;
				case "3":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/hotels.png" alt="options">'+"  "+tempmarkerName[j]+' <br><h6> '+tempmarkerPlace[j]+' | '+tempmarkerSScat[j]+'</h6></a>';
					break;
				case "4":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list14_0.png" alt="options">'+"  "+tempmarkerName[j]+' <br><h6> '+tempmarkerPlace[j]+'</h6></a>';
					break;
				case "5":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list15_1.png" alt="options" />'+"  "+tempmarkerName[j]+' <br><h6> '+tempmarkerPlace[j]+'</h6></a>';
					break;
				case "6":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list3_0.png" alt="options">'+"  "+tempmarkerName[j]+' <br><h6> '+tempmarkerPlace[j]+'</h6></a>';
					break;
				case "7":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list12_0.png" alt="options">'+"  "+tempmarkerName[j]+' <br><h6> '+tempmarkerPlace[j]+' | '+tempmarkerSScat[j]+'</h6></a>';
					break;
				case "8_1":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list15_0.png" alt="options">'+"  "+tempmarkerName[j]+' <br><h6> '+tempmarkerPlace[j]+'</h6></a>';
					break;
				case "8_2":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list15_1.png" alt="options">'+"  "+tempmarkerName[j]+' <br><h6> '+tempmarkerPlace[j]+'</h6></a>';
					break;
				case "8_3":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list15_2.png" alt="options">'+"  "+tempmarkerName[j]+' <br><h6> '+tempmarkerPlace[j]+'</h6></a>';
					break;
				case "8_4":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list15_3.png" alt="options">'+"  "+tempmarkerName[j]+' <br><h6> '+tempmarkerPlace[j]+'</h6></a>';
					break;
				case "8_5":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list15_4.png" alt="options">'+"  "+tempmarkerName[j]+' <br><h6> '+tempmarkerPlace[j]+'</h6></a>';
					break;
				case "8_6":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list15_5.png" alt="options">'+"  "+tempmarkerName[j]+'<br><h6>  '+tempmarkerPlace[j]+'</h6></a>';
					break;
				case "8_7":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list15_6.png" alt="options">'+"  "+tempmarkerName[j]+' <br><h6> '+tempmarkerPlace[j]+'</h6></a>';
					break;
				case "8_8":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list15_7.png" alt="options">'+"  "+tempmarkerName[j]+'<br><h6>'+tempmarkerPlace[j]+'</h6></a>';
					break;
				case "8_9":
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list15_8.png" alt="options">'+"  "+tempmarkerName[j]+' <br><h6>'+tempmarkerPlace[j]+'</h6></a>';
					break;
				default:
					fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+j+'" ><img src="images/list15_1.png" alt="options">'+"  "+tempmarkerName[j]+' <br></h6>'+tempmarkerPlace[j]+'</h6></a>';
				}
				if (j == 50){
					break;
				}
			}
			document.getElementById('showingInfo').innerHTML= MyApp.resources.Showing + j + MyApp.resources.From + tempmarkerName.length;

		}
		$( ".loading_gif" ).css( "display", "none" );
		$("#orderedPlaces").html(fillhtml);
		$('#orderedPlaces').trigger('create');
	}
	else{
		if ((currentLat < 36.65) || (currentLat > 36.91) || (currentLong < 26.90) || (currentLong > 27.35)){
			alert(MyApp.resources.AwayFromKos);
			clearWatch();
		}
		else{
			map.panTo([currentLat,currentLong ]);
			if (marker1 != null)
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
	}
}

function onError(error)
{
//	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
	alert(MyApp.resources.NoLocation);
}

function addGroupMarker(x, y, name, descr, categ, place, sscat, poiID, index)
{
	x = x.replace(x.charAt(2), ".");
	y = y.replace(y.charAt(2), ".");
	if (x < 35){
		var temp = x;
		x = y;
		y = temp;
	}
	var marker;
	var markerLocation = new L.LatLng(x, y);
//	console.log(categ);
	categ = $.trim(categ);
	if (categ.indexOf("8_") == -1 ){
		categ = categ.slice(0,1);
//		console.log(categ);
	}
//	console.log(categ);
	panToLong = y;
	panToLat = x;
	switch (categ)
	{
	case "1":
		marker = new L.Marker(markerLocation, {icon: MarkerShopping}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "2":
		marker = new L.Marker(markerLocation, {icon: MarkerSights}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "3":
		marker = new L.Marker(markerLocation, {icon: MarkerAccommodation}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "4":
		marker = new L.Marker(markerLocation, {icon: MarkerActivities}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "5":
		marker = new L.Marker(markerLocation, {icon: MarkerSea}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "6":
		marker = new L.Marker(markerLocation, {icon: MarkerTransport}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "7":
		marker = new L.Marker(markerLocation, {icon: MarkerFood}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "8_1":
		marker = new L.Marker(markerLocation, {icon: PublicServices}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "8_2":
		marker = new L.Marker(markerLocation, {icon: HealthClinics}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "8_3":
		marker = new L.Marker(markerLocation, {icon: Dispensaries}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "8_4":
		marker = new L.Marker(markerLocation, {icon: Pharmacies}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "8_5":
		marker = new L.Marker(markerLocation, {icon: CurrencyExchange}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "8_6":
		marker = new L.Marker(markerLocation, {icon: Banks}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "8_7":
		marker = new L.Marker(markerLocation, {icon: Parking}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "8_8":
		marker = new L.Marker(markerLocation, {icon: GasStations}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	case "8_9":
		marker = new L.Marker(markerLocation, {icon: Courier}).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
		break;
	default:
		marker = new L.Marker(markerLocation).addTo(map)
		.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>", {maxWidth: 250});
	}
	if (index == 1){
		markerLong.push(y);
		markerLat.push(x);
		markerCat.push(categ);
		markerName.push(name);
		markerSSubCat.push(sscat);
		markerPlace.push(place);
		markerDescr.push(descr);
		markerPoiId.push(poiID);
	}
	map.addLayer(marker);
	currentMarkers.push(marker);
}

function ClearAll(){
	$('#placespage input[type=checkbox]').each(function (){
		this.checked = false;
		});
	$("#placespage input[type=checkbox]").checkboxradio("refresh");
}

function switchToEmailPage(langid)
{
//	if (newtimestamp == true){
//		popNewTimestampDb();
//	}
	console.log("switchToEmailPage");
	language = langid;
	langstr = langid.toLowerCase();
    db.transaction(function(tx) {
    	tx.executeSql('INSERT INTO SETTINGS(id, data) VALUES (?,?)',[1,langstr],successCB, errorCB);
    	//console.log("inserted Into settings: "+langstr);
    	checkForLanguage();
    });
	if (isOffline == false){
//		sync();
	}
//	setTimeout(function(){
		switchToHomePage();
//	},2300);
}

function switchToHomePage(){
	if (map == null){
		generateMap();
	}
	checkForLanguage();
	if (isOffline == true)
	{
		alert(MyApp.resources.NoInternetAccess);
	}
	console.log("in switchToHomePage");
	createPageHeader(8);
	var innerhtml = '';
	innerhtml  = '<img src="images/Flag_Left_Azure2.png" class="fpicon" onClick="firstSwitchToPlacesPage();"><br>';
	innerhtml += '<div style="font-weight:bold;">'+MyApp.resources.Explore+'</div><br><br>';
	innerhtml += '<img src="images/path2.png" class="fpicon" onClick="loadItineraries();"><br>';
	innerhtml += '<div style="font-weight:bold;">'+MyApp.resources.Routes+'</div><br><br>';
	//innerhtml += '<img src="images/Location2.png" class="fpicon" onClick="showPositionOnMap();">';
	//innerhtml += '<h4>'+MyApp.resources.CurrentPosition+'</h4>';
	$("#explore").html(innerhtml);
	$('#homepage').trigger("create");
	$.mobile.changePage($('#homepage'), 'pop');
	var email = $('#emailaccountchange8').val();
	if ( email == null || email == ""){
		$('#emailaccountchange2').val(currentEmail);
	}
	$('.options').css({'display':'none'});
	setLabelsForMainPage();
}

function showPositionOnMap(){
	$.mobile.changePage($('#mainpage'), 'pop');
	setLabelsForMainPage();
	$( ".loading_gif" ).css( "display", "none" );
	createPageHeader(1);
	$('.options').css({'display':'none'});
	$.mobile.changePage($('#mainpage'), 'pop');
	$('#abtnList').removeClass("active");
    $('#abtnMap').addClass("active");
    $('#abtnFilter').removeClass("active");
	$('#abtnPlaces').addClass("active");
	$("#abtnFilterTour").hide();
	$("#abtnFilterPlaces").show();
	$('#map').css('height',screenHeight-125);
	setTimeout(function(){
		map.invalidateSize();
	},2500);
	email = $('#emailaccountchange').val();
	if ( email == null || email == ''){
		$('#emailaccountchange').val(currentEmail);
	}
	setLabelsForMainPage();
	if (fromSettings == true){
	    onClickSettings();
	    fromSettings = false;
	}
	onClickbtnCurrent();
}

function firstSwitchToPlacesPage()
{
	console.log("in firstSwitchToPlacesPage()");
	onClickbtnFilterPlaces();
}

function setLabelsForMainPage()
{
	setHeaderLabels();
//	document.getElementById('btnSettings').innerHTML= MyApp.resources.Settings; 
//	document.getElementById('btnSBack').innerHTML=  MyApp.resources.Back;  
	document.getElementById('btnPBack').innerHTML= MyApp.resources.Apply;
//	document.getElementById('btnPBack2').innerHTML= MyApp.resources.Apply;
//	document.getElementById('btnShowNone').innerHTML= MyApp.resources.ShowNone;
	document.getElementById('btnList').innerHTML= MyApp.resources.List;
	document.getElementById('btnMap').innerHTML= MyApp.resources.Map;
	document.getElementById('btnFilter').innerHTML= MyApp.resources.Filter;
	document.getElementById('btnLocalBack').innerHTML= MyApp.resources.Back;
	document.getElementById('btnPortalBack').innerHTML= MyApp.resources.Back;
//	document.getElementById('settingsheading').innerHTML= MyApp.resources.SettingsHeading;   
//	document.getElementById('lbllanguageselect').innerHTML= MyApp.resources.LanguageSelect;
//	document.getElementById('lblslider').innerHTML= MyApp.resources.Slider;
	document.getElementById('btnRefresh').innerHTML= MyApp.resources.Refresh;
//	document.getElementById('lblemailaccount').innerHTML= MyApp.resources.EmailAccount;
	document.getElementById('btnFilterTour').innerHTML= MyApp.resources.FilterTour;    
	document.getElementById('btnFilterPlaces').innerHTML= MyApp.resources.FilterPlaces;
//	document.getElementById('btnSlideBack').innerHTML= MyApp.resources.Close;
	document.getElementById('btnLoadfromportal').innerHTML= MyApp.resources.LoadFromPortal;
	document.getElementById('btnLoadItinerary').innerHTML= MyApp.resources.LoadItinerary;
//	document.getElementById('btnLoadSelected').innerHTML= MyApp.resources.LoadSelected;
	document.getElementById('btnEachItineraryBack').innerHTML= MyApp.resources.Back;
//	document.getElementById('btnHide').innerHTML= MyApp.resources.Hide;
//	document.getElementById('itinerarypageheader').innerHTML= MyApp.resources.LoadAvailableTour;  
//	document.getElementById('itineraryportalpageheader').innerHTML= MyApp.resources.LoadPortalTour;  
	document.getElementById('btnClearAll').innerHTML= MyApp.resources.ClearAll;
	document.getElementById('btnLoad').innerHTML= MyApp.resources.Load;
//	document.getElementById('btnSaveChanges').innerHTML= MyApp.resources.SaveChanges;
//	document.getElementById('btnShowPlacesPage').innerHTML= MyApp.resources.ShowPlaces;
}

function setHeaderLabels(){
	document.getElementById('btnCurrentPosition').innerHTML= MyApp.resources.CurrentPosition;  
	document.getElementById('btnPlaces').innerHTML= MyApp.resources.Places;
	document.getElementById('btnTour').innerHTML= MyApp.resources.Tour;
//	document.getElementById('btnExit').innerHTML= MyApp.resources.Exit;
}

//function setSettingsLabels(){
//	
//}

function backToMainPage()
{
	var newLanguage = $("#language_select").val();
    var newEmail =  $("#emailaccountchange").val();
    var newlangstr = $("#language_select").val();
    langstr = newlangstr.toLowerCase();
    console.log(langstr);
	fromselectedplaces = false;
    if (language != newLanguage)
    {
    	language = newLanguage;
    	langchanged = true;
    	console.log(language);
    	db.transaction(function(tx) {
    		tx.executeSql('UPDATE SETTINGS SET DATA = ? WHERE ID= ?',[language,1]);
    		});
    }
    saveEmail(newEmail);
   // loadXml();
    checkForLanguage();
    fromSettings = true;
    $.mobile.changePage($('#mainpage'), 'pop');
    $('#map').css('height',screenHeight-125);
	email = $('#emailaccountchange').val();
	//console.log("123email: "+email);
	if ( email == null || email == ''){
		$('#emailaccountchange').val(currentEmail);
	}
	setLabelsForMainPage();
	if (fromSettings == true){
	    onClickSettings();
	    fromSettings = false;
	}
    checkSettingsDB();
}

function saveEmail(newEmail)
{
	if (currentEmail== null && newEmail !='' )
    {
    	db.transaction(function(tx) {
    		tx.executeSql('INSERT INTO SETTINGS(id, data) VALUES (?,?)',[2,newEmail]);
    		});
    	currentEmail = newEmail;
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
}

function reloadHomePage(){
	var newLanguage = $("#language_select8").val();
	var newEmail =  $("#emailaccountchange8").val();
	var newlangstr = $("#language_select8").val();
	var settingsChanged = false;
	langstr = newlangstr.toLowerCase();
	console.log(langstr);
	fromselectedplaces = false;
	if (language != newLanguage)
	{
		language = newLanguage;
		langchanged = true;
		console.log(language);
		db.transaction(function(tx) {
			tx.executeSql('UPDATE SETTINGS SET DATA = ? WHERE ID= ?',[language,1]);
		});
		settingsChanged = true;
	}
	var email = $('#emailaccountchange8').val();
	if ( email != null && email != ''){
		$('#emailaccountchange8').val(currentEmail);
	}
	saveEmail(newEmail);
	checkForLanguage();
	switchToHomePage();
}

function reloadPlacesPage(){
	var newLanguage = $("#language_select2").val();
	var newEmail =  $("#emailaccountchange2").val();
	var newlangstr = $("#language_select2").val();
	var settingsChanged = false;
	langstr = newlangstr.toLowerCase();
	console.log(langstr);
	fromselectedplaces = false;
	if (language != newLanguage)
	{
		language = newLanguage;
		langchanged = true;
		console.log(language);
		db.transaction(function(tx) {
			tx.executeSql('UPDATE SETTINGS SET DATA = ? WHERE ID= ?',[language,1]);
		});
		settingsChanged = true;
	}
	var email = $('#emailaccountchange2').val();
	if ( email != null && email != ''){
		$('#emailaccountchange2').val(currentEmail);
	}
	saveEmail(newEmail);
	checkForLanguage();
	onClickSettings();
	onClickbtnFilterPlaces();
}

function reloadItinerariesPage(){
	var newLanguage = $("#language_select3").val();
	var newEmail =  $("#emailaccountchange3").val();
	var newlangstr = $("#language_select3").val();
	var settingsChanged = false;
//	langstr = newlangstr.toLowerCase();
	//console.log(langstr);
	fromselectedplaces = false;
	if (language != newLanguage)
	{
		language = newLanguage;
		langchanged = true;
		//console.log(language);
		db.transaction(function(tx) {
			tx.executeSql('UPDATE SETTINGS SET DATA = ? WHERE ID= ?',[language,1]);
		});
		settingsChanged = true;
	}
	saveEmail(newEmail);
	checkForLanguage();
//	switchToMainPage();
//	if (settingsChanged == true){
	onClickSettings();
	loadItineraries();	    	
//	}
}

function switchToMainPage(email,x,y)
{
	/*
	$( ".loading_gif" ).css( "display", "none" );
					createPageHeader(1);
					$.mobile.changePage($('#mainpage'), 'pop');
					$('#abtnPlaces').addClass("active");
				    $('#abtnList').removeClass("active");
				    $('#abtnMap').addClass("active");
				    $('#abtnFilter').removeClass("active");
					$("#abtnFilterTour").hide();
					$("#abtnFilterPlaces").show();
					setTimeout(function(){
						map.invalidateSize();
					},2500);
					setLabelsForMainPage();
					$('.options').css({'display':'none'});
	*/
//	$.mobile.changePage($('#mainpage'), 'pop');
	setLabelsForMainPage();
	$( ".loading_gif" ).css( "display", "none" );
	createPageHeader(1);
	$('.options').css({'display':'none'});
	$.mobile.changePage($('#mainpage'), 'pop');
	$('#abtnTour').addClass("active");
//	$('#abtnList').removeClass("active");
//    $('#abtnMap').removeClass("active");
//    $('#abtnFilter').removeClass("active");
	$('#abtnPlaces').removeClass("active");
	$("#abtnFilterTour").show();
	$('#abtnCurrentPosition').removeClass("active");
	$("#abtnFilterPlaces").hide();
	setTimeout(function(){
		$('#map').css('height',screenHeight-100);
		map.invalidateSize();
	},2500);
	email = $('#emailaccountchange').val();
	//console.log("123email: "+email);
	if ( email == null || email == ''){
		$('#emailaccountchange').val(currentEmail);
	}
	setLabelsForMainPage();
	if (fromSettings == true){
	    onClickSettings();
	    fromSettings = false;
	}
//	onClickbtnCurrent();
}

function switchToMainPage2(){
	$.mobile.changePage($('#mainpage'), 'pop');
	$('#map').css('height',screenHeight-125);
	setTimeout(function(){
		map.invalidateSize();
	},2500);
	setLabelsForMainPage();
	onClickbtnTour();
}

function switchToFirstPage()
{
	db.transaction(function(tx) {
		tx.executeSql('DELETE FROM SETTINGS WHERE id=?', [1], successCB, errorCB);
		});
	$.mobile.changePage($('#firstpage'), 'pop');
}

function onClickbtnPlaces()
{
	clearWatch();
	//console.log("currentMarkers.length "+currentMarkers.length);
	if (currentMarkers != null)// && (firstTime == false))
	{
		//console.log("in here!");
		for(var i = 0; i < currentMarkers.length; ++i){
			map.addLayer(currentMarkers[i]);
//			//console.log("in here2!");
//			//console.log("Current marker "+currentMarkers[i]);
		}
	}
//	}
	if (track != null)
	{
		//console.log(track);
		//console.log("track not null!");
		map.removeLayer(track);
//		map.removeControl(control);
	}
	$("#abtnFilterPlaces").show();
    $("#abtnFilterTour").hide();
    $('#abtnPlaces').addClass("active");
    $('#abtnTour').removeClass("active");
    $( ".secondary_menu" ).css( "display", "block" );
    $('#abtnCurrentPosition').removeClass("active");
}

function onClickbtnPlaces2()
{
	clearWatch();
	//console.log("currentMarkers.length "+currentMarkers.length);
	if (currentMarkers != null)// && (firstTime == false))
	{
		//console.log("in here!");
		for(var i = 0; i < currentMarkers.length; ++i){
			map.addLayer(currentMarkers[i]);
			//console.log("in here2!");
			//console.log("Current marker "+currentMarkers[i]);
		}
	}
	if (track != null)
	{
		map.removeLayer(track);
//		map.removeControl(control);
	}
	createPageHeader(1);
	$.mobile.changePage($('#mainpage'), 'pop');
	$( ".secondary_menu" ).css( "display", "block" );
	$('#map').css('height',screenHeight-125);
	$('#abtnPlaces').addClass("active");
    $('#abtnList').removeClass("active");
    $('#abtnMap').addClass("active");
    $('#abtnFilter').removeClass("active");
    $('#abtnTour').removeClass("active");
	$("#abtnFilterTour").hide();
	$("#abtnFilterPlaces").show();
	setTimeout(function(){
		map.invalidateSize();
	},2500);
	setLabelsForMainPage();
	$( ".loading_gif" ).css( "display", "none" );
	$('.options').css({'display':'none'});
	/*setLabelsForMainPage();
	$.mobile.changePage($('#mainpage'), 'pop');
	setTimeout(function(){
		map.invalidateSize();
	},2000);
	$("#abtnFilterPlaces").show();
    $("#abtnFilterTour").hide();
    $('#abtnPlaces').addClass("active");
    $('#abtnTour').removeClass("active");
    $('#abtnCurrentPosition').removeClass("active");*/
}

function onClickbtnTour()
{
	cancelBackButton = false;
	clearWatch();
//	slideBack(0);
	$("#abtnFilterPlaces").hide();
    $("#abtnFilterTour").show();
    $('#abtnPlaces').removeClass("active");
    $( ".secondary_menu" ).css( "display", "none" );
    $('#abtnTour').addClass("active");
    $('#abtnCurrentPosition').removeClass("active");
//  enableTourButton = true;
    if (track != null)
	{
    	map.addLayer(track);
    	if (currentMarkers != null)
    	{
    		for(var i = 0; i < currentMarkers.length; ++i)
    		{
    			map.removeLayer(currentMarkers[i]);
    		}
//    		currentMarkers = [];
    	}
	}
    else
    {
    	loadItineraries();
    }
}

function submitSelectedPlaces()
{
	checked = [];
	markerCat = [], markerName = [], markerDescr = [], markerLong =[], markerLat = [], markerSSubCat = [], markerPlace = [], markerPoiId=[];
//	subsubGr = [];
	hotel = false; cuisine = false; music = false; era = false;
//	document.getElementById("loading_gif").style.display = "block";
//	$( ".loading_gif" ).css( "display", "block" );
	cancelBackButton = false;
	var descr;
	if (currentMarkers != null)
	{
		for(var i = 0; i < currentMarkers.length; ++i){
			map.removeLayer(currentMarkers[i]);
		}
		currentMarkers = [];
	}
	firstTime = false;
	if (langstr == 'en'){
		submitSelectedPlacesEn();
	}
	else {
		submitSelectedPlacesGr();
//		var poiName = "The wetland of Psalidi";
//		var c = slideName.indexOf(poiName);
//		console.log(c);
//		var tempId = slideId[c];
//		var tempCat = slideCat[c];
//		console.log(tempId+" "+tempCat);
//		for ( var l=0; l < slideIdgr.length ;l++){
//			if ( (tempId == slideIdgr[l]) && (tempCat == slideCatgr[l]) ){
//			//	fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo2(this.text)" rel="external" id="'
//			//	+pointCode[k]+'" >'+slideNamegr[l]+'</a>';
//				getMoreInfo2(slideNamegr[l]);
//				break;
//			}
//		}
	}
}

function submitSelectedPlacesEn(){
	$('input[type="checkbox"]').each(function(){
//		//console.log("name: "+this.name);
		if(this.checked || $(this).attr("checked") || $(this).is(':checked')) {
			checked.push(this.name);		//push checked items into values list
			//console.log("name222: "+this.name);
		}
	});
	for (var l=0; l<checked.length; l++){
		
		if (checked[l] == "Hotels"){
			hotel = true;
		}
		if (checked[l] == "Restaurants"){
			cuisine = true;
		}
		if (checked[l].indexOf("Archaelogical") != -1){
			era = true;
		}
		if (checked[l] == "Night Clubs"){
			music = true;
		}
	}
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM SUBCATEGORIESEN', [], function (tx, results) {
			var len = results.rows.length, subNew;
			for (var j=0; j<checked.length; j++){
//				alert("("+checked[j]+")");
				for (var i = 0; i < len; i++){
//					//console.log("in SubmitSelected En2");
					subNew = $.trim(results.rows.item(i).name);
//					//console.log("_"+subNew+"_");
					if (checked[j] == subNew)
					{
						checked[j] = results.rows.item(i).id;
						if (results.rows.item(i).id == '2_3'){
							checked.push('2_5');
						}
						if (results.rows.item(i).id == '4_1'){
							checked.push('4_2');
						}
						currentSubcategories.push(results.rows.item(i).id);
//						//console.log("!!#!!"+results.rows.item(i).id);
					}
				}
			}
			db.transaction(function (tx) {
				tx.executeSql('SELECT * FROM POIEN', [], function (tx, results) {
					var len = results.rows.length;
					var lat2;
					for (var j=0; j<checked.length; j++){
//						alert("@: "+checked[j]);
						for (var i = 0; i < len; i++){
//							//console.log("POIEN: "+results.rows.item(i).subcategory);
							if (checked[j] == results.rows.item(i).subcategory){
								var descr = results.rows.item(i).descr;
								if (descr.length > 200){			//slicing the description to the first 200 charactes.
									descr = descr.slice(0,200);
									descr += "...";
									descr += "<br>";
								}
								var poiid = results.rows.item(i).siteid;
								var poicat = results.rows.item(i).category;
								var x = results.rows.item(i).lat;
								var y = results.rows.item(i).long;
								x = x.replace(x.charAt(2), ".");
								y = y.replace(y.charAt(2), ".");
								descr += "<p onclick=getMoreInfo("+poiid+","+poicat+")><i><u>"+MyApp.resources.MoreInfo+"</i></u></p>";
//								descr += '<a href="#popupBasic" data-rel="popup">'+MyApp.resources.MoreInfo+'</a>';			
								descr += "<p onclick=getDirections("+x+","+y+")><i><u>"+MyApp.resources.GetDirections+"</i></u></p>";
//								////console.log("in SubmitSelected En3");
								lat2 = results.rows.item(i).lat;
								if ( lat2.indexOf("\n") == -1){
									//console.log(results.rows.item(i).subcategory);
									addGroupMarker(results.rows.item(i).lat , results.rows.item(i).long,
											results.rows.item(i).name, descr, results.rows.item(i).subcategory,
											results.rows.item(i).place,  results.rows.item(i).ssubcat, poiid, 1);
								}
							}
						}
					}
//					document.getElementById("loading_gif").style.display = "none";
					$( ".loading_gif" ).css( "display", "none" );
					createPageHeader(1);
					$.mobile.changePage($('#mainpage'), 'pop');
					$('#abtnPlaces').addClass("active");
				    $('#abtnList').removeClass("active");
				    $('#abtnMap').addClass("active");
				    $('#map').css('height',screenHeight-125);
				    $('#abtnFilter').removeClass("active");
					$("#abtnFilterTour").hide();
					$("#abtnFilterPlaces").show();
					setTimeout(function(){
						map.invalidateSize();
					},2500);
					setLabelsForMainPage();
					$('.options').css({'display':'none'});
					for ( var b=0 ; b < currentSubcategories.length ; b++)
						if (	(currentSubcategories[b] == "3_1") || (currentSubcategories[b] == "8_1") 
								||  (currentSubcategories[b] == "2_1") || (currentSubcategories[b] == "8_3"))
						{
							currentSubcategories.splice(b,1);
						}
				}, errorCB);
			});
		}, errorCB);
	});

}

function submitSelectedPlacesGr(){

	fromselectedplaces = true;
	$('input[type="checkbox"]').each(function(){
		if(this.checked || $(this).attr("checked") || $(this).is(':checked')) {
			checked.push(this.name);		//push checked items into values list
		}
	});
	for (var l=0; l<checked.length; l++){
		
		if (checked[l] == "Ξενοδοχεία"){
			hotel = true;
		}
		if (checked[l] == "Εστιατόρια"){
			cuisine = true;
		}
		if (checked[l].indexOf("Αρχαιολογικοί") != -1){
			era = true;
		}
		if (checked[l] == "Νυχτερινά Κέντρα"){
			music = true;
		}
	}
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM SUBCATEGORIESGR', [], function (tx, results) {
			var len = results.rows.length, subNew;
			//console.log("!!!! "+len);
			for (var j=0; j<checked.length; j++){
//				alert("("+checked[j]+")");
				for (var i = 0; i < len; i++){
					subNew = $.trim(results.rows.item(i).name);
					if (checked[j] == subNew){
						checked[j] = results.rows.item(i).id;
//						alert("#"+checked[j]);
						if (results.rows.item(i).id == '2_3'){
							checked.push('2_5');
						}
						if (results.rows.item(i).id == '4_1'){
							checked.push('4_2');
						}
						currentSubcategories.push(results.rows.item(i).id);
					}
				}
			}
			db.transaction(function (tx) {
				tx.executeSql('SELECT * FROM POIGR', [], function (tx, results) {
					var lat2;
					var len = results.rows.length;
					for (var j=0; j<checked.length; j++){
//						alert("@: "+checked[j]);
						for (var i = 0; i < len; i++){
							if (checked[j] == results.rows.item(i).subcategory){
								var descr = results.rows.item(i).descr;
								//console.log(descr);
								if (descr.length > 140){			//slicing the description to the first 140 charactes.
									descr = descr.slice(0,140);
									descr += "...";
									descr += "<br>";
//									//console.log("1231231: "+descr);
								}
								var poiid = results.rows.item(i).siteid;
								var poicat = results.rows.item(i).category;
								var x = results.rows.item(i).lat;
								var y = results.rows.item(i).long;
								x = x.replace(x.charAt(2), ".");
								y = y.replace(y.charAt(2), ".");
								descr += "<p onclick=getMoreInfo("+poiid+","+poicat+")><i><u>"+MyApp.resources.MoreInfo+"</i></u></p>";
								descr += "<p onclick=getDirections("+x+","+y+")><i><u>"+MyApp.resources.GetDirections+"</i></u></p>";
								lat2 = results.rows.item(i).lat;
								if ( lat2.indexOf("\n") == -1){
									addGroupMarker(results.rows.item(i).lat , results.rows.item(i).long,
											results.rows.item(i).name, descr, results.rows.item(i).subcategory,
											results.rows.item(i).place,  results.rows.item(i).ssubcat, poiid, 1);
//									subsubGr.push(results.rows.item(i).ssubcat);
								}
							}
						}
					}
//					document.getElementById("loading_gif").style.display = "none";
					$( ".loading_gif" ).css( "display", "none" );
					createPageHeader(1);
					$.mobile.changePage($('#mainpage'), 'pop');
//					map.invalidateSize();
					$('#abtnList').removeClass("active");
					$('#map').css('height',screenHeight-125);
				    $('#abtnMap').addClass("active");
				    $('#abtnFilter').removeClass("active");
					$('#abtnPlaces').addClass("active");
					$("#abtnFilterTour").hide();
					$("#abtnFilterPlaces").show();
					setTimeout(function(){
						map.invalidateSize();
					},2500);
					setLabelsForMainPage();
					$('.options').css({'display':'none'});
				}, errorCB);
			});
		}, errorCB);
	});
}


function showKmlFile()
{
	var x,y;
	if (track != null)
	{
		map.removeLayer(track);
	}
	console.log(startPoint);
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM POIEN WHERE name=?', [startPoint], function (tx, results) {
			x = results.rows.item(0).lat;
			y = results.rows.item(0).long;
			console.log(x+" "+y);
			x = x.replace(x.charAt(2), ".");
			y = y.replace(y.charAt(2), ".");
			console.log(x+" "+y);
			if (currentMarkers != null)
			{
				for (var i = 0; i < currentMarkers.length; ++i)
				{
					map.removeLayer(currentMarkers[i]);
				}
			}
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
				var something = '';
				var localtour;
				var kmlPath;
				kmlPath = fs.root.fullPath;
				kmlPath += '/itinerary_'+itId+'_'+dd+'.kml';
				track = new L.KML(kmlPath, {async: false});
				track.on("loaded", function(e) {
					map.fitBounds(e.target.getBounds());
//					var bounds = new L.LatLngBounds([x,y]);
//					map.fitBounds(bounds);
//					map.panTo([x,y]);
				});
				map.addLayer(track);
//				map.center([x,y]);
				fromSettings = false;
				setTimeout(function(){
					switchToMainPage(something,x,y);
				},1500);
			});
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
	createPageHeader(5);
	document.getElementById('emailaccountitinerary').placeholder= MyApp.resources.EmailAccountPlaceholder;
	customHeader(5);
	checkForLanguage();
    $('#abtnTour5').addClass("active");
    $('#abtnCurrentPosition5').removeClass("active");
    $('#abtnPlaces5').removeClass("active");
//    $('#abtnExit5').removeClass("active");
    $('#itineraryportalpage').trigger('create');
	$( ".loading_gif" ).css( "display", "none" );
    $('.options').css({'display':'none'});
	document.getElementById('btnLoadItinerary').innerHTML= MyApp.resources.LoadItinerary;
	document.getElementById('btnPortalBack').innerHTML= MyApp.resources.Back;
	var email = $('#emailaccountchange5').val();
	if (currentEmail != 'undefined' || currentEmail != '') {
		if (email == null || email == ""){
			$('#emailaccountchange5').val(currentEmail);
		}
	}
}

function reloadItineraryPortalPage()
{
	var newLanguage = $("#language_select5").val();
	var newEmail =  $("#emailaccountchange5").val();
	var newlangstr = $("#language_select5").val();
	var settingsChanged = false;
	langstr = newlangstr.toLowerCase();
	////console.log(langstr);
	fromselectedplaces = false;
	if (language != newLanguage)
	{
		language = newLanguage;
		langchanged = true;
		////console.log(language);
		db.transaction(function(tx) {
			tx.executeSql('UPDATE SETTINGS SET DATA = ? WHERE ID= ?',[language,1]);
		});
		settingsChanged = true;
	}
//	//console.log("111");
	checkForLanguage();
	saveEmail(newEmail);
//	checkForLanguage();
	onClickSettings();
	loadItinerariesfromPortal();
}

function popItinerariesDb(xmlDoc){
	var title;
	var user;
	var id;
	var pointCode ;
	var pointName ;
	var duration ;
	var day ;
	var coords;
	db.transaction(function(tx){
		title = $(xmlDoc).find("It_Title").text();
		user = $(xmlDoc).find("User").text();
		id = $(xmlDoc).find("Itinerary").attr("id");
		$(xmlDoc).find("Point").each(function(){
//			day.push($(this).parent().parent().attr("Kml"));
			day =   $(this).parent().parent().attr("Kml");
//			pointCode.push(($(this).attr("Code")));
			pointCode = $(this).attr("Code");
//			pointName.push(($(this).text()));
			pointName = $(this).text();
//			duration.push(($(this).parent().parent().text()).slice(2,10));
			//console.log("1 "+duration);
			duration = $(this).parent().parent().text().slice(0,10);
			//console.log("2 "+duration);
			itActive = 0;
			itCompleted = 0;
			tx.executeSql('INSERT INTO ITINERARIES(id, title, user, day, pointcode, pointname,coordinates, duration, isActive, completed) VALUES (?,?,?,?,?,?,?,?,?,?)'
					,[id,title,user,day,pointCode,pointName,coords,duration,itActive,itCompleted], successCB, error12CB);
		});
		loadItineraryXml2();
	});
	loadItineraryXml18();
}

//function popItiDayDb(){
//	var itid;
//	var kml;
//	var duration;
//
//	$(xmlDoc).find("Route").each(function(){
//		duration = $(xmlDoc).find("Duration").text();
//		kml = $(xmlDoc).find("Route").attr("Kml");
//		itid = $(xmlDoc).find("Itinerary").attr("id");
//	});
//}

function error12CB(){
	//console.log("error12CB");
}
/*
function loadItineraryXml(x){
	if (x == 2){
//		alert("xml/itinerary2_2.xml");
		xmlpathcat = 'xml/itinerary2_2.xml';
	}
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", xmlpathcat, false);
	xmlhttp.setRequestHeader('Content-Type', 'text/xml');
	xmlhttp.send("");
	xmlDoc4 = xmlhttp.responseXML;
	if ((xmlhttp.status != 200) && (xmlhttp.status != 0)){
		alert("Error loading Xml file4: "+ xmlhttp.status);
	}
	popItinerariesDb(xmlDoc4);
}

function loadItineraryXml2(){
//	alert("xml/itinerary3_3.xml");
	xmlpathcat = 'xml/itinerary_12.xml';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", xmlpathcat, false);
	xmlhttp.setRequestHeader('Content-Type', 'text/xml');
	xmlhttp.send("");
	xmlDoc5 = xmlhttp.responseXML;
	if ((xmlhttp.status != 200) && (xmlhttp.status != 0)){
		alert("Error loading Xml file4: "+ xmlhttp.status);
	}
	popItinerariesDb2(xmlDoc5);
}

function loadItineraryXml18(){
//	alert("xml/itinerary3_3.xml");
	xmlpathcat = 'xml/itinerary_26.xml';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", xmlpathcat, false);
	xmlhttp.setRequestHeader('Content-Type', 'text/xml');
	xmlhttp.send("");
	xmlDoc4 = xmlhttp.responseXML;
	if ((xmlhttp.status != 200) && (xmlhttp.status != 0)){
		alert("Error loading Xml file4: "+ xmlhttp.status);
	}
	//popItinerariesDb2(xmlDoc4);
} 

function popItinerariesDb2(xmlDoc5){
	var title;
	var user;
	var id;
	var pointCode ;
	var pointName ;
	var duration ;
	var day ;
	var coords;
	db.transaction(function(tx){
		title = $(xmlDoc5).find("It_Title").text();
		user = $(xmlDoc5).find("User").text();
		id = $(xmlDoc5).find("Itinerary").attr("id");
		$(xmlDoc5).find("Point").each(function(){
			day =   $(this).parent().parent().attr("Kml");
			pointCode = $(this).attr("Code");
			pointName = $(this).find("Title").text();
			coords = $(this).find("Coordinates").text();
			//console.log("Title: "+pointName);
			//console.log("1 "+duration);
			duration = $(this).parent().parent().text().trim().slice(0,10);
			//console.log("2 "+duration);
//			alert(duration);
			itActive = 0;
			itCompleted = 0;
//			alert("id: "+id+" title: "+title+" user: "+user+ " days: "+day +" "+pointCode+" "+pointName+" "+duration);
			tx.executeSql('INSERT INTO ITINERARIES(id, title, user, day, pointcode, pointname, coordinates, duration, isActive, completed) VALUES (?,?,?,?,?,?,?,?,?,?)'
					,[id,title,user,day,pointCode,pointName,coords,duration,itActive,itCompleted], successCB, error12CB);
		});
	});
}
*/
function checkItDb(){
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM ITINERARIES', [], function (tx, results) {	
			for (var k=0; k<results.rows.length; k++){
				itIdis.push(results.rows.item(k).id);
			}
		});
	});
}

function loadItineraries()
{
	var idis=[];
	var titles=[];
	var j;
	var fillhtml = '';
	document.getElementById('availableFiles').innerHTML='';
	var itineraryPageHeader ='';
	//console.log("in availableFiles");
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM ITINERARIES', [], function (tx, results) {
			var len = results.rows.length;
			////console.log("==="+len);
			if (len == 0){
				itineraryPageHeader= '<img src="images/info_icon.png" style="float:left;"><span>'+MyApp.resources.ItineraryPageHeaderNull+'</span>';
			}
			else{
				itineraryPageHeader= '<img src="images/info_icon.png" style="float:left;"><span>'+MyApp.resources.ItineraryPageHeaderOk+'</span>';
				for (var k=0; k<len; k++){
					idis.push(parseInt(results.rows.item(k).id));
					titles.push(results.rows.item(k).title);
				}
				for (j=1 ; j < idis.length ; j++){
					if (idis[j] != idis[j-1]){
//						$('<a href="#" input type="button" data-icon="arrow-r" data-iconpos="right" id="'+idis[j-1]+'" >'+titles[j-1]+'</a>')
//						.click(function() {var m = $(this).attr("id");
//						loadEachItineraryPage(m); }).appendTo($('#availableFiles'));
//						<a href="index.html" data-role="button" data-icon="arrow-r" data-iconpos="right" data-theme="a" onclick="doSomething(); return false" rel="external">VERIFY</a>
						fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "loadEachItineraryPage(this.id)" rel="external" id="'+idis[j-1]+'" >'+titles[j-1]+'</a>';
//						fillhtml += '<button id="'+idis[j-1]+'" onClick="loadEachItineraryPage(this.id)" data-icon="arrow-r" data-iconpos="right">'+titles[j-1]+'</button>';
					}
				}
//				fillhtml += '<button id="'+idis[j-1]+'" onClick="loadEachItineraryPage(this.id)" data-icon="arrow-r" data-iconpos="right">'+titles[j-1]+'</button>';
//				$('<a href="#" input type="button" data-icon="arrow-r" data-iconpos="right" id="'+idis[j-1]+'" >'+titles[j-1]+'</a>')
//				.click(function() {var m = $(this).attr("id");
//				loadEachItineraryPage(m); }).appendTo($('#availableFiles'));
				fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "loadEachItineraryPage(this.id)" rel="external" id="'+idis[j-1]+'" >'+titles[j-1]+'</a>';
			}
			
			$("#availableFiles").html(fillhtml);
			createPageHeader(3);
			$.mobile.changePage($('#itinerarypage'), 'pop');
			$('#itinerarypage').trigger('pagecreate');
			$("#itinerarypageHeader").html(itineraryPageHeader);
			customHeader(3);
			$('#abtnTour3').addClass("active");
			$('#abtnPlaces3').removeClass("active");
			$('#abtnCurrentPosition3').removeClass("active");
			$('.options').css({'display':'none'});
//			document.getElementById('btnSaveChanges3').innerHTML= MyApp.resources.SaveChanges;
			document.getElementById('btnLocalBack').innerHTML= MyApp.resources.Back;
			document.getElementById('btnLoadfromportal').innerHTML= MyApp.resources.LoadFromPortal;
			var email = $('#emailaccountchange3').val();
			if ( email == null || email == ""){
				$('#emailaccountchange3').val(currentEmail);
				////console.log(currentEmail);
			}
		});
	});
}

function findItineraryPage(j){
	tourXmlName = itineraryFilename[j];
	loadEachItineraryPage(tourXmlName.split("_")[0], tourXmlName);
}

function backToItineraryPage()
{
	$.mobile.changePage($('#itinerarypage'), 'pop');
}

function loadFromPortal(email)
{
//	$('#abtnLoadSelected').addClass('ui-disabled');
	$( ".loading_gif" ).css( "display", "block" );
	db.transaction(function (tx) {
		//console.log("Dropping Table ITINERARIES");
		tx.executeSql('DROP TABLE IF EXISTS ITINERARIES');
		tx.executeSql('CREATE TABLE IF NOT EXISTS ITINERARIES (id, title, user, day, pointcode, pointname, coordinates, duration, isActive, completed)');
	});
	var divportal = document.getElementById('portalItineraries');
	divportal.innerHTML='';
	var fillhtml='';
	if (email!='')
	{
		currentEmail = email;
		saveEmail(email);
		$.ajax({
			url: baseapiurl+'/itinerary/GetByEmail/aaa?name='+email,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			type: "GET",
			data:"{}",
			success: function(data) {
				if(data != '')
				{
					$(jQuery.parseJSON(JSON.stringify(data))).each(function() { 
				         var ID = this.ItineraryId;
				         ////console.log("ID "+ID);
				         itinerariesId.push(ID);
					});
					createXmlDb();
				}
				else
				{
					$( ".loading_gif" ).css( "display", "none" );
					alert(MyApp.resources.AvailableInitiaries);
				}
			},
			error: function () {
				$( ".loading_gif" ).css( "display", "none" );
				alert(MyApp.resources.CouldNotLoadItineraries);
			}
		});
		saveEmail();
	}
	else
	{
		$( ".loading_gif" ).css( "display", "none" );
		alert(MyApp.resources.EmailValidator);
	}
}

function createXmlDb(){
	for (var l=0; l<itinerariesId.length ; l++){
		var r = itinerariesId[l];
		////console.log("createXMLDB " +r);
		$.ajax({
			url: baseapiurl+'/itinerary/'+ r,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			type: "GET",
			async: false,
			data:"{}",
			success: function(data) {
				var xmlFile;
				xmlFile = JSON.stringify(data);
				var o = xmlFile.indexOf("<?xml");
//				//console.log("o "+o);
				var n = xmlFile.indexOf('","Kmlfiles"');
//				//console.log("n "+n);
				xmlFile = xmlFile.substring(o,n); 
//				kmlFile2 = kmlFile2.substring(o+12, n);
//				xmlFile = xmlFile.substring(o+5,n+5);
				xmlFile = xmlFile.replace(/\\r\\n/g," ");
				xmlFile = xmlFile.replace(/\\/g,"");
				xmlFile = xmlFile.replace(/Title/g,"NewTitle");
				////console.log("createXMLDB12 " +r);
				//console.log(xmlFile);
				////console.log("start");
				var title;
				var user;
				var id;
				var pointCode;
				var pointName;
				var duration;
				var day;
				var coords;
//				popItinerariesDb3(xmlFile,r);
				title = $(xmlFile).find("It_NewTitle").text();
				user = $(xmlFile).find("User").text();
//				id = $(xmlDoc).find("Itinerary").attr("id");
				id = r;
//				//console.log("--1 "+id+user+title);
//				$(xmlFile).find("Point").each(function(){
//					pointCode = $(this).attr("Code");
//					day = $(this).parent().parent().attr("Kml");
////					//console.log("popItinerariesDB22 id "+id);
////					$(this).find('Title').each(function(){
//					pointName = $(this).text();
////					});
////					pointName = $(this).children().text();
//					duration = $(this).parent().parent().text().slice(0,10);
//					itActive = 0;
//					itCompleted = 0;
				db.transaction(function (tx) {
				$(xmlFile).find("Point").each(function(){
					day = $(this).parent().parent().attr("Kml");
					pointCode = $(this).attr("Code");
//					pointName = $(this).find("Title").text();
					pointName = $(this).find("NewTitle").text();
					coords = $(this).find("Coordinates").text();
					////console.log("Title: "+title);
					////console.log("1 "+duration);
					////console.log(pointName);
					duration = $(this).parent().parent().text().trim().slice(0,10);
					////console.log("2 "+duration);
//					$(this).find('Title').each(function(){
//						pointName = $(this).text();
//						//console.log(pointName);
//					});
//					alert(duration);
//					//console.log(pointName);
					itActive = 0;
					itCompleted = 0;
//						tx.executeSql('INSERT INTO XMLDB(id, xmlstring) VALUES (?,?)',[r,xmlFile], successCB, error12CB);
						////console.log("--- "+id+title+" "+user+" "+day+" "+pointCode+" "+pointName+" "+coords+" "+duration+" "+itActive+" "+itCompleted);
						tx.executeSql('INSERT INTO ITINERARIES(id, title, user, day, pointcode, pointname,coordinates, duration, isActive, completed) VALUES (?,?,?,?,?,?,?,?,?,?)'
								,[id,title,user,day,pointCode,pointName,coords,duration,itActive,itCompleted], successCB, error12CB);
					});
					////console.log("done");
				});
			},
			error: function () {
				alert(MyApp.resources.CouldNotGetFilesFromPortal);
			}
		});
	}
	getFilesFromPortal();
	////console.log("9999");
//	setTimeout(function(){
//	//console.log("4444");
//	},9000);
}

function checkXMLDB(){
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM XMLDB', [], function (tx, results){
			for (var k=0; k<results.rows.lenth; k++){
				////console.log(results.rows.item(k).id);
				////console.log(results.rows.item(k).xmlstring);
			}
		},error12CB);
	});
}

function loadXmlFromPortal(){
	setTimeout(function(){$('#portalItineraries input[type="checkbox"]:checked').each(function (i, el){
		getFilesFromPortal(el.name);
		}
	);},600);
	loadItineraries();
}

function getFilesFromPortal(id)
{
	for (var l=0; l<itinerariesId.length ; l++){
		////console.log("in getFilesFromPortal11111");
		var r = itinerariesId[l];
		$.ajax({
			url: baseapiurl+'/itinerary/'+ r,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			type: "GET",
			async: false,
			data:"{}",
			success: function(data) {
//				var xmlFile = data.Xmlfile;
				var kmlFile = data.Kmlfile;
				var filename = data.Itinerary.ItineraryTitle + "_" + data.Itinerary.ItineraryId + ".xml";
//				fileWrite(filename, xmlFile);
				for (i in data.Kmlfiles)
				{
					var kmlFile = data.Kmlfiles[i];
//					//console.log("kmlFile "+kmlFile.toString());
//					//console.log("kmlFile2 "+kmlFile.valueOf());
					var kmlFile2;
					kmlFile2 = JSON.stringify(kmlFile);
//					//console.log("json2.js1: "+kmlFile2);
					var o=kmlFile2.indexOf("mlconten");
//					//console.log("o "+o);
					var n=kmlFile2.indexOf("/kml>");
//					//console.log("n "+n);
//					kmlFile2 = kmlFile2.substring(o+12, n);
					kmlFile2 = kmlFile2.substring(o+12,n+5);
					kmlFile2 = kmlFile2.replace(/\\r\\n/g," ");
					kmlFile2 = kmlFile2.replace(/\\/g,"");
//					kmlFile2 = kmlFile2.replace(/\r/g," ");
//					//console.log("json2.js: "+kmlFile2);
					filename =  data.Kmlfiles[i].Kmlfilename;
					fileWrite(filename, kmlFile2);
				}
//				//console.log("123 "+xmlFile);
//				checkItDb();
//				popItinerariesDb3(xmlFile,id);
//				//console.log("345 "+kmlFile);
			},
			error: function () {
				alert(MyApp.resources.CouldNotGetFilesFromPortal);
			}
		});
	}
	$( ".loading_gif" ).css( "display", "none" );
	loadItineraries();
}

function checkItDb(){
	_itId = [];
	_itName = [];
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM ITINERARIES', [], function (tx, results){
			var len = results.rows.length;
			for (var k=0; k < len; k++){
				_itId.push(results.rows.item(k).id);
				_itName.push(results.rows.item(k).title);
				if (results.rows.item(k).id == id) {
					var x=k;
				}
			}
		});
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
//		alert("text: "+text);
		writer.write(text);
	};

	var onFSFail = function(error) {
		alert('error');
	};
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSWin, onFSFail);
}

function popItinerariesDb3(xmlDoc,id2){
	var title;
	var user;
	var id;
	var pointCode;
	var pointName;
	var duration;
	var day;
	var coords;
	////console.log("popItinerariesDB11");
	db.transaction(function(tx){
		title = $(xmlDoc).find("It_Title").text();
		user = $(xmlDoc).find("User").text();
//		id = $(xmlDoc).find("Itinerary").attr("id");
		id = id2;
//		//console.log("--1 "+id+user+title);
		$(xmlDoc).find("Point").each(function(){
//			day.push($(this).parent().parent().attr("Kml"));
			day = $(this).parent().parent().attr("Kml");
			////console.log("popItinerariesDB22");
//			pointCode.push(($(this).attr("Code")));
			pointCode = $(this).attr("Code");
//			pointName.push(($(this).text()));
			$(this).find('Title').each(function(){
				pointName = $(this).text();
			});
//			pointName = $(this).children().text();
//			duration.push(($(this).parent().parent().text()).slice(2,10));
//			//console.log("1 "+duration);
			duration = $(this).parent().parent().text().slice(0,10);
//			//console.log("2 "+duration);
			itActive = 0;
			itCompleted = 0;
//			//console.log("--- "+id+title+user+day+pointCode+pointName+coords+duration+itActive+itCompleted);
			tx.executeSql('INSERT INTO ITINERARIES(id, title, user, day, pointcode, pointname,coordinates, duration, isActive, completed) VALUES (?,?,?,?,?,?,?,?,?,?)'
					,[id,title,user,day,pointCode,pointName,coords,duration,itActive,itCompleted], successCB, error12CB);
		});
//		loadEachItineraryPage(id);
	});
}

function loadEachItineraryPage(id)
{
	//console.log("in loadEachItineraryPage");
	//console.log(id);
	id = id.trim();
	id = parseInt(id);
	//console.log(id);
	globalItId = id;
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM ITINERARIES', [], function (tx, results){
			var len = results.rows.length;
			for (var k=0; k < len; k++){
				if (results.rows.item(k).id == id) {
					var x=k;
				}
			}
			showAvailableDays(id);
		});
	});
}

function loadTourXml(id)
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

function showAvailableDays(id)
{
	var y=0;
	var duration = [];
	var day = [];
	var fillhtml ='';
	pointCode = [];
	pointName = [];
	itId = id;
	document.getElementById('divItineraryInfo').innerHTML = '';
	//$('#availablePois').text('');
	document.getElementById('availablePois').innerHTML='';
	$('#availableDays').text('');
	////console.log("in showAvailableDays");
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM ITINERARIES', [], function (tx, results) {
//			tx.executeSql('INSERT INTO ITINERARIES(id, title, user, day, pointcode, pointname,coordinates, duration, isActive, completed)
			var len = results.rows.length;
			for (var k=0; k < len; k++){
				if (results.rows.item(k).id == id) {
					day.push(results.rows.item(k).day);
					pointCode.push(results.rows.item(k).pointcode);
					pointName.push(results.rows.item(k).pointname);
				}
				duration.push(results.rows.item(k).duration);
			}
			for (var j=1 ; j < day.length ; j++){
				if (day[j] != day[j-1]){
					$('#availableDays').append('<input type="radio" class="days" name="day-choice" id="'
							+day[j-1]+'" value="'+day[j-1]+'"/><label for="'+day[j-1]+'">'+"Day "+day[j-1]+'</label>');
					////console.log("day[j-1] "+day[j-1]);
				}
			}
			$('#availableDays').append('<input type="radio" class="days" name="day-choice" id="'+day[j-1]+
					'" value="'+day[j-1]+'"/><label for="'+day[j-1]+'">'+"Day "+day[j-1]+'</label>');
			$(".days").click(function show(){
				dd = $(this).attr("id");
				var m = pointName.length;
				var temp = '';
				$('#availablePois').text('');
				for (var k=0; k < m; k++){
					if ((day[k] == dd) ){//&& (results.rows.item(k).id == id)){
						if (temp == ''){
							temp = pointName[k];
						}
						if (langstr == 'gr'){
							var poiName = pointName[k];
							var c = slideName.indexOf(poiName);
							var tempId = slideId[c];
							var tempCat = slideCat[c];
							for ( var l=0; l < slideIdgr.length ; l++){
								if ( (tempId == slideIdgr[l]) && (tempCat == slideCatgr[l]) ){
									fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo2(this.text)" rel="external" id="'
									+pointCode[k]+'" >'+slideNamegr[l]+'</a>';
									break;
								}
							}
//							var y=k;
						}
						else{
						fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo2(this.text)" rel="external" id="'
									+pointCode[k]+'" >'+pointName[k]+'</a>';
						}
//						$('<a href="#" input type="button" data-icon="arrow-r" data-iconpos="right"id="'
//								+pointCode[k]+'" >'
//								+pointName[k]+'</a>').click(function() {
//									var j = $(this).text();
////									loadCoordinates(j);
//									getMoreInfo2(j);
//									}).appendTo($('#availablePois'));
//						$('#availablePois').trigger('create');
						var y=k;
					}
				}
				
				document.getElementById('divItineraryInfo').innerHTML = "<p>"+ results.rows.item(y).title 
					+" | " +"Day " + dd + "</p>" + "<p>Duration: "+ duration[y] +"</p>";
//				$('#'+$(this).attr("Code")+'').attr("checked",false).checkboxradio("refresh");
				startPoint = temp;
				temp = '';
				console.log(startPoint);
			}).first().click();
//			$("#btnCallMap").click(function(){
//				//console.log("btnCallMap clicked");
//				inGetDirections = true;
//				geolocationControl(HelloWorldFunction);
//			});
			$("#availablePois").html(fillhtml);
			createPageHeader(4);
			$.mobile.changePage($('#eachitinerarypage'), 'pop');
			$('#eachitinerarypage').trigger('pagecreate');
			customHeader(4);
		    $('#abtnTour4').addClass("active");
		    $('#abtnPlaces4').removeClass("active");
		    $('#abtnCurrentPosition4').removeClass("active");
//		    $('#abtnExit4').removeClass("active");
			$('#availablePois').trigger('create');
			$('#availableDays').trigger('create');
//			document.getElementById('btnSaveChanges4').innerHTML= MyApp.resources.SaveChanges;
			document.getElementById('btnLoad').innerHTML= MyApp.resources.Load;
			document.getElementById('btnEachItineraryBack').innerHTML= MyApp.resources.Back;
			var email = $('#emailaccountchange4').val();
			if ( email == null || email == ""){
				$('#emailaccountchange4').val(currentEmail);
				////console.log(currentEmail);
			}
		});
	});
}

function loadCoordinates(k)
{
	var x = k.indexOf('|');
	var y = k.indexOf(',');
	var z = k.indexOf(',0');
	var long = k.slice(x+1,y);
	var lat = k.slice(y+1,z);
	//////console.log("lat: "+lat);
	//////console.log("long: "+long);
	fromLoadCoords = true;
//	geolocationControl(HelloWorldFunction);
	getDirections(lat,long);
}

function checkSettingsDB(){
	var msg;
	var dbtext = '';
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM SETTINGS', [], function (tx, results) {
			var len = results.rows.length, i;
			for (i = 0; i < len; i++){
//				dbtext = dbtext + 'pointsDb['+i+']: !';
//				placesVisited.push(results.rows.item(i).id);
//				dbtext = dbtext + placesVisited[i]; 
//				dbtext = dbtext +", ";
//				ifVisited.push(results.rows.item(i).visited);
//				dbtext = dbtext + ifVisited[i];
//				dbtext = dbtext + '\n';
//				alert('pointsDb['+i+']: '+placesVisited[i]+", "+ifVisited[i]);
				////console.log(results.rows.item(i).data);
			}
//			alert(dbtext);
		}, errorCB);
	});
}

function onClickSettings(){
//Options Settings
	var appopts = $('.app_options');
	var opts = $('.options');
	//var settings = opts.next();
	console.log("in onClickSettings");
	if(appopts.hasClass('no_active')){
		appopts.removeClass('no_active');
		////console.log("inactive");
		console.log("in onClickSettings slideDown");
		opts.slideDown();
	}
	else {
		////console.log("active");
		appopts.addClass('no_active');
		console.log("in onClickSettings slideUp");
		opts.slideUp();
	}
}

clearControl = function(clearAllMarkers){
	var control = new (L.Control.extend({
	    options: { position: 'bottomleft' },
	    onAdd: function (map) {
	        controlDiv = L.DomUtil.create('div', 'geolocation-button');
	        L.DomEvent
//	            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
//	            .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
	            .addListener(controlDiv, 'click', this.clearMap);
	        // Set CSS for the control border
	        var controlUI = L.DomUtil.create('div', 'clearmap-button', controlDiv);
	        controlUI.title = 'Places near me';
	        // Set CSS for the control interior
	        var controlText = L.DomUtil.create('div', 'clearmap-button', controlUI);
	        controlText.innerHTML = '<img src="images/app_option_bg.png" width="40" height="40" />';
	        return controlDiv;
	    }
	    }));
	    control.clearMap = clearAllMarkers;
	    return control;
};

function clearMap(){
	//console.log("888");
	onClickbtnFilterPlaces();
}

geolocationControl = function(theHelloWorldFunction) {
    var control = new (L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function (map) {
        controlDiv = L.DomUtil.create('div', 'geolocation-button');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
            .addListener(controlDiv, 'click', this.HelloWorldFunction);

        // Set CSS for the control border
        var controlUI = L.DomUtil.create('div', 'geolocation-button', controlDiv);
        controlUI.title = 'Click for Hello World!';

        // Set CSS for the control interior
        var controlText = L.DomUtil.create('div', 'geolocation-button', controlUI);
        controlText.innerHTML = '<img src="images/position.png" width="40" height="40" />';
        
        return controlDiv;
    }
    }));
    control.HelloWorldFunction = theHelloWorldFunction;
    return control;
};

HelloWorldFunction = function () {
	if (watchID != null) {
		navigator.geolocation.clearWatch(watchID);
		watchID = null;
		////console.log("geolocation terminated");    
	}
	else{
		var options = { timeout: 20000, enableHighAccuracy: true };
		watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
//		watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError,{frequency:5000,maximumAge: 0, enableHighAccuracy:true});
		//console.log("geolocation activated");
	}
};

function SetElementHeight(){
	screenHeight=$('.ui-mobile').outerHeight(true);
	screenWidth=$('.ui-mobile').outerWidth(true);
	////console.log("outerHeight= "+ screenHeight);
	////console.log("outerWidth= "+ screenWidth);
	$('#map').css('height',screenHeight-125);
	$('#map').css('width',screenWidth);
}
	$(window).bind('orientationchange resize', function(event,ui){
	 SetElementHeight();
	});

function getDirections(x,y)
{
//	//console.log("inGetDirections");
//	//console.log("x: "+x);
//	//console.log("y: "+y);
	if (isOffline){
		alert(MyApp.resources.UserMustBeOnLine);
	}
	else{
		var url = 'http://maps.google.com/maps?saddr=';
//		currentLat;
//		var currentLong;
		if (currentLat==undefined) {
		    currentLat = '36.809098';
		}
		if (currentLong==undefined) {
		    currentLong = '27.102059';
		}url += currentLat+','+currentLong;// start point
//		url += '36.809098,27.102059'; 
		url += '&daddr='+x+','+y; // end point
//	    window.location = url;
//		var currentLat;
//		var currentLong;
		var ref = window.open(url, '_blank', 'location=no');
	}
}

function getMoreInfo2(poiName){
	var k;
	poiName = poiName.trim();
	if (langstr == 'en'){
		var c = slideName.indexOf(poiName);
//		for (var c =0; c < slideId.length ; c++){
//		////console.log("inslideen222"+slideName[c]);
//		if (poiName == slideName[c]){
		////console.log("inslideen333");
		slideen(slideName[c], slideDescr[c], slideWebsite[c], slideAddress[c], slidePlace[c], 
				slidePhone[c], slideEmail[c], slideImage[c]);
	}
	else{
		////console.log("..."+slideId.length);
//		for (var c =0; c < slideId.length ; c++){
////		//console.log("inslideen222"+slideNamegr[c]);
//		if (poiName == slideName[c]){
		////console.log("inslideen333");
		var c = slideNamegr.indexOf(poiName);
		slidegr(slideNamegr[c], slideDescrgr[c], slideWebsitegr[c], slideAddressgr[c], slidePlacegr[c], 
				slidePhonegr[c], slideEmailgr[c], slideImage[c]);
	}
}

function getMoreInfo3(poiName){
	var k;
//	console.log("getMoreInfo3 "+poiName);
	poiName = poiName.trim();
	var k = poiName.indexOf("\n");
	poiName = poiName.slice(0,k);
	poiName = poiName.trim();
//	console.log(poiName);
	if (langstr == 'en'){
		var c = slideName.indexOf(poiName);
		//console.log("inslideen333");
//		slideen3(slideName[c], slideDescr[c], slideWebsite[c], slideAddress[c], slidePlace[c], 
//				slidePhone[c], slideEmail[c], slideImage[c]);
		slideen(slideName[c], slideDescr[c], slideWebsite[c], slideAddress[c], slidePlace[c], 
				slidePhone[c], slideEmail[c], slideImage[c]);
	}
	else{
		var c = slideNamegr.indexOf(poiName);
		//console.log("inslideen333");
//		slidegr3(slideNamegr[c], slideDescrgr[c], slideWebsitegr[c], slideAddressgr[c], slidePlacegr[c], 
//				slidePhonegr[c], slideEmailgr[c], slideImage[c]);
		slidegr(slideNamegr[c], slideDescrgr[c], slideWebsitegr[c], slideAddressgr[c], slidePlacegr[c], 
				slidePhonegr[c], slideEmailgr[c], slideImage[c]);
	}
}

function getMoreInfo(poiid, categid)
{
	if (langstr == 'en'){
		for (var b =0; b < slideId.length ; b++){
			if ((poiid == slideId[b]) && (categid == slideCat[b])){
				//console.log("FOUND");
				//console.log(slideDescr[b]);
				slideen(slideName[b], slideDescr[b], slideWebsite[b], slideAddress[b], slidePlace[b], 
						slidePhone[b], slideEmail[b], slideImage[b]);
				break;
			}
		}
	}
	else{
		for (var b =0; b < slideId.length ; b++){
			if ((poiid == slideIdgr[b]) && (categid == slideCatgr[b])){
				slidegr(slideNamegr[b], slideDescrgr[b], slideWebsitegr[b], slideAddressgr[b], slidePlacegr[b], 
						slidePhonegr[b], slideEmailgr[b], slideImagegr[b]);
				break;
			}
		}
	}
}

function errorCCB(err){
	//console.log("error errorCCB ");
}

function slideen(name, descr, web, add, place, phone, email, img)
{
	var fillhtml ='';
	if ( descr.indexOf('<div class="360cities"') != -1){
		var k = descr.indexOf('<div class="360cities"');
		var l = descr.indexOf('</div>');
		var m = descr.slice(0,k);
		var n = descr.slice(l,-1);
		descr = m.concat(n);
	}
	fillhtml = '<span class="pointtitle">'+name+'</span><br>';
	if (!isOffline){
		fillhtml += img+'<br>';
	}
	fillhtml += descr+'<br>' +'<b>'+MyApp.resources.Website+': </b>'+web+'<br>' +'<b>'+MyApp.resources.Address+': </b>'
	+add+'<br>'	+'<b>'+MyApp.resources.Place+': </b>'+place+'<br>' +'<b>'+MyApp.resources.Phone+': </b>'
	+phone+'<br>'+'<b>email: </b>' +email+ '<br>';
	fillhtml += '<div class="button blue small"><a href="#" onClick = "slideBack();"><span id="btnSlideBack">'+
	MyApp.resources.Hide+'</span></a></div>';
//	$("#inner").html(fillhtml);
//	console.log("inSlide "+img);
//	//console.log("inSlide "+fillhtml);
//	$( ".inner_wrap" ).css( "display", "block" );
	$("#detailscontent").html(fillhtml);
	$.mobile.changePage($('#details'));
}

function slidegr(name, descr, web, add, place, phone, email,img)
{
	var fillhtml ='';
	if ( descr.indexOf('<div class="360cities"') != -1){
		var k = descr.indexOf('<div class="360cities"');
		var l = descr.indexOf('</div></div>');
		var m = descr.slice(0,k);
		var n = descr.slice(l,-7);
		descr = m.concat(n);
	}
//	console.log("2222 "+descr);
	fillhtml = '<span class="pointtitle">'+name+'</span><br>';
	if (!isOffline){
		fillhtml += img+'<br>';
	}
	fillhtml += descr+'<br>' +'<b>'+MyApp.resources.Website+': </b>'+web+'<br>' +'<b>'+MyApp.resources.Address+': </b>'+add+'<br>' +'<b>'+MyApp.resources.Place+': </b>'
	+place+'<br>' +'<b>'+MyApp.resources.Phone+': </b>'+phone+'<br>'+'<b>email: </b>' +email + '<br>';
	fillhtml += '<div class="button blue small"><a href="#" onClick = "slideBack();" data-rel="back"><span id="btnSlideBack">'+
	MyApp.resources.Hide+'</span></a></div>';
	$("#detailscontent").html(fillhtml);
	$.mobile.changePage($('#details'));
}

function slideBack()
{
	console.log("in SlideBack");
//	if ($.mobile.activePage.is('#details')){
//	console.log(globalI);
//	orderPlaces(globalI);
//	}
//	else{
	if (typeof (navigator.app) != "undefined") {
		console.log("in SlideBack1");
//		history.go(-1);
//		navigator.app.backHistory();
//		orderPlaces(0);
		window.history.back();
	} else {
		console.log("in SlideBack2");
//		window.history.back();
		history.go(-1);
	}
}
//}

function clearWatch() {
	//console.log("in clearWatch");
    if (watchID != null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
    }
}

function loadURL(url){
    navigator.app.loadUrl(url, { openExternal:true });
    return false;
}

function exitApplication()
{
	var r=confirm(MyApp.resources.ExitApp);
	if (r==true){
		if(navigator.app)
		{
			navigator.app.exitApp();
		}
		else if(navigator.device)
		{
			navigator.device.exitApp();
		}
	}
}

function clearCache(){
	db.transaction(function (tx) {
		tx.executeSql('DROP TABLE IF EXISTS SETTINGS');
		tx.executeSql('DROP TABLE IF EXISTS CATEGORIESEN');
		tx.executeSql('DROP TABLE IF EXISTS CATEGORIESGR');
		tx.executeSql('DROP TABLE IF EXISTS SUBCATEGORIESEN');
		tx.executeSql('DROP TABLE IF EXISTS SUBCATEGORIESGR');
		tx.executeSql('DROP TABLE IF EXISTS POIEN');
		tx.executeSql('DROP TABLE IF EXISTS POIGR');
		tx.executeSql('DROP TABLE IF EXISTS TIMESTAMP');
		tx.executeSql('DROP TABLE IF EXISTS TEMP');
		tx.executeSql('DROP TABLE IF EXISTS ITINERARIES');
	});
}

function orderPlaces(i)
{
//	if (isOffline){
	reOrdered = false;
	fromOrderPlaces = true;
	var fillhtml = '';
	var fillHeader= '<img src="images/info_icon.png" style="float:left;"><span>'+MyApp.resources.orderPlacesHeader+'<p></span>';
	//console.log("inOrderPlaces");
	document.getElementById('orderedPlaces').innerHTML='';
	document.getElementById('showingInfo').innerHTML='';
	for (i; i < markerName.length; i++){
		var categ = $.trim(markerCat[i]);
		if (categ.indexOf("8_") == -1 ){
			categ = categ.slice(0,1);
			//console.log(categ);		
		}
		switch (categ)
		{
		case "1":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/shopping_0.png" alt="options">'+"  "+markerName[i]+'<br><h6>'+markerPlace[i]+'</h6></a>';
			break;
		case "2":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list2_0.png" alt="options">'+"  "+markerName[i]+' <br><h6> '+markerPlace[i]+' | '+markerSSubCat[i]+'</h6></a>';
			break;
		case "3":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/hotels.png" alt="options">'+"  "+markerName[i]+' <br><h6> '+markerPlace[i]+' | '+markerSSubCat[i]+'</h6></a>';
			break;
		case "4":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list14_0.png" alt="options">'+"  "+markerName[i]+' <br><h6> '+markerPlace[i]+'</h6></a>';
			break;
		case "5":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list15_1.png" alt="options">'+"  "+markerName[i]+' <br><h6> '+markerPlace[i]+'</h6></a>';
			break;
		case "6":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list3_0.png" alt="options">'+"  "+markerName[i]+' <br><h6> '+markerPlace[i]+'</h6></a>';
			break;
		case "7":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list12_0.png" alt="options">'+"  "+markerName[i]+' <br><h6> '+markerPlace[i]+' | '+markerSSubCat[i]+'</h6></a>';
			break;
		case "8_1":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list15_0.png" alt="options">'+"  "+markerName[i]+' <br><h6> '+markerPlace[i]+'</h6></a>';
			break;
		case "8_2":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list15_1.png" alt="options">'+"  "+markerName[i]+' <br><h6> '+markerPlace[i]+'</h6></a>';
			break;
		case "8_3":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list15_2.png" alt="options">'+"  "+markerName[i]+' <br><h6> '+markerPlace[i]+'</h6></a>';
			break;
		case "8_4":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list15_3.png" alt="options">'+"  "+markerName[i]+' <br><h6> '+markerPlace[i]+'</h6></a>';
			break;
		case "8_5":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list15_4.png" alt="options">'+"  "+markerName[i]+' <br><h6> '+markerPlace[i]+'</h6></a>';
			break;
		case "8_6":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list15_5.png" alt="options">'+"  "+markerName[i]+'<br><h6>  '+markerPlace[i]+'</h6></a>';
			break;
		case "8_7":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list15_6.png" alt="options">'+"  "+markerName[i]+' <br><h6> '+markerPlace[i]+'</h6></a>';
			break;
		case "8_8":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list15_7.png" alt="options">'+"  "+markerName[i]+'<br><h6>'+markerPlace[i]+'</h6></a>';
			break;
		case "8_9":
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list15_8.png" alt="options">'+"  "+markerName[i]+' <br><h6>'+markerPlace[i]+'</h6></a>';
			break;
		default:
			fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "getMoreInfo3(this.text)" rel="external" id="'
						+i+'" ><img src="images/list15_1.png" alt="options">'+"  "+markerName[i]+' <br></h6>'+markerPlace[i]+'</h6></a>';
		}
		if (i == 50){
			fillhtml += '<div class="button blue small"><a href="#" onClick = "orderPlaces(51);"><span id="btnNext">'+
						MyApp.resources.Next+'</span></a></div>';
			break;
		}
		else if (i == 100){
			fillhtml += '<div class="button blue small"><a href="#" onClick = "orderPlaces(101);"><span id="btnNext">'+
						MyApp.resources.Next+'</span></a></div>';
			break;
		}
		else if (i == 150){
			fillhtml += '<div class="button blue small"><a href="#" onClick = "orderPlaces(151);"><span id="btnNext">'+
						MyApp.resources.Next+'</span></a></div>';
			break;
		}
		else if (i == 200){
			fillhtml += '<div class="button blue small"><a href="#" onClick = "orderPlaces(201);"><span id="btnNext">'+
						MyApp.resources.Next+'</span></a></div>';
			break;
		}
	}
	globalI = i;
	createPageHeader(6);
	$.mobile.changePage($('#orderplaces'), 'pop');
	customHeader(6);
	checkForLanguage();
	document.getElementById('showingInfo').innerHTML= MyApp.resources.Showing + i + MyApp.resources.From + markerName.length;
	$("#orderplacesHeader").html(fillHeader);
	$('#abtnTour6').removeClass("active");
	$('#abtnCurrentPosition6').removeClass("active");
	$('#abtnPlaces6').addClass("active");
	$('#abtnMap2').removeClass("active");
	$('#abtnList2').addClass("active");
	$('#abtnFilter2').removeClass("active");
	$('.options').css({'display':'none'});
//	document.getElementById('btnSaveChanges6').innerHTML= MyApp.resources.SaveChanges;
//	document.getElementById('btnPortalBack2').innerHTML= MyApp.resources.Back;
	var email = $('#emailaccountchange5').val();
	if (currentEmail != 'undefined' || currentEmail != '') {
		if (email == null || email == ""){
			$('#emailaccountchange5').val(currentEmail);
		}
	}
	$("#orderedPlaces").html(fillhtml);
	$('#orderedPlaces').trigger('create');
	document.getElementById('btnList2').innerHTML= MyApp.resources.List;
	document.getElementById('btnMap2').innerHTML= MyApp.resources.Map;
	document.getElementById('btnFilter2').innerHTML= MyApp.resources.Filter;
}

function readSlider(){
	var options = { timeout: 20000, enableHighAccuracy: true };
	watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
//	reOrdered = true;
//	$( ".loading_gif" ).css( "display", "block" );
//	var fillhtml = '';
//	document.getElementById('orderedPlaces').innerHTML='';
//	document.getElementById('showingInfo').innerHTML='';
//	tempmarkerCat = [],	tempmarkerName = [], tempmarkerDescr = [], tempmarkerLong =[], tempmarkerLat = [];
//	//console.log("inReadSlider");
//	var radius = $("#slider-fill").val();
//	//console.log("adadsa "+$("#slider-fill").val());
//	for (var i=0; i<markerName.length; i++){
//		reOrder(radius, markerLat[i], markerLong[i], markerCat[i], markerName[i], markerDescr[i] );
//	}
//	for (var j=0; j<tempmarkerName.length; j++){
//		fillhtml += '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick = "" rel="external" id="'+j+'" >'+tempmarkerName[j]+'</a>';
//		if (j == 30){
//			break;
//		}
//	}
//	document.getElementById('showingInfo').innerHTML= MyApp.resources.Showing + j + MyApp.resources.From + tempmarkerName.length;
//	$( ".loading_gif" ).css( "display", "none" );
//	$("#orderedPlaces").html(fillhtml);
//	$('#orderedPlaces').trigger('create');
}

function showOrderedPlacesOnMap(){
	$( ".loading_gif" ).css( "display", "block" );
	var descr;
	fromOrderPlaces = false;
	if (reOrdered){
		if (currentMarkers != null)
		{
			for(var i = 0; i < currentMarkers.length; ++i){
				map.removeLayer(currentMarkers[i]);
			}
			currentMarkers = [];
		}
		for (var j=0; j<tempmarkerName.length; j++){
			addGroupMarker(tempmarkerLat[j], tempmarkerLong[j], tempmarkerName[j], tempmarkerDescr[j], 
							tempmarkerCat[j], tempmarkerPlace[j], tempmarkerSScat[j], tempmarkerPoiid[j], 0);
		}
	}
	else{
		if (currentMarkers != null)// && (firstTime == false))
		{
			//console.log("in here!");
			for(var i = 0; i < currentMarkers.length; ++i){
				map.addLayer(currentMarkers[i]);
				//console.log("in here2!");
				//console.log("Current marker "+currentMarkers[i]);
			}
		}
	}
	$( ".loading_gif" ).css( "display", "none" );
	$.mobile.changePage($('#mainpage'), 'pop');
	$('#map').css('height',screenHeight-125);
	$('#abtnPlaces').addClass("active");
	$("#abtnFilterTour").hide();
	$("#abtnFilterPlaces").show();
	$('#abtnPlaces').addClass("active");
    $('#abtnList').removeClass("active");
    $('#abtnMap').addClass("active");
	setTimeout(function(){
		map.invalidateSize();
	},2500);
	setLabelsForMainPage();
	$('.options').css({'display':'none'});
}

function reOrder(radius,x,y, cat, name, descr, place, sscat){
	//console.log("in reOrder");
//	currentLat = position.coords.latitude;
	//currentLat = 36.87636;
	//currentLong = 27.20536;
//	currentLong = position.coords.longitude;
	var dist = distance(currentLat, currentLong,x,y);
	console.log("distance "+dist);
	if (dist < radius){
		tempmarkerCat.push(cat);
		tempmarkerName.push(name);
		tempmarkerDescr.push(descr);
		tempmarkerLat.push(x);
		tempmarkerLong.push(y);
		tempmarkerPlace.push(place);
		tempmarkerSScat.push(sscat);
	}
}

function reloadOrderPlaces(){
	var newLanguage = $("#language_select6").val();
	var newEmail =  $("#emailaccountchange6").val();
	var newlangstr = $("#language_select6").val();
	var settingsChanged = false;
	langstr = newlangstr.toLowerCase();
	fromselectedplaces = false;
	if (language != newLanguage)
	{
		language = newLanguage;
		langchanged = true;
		//console.log(language);
		db.transaction(function(tx) {
			tx.executeSql('UPDATE SETTINGS SET DATA = ? WHERE ID= ?',[language,1]);
		});
		settingsChanged = true;
	}
	var email = $('#emailaccountchange6').val();
	if ( email != null && email != ''){
		$('#emailaccountchange6').val(currentEmail);
	}
	saveEmail(newEmail);
	checkForLanguage();
	orderPlaces(0);
}

function reloadFilteredPlaces(){
	var newLanguage = $("#language_select7").val();
	var newEmail =  $("#emailaccountchange7").val();
	var newlangstr = $("#language_select7").val();
	var settingsChanged = false;
	langstr = newlangstr.toLowerCase();
	fromselectedplaces = false;
	if (language != newLanguage)
	{
		language = newLanguage;
		langchanged = true;
		//console.log(language);
		db.transaction(function(tx) {
			tx.executeSql('UPDATE SETTINGS SET DATA = ? WHERE ID= ?',[language,1]);
		});
		settingsChanged = true;
	}
	var email = $('#emailaccountchange6').val();
	if ( email != null && email != ''){
		$('#emailaccountchange6').val(currentEmail);
	}
	saveEmail(newEmail);
	checkForLanguage();
	showFilterCategories();
}

function backToMap(){
	navigator.app.backHistory();
}

function distance(lat1,lon1,lat2,lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1);
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI/180);
}

function showFilterCategories(q){
	var g;
	var initHtml='';
	var fillhtml ='';
	$("#hotelContent").html(initHtml);
	$("#restaurantContent").html(initHtml);
	$("#archaiologicalContent").html(initHtml);
	$("#musicContent").html(initHtml);
	var hotelHtml='';
	var restaurantHtml='';
	var eraHtml='';
	var musicHtml='';
	var placeHtml='';
	placeHtml = '<fieldset data-role="controlgroup"><legend>' + MyApp.resources.PlacePoi+'</legend>';
	placeHtml +='<div data-role="fieldcontain"><label for="place_select" id="placeselect"></label><select name="place_select" id="place_select">';
	placeHtml += '<option value="-1">'+MyApp.resources.WholeIsland+'</option>';
	if (langstr == 'gr'){
		for (g=0; g<placeGr.length; g++){
			placeHtml += '<option value="'+g+'">'+placeGr[g]+'</option>';
		}
		placeHtml += '</select></div><br>';
	} else {
		for (g=0; g<placeEn.length; g++){
			placeHtml += '<option value="'+g+'">'+placeEn[g]+'</option>';
		}
		placeHtml += '</select></div><br>';
	}
	if (hotel == true){
		hotelHtml = '<fieldset data-role="controlgroup"><legend>' + MyApp.resources.HotelStars+'</legend>';
		hotelHtml += '<div data-role="fieldcontain"><label for="hotel_select" id="hotelselect"></label><select name="hotel_select" id="hotel_select">';
		hotelHtml += '<option value="-1">'+MyApp.resources.ShowAll+'</option>';
		hotelHtml += '<option value="1">1 '+MyApp.resources.Stars+'</option>';
		hotelHtml += '<option value="2">2 '+MyApp.resources.Stars+'</option>';
		hotelHtml += '<option value="3">3 '+MyApp.resources.Stars+'</option>';
		hotelHtml += '<option value="4">4 '+MyApp.resources.Stars+'</option>';
		hotelHtml += '<option value="5">5 '+MyApp.resources.Stars+'</option>';
		hotelHtml += '</select></div><br>';
	}
	if (cuisine == true){
		restaurantHtml = '<fieldset data-role="controlgroup"><legend>' + MyApp.resources.RestaurantCuisine+'</legend>';
		restaurantHtml +='<div data-role="fieldcontain"><label for="cuisine_select" id="cuisineselect"></label><select name="cuisine_select" id="cuisine_select">';
		restaurantHtml += '<option value="-1">'+MyApp.resources.ShowAll+'</option>';
		if (langstr == 'gr'){
//		    restaurantHtml += '<option value="-1" selected="selected">Ξ�Ξ»ΞµΟ‚</option>';
			for (g=0; g<cuisineGr.length; g++){
				restaurantHtml += '<option value="'+g+'">'+cuisineGr[g]+'</option>';
			}
			restaurantHtml += '</select></div><br>';
		}
		else{
//		    restaurantHtml += '<option value="-1" selected="selected">All</option>';
			for (g=0; g<cuisineEn.length; g++){
				restaurantHtml += '<option value="'+g+'">'+cuisineEn[g]+'</option>';
			}
			restaurantHtml += '</select></div><br>';
		}
	}
	if (era == true){
		eraHtml = '<fieldset data-role="controlgroup"><legend>' + MyApp.resources.ArchaiologicalEra+'</legend>';
		eraHtml +='<div data-role="fieldcontain"><label for="era_select" id="eraselect"></label><select name="era_select" id="era_select">';
		eraHtml += '<option value="-1">'+MyApp.resources.ShowAll+'</option>';
		if (langstr == 'gr'){
			for (g=0; g<eraGr.length; g++){
				eraHtml += '<option value="'+g+'">'+eraGr[g]+'</option>';
			}
			eraHtml += '</select></div><br>';
		}
		else{
//		    eraHtml += '<option value="-1" selected="selected">All</option>';
			for (g=0; g<eraEn.length; g++){
				eraHtml += '<option value="'+g+'">'+eraEn[g]+'</option>';
			}
			eraHtml += '</select></div><br>';
		}
//		$("#archaiologicalContent").html(eraHtml);
	}
	if (music == true){
		musicHtml = '<fieldset data-role="controlgroup"><legend>'+MyApp.resources.NightClubMusic+'</legend>';
		musicHtml +='<div data-role="fieldcontain"><label for="music_select" id="musicelect"></label><select name="music_select" id="music_select">';
		musicHtml += '<option value="-1">'+MyApp.resources.ShowAll+'</option>';
		if (langstr == 'gr'){
			for (g=0; g<musicGr.length; g++){
				musicHtml += '<option value="'+g+'">'+musicGr[g]+'</option>';
			}
			musicHtml += '</select></div>';
		}
		else{
			for (g=0; g<musicEn.length; g++){
				//console.log(musicEn[g]);
				musicHtml += '<option value="'+g+'">'+musicEn[g]+'</option>';
			}
			musicHtml += '</select></div>';
		}
	}
	fillhtml  = '<img src="images/info_icon.png" style="float:left;"><h2>'+MyApp.resources.SearchPopUpHeader+'</h2>';
	fillhtml += '<p></p>';
	fillhtml += '<div data-role="fieldcontain" ><label for="searchbox" id="searchbox">'+MyApp.resources.FreeTextSearchLabel+'</label>';
	fillhtml += '<input type="text" value="" name="search_box" id="search_box" placeholder="" /></div><br>';
	fillhtml += placeHtml;
	fillhtml += hotelHtml;
	fillhtml += restaurantHtml;
	fillhtml += eraHtml;
	fillhtml += musicHtml;
	fillhtml += '<div class="button blue small"><a href="#" onClick = "filterPlaces();"><span id="btnSlideBack">'+
				MyApp.resources.Apply+'</span></a></div>';
	fillhtml += '<div class="button blue small"><a href="#" onClick = "cancel();"><span id="btnSlideBack">'+
				MyApp.resources.Cancel+'</span></a></div>';
	createPageHeader(7);
	$.mobile.changePage($('#filterplaces'), 'pop');
	customHeader(7);
	checkForLanguage();
//	$("#orderplacesHeader").html(fillHeader);
	$('#abtnTour7').removeClass("active");
	$('#abtnCurrentPosition7').removeClass("active");
	$('#abtnPlaces7').addClass("active");
	$('#abtnMap3').removeClass("active");
	$('#abtnList3').removeClass("active");
	$('#abtnFilter3').addClass("active");
	$('.options').css({'display':'none'});
	var email = $('#emailaccountchange7').val();
	if (currentEmail != 'undefined' || currentEmail != '') {
		if (email == null || email == ""){
			$('#emailaccountchange7').val(currentEmail);
		}
	}
	$("#filteredPlaces").html(fillhtml);
	if (placeHtmlId != -2){
		$("#place_select").val(placeHtmlId);
	}
	if ((hotelHtmlId != -2) && (hotel == true)){
		$("#hotel_select").val(hotelHtmlId);
	}
	if ((restaurantHtmlId != -2) && (cuisine == true)){
//		console.log(restaurantHtmlId);
		$("#cuisine_select").val(restaurantHtmlId);
	}
	if ((eraHtmlId != -2) && (era == true)){
//		console.log(eraHtmlId);
		$("#era_select").val(eraHtmlId);
	}
	if ((musicHtmlId != -2) && (music == true)){
//		console.log(musicHtmlId);
		$("#music_select").val(musicHtmlId);
	}
	$('#filterplaces').trigger('create');
	document.getElementById('btnList3').innerHTML= MyApp.resources.List;
	document.getElementById('btnMap3').innerHTML= MyApp.resources.Map;
	document.getElementById('btnFilter3').innerHTML= MyApp.resources.Filter;
}

function cancel(){
    $('#abtnTour').removeClass("active");
	$("#abtnFilterTour").hide();
	$("#abtnFilterPlaces").show();
	$('#abtnPlaces').addClass("active");
    $('#abtnList').removeClass("active");
    $('#abtnMap').addClass("active");
	setTimeout(function(){
		map.invalidateSize();
//		if ((panToLong != 0) && (panToLat != 0)){
//			map.panTo([panToLat,panToLong]);
//		}
	},2500);
    $.mobile.changePage($('#mainpage'), 'pop');
    $('#map').css('height',screenHeight-125);
}

function filterPlaces(x){
	tempmarkerCat = [], tempmarkerName = [], tempmarkerDescr = [], tempmarkerLong = [], tempmarkerLat = [];
	tempmarkerPoiid = [], tempmarkerPlace = [], tempmarkerSScat = [];
	$( ".loading_gif" ).css( "display", "block" );
	if (currentMarkers != null)
	{
		for(var i = 0; i < currentMarkers.length; ++i){
			map.removeLayer(currentMarkers[i]);
		}
//		currentMarkers = [];
	}
	// radius filter
	var radius = $("#slider-fill").val();
//	if (radius != 40){
//		readSlider();
//	}
	var text = $('#search_box').val();
//	console.log("text: "+ text);
	var poiDB = (langstr == 'en') ? "POIEN" : "POIGR";
	var newHotelFilter = '';
	var newCuisineSelect = '';
	var newEraSelect = '';
	var newMusicSelect = '';
	var newPlaceSelect = '';
	userFilters.place = $("#place_select").val();
//	console.log("place "+userFilters.place);
	
	placeHtmlId = $("#place_select").val();
	if (hotel == true){
		userFilters.hotel = $("#hotel_select").val();
		hotelHtmlId = $("#hotel_select").val();
//		console.log(hotelHtmlId);
	}
	if (cuisine == true){
		if ($("#cuisine_select").val() == -1){
			userFilters.cuisine = $("#cuisine_select").val();
		}
		else{
			userFilters.cuisine = cuisineGr[$("#cuisine_select").val()];
		}
		restaurantHtmlId = $("#cuisine_select").val();
//		console.log(userFilters.cuisine);
	}
	if (era == true){
		if ($("#era_select").val() == -1){
			userFilters.era = $("#era_select").val();
		}
		else{
			userFilters.era = eraGr[$("#era_select").val()];
		}
		eraHtmlId = $("#era_select").val();
//		console.log(userFilters.era);
	}
	if (music == true){
		if ($("#music_select").val() == -1){
			userFilters.music = $("#music_select").val();
		}
		else{
			userFilters.music = musicGr[$("#music_select").val()];
		}
		musicHtmlId = $("#music_select").val();
//		console.log(userFilters.music);
	}
	if (userFilters.hotel == -1){
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM '+poiDB+' WHERE subcategory=?', ["3_1"], function (tx, results) {
				var len = results.rows.length;
//				console.log(len);
				for (var j=0; j<len; j++){
//					console.log("in Select1 "+j);
					var poiid = results.rows.item(j).siteid;
					var poicat = results.rows.item(j).category;
					var x = results.rows.item(j).lat;
					var y = results.rows.item(j).long;
					x = x.replace(x.charAt(2), ".");
					y = y.replace(y.charAt(2), ".");
					if (x < 35){
						var temp = x;
						x = y;
						y = temp;
					}
					lat2 = results.rows.item(j).lat;
					if ( lat2.indexOf("\n") == -1){
						addTempMarker(x, y, results.rows.item(j).name, results.rows.item(j).descr, poicat, poiid, 
										results.rows.item(j).place, results.rows.item(j).ssubcat);
					}
				}
			}, errorCB);
		});
	}
	if (userFilters.cuisine == -1){
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM '+poiDB+' WHERE subcategory=?', ["7_1"], function (tx, results) {
				var len = results.rows.length;
				for (var j=0; j<len; j++){
					var poiid = results.rows.item(j).siteid;
					var poicat = results.rows.item(j).category;
					var x = results.rows.item(j).lat;
					var y = results.rows.item(j).long;
					x = x.replace(x.charAt(2), ".");
					y = y.replace(y.charAt(2), ".");
					if (x < 35){
						var temp = x;
						x = y;
						y = temp;
					}
					lat2 = results.rows.item(j).lat;
					if ( lat2.indexOf("\n") == -1){
						addTempMarker(x, y, results.rows.item(j).name, results.rows.item(j).descr, poicat, poiid, results.rows.item(j).place, results.rows.item(j).ssubcat);
					}
				}
			}, errorCB);
		});
	}
	if (userFilters.era == -1){
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM '+poiDB+' WHERE subcategory=?', ["2_1"], function (tx, results) {
				var len = results.rows.length;
				for (var j=0; j<len; j++){
					var poiid = results.rows.item(j).siteid;
					var poicat = results.rows.item(j).category;
					var x = results.rows.item(j).lat;
					var y = results.rows.item(j).long;
					x = x.replace(x.charAt(2), ".");
					y = y.replace(y.charAt(2), ".");
					if (x < 35){
						var temp = x;
						x = y;
						y = temp;
					}
					lat2 = results.rows.item(j).lat;
					if ( lat2.indexOf("\n") == -1){
						addTempMarker(x, y, results.rows.item(j).name, results.rows.item(j).descr, poicat, poiid, results.rows.item(j).place, results.rows.item(j).ssubcat);
					}
				}
			}, errorCB);
		});
	}
	if (userFilters.music == -1){
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM '+poiDB+' WHERE subcategory=?', ["7_5"], function (tx, results) {
				var len = results.rows.length;
				for (var j=0; j<len; j++){
					var poiid = results.rows.item(j).siteid;
					var poicat = results.rows.item(j).category;
					var x = results.rows.item(j).lat;
					var y = results.rows.item(j).long;
					x = x.replace(x.charAt(2), ".");
					y = y.replace(y.charAt(2), ".");
					if (x < 35){
						var temp = x;
						x = y;
						y = temp;
					}
					lat2 = results.rows.item(j).lat;
					if ( lat2.indexOf("\n") == -1){
						addTempMarker(x, y, results.rows.item(j).name, results.rows.item(j).descr, poicat, poiid, results.rows.item(j).place, results.rows.item(j).ssubcat);
					}
				}
			}, errorCB);
		});
	}
	for (var f=0; f< markerName.length; f++){
		if ( markerSSubCat[f] == "none" )
		{
			console.log(markerPlace[f]);
			addTempMarker(markerLat[f], markerLong[f], markerName[f], markerDescr[f], markerCat[f], 
					markerPoiId[f], markerPlace[f], markerSSubCat[f]);
		}
	}
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM '+poiDB+'', [], function (tx, results) {
			var len = results.rows.length;
			var lat2;
			for (var j=0; j<len; j++){
				if (   ( (results.rows.item(j).ssubcat.indexOf(userFilters.hotel) != -1) 	&& 	(hotel == true)	)
					|| ( (results.rows.item(j).ssubcat.indexOf(userFilters.cuisine) != -1) && (results.rows.item(j).subcategory == "7_1")	&& (cuisine == true) )
					|| ( (results.rows.item(j).ssubcat.indexOf(userFilters.era) != -1) 		&& 	  (era == true) )
					|| ( (results.rows.item(j).ssubcat.indexOf(userFilters.music) != -1) && (results.rows.item(j).subcategory == "7_5")	&& 	(music == true) )
					)
				{
					var poiid = results.rows.item(j).siteid;
					var poicat = results.rows.item(j).category;
					var x = results.rows.item(j).lat;
					var y = results.rows.item(j).long;
					x = x.replace(x.charAt(2), ".");
					y = y.replace(y.charAt(2), ".");
					if (x < 35){
						var temp = x;
						x = y;
						y = temp;
					}
					lat2 = results.rows.item(j).lat;
					if ( lat2.indexOf("\n") == -1){
//						addTempMarker(results.rows.item(j).lat , results.rows.item(j).long, results.rows.item(j).name, 
//								results.rows.item(j).descr, results.rows.item(j).category, poiid, poicat , x, y);
						addTempMarker(x, y, results.rows.item(j).name, results.rows.item(j).descr, poicat, poiid, results.rows.item(j).place, results.rows.item(j).ssubcat);
					}
				}
			}
//			markerCat = [], markerName = [], markerDescr = [], markerLong =[], markerLat = [], markerSSubCat = [], markerPlace = [], markerPoiId=[];
			if (userFilters.place == -1){
				if ((text == '') || (text == null)){
					searchText(text,2);
				}
				else{
					searchText(text,1);
				}
			}
			else {
				if ((text == '') || (text == null)){
					searchText(text,3);
				}
				else{
					searchText(text,4);
				}
			}
		    $('#abtnTour').removeClass("active");
			$("#abtnFilterTour").hide();
			$("#abtnFilterPlaces").show();
			$('#abtnPlaces').addClass("active");
		    $('#abtnList').removeClass("active");
		    $('#abtnMap').addClass("active");
//		    $( ".inner_wrap" ).css( "display", "none" );
			setTimeout(function(){
				map.invalidateSize();
				if ((panToLong != 0) && (panToLat != 0)){
					map.panTo([panToLat,panToLong]);
				}
			},2500);
		    $( ".loading_gif" ).css( "display", "none" );
		    $.mobile.changePage($('#mainpage'), 'pop');
		    $('#map').css('height',screenHeight-125);
		}, errorCB);
	});
}

function addTempMarker(x, y, name, descr, categ, poiid, place, sscat){
//	console.log(categ);
	tempmarkerCat.push(categ); tempmarkerName.push(name); tempmarkerDescr.push(descr); tempmarkerLong.push(y); 
	tempmarkerLat.push(x);	tempmarkerPoiid.push(poiid); tempmarkerPlace.push(place); tempmarkerSScat.push(sscat);
}

function searchText(text,k){
//	console.log(text+ " " + k);
//	markerCat = [], markerName = [], markerDescr = [], markerLong =[], markerLat = [], markerSSubCat = [], markerPlace = [], markerPoiId=[];
//	console.log("in searchText");
	if (currentMarkers != null)
	{
		for(var i = 0; i < currentMarkers.length; ++i){
			map.removeLayer(currentMarkers[i]);
		}
		currentMarkers = [];
	}
	if (k==1){
		var string = new RegExp(text, 'i');
//		console.log("112 "+markerName.length);
		for (var x=0 ; x < markerName.length ; x++){
			tempmarkerLat.push(markerLat[x]);
			tempmarkerName.push(markerName[x]);
			tempmarkerLong.push(markerLong[x]);
			tempmarkerCat.push(markerCat[x]);
			tempmarkerDescr.push(markerDescr[x]);
			tempmarkerSScat.push(markerSSubCat[x]);
			tempmarkerPoiid.push(markerPoiId[x]);
			tempmarkerPlace.push(markerPlace[x]);
		}
		markerCat = [], markerName = [], markerDescr = [], markerLong =[], markerLat = [], markerSSubCat = [], markerPlace = [], markerPoiId=[];
		for (x=0 ; x <tempmarkerName.length ; x++){
//			//console.log(tempmarkerName[x]);
//			//console.log(tempmarkerDescr[x]);
			if ((tempmarkerName[x].search(string) != -1) || (tempmarkerDescr[x].search(string) != -1)){
				var descr = tempmarkerDescr[x];
				if (descr.length > 200){			//slicing the description to the first 200 charactes.
					descr = descr.slice(0,200);
					descr += "...";
					descr += "<br>";
				}
				descr += "<p onclick=getMoreInfo("+tempmarkerPoiid[x]+","+tempmarkerCat[x]+")><i><u>"+MyApp.resources.MoreInfo+"</i></u></p>";
				descr += "<p onclick=getDirections("+tempmarkerLat[x]+","+tempmarkerLong[x]+")><i><u>"+MyApp.resources.GetDirections+"</i></u></p>";
				addGroupMarker(tempmarkerLat[x] , tempmarkerLong[x], tempmarkerName[x], descr, tempmarkerCat[x], 
								tempmarkerPlace[x], tempmarkerSScat[x], tempmarkerPoiid[x], 1);
			}
		}
	}
	else if (k==2){
		markerCat = [], markerName = [], markerDescr = [], markerLong =[], markerLat = [], markerSSubCat = [], markerPlace = [], markerPoiId=[];
		//console.log("in searchText2");
		for (var x=0 ; x <tempmarkerName.length ; x++){
			var descr = tempmarkerDescr[x];
			if (descr.length > 200){			//slicing the description to the first 200 charactes.
				descr = descr.slice(0,200);
				descr += "...";
				descr += "<br>";
			}
			descr += "<p onclick=getMoreInfo("+tempmarkerPoiid[x]+","+tempmarkerCat[x]+")><i><u>"+MyApp.resources.MoreInfo+"</i></u></p>";
			descr += "<p onclick=getDirections("+tempmarkerLat[x]+","+tempmarkerLong[x]+")><i><u>"+MyApp.resources.GetDirections+"</i></u></p>";
			addGroupMarker(tempmarkerLat[x] , tempmarkerLong[x], tempmarkerName[x], descr, 
							tempmarkerCat[x], tempmarkerPlace[x], tempmarkerSScat[x], tempmarkerPoiid[x], 1);
		}
	}
	else if (k==3){
//		var place = (langstr == 'en') ? placeEn[userFilters.place] : placeGr[userFilters.place];
		var place = placeGr[userFilters.place];
//		console.log("place "+place);
//		markerCat = [], markerName = [], markerDescr = [], markerLong =[], markerLat = [], markerSSubCat = [], markerPlace = [], markerPoiId=[];
//		if ((text == '') || (text == null)){
		console.log(tempmarkerName.length);
			for (var x=0 ; x <tempmarkerName.length ; x++){
				var descr = tempmarkerDescr[x];
				if (descr.length > 200){			//slicing the description to the first 200 charactes.
					descr = descr.slice(0,200);
					descr += "...";
					descr += "<br>";
				}
//				descr += "<p onclick=getMoreInfo("+tempmarkerPoiid[x]+","+tempmarkerCat[x]+")><i><u>"+MyApp.resources.MoreInfo+"</i></u></p>";
				descr += "<p onclick=getDirections("+tempmarkerLat[x]+","+tempmarkerLong[x]+")><i><u>"+MyApp.resources.GetDirections+"</i></u></p>";
//				console.log("12 "+tempmarkerPlace[x] + " " + place);
				console.log(tempmarkerPlace[x] + " "+ place);
				if (tempmarkerPlace[x] == place){
					console.log("1");
					addGroupMarker(tempmarkerLat[x] , tempmarkerLong[x], tempmarkerName[x], descr, 
									tempmarkerCat[x], tempmarkerPlace[x], tempmarkerSScat[x], tempmarkerPoiid[x], 1);
				}
			}
//		}
	}
	else if (k==4){
		var string = new RegExp(text, 'i');
		for (var x=0 ; x < markerName.length ; x++){
			tempmarkerLat.push(markerLat[x]);
			tempmarkerName.push(markerName[x]);
			tempmarkerLong.push(markerLong[x]);
			tempmarkerCat.push(markerCat[x]);
			tempmarkerDescr.push(markerDescr[x]);
			tempmarkerSScat.push(markerSSubCat[x]);
			tempmarkerPoiid.push(markerPoiId[x]);
			tempmarkerPlace.push(markerPlace[x]);
		}
		markerCat = [], markerName = [], markerDescr = [], markerLong =[], markerLat = [], markerSSubCat = [], markerPlace = [], markerPoiId=[];
		for (x=0 ; x <tempmarkerName.length ; x++){
			if ((tempmarkerName[x].search(string) != -1 || tempmarkerDescr[x].search(string) != -1) && 
					(tempmarkerPlace[x] == placeGr[userFilters.place] )) {
				var descr = tempmarkerDescr[x];
				if (descr.length > 200){			//slicing the description to the first 200 charactes.
					descr = descr.slice(0,200);
					descr += "...";
					descr += "<br>";
				}
				descr += "<p onclick=getMoreInfo("+tempmarkerPoiid[x]+","+tempmarkerCat[x]+")><i><u>"+MyApp.resources.MoreInfo+"</i></u></p>";
				descr += "<p onclick=getDirections("+tempmarkerLat[x]+","+tempmarkerLong[x]+")><i><u>"+MyApp.resources.GetDirections+"</i></u></p>";
				addGroupMarker(tempmarkerLat[x] , tempmarkerLong[x], tempmarkerName[x], descr, tempmarkerCat[x], 
								tempmarkerPlace[x], tempmarkerSScat[x], tempmarkerPoiid[x], 1);
			}
		}
	}
}

function createPageHeader(x){
	var fillHtml = '';
	var fillHtml2 = '';
	fillHtml  = '<div class="container"> <div class="app_logo"> <img src="images/logo_app.png" alt="logo" onClick="switchToHomePage();"></div>';
	fillHtml +=	'<div class="app_options no_active"><a href="#" onClick = "onClickSettings();">	<img src="images/settings_new.png" alt="options">';
	fillHtml += '</a></div></div>';
	switch (x)
	{
	case 1:
		fillHtml2  = '<div data-role="fieldcontain"><label for="language_select" id="lbllanguageselect">'
						+MyApp.resources.LanguageSelect+'</label>	';
		fillHtml2 += '<select name="language_select" id="language_select"><option value="GR">'+MyApp.resources.Greek+'</option>';
		fillHtml2 += '<option value="EN">English</option></select>	</div>';
		fillHtml2 += '<div data-role="fieldcontain" ><label for="emailaccount" id="lblemailaccount">';
		fillHtml2 += '</label><input type="text" value="" name="emailaccount" id="emailaccountchange" placeholder="email account" /></div>';
		fillHtml2 += '<div class="button blue small"><a href="#" onClick = "backToMainPage();"><span id="btnSaveChanges">'
						+MyApp.resources.SaveChanges+' </span></a></div>';
		$(".container1").html(fillHtml2);
		break;
	case 2:
		fillHtml2  = '<div data-role="fieldcontain"><label for="language_select" id="lbllanguageselect">'
						+MyApp.resources.LanguageSelect+'</label>';
		fillHtml2 += '<select name="language_select" id="language_select2"><option value="GR">'+MyApp.resources.Greek+'</option>';
		fillHtml2 += '<option value="EN">English</option></select>	</div>';
		fillHtml2 += '<div data-role="fieldcontain" ><label for="emailaccount" id="lblemailaccount">';
		fillHtml2 += '</label><input type="text" value="" name="emailaccount" id="emailaccountchange2" placeholder="email account" /></div>';
		fillHtml2 += '<div class="button blue small"><a href="#" onClick = "reloadPlacesPage();"><span id="btnSaveChanges2">'
						+MyApp.resources.SaveChanges+'</span></a></div>';
		$(".container2").html(fillHtml2);
		break;
	case 3:
		fillHtml2  = '<div data-role="fieldcontain"><label for="language_select" id="lbllanguageselect">'
						+MyApp.resources.LanguageSelect+'</label>';
		fillHtml2 += '<select name="language_select" id="language_select3"><option value="GR">'+MyApp.resources.Greek+'</option>';
		fillHtml2 += '<option value="EN">English</option></select>	</div>';
		fillHtml2 += '<div data-role="fieldcontain" ><label for="emailaccount" id="lblemailaccount">';
		fillHtml2 += '</label><input type="text" value="" name="emailaccount" id="emailaccountchange3" placeholder="email account" /></div>';
		fillHtml2 += '<div class="button blue small"><a href="#" onClick = "reloadItinerariesPage();"><span id="btnSaveChanges3">'
						+MyApp.resources.SaveChanges+'</span></a></div>';
		$(".container3").html(fillHtml2);
		break;
	case 4:
		fillHtml2  = '<div data-role="fieldcontain"><label for="language_select" id="lbllanguageselect">'
						+MyApp.resources.LanguageSelect+'</label>	';
		fillHtml2 += '<select name="language_select" id="language_select4"><option value="GR">'+MyApp.resources.Greek+'</option>';
		fillHtml2 += '<option value="EN">English</option></select>	</div>';
		fillHtml2 += '<div data-role="fieldcontain" ><label for="emailaccount" id="lblemailaccount">';
		fillHtml2 += '</label><input type="text" value="" name="emailaccount" id="emailaccountchange4" placeholder="email account" /></div>';
		fillHtml2 += '<div class="button blue small"><a href="#" onClick = "reloadItinerariesPage();"><span id="btnSaveChanges4">'
						+MyApp.resources.SaveChanges+'</span></a>	</div>';
		$(".container4").html(fillHtml2);
		break;
	case 5:
		fillHtml2  = '<div data-role="fieldcontain"><label for="language_select" id="lbllanguageselect">'
						+MyApp.resources.LanguageSelect+'</label>	';
		fillHtml2 += '<select name="language_select" id="language_select5"><option value="GR">'+MyApp.resources.Greek+'</option>';
		fillHtml2 += '<option value="EN">English</option></select>	</div>';
		fillHtml2 += '<div data-role="fieldcontain" ><label for="emailaccount" id="lblemailaccount">';
		fillHtml2 += '</label><input type="text" value="" name="emailaccount" id="emailaccountchange5" placeholder="email account" /></div>';
		fillHtml2 += '<div class="button blue small"><a href="#" onClick = "reloadItineraryPortalPage();"><span id="btnSaveChanges5">'
						+MyApp.resources.SaveChanges+'</span></a></div>';
		$(".container5").html(fillHtml2);
		break;
	case 6:
		fillHtml2  = '<div data-role="fieldcontain"><label for="language_select" id="lbllanguageselect">'
						+MyApp.resources.LanguageSelect+'</label>	';
		fillHtml2 += '<select name="language_select" id="language_select6"><option value="GR">'+MyApp.resources.Greek+'</option>';
		fillHtml2 += '<option value="EN">English</option></select>	</div>';
		fillHtml2 += '<div data-role="fieldcontain" ><label for="emailaccount" id="lblemailaccount">';
		fillHtml2 += '</label><input type="text" value="" name="emailaccount" id="emailaccountchange6" placeholder="email account" /></div>';
		fillHtml2 += '<div class="button blue small"><a href="#" onClick = "reloadOrderPlaces();"><span id="btnSaveChanges6">'
						+MyApp.resources.SaveChanges+'</span></a></div>';
		$(".container6").html(fillHtml2);
		break;
	case 7:
		fillHtml2  = '<div data-role="fieldcontain"><label for="language_select" id="lbllanguageselect">'
						+MyApp.resources.LanguageSelect+'</label>';
		fillHtml2 += '<select name="language_select" id="language_select7"><option value="GR">'+MyApp.resources.Greek+'</option>';
		fillHtml2 += '<option value="EN">English</option></select>	</div>';
		fillHtml2 += '<div data-role="fieldcontain" ><label for="emailaccount" id="lblemailaccount">';
		fillHtml2 += '</label><input type="text" value="" name="emailaccount" id="emailaccountchange7" placeholder="email account" /></div>';
		fillHtml2 += '<div class="button blue small"><a href="#" onClick = "reloadFilteredPlaces();"><span id="btnSaveChanges7">'
						+MyApp.resources.SaveChanges+'</span></a></div>';
		$(".container7").html(fillHtml2);
		break;
	case 8:
		fillHtml2  = '<div data-role="fieldcontain"><label for="language_select" id="lbllanguageselect">'
						+MyApp.resources.LanguageSelect+'</label>';
		fillHtml2 += '<select name="language_select" id="language_select8"><option value="GR">'+MyApp.resources.Greek+'</option>';
		fillHtml2 += '<option value="EN">English</option></select>	</div>';
		fillHtml2 += '<div data-role="fieldcontain" ><label for="emailaccount" id="lblemailaccount">';
		fillHtml2 += '</label><input type="text" value="" name="emailaccount" id="emailaccountchange8" placeholder="email account" /></div>';
		fillHtml2 += '<div class="button blue small"><a href="#" onClick = "reloadHomePage();"><span id="btnSaveChanges8">'
						+MyApp.resources.SaveChanges+'</span></a></div>';
		$(".container8").html(fillHtml2);
		break;
	}
	$(".header").html(fillHtml);
//	$(".container2").html(fillHtml2);
}


