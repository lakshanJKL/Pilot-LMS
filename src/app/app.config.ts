import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {AngularFirestore, AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment.development";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    importProvidersFrom([
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireStorageModule,
      AngularFireDatabaseModule
    ]),
    provideAnimationsAsync()]
};
