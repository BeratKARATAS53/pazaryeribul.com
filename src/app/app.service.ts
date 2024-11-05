import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable()
export class AppService {
	monkedoURL = 'https://app.monkedo.com/api/v1/ipaas';

	constructor(private http: HttpClient) {}

	getMarkets(data: Record<string, any>): Observable<Market[]> {
		const headers = {
			'Authorization': `Bearer ${environment.monkedoToken}`,
			'Content-Type': 'application/json',
		};

		const params = { data, userId: 'pazaryeribul.com' };

		return this.http.post<Market[]>(`${this.monkedoURL}/automations/6727584dbcfa979526ef0bd8/run`, params, { headers });
	}

	getFilters(): Observable<Filters> {
		return this.http.get<Filters>('https://app.monkedo.com/webhook/f0lhcaj8adgwgyzz');
	}
}

export type Market = {
	name: string;
	address: string;
	city: string;
	state: string;
	province: string;
	day: string;
	point?: number;
}

export type Filters = {
	cities: string[];
	states: string[];
	provinces: string[];
}
