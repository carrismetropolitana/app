const staging = false;
const production = false;

const getAccountsUrl = () => {
	if (production) return 'https://accounts.carrismetropolitana.pt/accounts';
	if (staging) return 'https://staging.accounts.carrismetropolitana.pt/accounts';
	return 'http://10.128.1.240:5050/accounts';
};

export const Routes = Object.freeze({
	API: 'https://api.carrismetropolitana.pt/v2',
	API_ACCOUNTS: getAccountsUrl(),
	CARRIS_METROPOLITANA: 'https://www.carrismetropolitana.pt',
});
