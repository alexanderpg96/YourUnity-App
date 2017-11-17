import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { YourCardsPage } from './your-cards';

@NgModule({
  declarations: [
    YourCardsPage,
  ],
  imports: [
    IonicPageModule.forChild(YourCardsPage),
    TranslateModule.forChild()
  ],
  exports: [
    YourCardsPage
  ]
})
export class YourCardsPageModule { }
