import { Injectable, Inject, EventEmitter } from '@angular/core';

import { THEMES, ACTIVE_THEME, Theme } from './symbols';

@Injectable()
export class ThemeService {

	themeChange = new EventEmitter<Theme>();

	constructor(
		@Inject(THEMES) public themes: Theme[],
		@Inject(ACTIVE_THEME) public theme: string
	) { }

	getActiveTheme(): Theme {
		const themeName = localStorage.getItem('theme') || this.theme;

		const theme = this.themes.find(t => t.name === themeName);
		return theme!;
	}

	setTheme(name: string) {
		this.theme = name;
		localStorage.setItem('theme', name);

		this.themeChange.emit(this.getActiveTheme());
	}
}
