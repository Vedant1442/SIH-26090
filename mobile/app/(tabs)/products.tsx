import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, BottomSheet, Button } from 'panelui-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import CheckmarkCircle01Icon from '@hugeicons/core-free-icons/dist/esm/CheckmarkCircle01Icon';
import Alert01Icon from '@hugeicons/core-free-icons/dist/esm/Alert01Icon';
import Image01Icon from '@hugeicons/core-free-icons/dist/esm/Image01Icon';
import MoreVerticalIcon from '@hugeicons/core-free-icons/dist/esm/MoreVerticalIcon';
import { useState } from 'react';
import { useAppContext, Product } from '../context/AppContext';

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const { products } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [formalizationOpen, setFormalizationOpen] = useState(false);
  const [marketingOpen, setMarketingOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return '#738054';
      case 'Needs attention': return '#E59F4A';
      default: return '#8C7C75';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'Needs attention' ? Alert01Icon : CheckmarkCircle01Icon;
  };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <View className="flex-1 bg-[#FDF8F5]" style={{ paddingTop: insets.top }}>
      {/* Header Area */}
      <View className="px-6 pt-8 pb-4">
        <Text size="3xl" weight="bold" style={{ color: '#2A1B18' }} className="mb-1">
          My Products
        </Text>
        <Text size="base" style={{ color: '#8C7C75' }}>
          {products.length} products total
        </Text>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 100, gap: 16 }}>
        {products.map((product) => (
          <Pressable 
            key={product.id}
            onPress={() => handleProductPress(product)}
            className="bg-[#FFFFFF] p-4 rounded-[20px] shadow-sm border border-[#8C7C75]/20 flex-row gap-4 active:bg-[#FDF8F5]"
          >
            {/* Mock Image */}
            <View className="w-20 h-24 rounded-[12px] bg-[#E5DFD3] items-center justify-center">
              <HugeiconsIcon icon={Image01Icon} size={24} color="#8C7C75" />
            </View>

            {/* Details */}
            <View className="flex-1 justify-center">
              <Text size="lg" weight="bold" style={{ color: '#2A1B18' }}>{product.title}</Text>
              <Text size="base" style={{ color: '#8C7C75' }} className="mt-1">{product.price}</Text>
              
              <View className="flex-row items-center gap-1.5 mt-2">
                <HugeiconsIcon icon={getStatusIcon(product.status)} size={16} color={getStatusColor(product.status)} />
                <Text size="xs" weight="bold" style={{ color: getStatusColor(product.status) }}>
                  {product.status}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Main Product Action Sheet */}
      <BottomSheet open={!!selectedProduct && !pricingOpen && !exportOpen && !formalizationOpen && !marketingOpen} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <BottomSheet.Content>
          <BottomSheet.Header>
            <View className="flex-row justify-between items-center pr-2">
              <Text size="xl" weight="bold" style={{ color: '#2A1B18', flex: 1 }} numberOfLines={1}>
                {selectedProduct?.title}
              </Text>
              <HugeiconsIcon icon={MoreVerticalIcon} size={24} color="#8C7C75" />
            </View>
          </BottomSheet.Header>
          <BottomSheet.Body>
            <View className="py-2 gap-4">
              <View className="flex-row justify-between items-center bg-[#FDF8F5] p-4 rounded-[16px]">
                <Text size="base" style={{ color: '#8C7C75' }}>Price</Text>
                <Text size="lg" weight="bold" style={{ color: '#2A1B18' }}>{selectedProduct?.price}</Text>
              </View>

              <View className="gap-3 mt-2">
                <Button variant="outline" className="w-full justify-start py-4 border-[#8C7C75]/30" onPress={() => setPricingOpen(true)}>
                  <Text style={{ color: '#C2593F' }} weight="semibold">Edit Pricing Sheet</Text>
                </Button>
                <Button variant="outline" className="w-full justify-start py-4 border-[#8C7C75]/30" onPress={() => setFormalizationOpen(true)}>
                  <Text style={{ color: '#2A1B18' }} weight="semibold">Formalization Docs</Text>
                </Button>
                <Button variant="outline" className="w-full justify-start py-4 border-[#8C7C75]/30" onPress={() => setExportOpen(true)}>
                  <Text style={{ color: '#2A1B18' }} weight="semibold">ONDC / GeM Export</Text>
                </Button>
                <Button variant="outline" className="w-full justify-start py-4 border-[#8C7C75]/30" onPress={() => setMarketingOpen(true)}>
                  <Text style={{ color: '#C2593F' }} weight="semibold">AI Lifestyle Visuals</Text>
                </Button>
              </View>
            </View>
          </BottomSheet.Body>
        </BottomSheet.Content>
      </BottomSheet>

      {/* Pricing Sheet */}
      <BottomSheet open={pricingOpen} onOpenChange={setPricingOpen}>
        <BottomSheet.Content>
          <BottomSheet.Header>
            <Text size="xl" weight="bold" style={{ color: '#2A1B18' }}>Pricing Breakdown</Text>
          </BottomSheet.Header>
          <BottomSheet.Body>
            <View className="py-8">
              <Text>Pricing mock</Text>
            </View>
          </BottomSheet.Body>
        </BottomSheet.Content>
      </BottomSheet>

      {/* Formalization Sheet */}
      <BottomSheet open={formalizationOpen} onOpenChange={setFormalizationOpen}>
        <BottomSheet.Content>
          <BottomSheet.Header>
            <Text size="xl" weight="bold" style={{ color: '#2A1B18' }}>Your Profile & Documents</Text>
          </BottomSheet.Header>
          <BottomSheet.Body>
            <View className="py-8">
              <Text>Formalization mock</Text>
            </View>
          </BottomSheet.Body>
        </BottomSheet.Content>
      </BottomSheet>

      {/* Export Sheet */}
      <BottomSheet open={exportOpen} onOpenChange={setExportOpen}>
        <BottomSheet.Content>
          <BottomSheet.Header>
            <Text size="xl" weight="bold" style={{ color: '#2A1B18' }}>Export Status</Text>
          </BottomSheet.Header>
          <BottomSheet.Body>
            <View className="py-8">
              <Text>Export mock</Text>
            </View>
          </BottomSheet.Body>
        </BottomSheet.Content>
      </BottomSheet>

      {/* Marketing Sheet */}
      <BottomSheet open={marketingOpen} onOpenChange={setMarketingOpen}>
        <BottomSheet.Content>
          <BottomSheet.Header>
            <Text size="xl" weight="bold" style={{ color: '#2A1B18' }}>Lifestyle Images</Text>
          </BottomSheet.Header>
          <BottomSheet.Body>
            <View className="py-8">
              <Text>Marketing mock</Text>
            </View>
          </BottomSheet.Body>
        </BottomSheet.Content>
      </BottomSheet>
    </View>
  );
}
