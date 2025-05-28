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
        ? theming.colorSystemBackgroundLight200
        : theming.colorSystemBackgroundDark200;
    const fontColor = isLight
        ? theming.colorSystemText100
        : theming.colorSystemText300;

    //
    // B. Render Components

    return StyleSheet.create({
        /* * */
        /* CONTAINER */
        container: {
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
            backgroundColor: 'rgb(15 70 210)',
            borderRadius: 4,
        },
        /* * */
        /* COUNTRY */
        countryContainer: {
            paddingRight:2,
            paddingLeft: 2,
        },
        countryText: {
            textAlign: 'center',
            fontSize: 11,
            fontWeight: theming.fontWeightBold as 'bold',
            color: '#ffffff',
            textTransform: 'uppercase',
        },
        /* * */
        /* PLATE */
        plateContainer: {
            paddingLeft: 10,
            paddingRight: 5,
            borderRadius: 2,
            backgroundColor: '#ffffff',
        },
        plateText: {
            fontSize: 14,
            fontWeight: theming.fontWeightBold as 'bold',
            color: '#000000',
            textTransform: 'uppercase',
        }
    });

    //
};
