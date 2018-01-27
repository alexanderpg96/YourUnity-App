import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import {HttpModule, Headers, RequestOptions, Response} from '@angular/http'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

import firebase from 'firebase';
//import { SettingsPage } from '../settings/settings';

@IonicPage()
@Component({
  selector: 'page-content',
  templateUrl: 'content.html'
})

export class ContentPage {
  user = firebase.auth().currentUser;
  numEvents = 0;
  time = 0;

  cardItems: any[];
  opened: Boolean = false;
  isInEnabled: Boolean = false;
  isOutEnabled: Boolean = false;
  checkin: any;
  ios: Boolean;
  latitude : any;
  longitude : any;
  location: Geolocation;
  userLat: any;
  userLong: any;
  distance: number;

  baseUrl: string = 'https://yourunity.org';

  constructor(public navCtrl: NavController, public http: Http, public storage: Storage, public platform: Platform, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation) { 
    this.http.get(this.baseUrl + '/api/user/' + this.user.uid).map(res => res.json()).subscribe(data => {
      for(var i = 0; i < data.length; i++) {
        if(data[i].activity_status === 0) {
          this.numEvents++;
          this.time += data[i].duration;
        }
      }

      this.time = Math.round( ((this.time)/3600) * 10 ) / 10;

      console.log(this.numEvents);
      console.log(this.time);
    });

    // Getting user events

    this.pullEvents();

    if (this.platform.is('ios')) {
      this.ios = true;
    }
    else {
      this.ios = false;
    }
  }

  ionViewDidLoad() {
    this.getUserLocation();
  }

  pullEvents() {
    this.http.get(this.baseUrl + '/api/user_events/' + this.user.uid).map(res => res.json()).subscribe(data => {
      this.cardItems = data;
      
      for(var i = 0; i < this.cardItems.length; i++) {
        if(this.cardItems[i].activity_status === 0) {
          this.numEvents++;
          this.time += this.cardItems[i].duration;
        }

        var item = this.cardItems[i];

        // if statement to check if time has started and check status (1 = event started, 2 = not started)
        if(item.starts <= Math.round((new Date()).getTime() / 1000) && item.ends >= Math.round((new Date()).getTime() / 1000)) {
          var key = item.id.toString() + "_check";
          this.storage.get(key).then((val) => {
            if(val) {
              console.log("id: " + item.id + ", checkin turned off");
              this.setIn(item, false);
              this.setOut(item, true);
            }
            else {
              console.log("id: " + item.id + ", checkin turned on");
              this.setIn(item, true);
              this.setOut(item, false);
            }      
          });      
        }
        else {
          item.isInEnabled = false;
          item.isOutEnabled = false;
        }

        item.distance = this.calculateDistance(this.userLat, item.latitude, this.userLong, item.longitude);
      }
      console.log(this.cardItems);
      console.log(this.user.uid);
    });

    console.log("Lat: " + this.userLat);
    console.log("Long: " + this.userLong);
  }

  getUserLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLat = resp.coords.latitude;
      this.userLong = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  ////////// Functions for Settings //////////////

  openSettings() {
    this.navCtrl.push('SettingsPage');
  }

  /////////// Functions for User Events ////////////

  calculateDistance(lat1:number,lat2:number,long1:number,long2:number){
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    dis = Math.round( ((dis)) * 10 ) / 10;
    return dis;
  }

  doRefresh(refresher) {
    this.pullEvents();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 700);
  }

  toggle(item) {
    console.log(item.id);
    item.opened = !item.opened;
  }

  setIn(item, isIt) {
    console.log("in");
    console.log(isIt);
    item.isInEnabled = isIt;
  }

  setOut(item, isIt) {
    item.isOutEnabled = isIt;
  }

  isCardOpened(item) {
    return item.opened;
  }

  isCheckin(item) {
    return item.isInEnabled;
  }

  isCheckout(item) {
    return item.isOutEnabled;
  }

  checkIn(item) {
    var user_id = this.user.uid;
    var url = this.baseUrl + '/api/checkin/' + user_id + '/' + item.id;
    var checkinTime = Math.round((new Date()).getTime() / 1000)
    var data = {
      "check_in_time" : Math.round((new Date()).getTime() / 1000),
      "duration" : 0,
      "activity_status" : 1
    };
    let headers = new Headers ({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers }); 

    // Check in user on server
    this.http.patch(url, JSON.stringify(data), options)
    .map(res => res.json())
    .subscribe(data =>
      console.log(data)
    );

    console.log("Checked in");

    item.isInEnabled = false;
    item.isOutEnabled = true;

    var key = item.id.toString() + "_check";
    this.storage.set(key, checkinTime);
    this.storage.get(key).then((val) => {console.log(val)});
  }

  checkOut(item) {
    var key = item.id.toString() + "_check";
    var duration = Math.round((new Date()).getTime() / 1000);

    this.storage.get(key).then((checkin) => {
      duration = duration - checkin;
      var user_id = this.user.uid;
      var url = this.baseUrl + '/api/checkin/' + user_id + '/' + item.id;
      var data = {
        "check_in_time" : checkin,
        "duration" : duration,
        "activity_status" : 0
      };
      let headers = new Headers ({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers }); 
        
      // Check in user on server
      this.http.patch(url, JSON.stringify(data), options)
      .map(res => res.json())
      .subscribe(data =>
        console.log(data)
      );

      console.log("Checked out");
      console.log(data);

      item.isInEnabled = false;
      item.isOutEnabled = false;

      if(duration < 60) {
        alert("Thanks for volunteering! You volunteered for " + duration + " seconds!");
      }
      else if(duration < 3600) {
        alert("Thanks for volunteering! You volunteered for " + (duration/60) + " minutes!");
      }
      else {
        alert("Thanks for volunteering! You volunteered for " + (duration/3600) + " hours!");
      }
      
    });
    
    var key = item.id.toString() + "_check";
    this.storage.remove(key);
  }

}
