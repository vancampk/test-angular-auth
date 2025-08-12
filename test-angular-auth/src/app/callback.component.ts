import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UserStateService } from './user-state.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `<p>Processing authentication...</p>`
})
export class CallbackComponent implements OnInit {
  private oidcSecurityService = inject(OidcSecurityService);
  private router = inject(Router);
  private userStateService = inject(UserStateService);

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, accessToken, idToken, userData }) => {
      if (isAuthenticated) {
        // Decode JWT to get expiration
        let expiresAt = 0;
        if (accessToken) {
          const payload = accessToken.split('.')[1];
          if (payload) {
            const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            if (decoded && decoded.exp) {
              expiresAt = decoded.exp * 1000;
            }
          }
        }
        const userState = {
          accessToken,
          idToken,
          expiresAt,
          profile: userData
        };
        this.userStateService.setUser(userState);
        this.router.navigate(['/main-menu']);
      } else {
        // Optionally handle error or show a message
      }
    });
  }
}
