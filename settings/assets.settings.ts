/* eslint-disable @typescript-eslint/no-require-imports */
/* * */

export const BrandsCmet = Object.freeze({
	cmet_dark: '/brands/cmet/cmet_dark.svg',
	cmet_light: '/brands/cmet/cmet_light.svg',
});

export const BrandsMunicipalities = Object.freeze({
	alcochete: '/brands/municipalities/alcochete.jpg',
	alenquer: '/brands/municipalities/alenquer.jpg',
	almada: '/brands/municipalities/almada.jpg',
	amadora: '/brands/municipalities/amadora.jpg',
	arruda_vinhos: '/brands/municipalities/arruda_vinhos.jpg',
	barreiro: '/brands/municipalities/barreiro.jpg',
	cascais: '/brands/municipalities/cascais.jpg',
	lisboa: '/brands/municipalities/lisboa.jpg',
	loures: '/brands/municipalities/loures.jpg',
	mafra: '/brands/municipalities/mafra.jpg',
	moita: '/brands/municipalities/moita.jpg',
	montijo: '/brands/municipalities/montijo.jpg',
	odivelas: '/brands/municipalities/odivelas.jpg',
	oeiras: '/brands/municipalities/oeiras.jpg',
	palmela: '/brands/municipalities/palmela.jpg',
	seixal: '/brands/municipalities/seixal.jpg',
	sesimbra: '/brands/municipalities/sesimbra.jpg',
	setubal: '/brands/municipalities/setubal.jpg',
	sintra: '/brands/municipalities/sintra.jpg',
	sobral_monte_agraco: '/brands/municipalities/sobral_monte_agraco.jpg',
	torres_vedras: '/brands/municipalities/torres_vedras.jpg',
	vendas_novas: '/brands/municipalities/vendas_novas.jpg',
	vila_franca_xira: '/brands/municipalities/vila_franca_xira.jpg',
});

export const BrandsOperators = Object.freeze({
	atlantic_ferries: '/icons/operators/atlantic_ferries.svg',
	ccfl: '/icons/operators/ccfl.svg',
	cmet: '/icons/operators/cmet.svg',
	cp: '/icons/operators/cp.svg',
	fertagus: '/icons/operators/fertagus.svg',
	metro: '/icons/operators/metro.svg',
	mobi_cascais: '/icons/operators/mobi_cascais.svg',
	mts: '/icons/operators/mts.svg',
	tcb: '/icons/operators/tcb.svg',
	ttsl: '/icons/operators/ttsl.svg',
});

/* * */

/**
 * Icons used by alerts
 */

export const IconsSocial = Object.freeze({
	facebook: '/icons/social/social-facebook.svg',
	instagram: '/icons/social/social-instagram.svg',
	whatsapp: '/icons/social/social-whatsapp.svg',
	x: '/icons/social/social-twitter.svg',
});

export const IconsFacilities = Object.freeze({
	court: require('@/assets/icons/facilities/court.svg'),
	fire_station: require('@/assets/icons/facilities/fire_station.svg'),
	health_center: require('@/assets/icons/facilities/health_center.svg'),
	hospital: require('@/assets/icons/facilities/hospital.svg'),
	park: require('@/assets/icons/facilities/park.svg'),
	police_station: require('@/assets/icons/facilities/police_station.svg'),
	school: require('@/assets/icons/facilities/school.svg'),
	transit_office: require('@/assets/icons/facilities/transit_office.svg'),
	university: require('@/assets/icons/facilities/university.svg'),
});

export const IconsConnections = Object.freeze({
	bike_parking: '/icons/connections/bike_parking.svg',
	boat: '/icons/connections/boat.svg',
	bus: '/icons/connections/bus.svg',
	car_parking: '/icons/connections/car_parking.svg',
	light_rail: '/icons/connections/light_rail.svg',
	subway: '/icons/connections/subway.svg',
	train: '/icons/connections/train.svg',
});

/* * */

export const IconsMap = Object.freeze({
	bus_delay: require('@/assets/icons/map/bus_delay.png'),
	bus_error: require('@/assets/icons/map/bus_error.png'),
	bus_regular: require('@/assets/icons/map/bus_regular.png'),
	pin: require('@/assets/icons/map/pin.png'),
	shape_direction: require('@/assets/icons/map/shape_direction.png'),
	stop_selected: require('@/assets/icons/map/stop_selected.png'),
	store_busy: require('@/assets/icons/map/store_busy.png'),
	store_closed: require('@/assets/icons/map/store_closed.png'),
	store_open: require('@/assets/icons/map/store_open.png'),
});

export const IconsCommon = Object.freeze({
	AML_MAP: require('@/assets/icons/common/aml-map.svg'),
	AML_MAP_OPERATORS: require('@/assets/icons/common/aml-map-with-operators.svg'),
	AML_MAP_SINGLE: require('@/assets/icons/common/aml-map-single.svg'),
	LINE_BADGE_BASE: require('@/assets/icons/common/line-badge-base.svg'),
	LIVRO_RECLAMACOES: require('@/assets/icons/common/livro-de-reclamacoes.svg'),
	MULTIBANCO_DARK: require('@/assets/icons/common/multibanco-dark.svg'),
	MULTIBANCO_LIGHT: require('@/assets/icons/common/multibanco-light.svg'),
	NAVEGANTE_APP: require('@/assets/icons/common/app-navegante.svg'),
	NAVEGANTE_POINT: require('@/assets/icons/common/espaco-navegante.svg'),
	PAYSHOP: require('@/assets/icons/common/payshop.png'),
	QUESTION: require('@/assets/icons/common/question.svg'),
	RECEIPT: require('@/assets/icons/common/receipt.svg'),
	SAFARI_PINNED_TAB: require('@/assets/icons/common/safari-pinned-tab.svg'),
	TICKET: require('@/assets/icons/common/ticket.svg'),
});

export const IconsMobile = Object.freeze({
	MOBILE_ANDROID_192: require('@/assets/icons/mobile/android-chrome-192x192.png'),
	MOBILE_ANDROID_512: require('@/assets/icons/mobile/android-chrome-512x512.png'),
	MOBILE_APPLE: require('@/assets/icons/mobile/apple-touch-icon.png'),
});

/* * */

// Images

export const ImagesCommon = Object.freeze({
	AREA1: require('@/assets/images/common/Area1.svg'),
	AREA2: require('@/assets/images/common/Area2.svg'),
	AREA3: require('@/assets/images/common/Area3.svg'),
	AREA4: require('@/assets/images/common/Area4.svg'),
	// COINS: require('@/assets/images/common/coins.svg'),
	// NAVEGANTE_CARD: require('@/assets/images/common/navegante-card.png'),
	// NAVEGANTE_OCASIONAL: require('@/assets/images/common/navegante-occasional.png'),
	PLACEHOLDER: require('@/assets/images/common/placeholder.png'),
});

export const ImagesHome = Object.freeze({
	CASO_DE_ESTUDO_LOURES: require('@/assets/images/home/caso-de-estudo-loures.png'),
	DRIVERS: require('@/assets/images/home/drivers.png'),
});

export const Images = Object.freeze({
	...ImagesCommon,
	...ImagesHome,
});
