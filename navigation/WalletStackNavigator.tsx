import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CardDetailScreen from '../screens/CardDetailScreen';
import InsightsScreen from '../screens/InsightsScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import WalletScreen from '../screens/WalletScreen';
import type { WalletStackParamList } from './types';

const Stack = createNativeStackNavigator<WalletStackParamList>();

export default function WalletStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WalletMain" component={WalletScreen} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      <Stack.Screen name="CardDetail" component={CardDetailScreen} />
      <Stack.Screen name="Insights" component={InsightsScreen} />
    </Stack.Navigator>
  );
}
