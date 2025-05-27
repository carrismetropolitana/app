/* * */

import React, { forwardRef } from 'react';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useThemeContext } from '@/contexts/Theme.context';

/* * */

interface BottomSheetWrapperProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
};

/* * */

const BottomSheetWrapper = forwardRef<BottomSheetModal, BottomSheetWrapperProps>(({ children, snapPoints = ['100%', '100%'] }, ref) => {
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
      enablePanDownToClose={true}
      backgroundStyle={{  backgroundColor: themeContext.theme.mode === 'light' 
          ? themeContext.theme.lightColors?.background 
          : themeContext.theme.darkColors?.background, 
      }}
    >
      <BottomSheetScrollView>
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
);

//

export default BottomSheetWrapper;