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
      }
    });
  }

  register(item) {
    var user_id = this.user.uid;
    var url = 'https://yourunity-dev.dev/api/register_event';
    var data = {
      "event_id" : item.id,
      "firedb_id" : user_id,
      "check_in_time" : 0,
      "duration" : 0,
      "activity_status" : 2
    };

    let headers = new Headers ({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers }); 

    // Check in user on server
    this.http.post(url, JSON.stringify(data), options)
    .map(res => res.json())
    .subscribe(data =>
      console.log(data)
    );

    console.log("uploaded");

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
        this.storage.get(item.id.toString()).then((val) => {
          if(val) {
            this.setRegister(item, false);
          }
          else {
            this.setRegister(item, true);
          }      
        }); 
      }
    });

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 700);
  }

  private setRegister(item, isIt) {
    console.log("Function called on ID " + item.id + ", value = " + isIt);
    item.isRegister = isIt;
    console.log(item.isRegister);
  }
}
