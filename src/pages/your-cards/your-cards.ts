import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-your-cards',
  templateUrl: 'your-cards.html'
})
export class YourCardsPage {
  cardItems: any[];

  constructor(public navCtrl: NavController) {
    this.cardItems = [
      {
        event: {
          name: 'Mission Beach Clean Up',
        },
        organization: 'San Diego Parks and Recreation',
        time: '8:00 AM - 12:00 PM',
        cat_image: 'assets/img/splashbg.jpg',
        content: 'San Diego beaches are beautiful and clean. Let us keep them that way',
      }
    ];

  }
}
