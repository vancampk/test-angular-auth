import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth } from 'angular-auth-oidc-client';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  provideHttpClient(),
    provideRouter(routes),
    provideAuth({
      config: {
        authority: 'https://demo.duendesoftware.com',
  redirectUrl: window.location.origin + '/callback',
        clientId: 'interactive.public',
        scope: 'openid profile email api',
        responseType: 'code',
        silentRenew: false,
        useRefreshToken: false,
      },
    })
  ]
};
