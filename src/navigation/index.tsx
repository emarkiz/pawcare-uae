import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../types';
import AuthNavigator from './AuthNavigator';
import { CustomerTabNavigator } from './AppNavigator';
import PlaceholderScreen from '../screens/PlaceholderScreen';

function RoleAppNavigator({ role }: { role: UserRole }) {
  switch (role) {
    case 'provider':
      return (
        <PlaceholderScreen
          title="PawPro Dashboard 🌟"
          subtitle="Provider home — Session 4"
          showSignOut
        />
      );
    case 'vendor':
      return (
        <PlaceholderScreen
          title="Vendor Dashboard 🏪"
          subtitle="Vendor home — Session 5"
          showSignOut
        />
      );
    case 'vet':
      return (
        <PlaceholderScreen
          title="Vet / Clinic Portal 🩺"
          subtitle="Vet home — Session 6"
          showSignOut
        />
      );
    case 'admin':
      return (
        <PlaceholderScreen
          title="Admin Control Centre 🛡️"
          subtitle="Admin home — Session 7"
          showSignOut
        />
      );
    case 'customer':
    default:
      return <CustomerTabNavigator />;
  }
}

function AuthenticatedNavigator() {
  const role = useAuthStore((s) => s.role) ?? 'customer';
  return <RoleAppNavigator role={role} />;
}

export default function RootNavigator() {
  const session = useAuthStore((s) => s.session);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  if (!isInitialized) {
    return null;
  }

  if (!session) {
    return <AuthNavigator />;
  }

  return <AuthenticatedNavigator />;
}
