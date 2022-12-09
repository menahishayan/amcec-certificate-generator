import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxFileHelpersModule } from 'ngx-file-helpers';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Certificate } from './certificate.component';

@NgModule({
  declarations: [
    AppComponent,
    Certificate
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxFileHelpersModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
