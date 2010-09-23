var defaults = {
	'stundensatz': {
		headline: 'Netto-Stundensatz',
		view: 'linechart',
		options: [
			{ name: '0',	label: 'keine Angabe' },
			{ name: 'u30',	label: 'unter 30 €' },
			{ name: 'u40',	label: '40 – 49 €' },
			{ name: 'u50',	label: '50 – 59 €' },
			{ name: 'u60',	label: '60 – 69 €' },
			{ name: 'u70',	label: '70 – 79 €' },
			{ name: 'u80',	label: '80 – 89 €' },
			{ name: 'u90',	label: '90 – 99 €' },
			{ name: '100',	label: 'über 100 €' }
		]
	},
	'alter': {
		headline: 'Alter',
		view: 'piechart',
		options: [
			{ name: '0',	label: 'keine Angabe' },
			{ name: 'u20',	label: 'unter 20' },
			{ name: 'u30',	label: '20 – 29' },
			{ name: 'u40',	label: '30 – 39' },
			{ name: 'u50',	label: '40 – 49' },
			{ name: 'u60',	label: '50 – 59' },
			{ name: '60',	label: 'über 60' }
		]
	},
	'geschlecht': {
		headline: 'Das Geschlecht',
		view: 'piechart',
		small: true,
		options: [
			{ name: 'e',	label: 'keine Angabe' },
			{ name: 'm',	label: 'Männlich' },
			{ name: 'w',	label: 'Weiblich' },
			{ name: 'o',	label: 'Anderes' }
		]
	},
	
	'wo': {
		headline: 'Herkunft',
		small: true,
		view: 'piechart_map',
		options: [
	 		{ name: 'bw',	label: 'Baden-Württemberg' },
	 		{ name: 'by',	label: 'Bayern' },
	 		{ name: 'bb',	label: 'Brandenburg' },
	 		{ name: 'he',	label: 'Hessen' },
	 		{ name: 'mv',	label: 'Mecklenburg-Vorpommern' },
	 		{ name: 'ni',	label: 'Niedersachsen' },
	 		{ name: 'nw',	label: 'Nordrhein-Westfalen' },
	 		{ name: 'rp',	label: 'Rheinland-Pfalz' },
	 		{ name: 'sl',	label: 'Saarland' },
	 		{ name: 'sn',	label: 'Sachsen' },
	 		{ name: 'st',	label: 'Sachsen-Anhalt' },
	 		{ name: 'sh',	label: 'Schleswig-Holstein' },
	 		{ name: 'th',	label: 'Thüringen' },
	 		{ name: 'be',	label: 'Berlin' },
	 		{ name: 'hb',	label: 'Bremen' },
	 		{ name: 'hh',	label: 'Hamburg' },
	 		{ name: 'ch',	label: 'Schweiz' },
	 		{ name: 'at',	label: 'Österreich' },
	 		{ name: 'o', 	label: 'Anderswo' },
			{ name: '0', 	label: 'keine Angabe' },
	 	]
	},
	'arbeitsbereich': {
		headline: 'Arbeitsbereich',
		view: 'piechart_multiple',
		small: true,
		options: [
			{ name: 'webdesign',	label: 'Webdesign' },
			{ name: 'frontend',		label: 'Frontend' },
			{ name: 'backend',		label: 'Backend' },
			{ name: 'beratung',		label: 'Beratung / Schulung' },
			{ name: 'sonstiges',	label: 'Anderes' }
		]
	},
	'wie': {
		headline: 'Arbeitsform',
		view: 'piechart',
		options: [
			{ name: '0',			label: 'keine Angabe' },
			{ name: 'vollzeit',	label: 'Vollzeit' },
			{ name: 'teilzeit',	label: 'Teilzeit' },
			{ name: 'schueler',	label: 'Schüler/Studentenjob' },
			{ name: 'hobby',	label: 'Hobbyist' }
		]
	},
	'zeit': {
		headline: 'Erfahrung',
		view: 'piechart',
		options: [
			{ name: '0',		label: 'keine Angabe' },
			{ name: '1',		label: '1 Jahr oder weniger' },
			{ name: '3',		label: '1 – 3 Jahre' },
			{ name: '5',	label: '3 – 5 Jahre' },
			{ name: '10',		label: '5 – 10 Jahre' },
			{ name: '10+',	label: 'Über 10 Jahre' }
		]
	},
	'kunden': {
		headline: 'Kundenbereich',
		view: 'piechart_multiple',
		options: [
			{ name: 'umgebung',		label: 'Umgebung' },
			{ name: 'land',			label: 'Ganzes Land' },
			{ name: 'euausland',	label: 'Europäisches Ausland' },
			{ name: 'ausland',		label: 'Sonstiges Ausland' }
		]
	}
};