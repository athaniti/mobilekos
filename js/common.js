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
cuisineGr[0]="��������";
cuisineGr[1]="��������";
cuisineGr[2]="Vegeterian";
cuisineGr[3]="�������";
cuisineGr[4]="��������";
cuisineGr[5]="�������";
cuisineGr[6]="�������";
cuisineGr[7]="���������";
cuisineGr[8]="����������";
cuisineGr[9]="��������";
cuisineGr[10]="������������";
cuisineGr[11]="Fast Food";
cuisineGr[12]="������";
cuisineGr[13]="�������� ��������";
cuisineGr[14]="�������";
cuisineGr[15]="�����������";
cuisineGr[16]="Take away";
cuisineGr[17]="�������";
cuisineGr[18]="����������";
cuisineGr[19]="������";
eraEn[0]="Prehistoric";
eraEn[1]="Antiquity";
eraEn[2]="Byzantine";
eraEn[3]="Medieval";
eraEn[4]="Modern";
eraGr[0]="�����������";
eraGr[1]="������";
eraGr[2]="���������";
eraGr[3]="����������";
eraGr[4]="�������";
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
musicGr[5]="��������";
musicGr[6]="�������";
musicGr[7]="�������� ��� ������";
musicGr[8]="�����������";
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
placeGr[0]="����������";
placeGr[1]="������";
placeGr[2]="���";
placeGr[3]="����������";
placeGr[4]="�������";
placeGr[5]="��� (����)";
placeGr[6]="�������";
placeGr[7]="���������";
placeGr[8]="����";
placeGr[9]="�������";

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


























