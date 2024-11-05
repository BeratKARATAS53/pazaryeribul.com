import { Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { AppService, Market } from '../app.service';
import { cityList, marketList, provinceList, stateList } from '../constant';
import { ACTIVE_THEME, Theme } from '../theme/symbols';
import { ThemeService } from '../theme/theme.service';

@Component({
	selector: 'app-markets',
	templateUrl: './markets.component.html',
	styleUrl: './markets.component.scss',
	providers: [TitleCasePipe],
})
export class MarketsComponent {
	allMarkets: Market[] = marketList;
	filteredMarkets: Market[] = marketList;
	cities: string[] = [];
	states: string[] = [];
	provinces: string[] = [];

	filter = {
		city: '',
		state: '',
		province: '',
		search: '',
	};
	pagination = {
		page: 1,
		limit: 10,
		total: 0,
	}

	Math = Math;

	activeTheme: Theme['name'] = 'morning';

	constructor(private appService: AppService, private themeService: ThemeService) {
		this.activeTheme = this.themeService.getActiveTheme().name;
	}
	
	ngOnInit(): void {
		const params = {
			...this.filter,
			...this.pagination,
		};

		this.appService.getFilters().subscribe((filters) => {
			this.cities = filters.cities;
			this.states = filters.states;
			this.provinces = filters.provinces;
		});

		//this.appService.getMarkets(params).subscribe((markets: Market[]) => {
		//	this.markets = markets.map((market: Market) => ({
		//		...market,
		//		name: new TitleCasePipe().transform(market.name.toLowerCase()),
		//	}));
		//});
		
		this.filterMarkets();

		this.themeService.themeChange.subscribe((theme: Theme) => {
			this.activeTheme = theme.name;
		});
	}

	async filterMarkets(): Promise<void> {
		//const params = {
		//	...this.filter,
		//	...this.pagination,
		//};

		//this.appService.getMarkets(params).subscribe((markets: Market[]) => {
		//	this.markets = markets.map((market: Market) => ({
		//		...market,
		//		name: new TitleCasePipe().transform(market.name.toLowerCase()),
		//	}));
		//});

		this.allMarkets = [...marketList].map((market: Market) => ({
			name: this.toTitleCase(market.name),
			address: this.toTitleCase(market.address),
			city: market.city ? this.toTitleCase(market.city) : '',
			state: this.toTitleCase(market.state),
			province: this.toTitleCase(market.province),
			day: this.toTitleCase(market.day),
			point: market.point ?? 0,
		}));
		this.pagination.total = this.allMarkets.length;

		this.filteredMarkets = [...this.allMarkets].filter((market: Market) => {
			if (this.filter.city && market.city.toLowerCase() !== this.filter.city.toLowerCase()) {
				return false;
			}

			if (this.filter.state && market.state.toLowerCase() !== this.filter.state.toLowerCase()) {
				return false;
			}

			if (this.filter.province && market.province.toLowerCase() !== this.filter.province.toLowerCase()) {
				return false;
			}

			if (this.filter.search && !market.name.toLowerCase().includes(this.filter.search.toLowerCase())) {
				return false;
			}

			return true;
		}).slice((this.pagination.page - 1) * this.pagination.limit, this.pagination.page * this.pagination.limit);
	}

	paginate(page: number): void {
		this.pagination.page = page;
		this.filterMarkets();
	}

	search(): void {
		this.pagination.page = 1;
		this.filterMarkets();
	}

	private toTitleCase(value: string): string {
		return new TitleCasePipe().transform(value.toLowerCase());
	}
}
