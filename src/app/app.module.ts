import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {ApiService} from "../service/api.service";
import {RequestService} from "../service/utils/request.service";
import {OneWorkerService} from "../service/utils/one-worker.service";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import {HomePageComponent} from "../component/homepage.component";
import {AlbumComponent} from "../component/album.component";
import {MenuService} from "../service/menu.service";

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AlbumComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    ApiService,
    RequestService,
    OneWorkerService,
    MenuService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
