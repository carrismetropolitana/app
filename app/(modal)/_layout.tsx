import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <LinesDetailContextProvider>
      <StopsDetailContextProvider>
        <Stack
          screenOptions={{
            presentation: 'formSheet',
            gestureEnabled: true,
            headerShown: false,
            sheetGrabberVisible: true,
          }}
        >
        </Stack>
      </StopsDetailContextProvider>
    </LinesDetailContextProvider>
  );
}
