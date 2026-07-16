import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';
import CockpitNav from '../../components/navigation/CockpitNav';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CockpitNav {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.navBg },
      }}
    >
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="radar" options={{ title: 'Radar' }} />
      <Tabs.Screen name="squadrons" options={{ title: 'Squadrons' }} />
      <Tabs.Screen name="dispatch" options={{ title: 'Dispatch' }} />
      <Tabs.Screen name="dossier" options={{ title: 'Dossier' }} />
    </Tabs>
  );
}
