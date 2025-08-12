import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private oidcSecurityService: OidcSecurityService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.oidcSecurityService.isAuthenticated$.pipe(
      map(({ isAuthenticated }) => {
        console.log('[AuthGuard] isAuthenticated:', isAuthenticated);
        if (isAuthenticated) {
          console.log('[AuthGuard] User is authenticated, allowing route.');
          return true;
        } else {
          console.log('[AuthGuard] User is NOT authenticated, triggering authorize()');
          this.oidcSecurityService.authorize();
          return false;
        }
      })
    );
  }
}
