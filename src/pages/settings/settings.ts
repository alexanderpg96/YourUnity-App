import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import {HttpModule, Headers, RequestOptions, Response} from '@angular/http'
import 'rxjs/add/operator/map';

import { Settings } from '../../providers/providers';

import firebase from 'firebase';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */

let _this;

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  
  user = firebase.auth().currentUser;

  account: { email: string, name_first: string, name_last: string } =  {
   email: this.user.email,
   name_first:  "First name",
   name_last: "Last name"
  };

  baseUrl: string = 'https://yourunity.org';

  constructor(public navCtrl: NavController, public settings: Settings, public navParams: NavParams, public http: Http) {
    
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter() {
    
  }

  updateUser() {
    _this = this;

    this.user.updateEmail(this.account.email).then(function() {
      // Update successful.
      console.log("Email updated");
    }).catch(function(error) {
      // An error happened.
      console.log("Email not updated");
      console.log(error);
    });

    this.user.updateProfile({
      displayName: this.account.name_first + " " + this.account.name_last,
      photoURL: ""
    }).then(function() {
      // Update successful.
      console.log("Info changed");
    }).catch(function(error) {
      console.log("Info not changed");
      console.log(error);
    });

    var user_id = this.user.uid;
      var url = this.baseUrl + '/api/add_attendee/' + user_id;
      var data = {
        "name_first" : this.account.name_first,
        "name_last" : this.account.name_last,
        "avatar" : "default.jpg",
        "email" : this.account.email
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
      _this.navCtrl.pop();
  }

  logout() {
    firebase.auth().signOut();
  }
}
