var baseapiurl='ath.dataverse.gr:18090/api/';
//var cloudmadeApiUrl='http://routes.cloudmade.com/b2adb48b2e8840d1a8ee52438aa58def/api/0.3';
//var basepoifolder = 'xml/';
//var baselat = 38.00411;
//var baselong = 23.720673;
var map;
//var defaultZoom = 4;
var firstTime = true;
var basemap;
//var latlng;
var screenHeight;
var currentTimestamp = [];
//var xmlArray = [];
var currentLat;
var currentLong;
var marker1;
//var inGetDirections = false;
var watchID = null;
//var marker2;
var fromLoadCoords = false;
var xmlDoc,xmlDoc1,xmlDoc2,xmlDoc3,xmlDoc4,xmlDoc5;
var currentMarkers = [];
var db;
var po=0;
var showPlacesInfo = false;
var itineraryFilename = [];
var isOffline = true;
var language;
var langstr = 'en';
var currentEmail;
//var filepath;
var langchanged = false;
var xmlpathcat;
var fromselectedplaces = false;
var itId;//, dayId;
//var itTitle;
//var synchronizd = false ;
var itActive;
var itCompleted;
//var category = [];
//var placesVisited = [];
//var ifVisited = [];
//var tempCategory = [];
//var tempPoi = [];
//var timestamp;
//var fileNameToBeMoved;
//var tempFound = false;
//var mapAppFound = false;
//var upToDate = false;
var fromMainPage = false;
var nameCat= [];
var categId = [];
var newtimestamp = false;
var fromSettings = false;
//var ItTitle = [];
//var ItUser = [];
//var ItId = [];
//var ItDays = [];
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
	MarkerEntertainment = new LeafIcon({iconUrl: 'dist/images/list11.png'}),
	MarkerFood = new LeafIcon({iconUrl: 'dist/images/list12.png'});
	MarkerShopping = new LeafIcon({iconUrl: 'dist/images/shopping.png'});

function onDeviceReady() {
	db = window.openDatabase("KosMobile", "1.0", "Kos Db", 6000000);
//	db.transaction(populateDB, errorCB, successCB);
	document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("searchbutton", onSearchKeyDown, false);
	document.addEventListener("offline", function() {isOffline = true;}, false);
	document.addEventListener("online", function() {isOffline = false;}, false);
	SetElementHeight();
	if(navigator.network && navigator.network.connection.type != Connection.NONE){
		isOffline = false;
	}
	
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

function checkLanguageSettings()
{
	
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM SETTINGS', [], function (tx, results) {
			len = results.rows.length;
			console.log("SETTINGS.length= "+len);
			if ((len == null) || (len == 0)){
				switchToSecondPage();
				showPlacesInfo = true;
//				createDb();
				populateDB();
			}
			else{
				language = results.rows.item(0).data;
				console.log("langstr: "+langstr);
				checkForLanguage();
				if (isOffline == false){
//					sync();
				}
				setTimeout(function(){
//					firstSwitchToMainPage();
					firstSwitchToPlacesPage();
				},500);
			}
		},success13CB, error13CB);
//		populateDB();
	});
}

function populateDB(tx)
{
	console.log("IN POPULATE DB");
	db.transaction(function (tx) {
		console.log("populateDB(tx)");
		tx.executeSql('DROP TABLE IF EXISTS SETTINGS');
		tx.executeSql('DROP TABLE IF EXISTS POINTS');
		tx.executeSql('DROP TABLE IF EXISTS CATEGORIESEN');
		tx.executeSql('DROP TABLE IF EXISTS CATEGORIESGR');
		tx.executeSql('DROP TABLE IF EXISTS SUBCATEGORIESEN');
		tx.executeSql('DROP TABLE IF EXISTS SUBCATEGORIESGR');
		tx.executeSql('DROP TABLE IF EXISTS POIEN');
		tx.executeSql('DROP TABLE IF EXISTS POIGR');
		tx.executeSql('DROP TABLE IF EXISTS TIMESTAMP');
//		tx.executeSql('DROP TABLE IF EXISTS ROUTES');
		tx.executeSql('DROP TABLE IF EXISTS TEMP');
		tx.executeSql('CREATE TABLE IF NOT EXISTS SETTINGS (id unique, data)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS POINTS (id, Id_Portal, routeId, isActive, visited, long, lat)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS CATEGORIESEN (id unique, name, guid)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS CATEGORIESGR (id unique, name, guid)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS SUBCATEGORIESEN (id unique, name, catid)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS SUBCATEGORIESGR (id unique, name, catid)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS POIEN (name, descr, category, subcategory, long, lat)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS POIGR (name, descr, category, subcategory, long, lat)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS TIMESTAMP (id unique, timestamp)');
//		tx.executeSql('CREATE TABLE IF NOT EXISTS ROUTES (id, title, itineraryId, isActive, completed)');
		console.log("populateDB()2");
		populateDatabases();
	});
}

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

function successCB() {
    //alert('successCB!');
}

function switchToSecondPage()
{
	$('#secondpage').trigger("create");
	$.mobile.changePage($('#secondpage'), 'pop');
}

function success13CB(){
	console.log("success13CB");
	switchToSecondPage();
	showPlacesInfo = true;
//	createDb();
	populateDB();
}

function error13CB(){
	console.log("error13CB");
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

function sync(){
	console.log("in sync");
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM TIMESTAMP', [], function (tx, results){
			var len = results.rows.length, i;
			for (i = 0; i < len; i++){
				currentTimestamp.push(results.rows.item(i).timestamp);
			}
			popNewTimestampDb();
		}, errorCB);
	});
	console.log("in sync2");
	downloadXmlFiles();	
}

function checkDb(){
//	console.log("in CheckDb");
//	var len;
//	db.transaction(function (tx) {
//		tx.executeSql('SELECT * FROM CATEGORIESEN', [], function (tx, results) {
//			len = results.rows.length;
//			if ((len == null) || (len == 0)){
//				createDb();
//			}
//		},success0CB, error0CB);
//		populateDB();
//	});
}

function error0CB(){
//	alert("error0CB");
	populateDB();
}

function success0CB(){
	console.log("success0CB");
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
	loadItineraryXml(2);
}

//function createItDb2(){
//	alert("error10CB()");
//	db.transaction(function(tx) {
//		tx.executeSql('DROP TABLE IF EXISTS ITINERARIES');
//		tx.executeSql('CREATE TABLE IF NOT EXISTS ITINERARIES (id, title, user, day, pointcode, pointname, duration, isActive, completed)');
//	});
//	loadItineraryXml(2);
//}

//function createDb(){
//	console.log("in createDb()");
//	db.transaction(populateDB, errorCB, successCB);
//	setTimeout(function(){
//		populateDatabases();
//	},1000);
//}

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
	popTimestampDb();
//	setTimeout(function(){sync();},1000);
}

function popCategoriesEnDb(){
	console.log("in popCategoriesEnDb()");
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
	console.log("in popSubCategoriesEnDb()");
	db.transaction(function(tx) {
		var cat =  xmlDoc.getElementsByTagName("Category");
		var sub, subId, subName;
		for (var i=0; i< cat.length; i++){
			catId = xmlDoc.getElementsByTagName("Category")[i].getAttribute('id');
			sub = cat[i].getElementsByTagName("Subcategories")[0].getElementsByTagName("Subcategory");
			if (catId == 7){
				tx.executeSql('INSERT INTO SUBCATEGORIESEN (id, name, catid) VALUES (?,?,?)',
						['0x010043E0C6427A88F547B069EF3C265F983C','Villages',catId], success4CB, error4CB);
			}
			else if (catId == 9){
				tx.executeSql('INSERT INTO SUBCATEGORIESEN (id, name, catid) VALUES (?,?,?)',
						['0x010020858B5F00431840A5FF9BA2B0E92EAE','General Information',catId], success4CB, error4CB);
			}
			else{
				for (var j=0; j<sub.length; j++){
					subName = sub[j].getElementsByTagName("Name")[0].textContent;
					subId = sub[j].getAttribute('id');
//					alert(subId +" __ "+subName +" __ "+ catId);
					tx.executeSql('INSERT INTO SUBCATEGORIESEN (id, name, catid) VALUES (?,?,?)',[subId,subName,catId], success4CB, error4CB);
				}
			}
		}
//		alert("3: "+subName);
	});
}

function success4CB(){
//	loadXmlCat(2);
}

function popCategoriesGrDb(){
	console.log("in popCategoriesGrDb()");
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
	console.log("error5CB");
}

function popSubCategoriesGrDb(){
	console.log("in popSubCategoriesGrDb()");
	db.transaction(function(tx) {
		var cat =  xmlDoc1.getElementsByTagName("Category");
		var sub, subId, subName;
		for (var i=0; i< cat.length; i++){
			catId = xmlDoc1.getElementsByTagName("Category")[i].getAttribute('id');
			sub = cat[i].getElementsByTagName("Subcategories")[0].getElementsByTagName("Subcategory");
			if (catId == 7){
				tx.executeSql('INSERT INTO SUBCATEGORIESEN (id, name, catid) VALUES (?,?,?)',
						['0x010043E0C6427A88F547B069EF3C265F983C','Χωριά',catId], success4CB, error4CB);
			}
			else if (catId == 9){
				tx.executeSql('INSERT INTO SUBCATEGORIESEN (id, name, catid) VALUES (?,?,?)',
						['0x010020858B5F00431840A5FF9BA2B0E92EAE','Γενικές πληροφορίες',catId], success4CB, error4CB);
			}
			else{
				for (var j=0; j<sub.length; j++){
					subName = sub[j].getElementsByTagName("Name")[0].textContent;
//					alert(subName);
					subId = sub[j].getAttribute('id');
//					alert(subId +" __ "+subName +" __ "+ catId);
					tx.executeSql('INSERT INTO SUBCATEGORIESGR (id, name, catid) VALUES (?,?,?)',[subId,subName,catId], successCB, error4CB);
				}
			}
		}
//	alert("4: "+subName);
});
		}

function popPoiEnDb(){
	console.log("in popPoiEnDb");
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
	console.log("error6CB");
}

function popPoiGrDb(){
	console.log("popPoiGrDb");
	db.transaction(function(tx) {
		var LenCat =  xmlDoc3.getElementsByTagName("Poi").length;
		var subCatId, poiName, poiDescr, poiLong, poiLat, timestamp, poiCat, poiSubCat , pois;
		timestampd = $(xmlDoc3).find("timestamp").text();
		for(var i = 0; i < LenCat; i++)	{
			poiName = xmlDoc3.getElementsByTagName("pois")[0].getElementsByTagName("Poi")[i].getElementsByTagName("Name")[0].textContent;
			poiDescr = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Description")[0].textContent;
			poiLong = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Longitude")[0].textContent;
			poiLat = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Latitude")[0].textContent;
			poiCat = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Category")[0].textContent;
			poiSubCat = xmlDoc3.getElementsByTagName("Poi")[i].getElementsByTagName("Sucategories");
//			console.log(poiName, poiDescr, poiCat, subCatId, poiLong, poiLat);
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
	console.log('error2CB');
}

function popTimestampDb(){
	console.log("in popTimestampDb");
	db.transaction(function(tx) {
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[1,timestampa],successCB,error7CB);
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[2,timestampb],successCB,error7CB);
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[3,timestampc],successCB,error7CB);
		tx.executeSql('INSERT INTO TIMESTAMP (id, timestamp) VALUES (?,?)',[4,timestampd],successCB,error7CB);
	});
}

function popNewTimestampDb(){
	console.log("in popNewTimestampDb");
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
	console.log("error9CB!");
}

function error7CB(err){
	console.log("error7CB"+err.code);
}

function error3CB(){
	console.log('error db 3');
}

function error4CB(){
	console.log('error db 4');
}

function onSearchKeyDown()
{
	console.log('button search');
}

function downloadXmlFiles(){
	console.log('in downloadXmlFiles');
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
	console.log("po= "+po);
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
	console.log("error8CB!");
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
//	console.log("error9CB!");
//}
//	db.transaction(function(tx) {
//	tx.executeSql('INSERT INTO SUBCATEGORIESGR (id, name, catid) VALUES (?,?,?)',[subId,subName,catId], successCB, error4CB);
//	}
//	}
//	});

function popNewPoiGrDb(data){
	console.log("inpopNewPoiGrDb");
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
		console.log(data);
		$(data).find("category subcategories subcategory name").each(function (){
			 console.log($(this).text());
		});
//		catId = xmlDoc.getElementsByTagName("Category")[i].getAttribute('id');
			catName = xmlDoc.getElementsByTagName("Category")[i].getElementsByTagName("Name")[0].textContent;
			guid = xmlDoc.getElementsByTagName("Category")[i].getAttribute('guid');
			tx.executeSql('INSERT INTO CATEGORIESEN (id, name, guid) VALUES (?,?,?)',[catId,catName,guid], success3CB, error3CB);
//	});
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
	console.log("newXmlFileName: "+newXmlFileName); 
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

function drawPlacesPageEn(len){
	var fillhtml='';
//	var fillHeader='';
//	var divplaces = document.getElementById('placesContent');
	fillHeader= '<img src="images/info_icon.png" style="float:left;"><span>'+MyApp.resources.placesPageHeader+'</span>';
	var subLen;
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM SUBCATEGORIESEN', [], function (tx, results) {			
			var subId;
			for (var k=0; k<len; k++){
//				alert("12 "+nameCat[k]);
				fillhtml += "<fieldset data-role='collapsible' data-theme='g' data-content-theme='g'>";
				fillhtml += "<legend>" + nameCat[k] + "</legend>";
				fillhtml += "<div data-role='controlgroup'>";
				subLen = results.rows.length;
//				alert("sublen: "+sublen);
				for(var j=0; j<subLen ; j++){
//					alert("13 "+results.rows.item(j).catid);
					subId = results.rows.item(j).catid;
					sname = results.rows.item(j).name;
					sname = $.trim(sname);
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
			$("#placesPageHeader").html(fillHeader);
//			$.mobile.changePage($('#placespage'), 'slideup(1000)');
			$.mobile.changePage($('#placespage'), 'slideUp');
			customHeader(2);
		    $('#abtnTour2').removeClass("active");
//		    $('#abtnPlaces2').addClass("active");
		    $('#abtnCurrentPosition2').removeClass("active");
		    $('#abtnExit2').removeClass("active");
		    $('.options').css({'display':'none'});
		    document.getElementById('btnSaveChanges2').innerHTML= MyApp.resources.SaveChanges;
		    setLabelsForMainPage();
//		    document.getElementById('placesPageHeader').innerHTML= MyApp.resources.placesPageHeader;
//		    $("#placesContent").ready(function(){
//		        $('#scrollbar1').tinyscrollbar();
//		    });
			var email = $('#emailaccountchange2').val();
			console.log("2222 email: "+email);
			if ( email == null || email == ""){
				$('#emailaccountchange2').val(currentEmail);
				console.log(currentEmail);
			}
//		    var div = $(document).height();
//		    var doc = $(window).height();
//		    console.log("div= "+div+" doc= "+doc);
//		    if (div > doc ) {
//		        
//		    }
		});
	});
}

function customHeader(x){
//	document.getElementById('btnPlaces'+x).innerText= MyApp.resources.Places;
	document.getElementById('abtnCurrentPosition'+x).innerText= MyApp.resources.CurrentPosition;
	document.getElementById('btnTour'+x).innerHTML= MyApp.resources.Tour;
	document.getElementById('btnExit'+x).innerHTML= MyApp.resources.Exit;
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
	fillHeader= '<img src="images/info_icon.png" style="float:left;"><span>'+MyApp.resources.placesPageHeader+'</span>';
	var subLen;
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM SUBCATEGORIESGR', [], function (tx, results) {			
			var subId;
			for (var k=0; k<len; k++){
//				alert("12 "+nameCat[k]);
				fillhtml += "<fieldset data-role='collapsible' data-theme='g' data-content-theme='g'>";
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
			$("#placesPageHeader").html(fillHeader);
			$.mobile.changePage($('#placespage'), 'pop');
			customHeader(2);
			var email = $('#emailaccountchange2').val();
			if ( email == null || email == ""){
				$('#emailaccountchange2').val(currentEmail);
				console.log(currentEmail);
			}
		    $('#abtnTour2').removeClass("active");
//		    $('#abtnPlaces2').addClass("active");
		    $('#abtnCurrentPosition2').removeClass("active");
		    $('#abtnExit2').removeClass("active");
		    $('.options').css({'display':'none'});
		    document.getElementById('btnSaveChanges2').innerHTML= MyApp.resources.SaveChanges;
		    setLabelsForMainPage();
//		    document.getElementById('placesPageHeader').innerHTML= MyApp.resources.placesPageHeader;
//		    $(document).ready(function(){
//		        $('#scrollbar1').tinyscrollbar();
//		    });
		});
	});
}

function onClickbtnFilterPlaces()
{
//	var hasChilds = document.getElementById('placesContent').hasChildNodes();
//	if(!hasChilds)
//	{
//	$('#abtnFilterPlaces').addClass('ui-disabled');
	firstTime = false;
	if (langstr == 'en'){
		readCatDbEn();
	}
	else {
		readCatDbGr();
	}
//	}
//	$('#placespage').trigger("create");
//	$.mobile.changePage($('#placespage'), 'pop');
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

function typeSelectChanged()
{
	if (currentMarkers != null)
	{
		for(var i = 0; i < currentMarkers.length; ++i)
		{
			map.removeLayer(currentMarkers[i]);
		}
		currentMarkers = [];
	}
	var value = $(this).id();
	x=xmlDoc.getElementsByTagName("Type")[value -1].getElementsByTagName("Destination");
	for(var i = 0; i < x.length; ++i)
	{
		//appendOptionLast(x.length,10)
		addGroupMarker(x[i].attributes.getNamedItem("lat").nodeValue, 
				x[i].attributes.getNamedItem("long").nodeValue, 
				x[i].attributes.getNamedItem("name").nodeValue, 
				x[i].attributes.getNamedItem("descr").nodeValue);
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

function generateMap()
{ 
//	var strictBounds = 	new L.LatLngBounds(	new L.LatLng(36.6284187, 26.7715134),
//											new L.LatLng(36.9202150, 27.4904318)
//											);, maxBounds: strictBounds, minZoom: 11 
	
	var osm;
	map = new L.Map('map', {center: new L.LatLng(36.8939,27.2884), zoom: 13, zoomControl: false});
	if (isOffline)
	{
		alert("Offline Mode");
		osm = new L.TileLayer('map/{z}/{x}/{y}.png');
		map._layersMaxZoom=15;
		map._layersMinZoom=12;

	}
	else
		{
		alert("Online Mode");
			osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
		}
	//osm = new L.TileLayer('map/{z}/{x}/{y}.png');
	map.addLayer(osm);
	
	document.getElementById('map').style.display = 'block';
	map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.
	new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
	map.addControl(clearControl(clearMap));

}

function onClickbtnCurrent()
{
	$('#abtnCurrentPosition').addClass("active");
//	$('#abtnPlaces').removeClass("active");
   	$('#abtnTour').removeClass("active");
	$("#abtnFilterTour").hide();
	$("#abtnFilterPlaces").hide();
 	navigator.geolocation.getCurrentPosition(onSuccess, onError,{frequency:5000,maximumAge: 0, enableHighAccuracy:true});
 	switchToMainPage();
}

function onSuccess(position)
{
	console.log("in geolocation Success");
	currentLat = position.coords.latitude;
	console.log("currentLat: "+currentLat);
	currentLong = position.coords.longitude;
	console.log("currentLong: "+currentLong);
	if (fromLoadCoords == true){
//		fromLoadCoords = false;
		getDirections();
	}
	else{
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
}

function onError(error)
{
//	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
	alert("Could not get your location");
}

function addGroupMarker(x, y, name, descr, categ)
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
	categ = $.trim(categ);
	switch (categ)
	{
	case "1":
		marker = new L.Marker(markerLocation, {icon: MarkerShopping}).addTo(map)
							.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>");
		break;
	case "2":
		marker = new L.Marker(markerLocation, {icon: MarkerSights}).addTo(map)
							.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>");
		break;
	case "3":
		marker = new L.Marker(markerLocation, {icon: MarkerAccommodation}).addTo(map)
							.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>");
		break;
	case "4":
		marker = new L.Marker(markerLocation, {icon: MarkerActivities}).addTo(map)
							.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>");
		break;
	case "5":
		marker = new L.Marker(markerLocation, {icon: MarkerSea}).addTo(map)
							.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>");
		break;
	case "6":
		marker = new L.Marker(markerLocation, {icon: MarkerTransport}).addTo(map)
							.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>");
		break;
	case "8":
		marker = new L.Marker(markerLocation, {icon: MarkerFood}).addTo(map)
							.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>");
		break;
	case "10":
		marker = new L.Marker(markerLocation, {icon: MarkerEntertainment}).addTo(map)
							.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>");
		break;
	default:
		marker = new L.Marker(markerLocation).addTo(map)
							.bindPopup("<b>" + name + "</b>" + "</br><p>" + descr + "</p>");
	}
    map.addLayer(marker);
    currentMarkers.push(marker);
}

function addMarkerToList(name)
{
	$('#yourList').removeClass('ui-disabled');
	appendOptionListLast(name,0);
}

/*
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
}*/

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
	language = langid;
	langstr = langid.toLowerCase();
    db.transaction(function(tx) {
    	tx.executeSql('INSERT INTO SETTINGS(id, data) VALUES (?,?)',[1,langstr],successCB, errorCB);
    	console.log("inserted Into settings: "+langstr);
    });
    
    checkForLanguage();
//    $.mobile.changePage($('#secondpage'), 'pop');
//    setLabelsForEmailPage();
    
	if (isOffline == false){
//		sync();
	}
//	firstSwitchToMainPage();
	firstSwitchToPlacesPage();
}

function firstSwitchToPlacesPage()
{
	generateMap();
	if (isOffline == true)
	{
		alert(MyApp.resources.NoInternetAccess);
	}
//	$.mobile.changePage($('#mainpage'), 'pop');
//	setTimeout(function(){
//		map.invalidateSize();
//	},2300);
	setLabelsForMainPage();
	onClickbtnFilterPlaces();
}

/*
function setLabelsForEmailPage(lang)
{
	document.getElementById('emailheading').innerHTML=  MyApp.resources.EmailHeading;
	document.getElementById('btnOkEmail').innerText=  MyApp.resources.Ok;  
	document.getElementById('btnSkipEmail').innerHTML= MyApp.resources.Skip;  
//	document.getElementById('btnBackEmail').innerHTML=  MyApp.resources.Back;  
//	document.getElementById('divimportantEmail').innerHTML=  MyApp.resources.ImportantEmail;  
	document.getElementById('emailaccount').placeholder= MyApp.resources.EmailAccountPlaceholder;  
}*/

function setLabelsForMainPage()
{
	setHeaderLabels();
//	document.getElementById('btnSettings').innerHTML= MyApp.resources.Settings; 
//	document.getElementById('btnSBack').innerHTML=  MyApp.resources.Back;  
	document.getElementById('btnPBack').innerHTML= MyApp.resources.Apply;
//	document.getElementById('btnShowNone').innerHTML= MyApp.resources.ShowNone;
	document.getElementById('btnLocalBack').innerHTML= MyApp.resources.Back;
	document.getElementById('btnPortalBack').innerHTML= MyApp.resources.Back;
//	document.getElementById('settingsheading').innerHTML= MyApp.resources.SettingsHeading;   
	document.getElementById('lbllanguageselect').innerHTML= MyApp.resources.LanguageSelect;
	document.getElementById('lblemailaccount').innerHTML= MyApp.resources.EmailAccount;
	document.getElementById('btnFilterTour').innerHTML= MyApp.resources.FilterTour;    
	document.getElementById('btnFilterPlaces').innerHTML= MyApp.resources.FilterPlaces;
	document.getElementById('btnLoadfromportal').innerHTML= MyApp.resources.LoadFromPortal;
	document.getElementById('btnLoadItinerary').innerHTML= MyApp.resources.LoadItinerary;
//	document.getElementById('btnLoadSelected').innerHTML= MyApp.resources.LoadSelected;
	document.getElementById('btnEachItineraryBack').innerHTML= MyApp.resources.Back;
//	document.getElementById('itinerarypageheader').innerHTML= MyApp.resources.LoadAvailableTour;  
//	document.getElementById('itineraryportalpageheader').innerHTML= MyApp.resources.LoadPortalTour;  
	document.getElementById('btnClearAll').innerHTML= MyApp.resources.ClearAll;
	document.getElementById('btnLoad').innerHTML= MyApp.resources.Load;
	document.getElementById('btnSaveChanges').innerHTML= MyApp.resources.SaveChanges;
//	document.getElementById('btnHide').innerHTML= MyApp.resources.Hide;
//	document.getElementById('btnShowPlacesPage').innerHTML= MyApp.resources.ShowPlaces;
}

function setHeaderLabels(){
	document.getElementById('btnCurrentPosition').innerHTML= MyApp.resources.CurrentPosition;  
//	document.getElementById('btnPlaces').innerText= MyApp.resources.Places;
//	document.getElementById('btnPlaces').innerText= MyApp.resources.CurrentPosition;
	document.getElementById('btnTour').innerHTML= MyApp.resources.Tour;
	document.getElementById('btnExit').innerHTML= MyApp.resources.Exit;
}

function setSettingsLabels(){}

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
    	console.log(language);
    	db.transaction(function(tx) {
    		tx.executeSql('UPDATE SETTINGS SET DATA = ? WHERE ID= ?',[language,1]);
    		});
    }
    saveEmail(newEmail);
   // loadXml();
    checkForLanguage();
    fromSettings = true;
    switchToMainPage();
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

function reloadPlacesPage(){
	var newLanguage = $("#language_select2").val();
	var newEmail =  $("#emailaccountchange2").val();
	var newlangstr = $("#language_select2").val();
	var settingsChanged = false;
	langstr = newlangstr.toLowerCase();
	// alert(langstr);
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
//	if (currentEmail== null && newEmail !='' )
//	{
//		db.transaction(function(tx) {
//			tx.executeSql('INSERT INTO SETTINGS(id, data) VALUES (?,?)',[2,newEmail]);
//		});
//		settingsChanged = true;
//	}
//	else if (currentEmail != null && newEmail =='')
//	{
//		db.transaction(function(tx) {
//			tx.executeSql('DELETE FROM SETTINGS WHERE ID=?',[2]);
//		});
//		currentEmail = null;
//		settingsChanged = true;
//	}
//	else if (currentEmail != newEmail)
//	{
//		db.transaction(function(tx) {
//			tx.executeSql('UPDATE SETTINGS SET DATA =? WHERE ID=?',[newEmail,2]);
//		});
//		currentEmail = newEmail;
//		settingsChanged = true;
//	}
	saveEmail(newEmail);
	checkForLanguage();
	onClickSettings();
	onClickbtnFilterPlaces();
}

function reloadItinerariesPage(){
	var newLanguage = $("#language_select4").val();
	var newEmail =  $("#emailaccountchange4").val();
	var newlangstr = $("#language_select4").val();
	var settingsChanged = false;
//	langstr = newlangstr.toLowerCase();
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
	saveEmail(newEmail);
	checkForLanguage();
//	switchToMainPage();
//	if (settingsChanged == true){
	onClickSettings();
	loadItineraries();	    	
//	}
}

function firstSwitchToMainPage(email){
//	console.log("in first switch... email: "+email);
	if (fromMainPage == false){
		generateMap();
	}
//	if (email !=null && email !='')
//	{
//		console.log("1234567");
//		db.transaction(function(tx) {
//			tx.executeSql('INSERT INTO SETTINGS(id, data) VALUES (?,?)',[2,email], successCB, errorCB);
//		});
//	}
	if (isOffline == true)
	{
		alert(MyApp.resources.NoInternetAccess);
	}
	$.mobile.changePage($('#mainpage'), 'pop');
	setTimeout(function(){
		map.invalidateSize();
	},2300);
	setLabelsForMainPage();
	if (firstTime == true){
//		firstTime = false;
		onClickbtnCurrent();
//		setTimeout(function(){
//			onClickbtnFilterPlaces();
//		},2500);
	}
//	setTimeout(function(){
//		show();
//	},3500);
//	$(".popupBasic").popup({
//		  create: function( event, ui ) {}
//		});
//	$( ".popupBasic" ).popup("open");
//	if (showPlacesInfo == true){
//		var divInfo = getElementById();
//		document.getElementById('availableFiles').innerHTML=My;
//		setTimeout(function(){
//			slide();
//		},3000);
//	}
}

function switchToMainPage(email)
{
//	if (email !=null && email !='')
//	{
//		db.transaction(function(tx) {
//			tx.executeSql('INSERT INTO SETTINGS(id, data) VALUES (?,?)',[2,email], successCB, errorCB);
//		});
//	}
	$.mobile.changePage($('#mainpage'), 'pop');
	setTimeout(function(){
		map.invalidateSize();
	},1000);
	email = $('#emailaccountchange').val();
	console.log("123: "+email);
	if ( email == null || email == ''){
		$('#emailaccountchange').val(currentEmail);
	}
	setLabelsForMainPage();
	if (fromSettings == true){
	    onClickSettings();
	    fromSettings = false;
	}
//	setTimeout(function(){
//		$('.options').css({'display':'none'});
//	},600);
}

function switchToMainPage2(){
	$.mobile.changePage($('#mainpage'), 'pop');
	setTimeout(function(){
		map.invalidateSize();
	},1000);
	setLabelsForMainPage();
	onClickbtnTour();
}

/*
function switchToMainPage3(){
	$.mobile.changePage($('#mainpage'), 'pop');
	setTimeout(function(){
		map.invalidateSize();
	},1000);
	setLabelsForMainPage();
//	onClickbtnCurrent();
}*/

function switchToFirstPage()
{
	db.transaction(function(tx) {
		tx.executeSql('DELETE FROM SETTINGS WHERE id=?', [1], successCB, errorCB);
		});
	$.mobile.changePage($('#firstpage'), 'pop');
}

/*
function switchToSettingPage()
{
	getSelectedSettings();
	$.mobile.changePage($('#settingspage'), 'pop'); 
}*/

function onClickbtnPlaces()
{
	slideBack();
	if (firstTime == true){
//		firstTime = false;
		console.log("first time == true");
		showAllPlaces();
	}
	else{
		console.log("currentMarkers.length "+currentMarkers.length);
		if (currentMarkers != null)// && (firstTime == false))
		{
			console.log("in here!");
			for(var i = 0; i < currentMarkers.length; ++i){
				map.addLayer(currentMarkers[i]);
				console.log("in here2!");
				console.log("Current marker "+currentMarkers[i]);
			}
//			currentMarkers = [];
		}
	}
	if (track != null)
	{
		console.log(track);
		console.log("track not null!");
		map.removeLayer(track);
		map.removeControl(control);
	}
	$("#abtnFilterPlaces").show();
    $("#abtnFilterTour").hide();
    $('#abtnTour').removeClass("active");
//    $('#abtnPlaces').addClass("active");
    $('#abtnCurrentPosition').removeClass("active");

}

function onClickbtnTour()
{
	clearWatch();
	slideBack();
	$("#abtnFilterPlaces").hide();
    $("#abtnFilterTour").show();
    $('#abtnTour').addClass("active");
//    $('#abtnPlaces').removeClass("active");
    $('#abtnCurrentPosition').removeClass("active");

    if (track != null)
	{
    	map.addLayer(track);
//    	map.addLayer(osm);
    	map.removeControl(control);
    	control = new L.Control.Layers({}, {'Track':track});
//    	map.addControl(new L.Control.Layers({}, {'Track':track}));
    	map.addControl(control);
	}
    else
    {
    	createItDb();	
    }
    if (currentMarkers != null)
	{
		for(var i = 0; i < currentMarkers.length; ++i)
		{
			map.removeLayer(currentMarkers[i]);
		}
//		currentMarkers = [];
	}
    
}    

/*
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
}*/

/*
function showKeyEmail()
{
	if(window.event.keyCode == 13)
	{
		switchToMainPage($('#emailaccount').val());
	}
}*/

function submitSelectedPlaces()
{
//	$('#btnPBack').addClass('ui-disabled');
//	$('#btnClearAll').addClass('ui-disabled');
//	$('#btnShowNone').addClass('ui-disabled');
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
	}
}

function submitSelectedPlacesEn(){
	var checked = [];
	fromselectedplaces = true;
	console.log("in SubmitSelected En1");
	$('#placesContent input[type=checkbox]:checked').each(function () {
		checked.push(this.name);		//push checked items into values list
		console.log(this.name);
	});
	setTimeout(function(){
		console.log("checked.length0= "+checked.length);
		if (checked.length == 0){
			console.log("checked.length= "+checked.length);
			showAllPlaces();
			$.mobile.changePage($('#mainpage'), 'pop');
			setTimeout(function(){
				map.invalidateSize();
			},2000);
		}
		else{
			db.transaction(function (tx) {
				tx.executeSql('SELECT * FROM SUBCATEGORIESEN', [], function (tx, results) {
					var len = results.rows.length, subNew;
					for (var j=0; j<checked.length; j++){
//						alert("("+checked[j]+")");
						for (var i = 0; i < len; i++){
//							console.log("in SubmitSelected En2");
							subNew = $.trim(results.rows.item(i).name);
//							console.log("_"+subNew+"_");
							if (checked[j] == subNew){
								checked[j] = results.rows.item(i).id;
								console.log("!!#!!"+checked[j]);
							}
						}
					}
					db.transaction(function (tx) {
						tx.executeSql('SELECT * FROM POIEN', [], function (tx, results) {
							var len = results.rows.length;
							var lat2;
							console.log("in second tx.executeSql");
							for (var j=0; j<checked.length; j++){
								//						alert("@: "+checked[j]);
								for (var i = 0; i < len; i++){
//									console.log("POIEN: "+results.rows.item(i).subcategory);
									if (checked[j] == results.rows.item(i).subcategory){
										descr = results.rows.item(i).descr;
										if (descr.length > 140){			//slicing the description to the first 140 charactes.
											descr = descr.slice(0,140);
											descr += "...";
											descr += "<br>";
										}
										var x = results.rows.item(i).lat;
										var y = results.rows.item(i).long;
										x = x.replace(x.charAt(2), ".");
										y = y.replace(y.charAt(2), ".");
										if (x < 35){
											var temp = x;
											x = y;
											y = temp;
										}
										descr += "<p onclick=getMoreInfo("+x+","+y+")><i><u>"+MyApp.resources.MoreInfo+"</i></u></p>";
										descr += "<p onclick=getDirections("+x+","+y+")><i><u>"+MyApp.resources.GetDirections+"</i></u></p>";
										console.log("in SubmitSelected En3");
										lat2 = results.rows.item(i).lat;
										if ( lat2.indexOf("\n") == -1){
											addGroupMarker(results.rows.item(i).lat , results.rows.item(i).long,
														results.rows.item(i).name, descr, results.rows.item(i).category);
											console.log(results.rows.item(i).name);
										}
									}
								}
							}
							$.mobile.changePage($('#mainpage'), 'pop');
							//					map.invalidateSize();
							$("#abtnFilterTour").hide();
							$("#abtnFilterPlaces").hide();
							setTimeout(function(){
								map.invalidateSize();
							},1000);
							setLabelsForMainPage();
							$('.options').css({'display':'none'});
						}, errorCB);
					});
				}, errorCB);
			});
			console.log("in SubmitSelected En4");
		}
	},2500);

}

function submitSelectedPlacesGr(){
	var checked = [];
	fromselectedplaces = true;
	console.log("in here!!");
	$('#placesContent input[type=checkbox]:checked').each(function () {
		checked.push(this.name);		//push checked items into values list
		console.log(this.name);
	});
	setTimeout(function(){
		if (checked.length == 0){
			console.log("checked.length= "+checked.length);
			showAllPlaces();
			$.mobile.changePage($('#mainpage'), 'pop');
			setTimeout(function(){
				map.invalidateSize();
			},2000);
		}
		else{
			db.transaction(function (tx) {
				tx.executeSql('SELECT * FROM SUBCATEGORIESGR', [], function (tx, results) {
					var len = results.rows.length, subNew;
					console.log("!!!! "+len);
					for (var j=0; j<checked.length; j++){
//						alert("("+checked[j]+")");
						for (var i = 0; i < len; i++){
							subNew = $.trim(results.rows.item(i).name);
//							alert("_"+subNew+"_");
							if (checked[j] == subNew){
								checked[j] = results.rows.item(i).id;
//								alert("#"+checked[j]);
							}
						}
					}
					db.transaction(function (tx) {
						tx.executeSql('SELECT * FROM POIGR', [], function (tx, results) {
							var lat2;
							var len = results.rows.length;
							for (var j=0; j<checked.length; j++){
//								alert("@: "+checked[j]);
								for (var i = 0; i < len; i++){
									if (checked[j] == results.rows.item(i).subcategory){
										descr = results.rows.item(i).descr;
										console.log(descr);
										if (descr.length > 140){			//slicing the description to the first 140 charactes.
											descr = descr.slice(0,140);
											descr += "...";
											descr += "<br>";
											console.log("1231231: "+descr);
										}
										var x = results.rows.item(i).lat;
										var y = results.rows.item(i).long;
										x = x.replace(x.charAt(2), ".");
										y = y.replace(y.charAt(2), ".");
										if (x < 35){
											var temp = x;
											x = y;
											y = temp;
										}
										descr += "<p onclick=getMoreInfo("+x+","+y+")><i><u>"+MyApp.resources.MoreInfo+"</i></u></p>";
										descr += "<p onclick=getDirections("+x+","+y+")><i><u>"+MyApp.resources.GetDirections+"</i></u></p>";
										lat2 = results.rows.item(i).lat;
										if ( lat2.indexOf("\n") == -1){
											addGroupMarker(results.rows.item(i).lat , results.rows.item(i).long,
													results.rows.item(i).name, descr, results.rows.item(i).category);
										}
									}
								}
							}
							$.mobile.changePage($('#mainpage'), 'pop');
//							map.invalidateSize();
							$("#abtnFilterTour").hide();
							$("#abtnFilterPlaces").hide();
							setTimeout(function(){
								map.invalidateSize();
							},1000);
							setLabelsForMainPage();
							$('.options').css({'display':'none'});
						}, errorCB);
					});
				}, errorCB);
			});
		}
	},2500);
}

function showAllPlaces(){
	if (currentMarkers != null){
		for(var i = 0; i < currentMarkers.length; ++i)
		{
			map.removeLayer(currentMarkers[i]);
		}
		currentMarkers = [];
	}
	var descr;
	var lat2;
	document.getElementById("loading_gif").style.display = "block";
	if (langstr == 'en'){
//		alert("lang: en");
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM POIEN', [], function (tx, results) {
				var len = results.rows.length, i;
//				dataloading();
				console.log("eep");
				
				for (i = 0; i < len; i++){
					descr = results.rows.item(i).descr;
					if (descr.length > 140){			//slicing the description to the first 140 charactes.
						descr = descr.slice(0,140);
						descr += "...";
						descr += "<br>";
//						descr += '';
					}
					var x = results.rows.item(i).lat;
					var y = results.rows.item(i).long;
					x = x.replace(x.charAt(2), ".");
					y = y.replace(y.charAt(2), ".");
					if (x < 35){
						var temp = x;
						x = y;
						y = temp;
					}
					descr += "<p onclick=getMoreInfo("+x+","+y+")><i><u>"+MyApp.resources.MoreInfo+"</i></u></p>";
					descr += "<p onclick=getDirections("+x+","+y+")><i><u>"+MyApp.resources.GetDirections+"</i></u></p>";
					lat2 = results.rows.item(i).lat;
					if ( lat2.indexOf("\n") == -1){
						addGroupMarker(results.rows.item(i).lat , results.rows.item(i).long,
								results.rows.item(i).name, descr, results.rows.item(i).category);
						}
					}
//				dataload();
//				$('#loading_gif').removeClass();
				console.log("oop");
				document.getElementById("loading_gif").style.display = "none";
				}
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
						descr += "<br>";
					}
					var x = results.rows.item(i).lat;
					var y = results.rows.item(i).long;
					x = x.replace(x.charAt(2), ".");
					y = y.replace(y.charAt(2), ".");
					if (x < 35){
						var temp = x;
						x = y;
						y = temp;
					}
					descr += "<p onclick=getMoreInfo("+x+","+y+")><i><u>"+MyApp.resources.MoreInfo+"</i></u></p>";
					descr += "<p onclick=getDirections("+x+","+y+")><i><u>"+MyApp.resources.GetDirections+"</i></u></p>";
					lat2 = results.rows.item(i).lat;
					if ( lat2.indexOf("\n") == -1){
						addGroupMarker(results.rows.item(i).lat , results.rows.item(i).long,
										results.rows.item(i).name, descr, results.rows.item(i).category);
					}
				}
				document.getElementById("loading_gif").style.display = "none";
			}, errorCB);
		});
	}
}

function showNone()
{
//	$('#btnPBack').addClass('ui-disabled');
//	$('#btnClearAll').addClass('ui-disabled');
//	$('#btnShowNone').addClass('ui-disabled');
	if (currentMarkers != null){
		for(var i = 0; i < currentMarkers.length; ++i)
		{
			map.removeLayer(currentMarkers[i]);
		}
	}
	$.mobile.changePage($('#mainpage'), 'pop');
	setTimeout(function(){
		map.invalidateSize();
	},1000);
	setLabelsForMainPage();
	$('.options').css({'display':'none'});
}


function checkForLanguage()
{
	if  (language == 'EN')
	{
		langstr = 'en';
		console.log(langstr);
		$.extend(MyApp.resources, enResources);
	}
	else if (language =='GR')
	{
		langstr = 'gr';
		console.log(langstr);
		$.extend(MyApp.resources, grResources);
	}
}

function showKmlFile()
{
	if (track != null)
	{
		map.removeLayer(track);
		map.removeControl(control);
	}
	if (currentMarkers != null)
	{
		for(var i = 0; i < currentMarkers.length; ++i)
		{
			map.removeLayer(currentMarkers[i]);
		}
//		currentMarkers = [];
	}
	var localtour;
	var kmlPath;
	kmlPath = 'kml/itinerary_'+itId+'_'+dd+'.kml';
	console.log("kmlPath: "+kmlPath);
//	var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
	track = new L.KML(kmlPath, {async: true});
	track.on("loaded", function(e) {
		map.fitBounds(e.target.getBounds());
	});
	map.addLayer(track);
//	map.addLayer(osm);
	control = new L.Control.Layers({}, {'Track':track});
//	map.addControl(new L.Control.Layers({}, {'Track':track}));
	map.addControl(control);
	fromSettings = false;
	setTimeout(function(){
		switchToMainPage();
	},500);
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
	document.getElementById('emailaccountitinerary').placeholder= MyApp.resources.EmailAccountPlaceholder;
	customHeader(5);
	checkForLanguage();
    $('#abtnTour5').addClass("active");
    $('#abtnCurrentPosition5').removeClass("active");
    $('#abtnExit5').removeClass("active");
    $('.options').css({'display':'none'});
	document.getElementById('btnSaveChanges5').innerHTML= MyApp.resources.SaveChanges;
//	document.getElementById('btnLoad5').innerHTML= MyApp.resources.Load;
//	document.getElementById('btnEachItineraryBack').innerHTML= MyApp.resources.Back;
	document.getElementById('btnLoadItinerary').innerHTML= MyApp.resources.LoadItinerary;
	document.getElementById('btnPortalBack').innerHTML= MyApp.resources.Back;
	var email = $('#emailaccountchange5').val();
	if ( email == null || email == ""){
		$('#emailaccountchange5').val(currentEmail);
		console.log(currentEmail);
	}
}

function reloadItineraryPortalPage()
{
	var newLanguage = $("#language_select5").val();
	var newEmail =  $("#emailaccountchange5").val();
	var newlangstr = $("#language_select5").val();
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
	console.log("111");
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
//			alert($(this).parent().parent().attr("Kml"));
//			pointCode.push(($(this).attr("Code")));
			pointCode = $(this).attr("Code");
//			alert(($(this).parent().parent().text()).slice(2,10));
//			pointName.push(($(this).text()));
			pointName = $(this).text();
//			alert(($(this).text()));
//			duration.push(($(this).parent().parent().text()).slice(2,10));
//			alert(($(this).attr("Code")));
			console.log("1 "+duration);
			duration = $(this).parent().parent().text().slice(0,10);
			console.log("2 "+duration);
			itActive = 0;
			itCompleted = 0;
//			alert("id: "+id+" title: "+title+" user: "+user+ " days: "+day +" "+pointCode+" "+pointName+" "+duration);
			tx.executeSql('INSERT INTO ITINERARIES(id, title, user, day, pointcode, pointname,coordinates, duration, isActive, completed) VALUES (?,?,?,?,?,?,?,?,?,?)'
					,[id,title,user,day,pointCode,pointName,coords,duration,itActive,itCompleted], successCB, error12CB);
		});
		loadItineraryXml2();
	});
	loadItineraryXml18();
}

function popItiDayDb(){
	var itid;
	var kml;
	var duration;

	$(xmlDoc).find("Route").each(function(){
		duration = $(xmlDoc).find("Duration").text();
		kml = $(xmlDoc).find("Route").attr("Kml");
		itid = $(xmlDoc).find("Itinerary").attr("id");
		
	});
}

function error12CB(){
	alert("error12CB");
}

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
			console.log("Title: "+pointName);
			console.log("1 "+duration);
			duration = $(this).parent().parent().text().trim().slice(0,10);
			console.log("2 "+duration);
//			alert(duration);
			itActive = 0;
			itCompleted = 0;
//			alert("id: "+id+" title: "+title+" user: "+user+ " days: "+day +" "+pointCode+" "+pointName+" "+duration);
			tx.executeSql('INSERT INTO ITINERARIES(id, title, user, day, pointcode, pointname, coordinates, duration, isActive, completed) VALUES (?,?,?,?,?,?,?,?,?,?)'
					,[id,title,user,day,pointCode,pointName,coords,duration,itActive,itCompleted], successCB, error12CB);
		});
	});
}

function loadItineraries()
{
//	var hasXml = false;
	var idis=[];
	var titles=[];
	document.getElementById('availableFiles').innerHTML='';
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM ITINERARIES', [], function (tx, results) {	
			var len = results.rows.length;
//			hasXml = true;
//			var j=0;
			for (var k=0; k<len; k++){
				idis.push(results.rows.item(k).id);
				titles.push(results.rows.item(k).title);
			}
			var x = idis.length;
			for (var j=1 ; j < idis.length ; j++){
				if (idis[j] != idis[j-1]){
					$('<a id="'+idis[j-1]+'" href="#">'+titles[j-1]+'</a>')
					.click(function() {
						j = $(this).attr("id");
						loadEachItineraryPage(j); }).appendTo($('#availableFiles'));
				}
			}
			$('<a id="'+idis[x-1]+'" href="#">'+titles[x-1]+'</a>')
			.click(function() {
				j = $(this).attr("id");
				loadEachItineraryPage(j); }).appendTo($('#availableFiles'));
			$.mobile.changePage($('#itinerarypage'), 'pop');
			$('#itinerarypage').trigger('pagecreate');     
			customHeader(3);
			$('#abtnTour3').addClass("active");
//			$('#abtnPlaces3').removeClass("active");
			$('#abtnCurrentPosition3').removeClass("active");
			$('#abtnExit3').removeClass("active");
			$('.options').css({'display':'none'});
			document.getElementById('btnSaveChanges3').innerHTML= MyApp.resources.SaveChanges;
			document.getElementById('btnLocalBack').innerHTML= MyApp.resources.Back;
			document.getElementById('btnLoadfromportal').innerHTML= MyApp.resources.LoadFromPortal;
			var email = $('#emailaccountchange3').val();
			if ( email == null || email == ""){
				$('#emailaccountchange3').val(currentEmail);
				console.log(currentEmail);
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
				console.log('inside1');
				if(data != '')
				{
					console.log('inside2');
					for (var i in data) 
					{
						$('#portalItineraries').append("<label style='margin-top:10px;' for='chk_"+data[i].ItineraryId+"'>"
								+ data[i].ItineraryTitle +"</label><input name='"+data[i].ItineraryId+"' id='chk_"
								+data[i].ItineraryId+"' class='custom' type='checkbox' value='"+ data[i].ItineraryTitle +"' />" );
					}
//					$('#abtnLoadSelected').removeClass('ui-disabled');
					$('#itineraryportalpage').trigger('pagecreate');
				}
				else
				{
//					$('#abtnLoadSelected').addClass('ui-disabled');
					alert(MyApp.resources.AvailableInitiaries);
				}
			},
			error: function () {
				alert(MyApp.resources.CouldNotLoadItineraries);
			}
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
		error: function () {
			alert("Could not get files from Portal");
		}
	});
}

function loadEachItineraryPage(id)
{
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
	pointCode = [];
	pointName = [];
	itId = id;
	document.getElementById('divItineraryInfo').innerHTML = '';
	//$('#availablePois').text('');
	document.getElementById('availablePois').innerHTML='';
	$('#availableDays').text('');
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM ITINERARIES', [], function (tx, results) {
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
				}
			}
			$('#availableDays').append('<input type="radio" class="days" name="day-choice" id="'+day[j-1]+
					'" value="'+day[j-1]+'"/><label for="'+day[j-1]+'">'+"Day "+day[j-1]+'</label>');
			$(".days").click(function show(){
				dd = $(this).attr("id");
				$('#availablePois').text('');
				for (var k=0; k < len; k++){
					if ((results.rows.item(k).day == dd) && (results.rows.item(k).id == id)){
//						$('#availablePois').append('<input type="checkbox" class="points" data-iconpos="right" name="poi-choice" id="'
//								+results.rows.item(k).pointcode+'" value="'+results.rows.item(k).pointcode+'" /><label for="'
//								+results.rows.item(k).pointcode+'">'+results.rows.item(k).pointname+" | Visited"+'</label>');
//						$('#availablePois').trigger('create');
//						$('<a id="'+results.rows.item(k).pointcode+"|"+results.rows.item(k).coordinates+'" href="#">'
						$('<a href="#" input type="button" data-icon="arrow-r" data-iconpos="right"id="'
								+results.rows.item(k).pointcode+"|"+results.rows.item(k).coordinates+'" >'
								+results.rows.item(k).pointname+'</a>')
						.click(function() {
							j = $(this).attr("id");
							loadCoordinates(j);
							}).appendTo($('#availablePois'));
						var y=k;
					}
				}
				document.getElementById('divItineraryInfo').innerHTML = "<p>"+ results.rows.item(y).title 
					+" | " +"Day " + dd + "</p>" + "<p>Duration: "+ duration[y] +"</p>";
				$('#'+$(this).attr("Code")+'').attr("checked",false).checkboxradio("refresh");
			}).first().click();
//			$("#btnCallMap").click(function(){
//				console.log("btnCallMap clicked");
//				inGetDirections = true;
//				geolocationControl(HelloWorldFunction);
//			});
			$.mobile.changePage($('#eachitinerarypage'), 'pop');
			$('#eachitinerarypage').trigger('pagecreate');
			customHeader(4);
		    $('#abtnTour4').addClass("active");
//		    $('#abtnPlaces4').removeClass("active");
		    $('#abtnCurrentPosition4').removeClass("active");
		    $('#abtnExit4').removeClass("active");
			$('#availablePois').trigger('create');
			$('#availableDays').trigger('create');
			document.getElementById('btnSaveChanges4').innerHTML= MyApp.resources.SaveChanges;
			document.getElementById('btnLoad').innerHTML= MyApp.resources.Load;
			document.getElementById('btnEachItineraryBack').innerHTML= MyApp.resources.Back;
			var email = $('#emailaccountchange4').val();
			if ( email == null || email == ""){
				$('#emailaccountchange4').val(currentEmail);
				console.log(currentEmail);
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
	console.log("lat: "+lat);
	console.log("long: "+long);
	fromLoadCoords = true;
//	geolocationControl(HelloWorldFunction);
	getDirections(lat,long);
}


//function checkedPoints(xmlTourDoc){
//	$('#availablePois input[type=checkbox]:checked').each(function (){
//		alert($(this).attr("Code"));
//	});
//}

function initializePoints(xmlTourDoc){
	var routeid = $(xmlTourDoc).filter(":first").attr("id");
	$(xmlTourDoc).find('Point').each(function(){
		var code = $(this).attr("Code");
		db.transaction(function(tx){
			tx.executeSql('INSERT INTO POINTS(id, Id_Portal, routeId, isActive, visited) VALUES (?,?,?,?,?)',[code,0,routeid,0,0], successCB, errorCB);
		});
	});
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
				console.log(results.rows.item(i).data);
			}
//			alert(dbtext);
		}, errorCB);
	});
}

//function show(){
//	console.log("in show");
//	var opts = $('.placesInfo');
//	opts.slideDown();
//}
//
//function hide(){
//	console.log("in hide");
//	var opts = $('.placesInfo');
//	opts.slideUp();
//}

function onClickSettings(){
//Options Settings
	var appopts = $('.app_options');
	var opts = $('.options');
	//var settings = opts.next();
	
	if(appopts.hasClass('no_active')){
		appopts.removeClass('no_active');
		console.log("inactive");
		opts.slideDown();
	}
	else {
		console.log("active");
		appopts.addClass('no_active');
		opts.slideUp();
	}
}

clearControl = function(clearAllMarkers){
	var control = new (L.Control.extend({
	    options: { position: 'topleft' },
	    onAdd: function (map) {
	        controlDiv = L.DomUtil.create('div', 'geolocation-button');
	        L.DomEvent
//	            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
//	            .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
	            .addListener(controlDiv, 'click', this.clearMap);
	        // Set CSS for the control border
	        var controlUI = L.DomUtil.create('div', 'clearmap-button', controlDiv);
	        controlUI.title = 'Click to clear Map!';

	        // Set CSS for the control interior
	        var controlText = L.DomUtil.create('div', 'clearmap-button', controlUI);
	        controlText.innerHTML = '<img src="images/markers_icon.png" width="66" height="55" />';
	        
	        return controlDiv;
	    }
	    }));
	    control.clearMap = clearAllMarkers;
	    return control;
};

function clearMap(){
//	if (track != null)
//	{
//		console.log("in clearAllMarkers4");
//		map.removeLayer(track);
//		map.removeControl(control);
//	}
//	if (currentMarkers != null)
//	{
//		console.log("in clearAllMarkers5");
//		for(var i = 0; i < currentMarkers.length; ++i)
//		{
//			map.removeLayer(currentMarkers[i]);
//		}
//	}
//	$("#abtnFilterTour").hide();
//	$("#abtnFilterPlaces").hide();
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
		console.log("geolocation terminated");    
	}
	else{
		watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError,{frequency:5000,maximumAge: 0, enableHighAccuracy:true
		});
		console.log("geolocation activated");
	}
};

function SetElementHeight(){
	screenHeight=$('.ui-mobile').outerHeight(true);
	var w=$('.ui-mobile').outerWidth(true);
	console.log("outerHeight= "+ screenHeight);
	console.log("outerWidth= "+ w);
	$('#map').css('height',screenHeight-85);
	$('#map').css('width',w);

}
	$(window).bind('orientationchange resize', function(event,ui){
	 SetElementHeight();
	});

function getDirections(x,y)
{
//	console.log("inGetDirections");
//	console.log("x: "+x);
//	console.log("y: "+y);
	if (isOffline){
		alert(MyApp.resources.UserMustBeOnLine);
	}
	else{
		var url = 'http://maps.google.com/maps?saddr=';
//		currentLat;
//		var currentLong;
		url += currentLat+','+currentLong;// start point
//		url += '36.809098,27.102059'; 
		url += '&daddr='+x+','+y; // end point
		//	      window.location = url;
//		var currentLat;
//		var currentLong;
		var ref = window.open(url, '_blank', 'location=no');
	}
}

function getMoreInfo(x,y)
{
	console.log("inGetMoreInfo");
	console.log("x: "+x);
	console.log("y: "+y);
}

function slide()
{
	console.log("inSlide");
	$('#inner').addClass('active');	
}

function slideBack()
{
	console.log("inSlideBack");
	$('#inner').removeClass('active');	
}

function clearWatch() {
    if (watchID != null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
    }
}
