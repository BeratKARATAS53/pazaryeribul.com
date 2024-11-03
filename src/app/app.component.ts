import { Component } from '@angular/core';

import { ThemeService } from './theme/theme.service';
import { Theme } from './theme/symbols';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	activeTheme: Theme['name'] = 'morning';

	themes: Theme[] = [];

	constructor(private themeService: ThemeService) {
		this.themes = this.themeService.themes;
	}

	toggle() {
		this.themeService.setTheme(this.activeTheme);
	}
}
