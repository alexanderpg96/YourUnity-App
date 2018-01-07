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


  constructor(public navCtrl: NavController, public http: Http, public storage: Storage) {
    this.http.get('https://yourunity-dev.dev/api/user_events/' + this.user.uid).map(res => res.json()).subscribe(data => {
      this.cardItems = data;
      
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

        console.log(item.isInEnabled);
        console.log(item.isOutEnabled);
      }

      console.log(this.cardItems);
      console.log(this.user.uid);
    });
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
