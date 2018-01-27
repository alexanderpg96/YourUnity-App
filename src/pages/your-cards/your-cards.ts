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

@IonicPage()
@Component({
  selector: 'page-your-cards',
  templateUrl: 'your-cards.html'
})
export class YourCardsPage {
  cardItems: any[];
  opened: Boolean = false;
  isInEnabled: Boolean = false;
  isOutEnabled: Boolean = false;
  user = firebase.auth().currentUser;
  checkin: any;
  ios: Boolean;
  latitude : any;
  longitude : any;
  location: Geolocation;
  userLat: any;
  userLong: any;
  distance: number;


  constructor(public navCtrl: NavController, public http: Http, public storage: Storage, public platform: Platform, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation) {
    this.http.get('https://yourunity-dev.dev/api/user_events/' + this.user.uid).map(res => res.json()).subscribe(data => {
      this.cardItems = data;
      console.log(this.cardItems);

      this.geolocation.getCurrentPosition().then((resp) => {
        this.userLat = resp.coords.latitude;
        this.userLong = resp.coords.longitude;
       }).catch((error) => {
         console.log('Error getting location', error);
       });
      
      for(var i = 0; i < this.cardItems.length; i++) {
        var item = this.cardItems[i];

        // if statement to check if time has started and check status (1 = event started, 2 = not started)
        if(item.starts <= Math.round((new Date()).getTime() / 1000) && item.ends >= Math.round((new Date()).getTime() / 1000)) {
          this.storage.get(item.id.toString()).then((val) => {
            if(val) {
              console.log(item.id + " is checked in already");
              this.setIn(item, false);
              this.setOut(item, true);
            }
            else {
              console.log(item.id + " is not checked in yet");
              this.setIn(item, true);
              this.setOut(item, false);
            }      
          });      
        }
        else {
          item.isInEnabled = false;
          item.isOutEnabled = false;
        }

        if(item.ends <= Math.round((new Date()).getTime() / 1000)) {
          // Don't show event
        }

        this.nativeGeocoder.forwardGeocode(item.location).then((coordinates: NativeGeocoderForwardResult) => {
          item.latitude = coordinates.latitude;
          item.longitude = coordinates.longitude;
        }).catch((error: any) => console.log(error));

        item.distance = this.calculateDistance(this.userLat, item.latitude, this.userLong, item.longitude);
        
        console.log(item.distance);
        console.log(item.isInEnabled);
        console.log(item.isOutEnabled);
      }

      console.log(this.cardItems);
      console.log(this.user.uid);
    });

    if (this.platform.is('ios')) {
      this.ios = true;
    }
    else {
      this.ios = false;
    }
  }

  calculateDistance(lat1:number,lat2:number,long1:number,long2:number){
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    dis = Math.round( ((dis)) * 10 ) / 10;
    return dis;
  }

  doRefresh(refresher) {
    this.http.get('https://yourunity-dev.dev/api/user_events/' + this.user.uid).map(res => res.json()).subscribe(data => {
      this.cardItems = data;
      
      for(var i = 0; i < this.cardItems.length; i++) {
        var item = this.cardItems[i];
        console.log("hello");
        // if statement to check if time has started and check status (1 = event started, 2 = not started)
        if(item.starts <= Math.round((new Date()).getTime() / 1000) && item.ends >= Math.round((new Date()).getTime() / 1000)) {
          this.storage.get(item.id.toString()).then((val) => {
            if(val) {
              this.setIn(item, false);
              this.setOut(item, true);
            }
            else {
              this.setIn(item, true);
              this.setOut(item, false);
            }      
          });      
        }
        else {
          item.isInEnabled = false;
          item.isOutEnabled = false;
        }

        this.nativeGeocoder.forwardGeocode(item.location).then((coordinates: NativeGeocoderForwardResult) => {
          item.latitude = coordinates.latitude;
          item.longitude = coordinates.longitude;
        }).catch((error: any) => console.log(error));

        item.distance = this.calculateDistance(this.userLat, item.latitude, this.userLong, item.longitude);
      }
      console.log(this.cardItems);
      console.log(this.user.uid);
    });

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 700);
  }

  toggle(item) {
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
    var url = 'https://yourunity-dev.dev/api/checkin/' + user_id + '/' + item.id;
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

    console.log("uploaded");

    item.isInEnabled = false;
    item.isOutEnabled = true;

    this.storage.set(item.id.toString(), checkinTime);
    this.storage.get(item.id.toString()).then((val) => {console.log(val)});
  }

  checkOut(item) {
    this.storage.get(item.id.toString()).then((checkin) => {
      var user_id = this.user.uid;
      var url = 'https://yourunity-dev.dev/api/checkin/' + user_id + '/' + item.id;
      var data = {
        "check_in_time" : checkin,
        "duration" : ((Math.round((new Date()).getTime() / 1000)) - (checkin)),
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

      console.log("uploaded");
      //console.log(((Math.round((new Date()).getTime() / 1000)) - (parseInt(item.check_in_time, 10))));
      console.log(data);

      item.isInEnabled = false;
      item.isOutEnabled = false;
    });
    
    this.storage.remove(item.id.toString());
  }
}
