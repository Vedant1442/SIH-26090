import { View, Pressable, Animated, Easing } from 'react-native';
import { Text } from 'panelui-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import VolumeHighIcon from '@hugeicons/core-free-icons/dist/esm/VolumeHighIcon';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<'splash' | 'language'>('splash');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (phase === 'splash') {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }).start(() => setPhase('language'));
      }, 2500);
    } else {
      fadeAnim.setValue(1);
    }
  }, [phase]);

  if (phase === 'splash') {
    return (
      <Animated.View className="flex-1 bg-[#FDF8F5] items-center justify-center" style={{ opacity: fadeAnim }}>
        <Text size="3xl" weight="bold" style={{ color: '#2A1B18', fontFamily: 'Fraunces' }} className="mb-8">
          Kaarigar Setu
        </Text>
        {/* Thread-row loading animation */}
        <View className="flex-row gap-1.5">
          {[...Array(5)].map((_, i) => (
            <View key={i} className="h-1 w-4 rounded-full bg-[#C2593F]" />
          ))}
        </View>
      </Animated.View>
    );
  }

  return (
    <View className="flex-1 bg-[#FDF8F5]" style={{ paddingTop: insets.top }}>
      {/* Audio-first header */}
      <View className="items-center mt-12 mb-16">
        <Pressable className="bg-[#8C7C75]/10 p-6 rounded-full active:scale-95 transition-transform">
          <HugeiconsIcon icon={VolumeHighIcon} size={48} color="#2A1B18" />
        </Pressable>
      </View>

      {/* Language Grid */}
      <View className="px-6 gap-4">
        {[
          { label: 'मराठी', script: 'Devanagari' },
          { label: 'हिंदी', script: 'Devanagari' },
          { label: 'தமிழ்', script: 'Tamil' },
          { label: 'English', script: 'Latin' }
        ].map((lang) => (
          <Pressable 
            key={lang.label}
            onPress={() => router.replace('/(tabs)')}
            className="bg-[#FFFFFF] border border-[#8C7C75]/20 p-6 rounded-[20px] active:bg-[#FDF8F5] flex-row justify-between items-center"
          >
            <Text size="xl" weight="medium" style={{ color: '#2A1B18' }}>{lang.label}</Text>
            <HugeiconsIcon icon={VolumeHighIcon} size={24} color="#8C7C75" />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
