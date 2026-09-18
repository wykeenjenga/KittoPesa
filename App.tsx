import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AddCardSheet from './components/AddCardSheet';
import PaySheet from './components/PaySheet';
import { AuthProvider } from './contexts/AuthContext';
import { RatesProvider } from './contexts/RatesContext';
import { useWalletCtx, WalletProvider } from './contexts/WalletContext';
import RootNavigator from './navigation/RootNavigator';
import { ThemeProvider, useTheme } from './theme/ThemeContext';

function GlobalModals() {
  const wallet = useWalletCtx();
  return (
    <>
      <PaySheet
        visible={wallet.payVisible}
        cards={wallet.cards}
        initialMethod={wallet.payRequest.method}
        initialMerchant={wallet.payRequest.merchant}
        initialAmount={wallet.payRequest.amount}
        kind={wallet.payRequest.kind}
        onClose={wallet.closePay}
        onComplete={wallet.completePayment}
      />
      <AddCardSheet
        visible={wallet.addCardVisible}
        onClose={() => wallet.setAddCardVisible(false)}
        onAdd={wallet.addCard}
      />
    </>
  );
}

function AppShell() {
  const { colors } = useTheme();
  const isWeb = Platform.OS === 'web';

  // React Native Web renders touchables as focusable elements, which picks
  // up the browser's default focus ring on tap/click. Suppress it globally
  // (native platforms are untouched — this effect never runs there).
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const style = document.createElement('style');
    style.textContent = '* { outline: none !important; }';
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <View style={[styles.outer, isWeb && { backgroundColor: '#20222a' }]}>
      <View style={[styles.frame, isWeb && styles.webFrame, { backgroundColor: colors.background }]}>
        <StatusBar style={colors.statusBar} />
        <RootNavigator />
        <GlobalModals />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RatesProvider>
          <AuthProvider>
            <WalletProvider>
              <AppShell />
            </WalletProvider>
          </AuthProvider>
        </RatesProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
  },
  frame: {
    flex: 1,
    width: '100%',
  },
  webFrame: {
    maxWidth: 430,
    boxShadow: '0 0 50px rgba(0, 0, 0, 0.35)',
  },
});
