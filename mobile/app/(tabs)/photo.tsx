import { View, Pressable, Animated, Easing, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button } from 'panelui-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import Camera01Icon from '@hugeicons/core-free-icons/dist/esm/Camera01Icon';
import Image01Icon from '@hugeicons/core-free-icons/dist/esm/Image01Icon';
import FlashIcon from '@hugeicons/core-free-icons/dist/esm/FlashIcon';
import RefreshIcon from '@hugeicons/core-free-icons/dist/esm/RefreshIcon';
import CheckmarkCircle02Icon from '@hugeicons/core-free-icons/dist/esm/CheckmarkCircle02Icon';
import { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';

export default function PhotoScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraState, setCameraState] = useState<'framing' | 'ready' | 'enhancing' | 'review'>('framing');
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Simulate auto-focusing finding the product
  useEffect(() => {
    if (cameraState === 'framing') {
      const timer = setTimeout(() => setCameraState('ready'), 2000);
      return () => clearTimeout(timer);
    }
  }, [cameraState]);

  // Simulate enhancing animation
  useEffect(() => {
    if (cameraState === 'enhancing') {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();

      const timer = setTimeout(() => {
        spinAnim.stopAnimation();
        setCameraState('review');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cameraState]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const handleCapture = () => {
    if (cameraState === 'ready' || cameraState === 'framing') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setCameraState('enhancing');
    }
  };

  if (cameraState === 'enhancing') {
    return (
      <View className="flex-1 bg-[#2A1B18] items-center justify-center" style={{ paddingTop: insets.top }}>
        <Animated.View style={{ transform: [{ rotate: spin }] }} className="w-16 h-16 mb-8 items-center justify-center">
          <HugeiconsIcon icon={RefreshIcon} size={48} color="#C2593F" />
        </Animated.View>
        <Text size="xl" weight="bold" style={{ color: '#FDF8F5', fontFamily: 'Fraunces' }}>
          Enhancing Lighting...
        </Text>
        {/* Thread-row progress */}
        <View className="flex-row gap-1.5 mt-8">
          {[...Array(5)].map((_, i) => (
            <View key={i} className="h-1 w-4 rounded-full bg-[#C2593F]" />
          ))}
        </View>
      </View>
    );
  }

  if (cameraState === 'review') {
    return (
      <View className="flex-1 bg-[#FDF8F5]" style={{ paddingTop: insets.top }}>
        <View className="px-6 py-6">
          <Text size="2xl" weight="bold" style={{ color: '#2A1B18', fontFamily: 'Fraunces' }}>
            Review Photo
          </Text>
          <Text size="sm" style={{ color: '#8C7C75' }} className="mt-2">
            Background & lighting only — your product is unchanged.
          </Text>
        </View>

        <View className="flex-row px-4 gap-4 flex-1 mb-8">
          {/* Original */}
          <View className="flex-1 relative rounded-[16px] overflow-hidden bg-[#2A1B18]">
            <View className="absolute top-2 left-2 bg-[#2A1B18]/70 px-3 py-1 rounded-full z-10">
              <Text size="xs" weight="medium" style={{ color: '#FDF8F5' }}>Original</Text>
            </View>
            <View className="w-full h-full bg-[#8C7C75]/20 items-center justify-center">
              <HugeiconsIcon icon={Image01Icon} size={32} color="#8C7C75" />
            </View>
          </View>

          {/* Enhanced */}
          <View className="flex-1 relative rounded-[16px] overflow-hidden bg-[#2A1B18] border-2 border-[#738054]">
            <View className="absolute top-2 left-2 bg-[#738054] px-3 py-1 rounded-full z-10">
              <Text size="xs" weight="medium" style={{ color: '#FDF8F5' }}>AI Enhanced</Text>
            </View>
            <View className="absolute bottom-2 right-2 bg-[#FDF8F5]/90 px-2 py-1 rounded-[6px] z-10">
              <Text size="xs" weight="bold" style={{ color: '#2A1B18' }}>AI Visualization</Text>
            </View>
            <View className="w-full h-full bg-[#E5DFD3] items-center justify-center">
              <HugeiconsIcon icon={Image01Icon} size={32} color="#2A1B18" />
            </View>
          </View>
        </View>

        <View className="px-6 pb-12 gap-4">
          <Button 
            className="w-full bg-[#738054] py-4"
            onPress={() => router.replace('/(tabs)/products')}
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', marginLeft: 8 }} weight="bold">Save Enhanced Photo</Text>
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-[#8C7C75]/30 py-4"
            onPress={() => setCameraState('framing')}
          >
            <Text style={{ color: '#2A1B18' }} weight="semibold">Retake</Text>
          </Button>
          <Pressable className="items-center mt-2" onPress={() => router.replace('/(tabs)/products')}>
            <Text size="sm" style={{ color: '#8C7C75' }} weight="medium">Keep Original</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Framing & Ready states
  const bracketColor = cameraState === 'ready' ? '#738054' : '#FDF8F5';

  return (
    <View className="flex-1 bg-[#2A1B18]" style={{ paddingTop: insets.top }}>
      {/* Top Bar */}
      <View className="px-6 pt-4 pb-4 flex-row justify-between items-center">
        <HugeiconsIcon icon={FlashIcon} size={28} color="#FFFFFF" />
        <View className="bg-[#C2593F]/80 px-4 py-1.5 rounded-full">
          <Text size="sm" weight="medium" style={{ color: '#FFFFFF' }}>AI Enhance Active</Text>
        </View>
        <HugeiconsIcon icon={Image01Icon} size={28} color="#FFFFFF" />
      </View>

      {/* Viewfinder Area */}
      <View className="flex-1 px-6 py-8 justify-center items-center">
        {!permission?.granted ? (
          <View className="w-full aspect-[3/4] border-2 border-dashed border-[#FDF8F5]/30 rounded-[24px] justify-center items-center">
            <Text size="lg" style={{ color: '#FDF8F5' }} className="mb-4">Camera access needed</Text>
            <Button onPress={requestPermission} className="bg-[#C2593F]">
              <Text style={{ color: '#FFFFFF' }}>Grant Permission</Text>
            </Button>
          </View>
        ) : (
          <View className="w-full aspect-[3/4] rounded-[24px] overflow-hidden relative">
            <CameraView style={{ flex: 1 }} facing="back" />
            
            {/* Frame guides overlay */}
            <View className="absolute inset-0 border-2 border-dashed border-[#FDF8F5]/30 justify-center items-center pointer-events-none transition-colors">
              <View className={`absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 rounded-tl-[12px]`} style={{ borderColor: bracketColor }} />
              <View className={`absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 rounded-tr-[12px]`} style={{ borderColor: bracketColor }} />
              <View className={`absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 rounded-bl-[12px]`} style={{ borderColor: bracketColor }} />
              <View className={`absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 rounded-br-[12px]`} style={{ borderColor: bracketColor }} />
              
              {cameraState === 'ready' && (
                <View className="bg-[#738054]/90 px-4 py-2 rounded-full">
                  <Text size="base" style={{ color: '#FFFFFF' }} weight="bold">Product Framed</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View className="px-8 pb-12 pt-6 items-center flex-row justify-between">
        <View className="w-12" />
        <Pressable onPress={handleCapture} className="active:scale-95 transition-transform duration-200">
          <View className="w-20 h-20 rounded-full border-4 items-center justify-center p-1" style={{ borderColor: bracketColor }}>
            <View className="w-full h-full rounded-full items-center justify-center" style={{ backgroundColor: bracketColor }}>
              <HugeiconsIcon icon={Camera01Icon} size={32} color={cameraState === 'ready' ? '#FFFFFF' : '#2A1B18'} />
            </View>
          </View>
        </Pressable>
        <View className="w-12 h-12 rounded-xl bg-[#FDF8F5]/20 items-center justify-center">
          <HugeiconsIcon icon={Image01Icon} size={24} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
}
