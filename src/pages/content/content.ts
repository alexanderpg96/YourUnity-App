import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import {HttpModule, Headers, RequestOptions, Response} from '@angular/http'
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-content',
  templateUrl: 'content.html'
})

export class ContentPage {
  user = firebase.auth().currentUser;
  numEvents = 0;
  time = 0;

  constructor(public navCtrl: NavController, public http: Http, public storage: Storage) { 
    this.http.get('https://yourunity-dev.dev/api/user/' + this.user.uid).map(res => res.json()).subscribe(data => {
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
  }

}
