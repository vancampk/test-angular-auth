import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { CallbackComponent } from './callback.component';
import { Component } from '@angular/core';

@Component({
	selector: 'app-main-menu',
	standalone: true,
	template: `<h1>Main Menu</h1><p>Welcome! You are authenticated.</p>`
})
export class MainMenuComponent {}

export const routes: Routes = [
	{
		path: 'callback',
		component: CallbackComponent,
	},
	{
		path: 'main-menu',
		component: MainMenuComponent,
        canActivate: [AuthGuard],
	},
	{
		path: '',
		canActivate: [AuthGuard],
		children: [], // Add child routes here as needed
	},
];
