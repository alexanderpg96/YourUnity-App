import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import {Headers, RequestOptions} from '@angular/http'
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

  account: { email: string } =  {
   email: ""
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

    if(this.account.email == "") {
      // do nothing
      alert("Please fill in email");
    }
    else {
      this.user.updateEmail(this.account.email).then(function() {
        // Update successful.
        console.log("Email updated");
      }).then(this.pushUpdate())
      .catch(function(error) {
        // An error happened.
        console.log("Email not updated");
        console.log(error);
      });
    }
  }

  pushUpdate() {
    var user_id = this.user.uid;
      var url = this.baseUrl + '/api/update_attendee';
      var data = 
        "firedb_id=" + user_id +
        "&email=" + this.account.email;

        let headers = new Headers ({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers }); 

      // Check in user on server
      this.http.post(url, data, options)
      .map(res => res.json())
      .subscribe(data =>
        console.log(data)
      );

      console.log("uploaded");
      _this.navCtrl.pop();

      var hello: any = "hello";
      return hello;
  }

  logout() {
    firebase.auth().signOut();
  }
}
