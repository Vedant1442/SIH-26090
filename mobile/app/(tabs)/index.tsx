import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Card, BottomSheet, Button } from 'panelui-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import Mic01Icon from '@hugeicons/core-free-icons/dist/esm/Mic01Icon';
import Camera01Icon from '@hugeicons/core-free-icons/dist/esm/Camera01Icon';
import Home01Icon from '@hugeicons/core-free-icons/dist/esm/Home01Icon';
import Folder01Icon from '@hugeicons/core-free-icons/dist/esm/Folder01Icon';
import { useState } from 'react';
import { router } from 'expo-router';

import { useAppContext } from '../context/AppContext';

export default function ArtisanHome() {
  const insets = useSafeAreaInsets();
  const [speakOpen, setSpeakOpen] = useState(false);
  const [formalizationOpen, setFormalizationOpen] = useState(false);
  const [demoState, setDemoState] = useState<'empty' | 'default' | 'attention'>('default');
  const { products } = useAppContext();

  const cycleDemoState = () => {
    if (demoState === 'default') setDemoState('empty');
    else if (demoState === 'empty') setDemoState('attention');
    else setDemoState('default');
  };

  const needsAttentionCount = products.filter(p => p.status === 'Needs attention').length;
  const liveCount = products.filter(p => p.status === 'Live').length;

  return (
    <View 
      className="flex-1 bg-[#FDF8F5]"
      style={{ paddingTop: insets.top }}
    >
      {/* Header Area */}
      <View className="px-6 pt-8 pb-4">
        <Pressable onPress={cycleDemoState}>
          <Text size="3xl" weight="bold" style={{ color: '#2A1B18' }} className="mb-1">
            नमस्कार, Sita 👋
          </Text>
        </Pressable>
        <Text size="base" style={{ color: '#8C7C75' }}>
          {demoState === 'empty' 
            ? "Let's add your first product" 
            : demoState === 'attention' 
            ? `${needsAttentionCount} product${needsAttentionCount !== 1 ? 's' : ''} needs your confirmation` 
            : `${liveCount} product${liveCount !== 1 ? 's' : ''} live, 1 needs your voice`}
        </Text>
      </View>

      {/* Main Dominant Action */}
      <View className="px-6 py-4 flex-1">
        <Pressable onPress={() => router.push('/(tabs)/speak')} className="active:scale-95 transition-transform duration-200">
          <View className="rounded-[20px] bg-[#C2593F] p-8 items-center justify-center min-h-[240px] shadow-sm">
            <View className="flex-row items-center gap-6 mb-6">
              <View className="bg-[#8B3A2B] p-5 rounded-full shadow-lg">
                <HugeiconsIcon icon={Mic01Icon} size={40} color="#FFFFFF"  />
              </View>
              <View className="bg-[#A64631] p-4 rounded-full">
                <HugeiconsIcon icon={Camera01Icon} size={32} color="#FFFFFF"  />
              </View>
            </View>
            <Text size="xl" weight="semibold" style={{ color: '#FFFFFF' }}>
              Tap to start listing
            </Text>
          </View>
        </Pressable>

        {/* Woven thread-row */}
        <View className="my-10 flex-row justify-center gap-1.5 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <View 
              key={i} 
              className="h-1 w-3 rounded-full bg-[#8C7C75]/30"
            />
          ))}
        </View>

        {/* Profile & Formalization Status */}
        {demoState !== 'empty' && (
          <View className="mb-8">
            <Pressable 
              onPress={() => setFormalizationOpen(true)}
            className="flex-row items-center justify-between bg-[#FFFFFF] p-4 rounded-[16px] shadow-sm border border-[#8C7C75]/20 active:bg-[#FDF8F5]"
          >
            <View className="flex-1">
              <Text size="sm" weight="semibold" style={{ color: '#2A1B18' }}>
                Your Profile
              </Text>
              <Text size="xs" style={{ color: '#8C7C75' }} className="mt-1">
                2 of 5 documents ready
              </Text>
            </View>
            {/* Thread-row progress motif */}
            <View className="flex-row gap-1">
              <View className="h-1.5 w-3 rounded-full bg-[#738054]" />
              <View className="h-1.5 w-3 rounded-full bg-[#738054]" />
              <View className={`h-1.5 w-3 rounded-full ${demoState === 'attention' ? 'bg-[#E59F4A]' : 'bg-[#E5DFD3]'}`} />
              <View className="h-1.5 w-3 rounded-full bg-[#E5DFD3]" />
              <View className="h-1.5 w-3 rounded-full bg-[#E5DFD3]" />
            </View>
          </Pressable>
        </View>
      )}
      </View>

      {/* Bottom Sheet for "Speak" action */}
      <BottomSheet open={speakOpen} onOpenChange={setSpeakOpen}>
        <BottomSheet.Content>
          <BottomSheet.Header>
            <Text size="xl" weight="bold" style={{ color: '#2A1B18' }}>
              Speak your product details
            </Text>
          </BottomSheet.Header>
          <BottomSheet.Body>
            <View className="py-8 items-center justify-center gap-6">
              <View className="bg-[#FDF8F5] p-8 rounded-full border-4 border-[#8B3A2B]/20">
                <HugeiconsIcon icon={Mic01Icon} size={64} color="#8B3A2B"  />
              </View>
              <Text size="lg" style={{ color: '#8C7C75' }} className="text-center px-4">
                "This is a blue handloom cotton saree with silver zari border..."
              </Text>
            </View>
          </BottomSheet.Body>
          <BottomSheet.Footer>
            <Button className="w-full bg-[#C2593F]" size="lg" onPress={() => setSpeakOpen(false)}>
              <Text style={{ color: '#FFFFFF' }} weight="semibold">Done</Text>
            </Button>
          </BottomSheet.Footer>
        </BottomSheet.Content>
      </BottomSheet>

      {/* Bottom Sheet for "Formalization Docs" */}
      <BottomSheet open={formalizationOpen} onOpenChange={setFormalizationOpen}>
        <BottomSheet.Content>
          <BottomSheet.Header>
            <Text size="xl" weight="bold" style={{ color: '#2A1B18' }}>
              Your Profile & Documents
            </Text>
          </BottomSheet.Header>
          <BottomSheet.Body>
            <View className="py-2 gap-4">
              <View className="flex-row items-center justify-between p-4 bg-[#FDF8F5] rounded-[16px]">
                <Text size="base" weight="semibold" style={{ color: '#2A1B18' }}>Aadhaar</Text>
                <View className="px-3 py-1 rounded-full bg-[#738054]/10 border border-dashed border-[#738054]">
                  <Text size="xs" weight="bold" style={{ color: '#738054' }}>Done</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between p-4 bg-[#FDF8F5] rounded-[16px]">
                <Text size="base" weight="semibold" style={{ color: '#2A1B18' }}>Bank Account</Text>
                <View className="px-3 py-1 rounded-full bg-[#738054]/10 border border-dashed border-[#738054]">
                  <Text size="xs" weight="bold" style={{ color: '#738054' }}>Done</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between p-4 bg-[#FDF8F5] rounded-[16px]">
                <Text size="base" weight="semibold" style={{ color: '#2A1B18' }}>PAN Card</Text>
                <View className="px-3 py-1 rounded-full bg-[#E59F4A]/10 border border-dashed border-[#E59F4A]">
                  <Text size="xs" weight="bold" style={{ color: '#E59F4A' }}>In progress</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between p-4 bg-[#FDF8F5] rounded-[16px]">
                <Text size="base" weight="semibold" style={{ color: '#2A1B18' }}>Udyam</Text>
                <View className="px-3 py-1 rounded-full bg-[#8C7C75]/10 border border-dashed border-[#8C7C75]">
                  <Text size="xs" weight="bold" style={{ color: '#8C7C75' }}>Not started</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between p-4 bg-[#FDF8F5] rounded-[16px]">
                <Text size="base" weight="semibold" style={{ color: '#2A1B18' }}>GST</Text>
                <View className="px-3 py-1 rounded-full bg-[#8C7C75]/10 border border-dashed border-[#8C7C75]">
                  <Text size="xs" weight="bold" style={{ color: '#8C7C75' }}>Not started</Text>
                </View>
              </View>

              <Button  className="w-full mt-4 border-[#8C7C75]/30 py-4">
                <Text style={{ color: '#C2593F' }} weight="semibold">Find nearest CSC for help</Text>
              </Button>
            </View>
          </BottomSheet.Body>
        </BottomSheet.Content>
      </BottomSheet>
    </View>
  );
}
