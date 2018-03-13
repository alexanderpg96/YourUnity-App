import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { IonicPage, NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import {Headers, RequestOptions} from '@angular/http'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import {DomSanitizer} from '@angular/platform-browser'

import firebase from 'firebase';
import { InAppBrowser } from '@ionic-native/in-app-browser';

// import { Items } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html'
})
export class EventPage {
  item: any;
  isRegister: Boolean = true;

  user = firebase.auth().currentUser;

  ios: Boolean;

  latitude : any;
  longitude : any;
  userLat: any;
  userLong: any;
  distance: number;

  searched: Boolean = false;

  baseUrl: string = 'https://yourunity.org';

  constructor(public sanitizer: DomSanitizer, public iab: InAppBrowser, public navCtrl: NavController, public navParams: NavParams, public http: Http, public storage: Storage, public platform: Platform, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLat = resp.coords.latitude;
      this.userLong = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
    });

     this.item = navParams.get("eventDetails");
     this.item.event_description = this.linkify(this.item.event_description);
    
    if (this.platform.is('ios')) {
      this.ios = true;
    }
    else {
      this.ios = false;
    }
  }

  ionViewDidLoad() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLat = resp.coords.latitude;
      this.userLong = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });

     this.storage.get(this.item.id.toString()).then((val) => {
      if(val) {
        this.item.isRegister = false;
      }
      else {
        this.item.isRegister = true;
      }      
    }); 
  }

  calculateCoords() {
    this.item.distance = this.calculateDistance(this.userLat, this.item[0].latitude, this.userLong, this.item[0].longitude);
  }

  calculateDistance(lat1:number,lat2:number,long1:number,long2:number){
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    dis = Math.round( ((dis)) * 10 ) / 10;
    return dis;
  }

  canRegister() {
    return this.item.isRegister;
  }

  register() {
    var user_id = firebase.auth().currentUser.uid;
    var url = this.baseUrl + '/api/register_event';
    var data =
      "event_id=" +  this.item.id +
      "&user_id=" + this.item.user_id +
      "&firedb_id=" + user_id +
      "&check_in_time=" + 0 +
      "&duration=" + 0 +
      "&activity_status=" + 2;

    let headers = new Headers ({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers }); 

    // Check in user on server
    this.http.post(url, data, options)
    .map(res => res.json())
    .subscribe(data =>
      console.log(data)
    );

    console.log("Registration completed");

    this.item.isRegister = false;

    this.storage.set(this.item.id.toString(), "registered");
  }

  linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a onclick="openExternal(\'$1\')">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a onclick="openExternal(\'http://$2\')">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return this.sanitizer.bypassSecurityTrustHtml(replacedText);
  }

}
