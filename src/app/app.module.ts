import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { NgxPaginationModule } from 'ngx-pagination';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { ThemeModule } from './theme/theme.module';
import { nightTheme } from './theme/night';
import { eveningTheme } from './theme/evening';
import { morningTheme } from './theme/morning';
import { MarketsComponent } from './markets/markets.component';

@NgModule({
	declarations: [AppComponent, MarketsComponent],
	imports: [
		BrowserModule,
		FormsModule,
		NgxPaginationModule,
		ThemeModule.forRoot({
			themes: [morningTheme, eveningTheme, nightTheme],
			active: 'morning',
		}),
	],
	providers: [AppService, provideHttpClient()],
	bootstrap: [AppComponent]
})
export class AppModule { }
