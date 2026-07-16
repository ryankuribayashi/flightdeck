import { Stack } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.bg } }}>
      <Stack.Screen
        name="ar-scanner"
        options={{ presentation: 'fullScreenModal', animation: 'fade' }}
      />
    </Stack>
  );
}
