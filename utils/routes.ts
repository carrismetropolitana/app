const staging = false;

export const Routes = Object.freeze({
	API: 'https://api.carrismetropolitana.pt/v2',
	API_ACCOUNTS: staging ? 'https://staging.accounts.carrismetropolitana.pt/accounts' : 'http://10.128.1.240:4321/accounts',
	CARRIS_METROPOLITANA: 'https://www.carrismetropolitana.pt',
});
