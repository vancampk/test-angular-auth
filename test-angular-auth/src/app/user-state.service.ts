import { Injectable, signal } from '@angular/core';

export interface UserState {
  accessToken: string;
  idToken: string;
  expiresAt: number;
  profile: any;
}

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private _user = signal<UserState | null>(null);

  get user() {
    return this._user();
  }

  setUser(user: UserState) {
    this._user.set(user);
    localStorage.setItem('userState', JSON.stringify(user));
  }

  loadUserFromStorage() {
    const data = localStorage.getItem('userState');
    if (data) {
      this._user.set(JSON.parse(data));
    }
  }

  clearUser() {
    this._user.set(null);
    localStorage.removeItem('userState');
  }
}
