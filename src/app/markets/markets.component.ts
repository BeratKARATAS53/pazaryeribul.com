import { Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { AppService, Market, Place } from '../app.service';
import { cityList, marketList } from '../constant';

@Component({
	selector: 'app-markets',
	templateUrl: './markets.component.html',
	styleUrl: './markets.component.scss',
	providers: [TitleCasePipe],
})
export class MarketsComponent {
	title = 'pazaryeribul.com';
	activeTheme: 'light' | 'dark' = 'light';

	allMarkets: Market[] = marketList;
	filteredMarkets: Market[] = marketList;
	cities: Place[] = cityList;
	states: Place[] = cityList;
	provinces: Place[] = cityList;

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

	constructor(private appService: AppService) {}
	
	ngOnInit(): void {
		const params = {
			...this.filter,
			...this.pagination,
		};

		//this.appService.getMarkets(params).subscribe((markets: Market[]) => {
		//	this.markets = markets.map((market: Market) => ({
		//		...market,
		//		name: new TitleCasePipe().transform(market.name.toLowerCase()),
		//	}));
		//});
		
		this.filterMarkets();
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

		this.filteredMarkets = [...this.allMarkets].slice((this.pagination.page - 1) * this.pagination.limit, this.pagination.page * this.pagination.limit);
		this.filteredMarkets = this.filteredMarkets.filter((market: Market) => {
			if (this.filter.city && market.city !== this.filter.city) {
				return false;
			}

			if (this.filter.state && market.state !== this.filter.state) {
				return false;
			}

			if (this.filter.province && market.province !== this.filter.province) {
				return false;
			}

			if (this.filter.search && !market.name.toLowerCase().includes(this.filter.search.toLowerCase())) {
				return false;
			}

			return true;
		})
	}

	paginate(page: number): void {
		this.pagination.page = page;
		this.filterMarkets();
	}

	private toTitleCase(value: string): string {
		return new TitleCasePipe().transform(value.toLowerCase());
	}
}
