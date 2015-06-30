//var baseapiurl='ath.dataverse.gr:18090/api/';
var baseapiurl='http://www.kos.gr:90/api/';
var baseurl = 'http://www.kos.gr/';
var baseaccount="info@kos.gr";
var maxZoom = 16;
var minZoom = 12;
var categs = new Array();
var cuisineEn = new Array();
var cuisineGr = new Array();
var eraEn = new Array();
var eraGr = new Array();
var musicGr = new Array();
var musicEn = new Array();
var placeEn = new Array();
var placeGr = new Array();

categs[0]="";
categs[1]="shopping";
categs[2]="sights";
categs[3]="accomodation";
categs[4]="activities";
categs[5]="sea";
categs[6]="transport";
categs[7]="kos";
categs[8]="food";
categs[9]="kos";
categs[10]="entertainment";
cuisineEn[0]="Greek";
cuisineEn[1]="Chinese";
cuisineEn[2]="Vegeterian";
cuisineEn[3]="French";
cuisineEn[4]="Spanish";
cuisineEn[5]="International";
cuisineEn[6]="Italian";
cuisineEn[7]="Sea Food";
cuisineEn[8]="Mediterranean";
cuisineEn[9]="Swedish";
cuisineEn[10]="Scandinavian";
cuisineEn[11]="Fast Food";
cuisineEn[12]="Ice Cream";
cuisineEn[13]="Frozen Yogurt";
cuisineEn[14]="English";
cuisineEn[15]="Asian";
cuisineEn[16]="Take away";
cuisineEn[17]="Creperie";
cuisineEn[18]="Mexican";
cuisineEn[19]="Indian";
cuisineGr[0]="Ελληνική";
cuisineGr[1]="Κινέζικη";
cuisineGr[2]="Vegeterian";
cuisineGr[3]="Γαλλική";
cuisineGr[4]="Ισπανική";
cuisineGr[5]="Διεθνής";
cuisineGr[6]="Ιταλική";
cuisineGr[7]="Θαλασσινά";
cuisineGr[8]="Μεσογειακή";
cuisineGr[9]="Σουηδική";
cuisineGr[10]="Σκανδιναβική";
cuisineGr[11]="Fast Food";
cuisineGr[12]="Παγωτό";
cuisineGr[13]="Παγωμένο γιαούρτι";
cuisineGr[14]="Αγγλική";
cuisineGr[15]="Ανατολίτικη";
cuisineGr[16]="Take away";
cuisineGr[17]="Κρεπερί";
cuisineGr[18]="Μεξικάνικη";
cuisineGr[19]="Ινδική";
eraEn[0]="Prehistoric";
eraEn[1]="Antiquity";
eraEn[2]="Byzantine";
eraEn[3]="Medieval";
eraEn[4]="Modern";
eraGr[0]="Προϊστορική";
eraGr[1]="Αρχαία";
eraGr[2]="Βυζαντινή";
eraGr[3]="Μεσαιωνική";
eraGr[4]="Νεότερη";
musicEn[0]="Electronica-Industrial";
musicEn[1]="Jazz-Blues-Ethnic";
musicEn[2]="Live";
musicEn[3]="Rock-pop-folk";
musicEn[4]="Soul-Funk-R&B";
musicEn[5]="Greek";
musicEn[6]="Classical";
musicEn[7]="Music of the World";
musicEn[8]="Experimental";
musicGr[0]="Electronica-Industrial";
musicGr[1]="Jazz-Blues-Ethnic";
musicGr[2]="Live";
musicGr[3]="Rock-pop-folk";
musicGr[4]="Soul-Funk-R&B";
musicGr[5]="Ελληνική";
musicGr[6]="Κλασική";
musicGr[7]="Μουσικές του κόσμου";
musicGr[8]="Πειραματική";
placeEn[0]="Antimachia";
placeEn[1]="Zipari";
placeEn[2]="Zia";
placeEn[3]="Kardamena";
placeEn[4]="Kefalos";
placeEn[5]="Kos (Town)";
placeEn[6]="Marmari";
placeEn[7]="Mastihari";
placeEn[8]="Pili";
placeEn[9]="Tigkaki";
placeGr[0]="Αντιμάχεια";
placeGr[1]="Ζηπάρι";
placeGr[2]="Ζιά";
placeGr[3]="Καρδάμαινα";
placeGr[4]="Κέφαλος";
placeGr[5]="Κως (Πόλη)";
placeGr[6]="Μαρμάρι";
placeGr[7]="Μαστιχάρι";
placeGr[8]="Πυλί";
placeGr[9]="Τιγκάκι";

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    'use strict';
    if (this == null) {
      throw new TypeError();
    }
    var n, k, t = Object(this),
        len = t.length >>> 0;

    if (len === 0) {
      return -1;
    }
    n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}


























