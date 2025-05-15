import React, { forwardRef } from 'react';
import { BottomSheetModal, BottomSheetModalProps, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { useThemeContext } from '@/contexts/Theme.context';

type BottomSheetWrapperProps = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
} & BottomSheetModalProps;



const BottomSheetWrapper = forwardRef<BottomSheetModal, BottomSheetWrapperProps>(
  
  ({ children, snapPoints = ['100%'], ...props }, ref) => {
    const themeContext = useThemeContext();
    return (
      
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
    borderRadius: 24,}}
        handleIndicatorStyle={styles.handle}
        {...props}
      >
        <BottomSheetScrollView contentContainerStyle={styles.content}>
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  handle: {
    backgroundColor: '#cccccc',
    width: 40,
  },
  content: {
    padding: 24,
  },
});

export default BottomSheetWrapper;