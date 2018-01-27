import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import firebase from 'firebase';
import { MainPage } from '../pages';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
let _this;

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  loggedIn: Boolean = false;

  constructor(public navCtrl: NavController) { 
    _this = this;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.loggedIn = true;
        _this.goToMain();
      } else {
        // No user is signed in.
      }
    });

    
  }

  goToMain() {
    this.navCtrl.push(MainPage);
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
}
