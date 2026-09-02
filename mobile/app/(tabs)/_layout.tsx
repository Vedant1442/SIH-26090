import { Tabs } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import Home01Icon from '@hugeicons/core-free-icons/dist/esm/Home01Icon';
import Mic01Icon from '@hugeicons/core-free-icons/dist/esm/Mic01Icon';
import Camera01Icon from '@hugeicons/core-free-icons/dist/esm/Camera01Icon';
import Folder01Icon from '@hugeicons/core-free-icons/dist/esm/Folder01Icon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFBF9',
          borderTopColor: 'rgba(138, 143, 148, 0.2)',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 24,
          paddingTop: 12,
          elevation: 0,
        },
        tabBarActiveTintColor: '#C2593F',
        tabBarInactiveTintColor: '#8C7C75',
        tabBarLabelStyle: {
          fontFamily: 'Manrope',
          fontWeight: '600',
          fontSize: 12,
          marginTop: 4,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={Home01Icon} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="speak"
        options={{
          title: 'Speak',
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={Mic01Icon} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="photo"
        options={{
          title: 'Photo',
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={Camera01Icon} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'My Products',
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={Folder01Icon} size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
