import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  cardItems: any[];

  constructor(public navCtrl: NavController) {
    this.cardItems = [
      {
        event: {
          name: 'Gardening Event',
        },
        organization: 'Community Garden',
        time: '5:00 PM - 7:00 PM',
        cat_image: 'assets/img/eco.jpg',
        content: 'Come and join us to lay mulch and plant flowers!',
      },
      {
        event: {
          name: 'Feed the Homeless',
        },
        organization: 'Dau Bum',
        time: '3:00 PM - 8:00 PM',
        cat_image: 'assets/img/splashbg.jpg',
        content: 'Come by the temple and make some sandwiches to hand out to the homeless community in San Diego',
      },
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
