import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { WinComponent } from './win/win.component';
import { GameComponent } from './game/game.component';
import { StartComponent } from './start/start.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const routes: Routes = [
  {
    path: '', component: AppComponent, children: [
      { path: '', component: StartComponent },
      { path: 'game', component: GameComponent },
      { path: 'win', component: WinComponent },
      { path: '**', redirectTo: '/' },
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    GameComponent,
    WinComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
