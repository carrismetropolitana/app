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
        /* * */
        /* OVERRIDES */

        contentOverride: {
            backgroundColor: backgroundColor,
            borderRadius: theming.borderRadiusLg,
        },

        bodyOverride: {
            display: 'flex',
            flexDirection: 'column',
            gap: theming.sizeSpacing20,
            alignItems: 'center',
            padding: theming.sizeSpacing30,
        },

        /* * */
        /* TEXT & TITLE */

        title: {
            fontSize: 18,
            fontWeight: 700,
            textAlign: 'center',
        },

        text: {
            fontSize: 14,
            fontWeight: 500,
            textAlign: 'center',
        },

        link: {
            paddingTop: 3,
            paddingRight: 8,
            fontSize: 12,
            fontWeight: 500,
            color: fontColor,
            borderRadius: 3,
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
        }
    });

    //
};