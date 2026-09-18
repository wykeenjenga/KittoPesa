import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AddCardSheet from './components/AddCardSheet';
import TabBar, { TabKey } from './components/TabBar';
import PaySheet from './components/PaySheet';
import { useWallet } from './hooks/useWallet';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShopScreen from './screens/ShopScreen';
import WalletScreen from './screens/WalletScreen';

export default function App() {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.topBar}>
        <Text style={styles.brand}>KittoPesa</Text>
        <Text style={styles.demoBadge}>DEMO · no real money moves</Text>
      </View>

      <View style={styles.screen}>
        {activeTab === 'home' && <HomeScreen wallet={wallet} onNavigate={setActiveTab} />}
        {activeTab === 'shop' && <ShopScreen wallet={wallet} />}
        {activeTab === 'wallet' && <WalletScreen wallet={wallet} />}
        {activeTab === 'profile' && <ProfileScreen wallet={wallet} />}
      </View>

      <TabBar active={activeTab} onChange={setActiveTab} />

      <PaySheet
        visible={wallet.payVisible}
        cards={wallet.cards}
        initialMethod={wallet.payRequest.method}
        initialMerchant={wallet.payRequest.merchant}
        initialAmount={wallet.payRequest.amount}
        onClose={wallet.closePay}
        onComplete={wallet.completePayment}
      />
      <AddCardSheet
        visible={wallet.addCardVisible}
        onClose={() => wallet.setAddCardVisible(false)}
        onAdd={wallet.addCard}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  brand: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  demoBadge: {
    fontSize: 10,
    color: '#0f9d58',
    fontWeight: '600',
    marginTop: 1,
    letterSpacing: 0.4,
  },
  screen: {
    flex: 1,
  },
});
