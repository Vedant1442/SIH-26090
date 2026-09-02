import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageSelection } from './src/screens/LanguageSelection';
import { ArtisanHome } from './src/screens/ArtisanHome';
import { VoiceCreation } from './src/screens/VoiceCreation';
import { PricingAssistant } from './src/screens/PricingAssistant';
import { MyProducts } from './src/screens/MyProducts';
import { ListingPreview } from './src/screens/ListingPreview';
import { AIPhotoStudio } from './src/screens/AIPhotoStudio';
import { PanelUIProvider } from './components/ui/panel-ui-provider';
import './global.css';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PanelUIProvider>
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="LanguageSelection">
          <Stack.Screen name="LanguageSelection">
            {({ navigation }) => (
              <LanguageSelection
                onContinue={(lang) => {
                  console.log(`Selected language: ${lang}`);
                  navigation.navigate('ArtisanHome');
                }}
              />
            )}
          </Stack.Screen>
          
          <Stack.Screen name="ArtisanHome">
            {({ navigation }) => (
              <ArtisanHome
                onMainAction={() => navigation.navigate('VoiceCreation')}
                onQuickAction={(actionId) => {
                  if (actionId === 'pricing') navigation.navigate('PricingAssistant');
                  else if (actionId === 'my_products') navigation.navigate('MyProducts');
                  else if (actionId === 'add_product') navigation.navigate('VoiceCreation');
                  else alert(`Action: ${actionId}`);
                }}
                onNavAction={(navId) => {
                  if (navId === 'home') return;
                  if (navId === 'products') navigation.navigate('MyProducts');
                  else alert(`Navigating to ${navId}...`);
                }}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="VoiceCreation">
            {({ navigation }) => (
              <VoiceCreation
                onBack={() => navigation.goBack()}
                onConfirm={() => {
                  navigation.navigate('AIPhotoStudio');
                }}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="AIPhotoStudio">
            {({ navigation }) => (
              <AIPhotoStudio
                onClose={() => navigation.goBack()}
                onUseImage={() => {
                  navigation.navigate('PricingAssistant');
                }}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="PricingAssistant">
            {({ navigation }) => (
              <PricingAssistant
                onAccept={() => {
                  navigation.navigate('ListingPreview');
                }}
                onChangePrice={() => alert('Change price')}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="ListingPreview">
            {({ navigation }) => (
              <ListingPreview
                onBack={() => navigation.goBack()}
                onPublish={() => {
                  alert('Product published successfully!');
                  navigation.navigate('MyProducts');
                }}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="MyProducts">
            {({ navigation }) => (
              <MyProducts
                onNavAction={(navId) => {
                  if (navId === 'home') navigation.navigate('ArtisanHome');
                  else alert(`Navigating to ${navId}`);
                }}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    </PanelUIProvider>
  );
}
