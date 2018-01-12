import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

// import { Items } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html'
})
export class EventDetailPage {
  event: any;
  ios: Boolean;
  latitude : any;
  longitude : any;
  distance: number;
  userLat = 37.987410;
  userLong = -121.834294;

  constructor(public navCtrl: NavController, navParams: NavParams, public platform: Platform, private nativeGeocoder: NativeGeocoder) {
    if (this.platform.is('ios')) {
      this.ios = true;
    }
    else {
      this.ios = false;
    }

    this.nativeGeocoder.forwardGeocode('1820 Capital Drive Brentwood, CA').then((coordinates: NativeGeocoderForwardResult) => {
      console.log(coordinates.latitude);
      this.latitude = coordinates.latitude;
      this.longitude = coordinates.longitude;
      this.distance = this.calculateDistance(this.userLat, this.latitude, this.userLong, this.longitude);
      this.distance = Math.round( ((this.distance)) * 10 ) / 10;
      console.log("Distance in then: " + this.distance);
    }).catch((error: any) => console.log(error));
        
    console.log("Distance: " + this.distance);
  }

  calculateDistance(lat1:number,lat2:number,long1:number,long2:number){
    let p = 0.017453292519943295;    // Math.PI / 180
    console.log("p: " + p);
    let c = Math.cos;
    console.log("c: " + c);
    let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
    console.log("a: " + a);
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    console.log("dis: " + dis);
    return dis;
  }

}
