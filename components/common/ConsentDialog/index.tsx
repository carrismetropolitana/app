/* * */

import { useAnalyticsContext } from '@/contexts/Analytics.context';
import { useConsentContext } from '@/contexts/Consent.context';
import { Button, CheckBox, Dialog, Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { Link, usePathname, } from 'expo-router';
import { useEffect, useState } from 'react';
import { styles } from './styles'
import { TouchableOpacity, View } from 'react-native';
import LottieView from 'lottie-react-native';
import zumeDark from '@/assets/header/zume/zume-dark.json';
import zumeLight from '@/assets/header/zume/zume-light.json';
import { useThemeContext } from '@/contexts/Theme.context';

/* * */

export function ConsentPopup() {
    //

    //
    // A. Setup variables

    const { t } = useTranslation('translation', { keyPrefix: 'analytics.ConsentPopup' });
    const pathname = usePathname();
    const consentContext = useConsentContext();
    const themeContext = useThemeContext();
    // const analyticsContext = useAnalyticsContext();

    const [showOptions, setShowOptions] = useState(false);
    const [optionAnalyticsDecision, setOptionAnalyticsDecision] = useState(true);
    const [optionFunctionalDecision, setOptionFunctionalDecision] = useState(true);


    const animation = themeContext.theme.mode === 'light' ? zumeLight : zumeDark;

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const consentModalStyles = styles();

    //
    // B. Handle actions

    useEffect(() => {
        // Return if consentContext is not ready
        if (!consentContext.data.init_status) return;
        // Return if pathname is not available
        if (!pathname) return;
        // Check if pathname is the cookies policy page
        const regexPatternToMatchCookiesPage = /^(\/[a-z]{2})?\/cookies\/?$/;
        const isCookiesPage = regexPatternToMatchCookiesPage.test(pathname);
        // Set the modal state based on the context and pathname
        setIsPopupOpen(consentContext.data.ask_for_consent && !isCookiesPage);
    }, [consentContext.data.init_status, consentContext.data.ask_for_consent, pathname]);

    const handleAccept = () => {
        // Set the Analytics decision based on the set option
        if (optionAnalyticsDecision) {
            consentContext.actions.enable(['analytics']);
            // analyticsContext.actions.capture((ampli, props) => ampli.analyticsConsentAccepted(props));
        }
        else {
            consentContext.actions.disable(['analytics']);
        }
        // Set the Functional decision based on the set option
        if (optionFunctionalDecision) {
            consentContext.actions.enable(['functional']);
        }
        else {
            consentContext.actions.disable(['functional']);
        }
        // Dismiss and reset the popup
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
    // C. Render Components

    return (
        <Dialog onBackdropPress={() => setIsPopupOpen(false)} isVisible={isPopupOpen} backdropStyle={{ opacity: 0.55 }} overlayStyle={consentModalStyles.contentOverride} >
            <LottieView source={animation} style={consentModalStyles.logo} autoPlay loop />
            <Text style={consentModalStyles.title}>{t('title')}</Text>
            <Text style={consentModalStyles.text}>{t('text')}</Text>
            <TouchableOpacity onPress={() => setShowOptions(prev => !prev)}>
                <View style={consentModalStyles.link} >
                    <Text> {showOptions ? t('actions.hide_options') : t('actions.show_options')}</Text>
                </View>
            </TouchableOpacity>
            {showOptions && (
                <>
                    <CheckBox title={t('options.functional')} checked={optionFunctionalDecision} onPress={() => setOptionFunctionalDecision(!optionFunctionalDecision)} />
                    <CheckBox title={t('options.analytics')} checked={optionAnalyticsDecision} onPress={() => setOptionAnalyticsDecision(!optionAnalyticsDecision)} />
                </>
            )}

            <Link style={consentModalStyles.link} href="/cookies" target="_blank">
                <Text>{t('policy_page')}</Text>
            </Link>

            <View style={consentModalStyles.answersWrapper}>
                <Button style={consentModalStyles.refuseButtonOverride} onPress={handleRefuse} title={t('actions.refuse')}>

                </Button>
                <Button onPress={handleAccept} buttonStyle={consentModalStyles.acceptButtonOverride}>
                    <Text style={consentModalStyles.text}> {optionAnalyticsDecision && optionFunctionalDecision ? t('actions.accept') : t('actions.save')}</Text>
                </Button>
            </View>
        </Dialog>
    );

    //
}
