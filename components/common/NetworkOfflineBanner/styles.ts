/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
    const { theme } = useThemeContext();
    const isLight = theme.mode === 'light';
    const fontColor = isLight
        ? theming.colorSystemText900
        : theming.colorSystemText200;

    return StyleSheet.create({
        fab: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 120,
            width: '100%',
            zIndex: 100,
        },
        fabButton: {
            backgroundColor: theming.colorLinesLonga,
        },
        fabButtonTitle: {
            color: fontColor,
        },
    });
};
