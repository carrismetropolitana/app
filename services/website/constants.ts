import { Platform } from 'react-native';

const WEBSITE_API_URL = `https://www.carrismetropolitana.pt/api/app-${Platform.OS}`;

export const NEWS_URL = `${WEBSITE_API_URL}/v1/news`;
