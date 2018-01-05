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
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  cardItems: any[];
  eventOpened: Boolean = false;
  isRegister: Boolean = true;
  user = firebase.auth().currentUser;

  constructor(public navCtrl: NavController, public http: Http, public storage: Storage) {
    this.http.get('https://yourunity-dev.dev/api/events/').map(res => res.json()).subscribe(data => {
      this.cardItems = data;
      
      for(var i = 0; i < this.cardItems.length; i++) {
        var item = this.cardItems[i];
        item.isRegister = true;
      }
    });
  }

  openEvent(item) {
    item.eventOpened = !item.eventOpened;
    this.eventOpened = !this.eventOpened;

    // this.navCtrl.push('EventDetailPage', {
    //   event: event
    // });
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
    this.http.get('https://yourunity-dev.dev/api/events').map(res => res.json()).subscribe(data => {
      this.cardItems = data;
      
      for(var i = 0; i < this.cardItems.length; i++) {
        var item = this.cardItems[i];
      }
    });

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 700);
  }
}
