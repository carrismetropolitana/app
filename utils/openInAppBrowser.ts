/* * */
import { theming } from '@/theme/Variables';
import * as WebBrowser from 'expo-web-browser';
/* * */

export async function openInAppBrowser(url: string) {
	await WebBrowser.openBrowserAsync(url, {
		controlsColor: theming.colorBrand,
		presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
	});
}
