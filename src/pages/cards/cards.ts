import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Searchbar, App } from 'ionic-angular';
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
import { MainPage, FirstRunPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  @ViewChild('topSearch') searchbar: Searchbar;

  cardItems: any[];

  eventOpened: Boolean = false;

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

  constructor(public app: App, public navCtrl: NavController, public http: Http, public storage: Storage, public platform: Platform, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation) {
    
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLat = resp.coords.latitude;
      this.userLong = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });
    
    if (this.platform.is('ios')) {
      this.ios = true;
    }
    else {
      this.ios = false;
    }
  }

  ionViewDidLoad() {
    this.pullEvents();
    
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLat = resp.coords.latitude;
      this.userLong = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  goToWelcome() {
    this.navCtrl.setRoot(MainPage);
  }

  pullEvents() {
    this.http.get(this.baseUrl + '/api/events').map(res => res.json()).subscribe(data => {
      this.cardItems = data;
      console.log(this.cardItems);

      for(var i = 0; i < this.cardItems.length; i++) {
        var item = this.cardItems[i];
        this.storage.get(item.id.toString()).then((val) => {
          if(val) {
            this.setRegister(item, false);
          }
          else {
            this.setRegister(item, true);
          }      
        }); 
      }

      this.calculateCoords(this.cardItems);
    });

    console.log("Lat: " + this.userLat);
    console.log("Long: " + this.userLong);
  }

  calculateCoords(cardItems) {
    for(var i = 0; i < this.cardItems.length; i++) {
      var item = this.cardItems[i];

      item.distance = this.calculateDistance(this.userLat, item[0].latitude, this.userLong, item[0].longitude);
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

  register(item) {
    var user_id = firebase.auth().currentUser.uid;
    var url = this.baseUrl + '/api/register_event';
    var data =
      "event_id=" +  item.id +
      "&user_id=" + item.user_id +
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

    item.isRegister = false;

    this.storage.set(item.id.toString(), "registered");
  }

  openEvent(item) {
    this.storage.get(item.id.toString()).then((val) => {
      if(val) {
        item.isRegister = false;
      }
      else {
        item.isRegister = true;
      }      
    }); 

    item.eventOpened = !item.eventOpened;
    this.eventOpened = !this.eventOpened;

    console.log();
    console.log(item[0].latitude);
    console.log(item[0].longitude);
  }

  isOpened() {
    return this.eventOpened;
  }

  isCardOpened(item) {
    return item.eventOpened;
  }

  canRegister(item) {
    return item.isRegister;
  }

  doRefresh(refresher) {
    this.pullEvents();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 700);
  }

  private setRegister(item, isIt) {
    console.log("Function called on ID " + item.id + ", isRegistered = " + isIt);
    item.isRegister = isIt;
    console.log(item.isRegister);
  }

  getEvents(event) {
    var q = event.srcElement.value; // the query

    if(!q) {
      return;
    }

    this.cardItems = this.cardItems.filter((v) => {
      if((v.event_name && q)) {
        if(v.event_name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          this.searched = true;
          console.log(this.searched);
          return true;
        }
        return false;
      }
    });

    
  }

  resetSearch() {
    this.searched = false;

    this.searchbar.clearInput(null);

    this.pullEvents();
  }

  isSearched() {
    return this.searched;
  }
}
