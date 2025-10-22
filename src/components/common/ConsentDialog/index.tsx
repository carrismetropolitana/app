/* * */

import { useConsentContext } from '@/contexts/Consent.context';
import { Button, CheckBox, Dialog, Text } from '@rn-vui/themed';
import { Link, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

/* * */

export function ConsentPopup() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'analytics.ConsentPopup' });
	const pathname = usePathname();
	const consentContext = useConsentContext();

	// const analyticsContext = useAnalyticsContext();

	const [showOptions, setShowOptions] = useState(false);
	const [optionAnalyticsDecision, setOptionAnalyticsDecision] = useState(true);
	const [optionFunctionalDecision, setOptionFunctionalDecision] = useState(true);

	const [isPopupOpen, setIsPopupOpen] = useState(false);

	const consentModalStyles = styles();

	//
	// B. Handle actions

	useEffect(() => {
		if (!consentContext.data.init_status) return;
		if (!pathname) return;
		const regexPatternToMatchCookiesPage = /^(\/[a-z]{2})?\/cookies\/?$/;
		const isCookiesPage = regexPatternToMatchCookiesPage.test(pathname);
		setIsPopupOpen(consentContext.data.ask_for_consent && !isCookiesPage);
	}, [consentContext.data.init_status, consentContext.data.ask_for_consent, pathname]);

	const handleAccept = () => {
		if (optionAnalyticsDecision) {
			consentContext.actions.enable(['analytics']);
		}
		else {
			consentContext.actions.disable(['analytics']);
		}
		if (optionFunctionalDecision) {
			consentContext.actions.enable(['functional']);
		}
		else {
			consentContext.actions.disable(['functional']);
		}
		setIsPopupOpen(false);
		setShowOptions(false);
		setOptionAnalyticsDecision(true);
		setOptionFunctionalDecision(true);
	};

	const handleRefuse = () => {
		consentContext.actions.disable(['analytics', 'functional']);
		setIsPopupOpen(false);
		setShowOptions(false);
		setOptionAnalyticsDecision(true);
		setOptionFunctionalDecision(true);
	};

	//
	// C. Render components

	return (
		<Dialog backdropStyle={{ opacity: 0.55 }} isVisible={isPopupOpen} onBackdropPress={() => setIsPopupOpen(false)} overlayStyle={consentModalStyles.contentOverride}>

			{/* eslint-disable-next-line @typescript-eslint/no-require-imports */}
			<Image source={require('../../../../assets/images/logo.png')} style={{ height: 100, left: 20, resizeMode: 'contain', width: 100 }} />

			<Text style={consentModalStyles.title}>{t('title')}</Text>
			<Text style={consentModalStyles.text}>{t('text')}</Text>
			<TouchableOpacity onPress={() => setShowOptions(prev => !prev)}>
				<View style={consentModalStyles.link}>
					<Text> {showOptions ? t('actions.hide_options') : t('actions.show_options')}</Text>
				</View>
			</TouchableOpacity>
			{showOptions && (
				<>
					<CheckBox checked={optionFunctionalDecision} onPress={() => setOptionFunctionalDecision(!optionFunctionalDecision)} title={t('options.functional')} />
					<CheckBox checked={optionAnalyticsDecision} onPress={() => setOptionAnalyticsDecision(!optionAnalyticsDecision)} title={t('options.analytics')} />
				</>
			)}

			<Link href="/cookies" style={consentModalStyles.link} target="_blank">
				<Text>{t('policy_page')}</Text>
			</Link>

			<View style={consentModalStyles.answersWrapper}>
				<Button onPress={handleRefuse} style={consentModalStyles.refuseButtonOverride} title={t('actions.refuse')} />
				<Button buttonStyle={consentModalStyles.acceptButtonOverride} onPress={handleAccept}>
					<Text style={consentModalStyles.text}> {optionAnalyticsDecision && optionFunctionalDecision ? t('actions.accept') : t('actions.save')}</Text>
				</Button>
			</View>
		</Dialog>
	);

	//
}
