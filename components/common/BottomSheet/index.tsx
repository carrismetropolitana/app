/* * */

import React, { forwardRef } from 'react';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { useThemeContext } from '@/contexts/Theme.context';

/* * */

interface BottomSheetWrapperProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
};

/* * */


const BottomSheetWrapper = forwardRef<BottomSheetModal, BottomSheetWrapperProps>(
  ({ children, snapPoints = ['100%'] }, ref) => {
    //

    //
    // A. Setup Variables
    
    const themeContext = useThemeContext();

    //
    // B. Render components

    return (
      
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background, borderRadius: 24,}}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetScrollView >
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

//

const styles = StyleSheet.create({
  handle: {
    backgroundColor: '#cccccc',
    width: 40,

  },
});

export default BottomSheetWrapper;