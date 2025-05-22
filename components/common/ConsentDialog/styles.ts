/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
    //

    //
    // A. Setup variables

    const { theme } = useThemeContext();
    const isLight = theme.mode === 'light';
    const backgroundColor = isLight
        ? theming.colorSystemBackgroundLight100
        : theming.colorSystemBackgroundDark100;
    const fontColor = isLight
        ? theming.colorSystemText100
        : theming.colorSystemText300;

    //
    // B. Render Components

    return StyleSheet.create({
        /* LOGO */
        logo: {
            height: 75,
            width: 150,
            alignSelf: 'center',
        },
        /* * */
        /* OVERRIDES */

        contentOverride: {
            backgroundColor: backgroundColor,
            borderRadius: theming.borderRadiusLg,
        },

        /* * */
        /* TEXT & TITLE */

        title: {
            fontSize: 18,
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: theming.sizeSpacing15,
        },

        text: {
            fontSize: 14,
            fontWeight: 500,
            textAlign: 'center',
            color: fontColor,
        },

        link: {
            paddingTop: 10,
            fontSize: 12,
            fontWeight: 500,
            color: fontColor,
            textAlign: 'center',
            alignSelf: 'center',
        },

        /* * */
        /* ANSWERS WRAPPER */

        answersWrapper: {
            gap: theming.sizeSpacing15,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginTop: theming.sizeSpacing15,
        },

        /* * */
        /* REFUSE BUTTON */

        refuseButtonOverride: {
            opacity: 1
        },

        /* * */
        /* ACCEPT BUTTON */

        acceptButtonOverride: {
            backgroundColor:theming.colorBrand,
            width: 100,
            height: 50,
        }
    });

    //
};