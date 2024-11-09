import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { map, Observable } from 'rxjs';

@Injectable()
export class AppService {
	monkedoURL = 'https://app.monkedo.com/api/v1/ipaas';

	constructor(private http: HttpClient) {}

	getMarkets(): Observable<Market[]> {
		return this.http.get<any[][]>('https://app.monkedo.com/webhook/ox830sl0syxqfyi0').pipe(
			map((markets) => markets.map((market) => ({
				name: this.toTitleCase(market[0]),
				city: this.toTitleCase(market[1]),
				state: this.toTitleCase(market[2]),
				district: this.toTitleCase(market[3]),
				address: this.toTitleCase(market[4]),
				day: this.toTitleCase(market[5]),
				point: market[6],
			}))),
		)
	}

	toTitleCase(value: string): string {
		return new TitleCasePipe().transform(value.toLocaleLowerCase('tr'));
	}
}

export type Market = {
	name: string;
	address: string;
	city: string;
	state: string;
	district: string;
	day: string;
	point?: number;
}

export type Filters = {
	cities: string[];
	states: string[];
	districts: string[];
}
