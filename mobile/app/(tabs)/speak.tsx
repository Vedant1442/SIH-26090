import { View, Animated, Easing, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button } from 'panelui-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import Mic01Icon from '@hugeicons/core-free-icons/dist/esm/Mic01Icon';
import KeyboardIcon from '@hugeicons/core-free-icons/dist/esm/KeyboardIcon';
import CheckmarkCircle01Icon from '@hugeicons/core-free-icons/dist/esm/CheckmarkCircle01Icon';
import Alert01Icon from '@hugeicons/core-free-icons/dist/esm/Alert01Icon';
import PlayIcon from '@hugeicons/core-free-icons/dist/esm/PlayIcon';
import Cancel01Icon from '@hugeicons/core-free-icons/dist/esm/Cancel01Icon';
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { useAppContext } from '../context/AppContext';
import * as Haptics from 'expo-haptics';

export default function SpeakScreen() {
  const insets = useSafeAreaInsets();
  const { addProduct } = useAppContext();
  const [mainState, setMainState] = useState<'listening' | 'drafted'>('listening');
  const [activeField, setActiveField] = useState<string | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Simulate granular generation
  const [visibleFields, setVisibleFields] = useState<number>(0);

  useEffect(() => {
    if (mainState === 'listening' || activeField) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [mainState, activeField]);

  useEffect(() => {
    if (mainState === 'drafted' && !activeField) {
      // Simulate cascading field generation
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setVisibleFields(current);
        if (current >= 3) clearInterval(interval);
      }, 600);
      return () => clearInterval(interval);
    }
  }, [mainState, activeField]);

  const fields = [
    { id: 'title', label: 'Product Title', value: 'Indigo Handwoven Saree', confidence: 'Heard clearly', color: '#738054', icon: CheckmarkCircle01Icon },
    { id: 'material', label: 'Material & Details', value: 'Pure cotton, silver zari border', confidence: 'Heard clearly', color: '#738054', icon: CheckmarkCircle01Icon },
    { id: 'price', label: 'Price', value: '₹ 2,400', confidence: 'Please confirm', color: '#E59F4A', icon: Alert01Icon },
  ];

  return (
    <View className="flex-1 bg-[#FDF8F5]" style={{ paddingTop: insets.top }}>
      
      {/* Header */}
      {mainState === 'drafted' && !activeField && (
        <View className="px-6 pt-6 pb-2">
          <Text size="2xl" weight="bold" style={{ color: '#2A1B18', fontFamily: 'Fraunces' }}>
            Review Details
          </Text>
          <Text size="sm" style={{ color: '#8C7C75' }} className="mt-1">
            Tap any field to correct it.
          </Text>
        </View>
      )}

      {/* Draft Content Area */}
      {mainState === 'listening' ? (
        <View className="flex-1 px-8 justify-center">
          <Text size="3xl" weight="medium" style={{ color: '#8C7C75' }} className="leading-tight">
            "This is a handwoven blue saree, price is <Text style={{ color: '#2A1B18' }}>two thousand four hundred rupees</Text>..."
          </Text>
        </View>
      ) : activeField ? (
        <View className="flex-1 px-8 justify-center">
          <Text size="sm" weight="semibold" style={{ color: '#8C7C75' }} className="mb-2 uppercase tracking-widest">
            Re-recording: {fields.find(f => f.id === activeField)?.label}
          </Text>
          <Text size="2xl" weight="medium" style={{ color: '#2A1B18' }} className="leading-tight">
            "Actually, the price is <Text style={{ color: '#C2593F' }}>two thousand five hundred</Text>..."
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
          {fields.slice(0, visibleFields).map((field) => (
            <Pressable 
              key={field.id}
              onPress={() => setActiveField(field.id)}
              className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-[#8C7C75]/20 active:bg-[#FDF8F5]"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text size="xs" weight="semibold" style={{ color: '#8C7C75' }} className="uppercase tracking-widest">
                  {field.label}
                </Text>
                <View className="flex-row items-center gap-1.5 bg-[#FDF8F5] px-2 py-1 rounded-full border border-[#8C7C75]/10">
                  <HugeiconsIcon icon={field.icon} size={14} color={field.color} />
                  <Text size="xs" weight="bold" style={{ color: field.color }}>{field.confidence}</Text>
                </View>
              </View>
              
              <Text size="lg" weight="medium" style={{ color: '#2A1B18' }} className="mb-4 pr-8">
                {field.value}
              </Text>

              <View className="flex-row items-center gap-2 border-t border-[#8C7C75]/10 pt-3">
                <View className="bg-[#8C7C75]/10 p-2 rounded-full">
                  <HugeiconsIcon icon={PlayIcon} size={16} color="#2A1B18" />
                </View>
                <Text size="xs" style={{ color: '#8C7C75' }}>Original audio snippet</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Voice Bar */}
      <View className="px-6 pb-10 pt-4 items-center gap-6 bg-[#FDF8F5]">
        {mainState === 'listening' || activeField ? (
          <Text size="sm" style={{ color: '#C2593F' }} weight="bold">Listening...</Text>
        ) : (
          <Text size="sm" style={{ color: '#8C7C75' }} weight="medium">Tap mic to add more details</Text>
        )}

        <View className="flex-row items-center justify-center w-full relative h-24">
          {activeField ? (
            <Pressable 
              onPress={() => setActiveField(null)}
              className="absolute left-0 bg-[#FDF8F5] p-4 rounded-full border border-[#8C7C75]/30"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={24} color="#2A1B18" />
            </Pressable>
          ) : (
            <View className="absolute left-0 bg-[#FFFBF9] p-4 rounded-full border border-[#8C7C75]/20">
              <HugeiconsIcon icon={KeyboardIcon} size={24} color="#2A1B18" />
            </View>
          )}
          
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Button 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                if (activeField) {
                  setActiveField(null); // finish re-recording field
                } else {
                  setMainState(prev => prev === 'listening' ? 'drafted' : 'listening');
                  setVisibleFields(0); // reset cascading anim
                }
              }}
              className="w-[88px] h-[88px] rounded-full bg-[#C2593F] items-center justify-center shadow-lg"
              style={{ padding: 0 }}
            >
              <HugeiconsIcon icon={Mic01Icon} size={40} color="#FFFFFF" />
            </Button>
          </Animated.View>
        </View>

        {mainState === 'drafted' && !activeField && visibleFields >= 3 && (
          <Button 
            className="w-full bg-[#2A1B18] py-4 rounded-[20px] mt-2" 
            size="lg"
            onPress={() => {
              addProduct({
                id: Math.random().toString(),
                title: fields[0].value,
                price: fields[2].value,
                material: fields[1].value,
                status: 'Live',
                hasPhoto: false
              });
              router.replace('/(tabs)/products');
            }}
          >
            <Text style={{ color: '#FFFFFF' }} weight="semibold">Save Product</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
