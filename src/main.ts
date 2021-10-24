import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializeApp } from "firebase/app";
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

const firebaseConfig = {
  apiKey: "AIzaSyBTkZNKwa1NbJ3hGHt_VMYu-35HFCEcJts",
  authDomain: "minimize-automata.firebaseapp.com",
  projectId: "minimize-automata",
  storageBucket: "minimize-automata.appspot.com",
  messagingSenderId: "786162899018",
  appId: "1:786162899018:web:d6f3d47e923dc258c16eb3"
};

const app = initializeApp(firebaseConfig);