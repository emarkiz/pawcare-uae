import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '../types';
import OnboardScreen from '../screens/auth/OnboardScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import RegisterPetScreen from '../screens/auth/RegisterPetScreen';
import RegisterSuccessScreen from '../screens/auth/RegisterSuccessScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Onboard"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Onboard" component={OnboardScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Otp" component={OTPScreen} />
      <Stack.Screen name="RegisterPet" component={RegisterPetScreen} />
      <Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} />
    </Stack.Navigator>
  );
}
