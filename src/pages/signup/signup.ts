import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import {HttpModule, Headers, RequestOptions, Response} from '@angular/http'
import 'rxjs/add/operator/map';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';

import firebase from "firebase";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name_first: string, name_last: string, email: string, password: string } = {
    name_first: 'First Name',
    name_last: 'Last Name',
    email: 'Your Email',
    password: 'test'
  };

  baseUrl: string = 'https://yourunity.org';

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService, public http: Http) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {
    // Attempt to register through Firebase

    var errorBool = false;

    firebase.auth().createUserWithEmailAndPassword(this.account.email, this.account.password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } 
      else {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END createwithemail]

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        // Update the user's name as well
        user.updateProfile({
          displayName: this.account.name_first + " " + this.account.name_last,
          photoURL: ""
        }).then(function() {
          console.log(user.uid);
        }).catch(function(error) {
          // An error happened.
        });

        this.navCtrl.push(MainPage);

      this.pushAccount(firebase.auth().currentUser.uid);
      }
    });
  }

  pushAccount(user) {
    // Push information to the database
    var user_id = user;
    var url = this.baseUrl + '/api/add_attendee';
    var data = {
      "firedb_id" : user_id,
      "name_first" : this.account.name_first,
      "name_last" : this.account.name_last,
      "avatar" : "default.jpg",
      "email" : this.account.email
    };

    console.log(data);

    let headers = new Headers ({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers }); 

    // Check in user on server
    this.http.post(url, JSON.stringify(data), options)
    .map(res => res.json())
    .subscribe(data =>
      console.log(data)
    );
  }
  
}
