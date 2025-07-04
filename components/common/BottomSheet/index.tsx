/* * */

import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';

/* * */

interface BottomSheetWrapperProps {
	children: React.ReactNode
	snapPoints?: (number | string)[]
};

/* * */

const BottomSheetWrapper = forwardRef<BottomSheetModal, BottomSheetWrapperProps>(({ children, snapPoints = ['100%', '100%'] }, ref) => {
	//

	//
	// A. Render components

	return (
		<BottomSheetModal
			ref={ref}
			enablePanDownToClose={true}
			index={0}
			snapPoints={snapPoints}
		>
			<BottomSheetScrollView>
				{children}
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
},
);

//

export default BottomSheetWrapper;
