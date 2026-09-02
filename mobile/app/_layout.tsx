// First, and it has to be first: this is what loads the Tailwind pipeline and
// the theme tokens every class name below resolves through.
import '../global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';
import { PanelUIProvider, useThemeMode } from 'panelui-native';
import { View, useWindowDimensions } from 'react-native';
import { AppProvider } from './context/AppContext';

function ThemedNavigation() {
  const { mode } = useThemeMode();
  const [background, card, text, border, primary] = useCSSVariable([
    '--color-background',
    '--color-card',
    '--color-foreground',
    '--color-border',
    '--color-primary',
  ]) as (string | undefined)[];

  const base = mode === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    dark: mode === 'dark',
    colors: {
      ...base.colors,
      ...(background ? { background } : null),
      ...(card ? { card } : null),
      ...(text ? { text } : null),
      ...(border ? { border } : null),
      ...(primary ? { primary, notification: primary } : null),
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (
    <AppProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: isLargeScreen ? '#E5DFD3' : '#FDF8F5', alignItems: 'center' }}>
          <View 
            style={{ 
              flex: 1, 
              width: '100%', 
              maxWidth: isLargeScreen ? 440 : '100%', 
              backgroundColor: '#FDF8F5',
              overflow: 'hidden',
              ...(isLargeScreen ? {
                boxShadow: '0px 16px 32px rgba(42, 27, 24, 0.08)',
                elevation: 10
              } : {})
            }}
          >
            <PanelUIProvider>
              <ThemedNavigation />
            </PanelUIProvider>
          </View>
        </View>
      </SafeAreaProvider>
    </AppProvider>
  );
}
