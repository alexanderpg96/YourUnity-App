import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// import { Items } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html'
})
export class EventDetailPage {
  event: any;

  constructor(public navCtrl: NavController, navParams: NavParams) {
    this.event = navParams.get('event');
    // this.event = navParams.get('event');
  }

  swipeEvent($e) {
      console.log("Swiped down");
      this.navCtrl.pop();
    
  }

}
