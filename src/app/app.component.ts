import { Component } from '@angular/core';

import { ThemeService } from './theme/theme.service';
import { Theme } from './theme/symbols';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	activeTheme: Theme['name'];

	themes: Theme[] = [];

	constructor(private themeService: ThemeService) {
		this.themes = this.themeService.themes;
		this.activeTheme = this.themeService.getActiveTheme().name;
	}

	toggle() {
		this.themeService.setTheme(this.activeTheme);
	}

	openModal(id: string) {
		const modal = document.getElementById(id) as HTMLDialogElement;
		modal!.classList.add(this.activeTheme);

		modal.showModal();
	}

	closeModal(id: string) {
		const modal = document.getElementById(id) as HTMLDialogElement;
		modal!.classList.remove(this.activeTheme);

		modal.close();
	}
}
