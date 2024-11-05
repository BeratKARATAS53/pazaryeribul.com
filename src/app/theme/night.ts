import { Theme } from './symbols';

export const nightTheme: Theme = {
	name: 'night',
	label: 'Gece',
	properties: {
		'--background': 'linear-gradient(to right, #131F2C, #111D29)',
		'--font-color': '#FFF',
		'--primary': '#2A3B4E',
		'--secondary': '#131F2C',
		'--light-secondary': '#1C2D40',
		'--link': '#5D93CE',
		'--pagination-background': '#1F3044',
		'--pagination-color': '#7DA6D3',
		'--selection': '#5289CD',
	}
};
