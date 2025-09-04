const staging = true;
const production = false;

const getAccountsUrl = () => {
	if (production) return process.env.EXPO_PUBLIC_PRODUCTION_ACCOUNTS_API_URL;
	if (staging) return process.env.EXPO_PUBLIC_STAGING_ACCOUNTS_API_URL;
	return process.env.EXPO_PUBLIC_DEV_ACCOUNTS_API_URL;
};

export const Routes = Object.freeze({
	API: 'https://api.carrismetropolitana.pt/v2',
	API_ACCOUNTS: getAccountsUrl(),
	CARRIS_METROPOLITANA: 'https://www.carrismetropolitana.pt',
});
