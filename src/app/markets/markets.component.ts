import { Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { AppService, Market } from '../app.service';
import { Theme } from '../theme/symbols';
import { ThemeService } from '../theme/theme.service';

@Component({
	selector: 'app-markets',
	templateUrl: './markets.component.html',
	styleUrl: './markets.component.scss',
	providers: [TitleCasePipe],
})
export class MarketsComponent {
	allMarkets: Market[] = [];
	filteredMarkets: Market[] = [];

	cities: string[] = [];
	states: string[] = [];
	districts: string[] = [];
	days: string[] = [];

	cityStatesMap: { city: string, states: string[] }[] = [];
	stateDistrictMap: { city: string, state: string, districts: string[] }[] = [];

	filter = {
		city: '',
		state: '',
		district: '',
		day: '',
		search: '',
	};
	pagination = {
		page: 1,
		limit: 10,
		total: 0,
	}

	pageReady = false;

	Math = Math;

	activeTheme: Theme['name'] = 'morning';

	constructor(private appService: AppService, private themeService: ThemeService) {
		this.activeTheme = this.themeService.getActiveTheme().name;
	}

	ngOnInit(): void {
		//const filters = JSON.parse(localStorage.getItem('filters') || '{}');
		//if (Object.keys(filters).length) this.filter = filters;

		//const pagination = JSON.parse(localStorage.getItem('pagination') || '{}');
		//if (Object.keys(pagination).length) this.pagination = pagination;

		this.appService.getMarkets().subscribe((markets) => {
			this.groupLocations(markets);

			this.allMarkets = markets;
			this.pagination.total = this.allMarkets.length;

			this.filterMarkets();

			this.pageReady = true;
		});

		this.themeService.themeChange.subscribe((theme: Theme) => {
			this.activeTheme = theme.name;
		});
	}

	async filterMarkets(): Promise<void> {
		//localStorage.setItem('filters', JSON.stringify(this.filter));
		//localStorage.setItem('pagination', JSON.stringify(this.pagination));

		this.filteredMarkets = [...this.allMarkets].filter((market: Market) => {
			if (
				this.filter.city && market.city.toLocaleLowerCase('tr') !== this.filter.city.toLocaleLowerCase('tr')
				|| this.filter.state && market.state.toLocaleLowerCase('tr') !== this.filter.state.toLocaleLowerCase('tr')
				|| this.filter.district && market.district.toLocaleLowerCase('tr') !== this.filter.district.toLocaleLowerCase('tr')
				|| this.filter.search && (
					!market.name.toLocaleLowerCase('tr').includes(this.filter.search.toLocaleLowerCase('tr'))
					&& !market.address.toLocaleLowerCase('tr').includes(this.filter.search.toLocaleLowerCase('tr'))
					&& !market.city.toLocaleLowerCase('tr').includes(this.filter.search.toLocaleLowerCase('tr'))
					&& !market.state.toLocaleLowerCase('tr').includes(this.filter.search.toLocaleLowerCase('tr'))
					&& !market.district.toLocaleLowerCase('tr').includes(this.filter.search.toLocaleLowerCase('tr'))
				)
				|| this.filter.day && market.day.toLocaleLowerCase('tr') !== this.filter.day.toLocaleLowerCase('tr')
			) {
				return false;
			}

			return true;
		});

		this.pagination.total = this.filteredMarkets.length;

		const { page, limit } = this.pagination;
		this.filteredMarkets = this.filteredMarkets.sort((a, b) => {
			if (a.city !== b.city) return a.city > b.city ? 1 : -1;
			if (a.state !== b.state) return a.state > b.state ? 1 : -1;
			return a.district > b.district ? 1 : -1;
		}).slice((page - 1) * limit, page * limit);
	}

	updateLocationFilters(type: 'city' | 'state' | 'district', location: any): void {
		if (type === 'city') {
			this.states = this.cityStatesMap.find((cs) => cs.city === location)!.states || [];
		}

		if (['city', 'state'].includes(type)) {
			this.districts = this.stateDistrictMap.filter((cs) => cs.state === location)!.map((cs) => cs.districts).flat() || [];
		}

		this.search();
	}

	clearFilters(type: 'city' | 'state' | 'district'): void {
		if (type === 'city') {
			this.cities = [...new Set(this.allMarkets.map((market) => market.city))].sort();
		}

		if (['city', 'state'].includes(type)) {
			this.states = [...new Set(this.allMarkets.map((market) => market.state))].sort();
		}

		this.districts = [...new Set(this.allMarkets.map((market) => market.district))].sort();

		this.filter[type] = '';
		this.search();
	}

	paginate(page: number): void {
		this.pagination.page = page;
		this.filterMarkets();
	}

	search(): void {
		this.pagination.page = 1;
		this.filterMarkets();
	}

	private groupLocations(markets: Market[]): void {
		this.cities = [...new Set(markets.map((market) => market.city))].sort();
		this.states = [...new Set(markets.map((market) => market.state))].sort();
		this.districts = [...new Set(markets.map((market) => market.district))].sort();
		this.days = [...new Set(markets.map((market) => market.day))].sort();

		this.cityStatesMap = this.cities.map((city) => ({
			city,
			states: [...new Set(markets.filter((market) => market.city === city).map((market) => market.state))].sort(),
		}));

		const stateDistrictMap = this.cities.map((city) => {
			const cityMarkets = markets.filter((market) => market.city === city);

			return this.states.map((state) => ({
				city,
				state,
				districts: [...new Set(cityMarkets.filter((market) => market.state === state).map((market) => market.district))].sort(),
			}));
		});
		this.stateDistrictMap = stateDistrictMap.flat();
	}
}
