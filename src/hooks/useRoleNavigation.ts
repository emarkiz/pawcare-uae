import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../types';

/** Maps user role to the primary app navigator key */
export function getAppNavigatorForRole(role: UserRole | null): string {
  switch (role) {
    case 'provider':
      return 'ProviderApp';
    case 'vendor':
      return 'VendorApp';
    case 'vet':
      return 'VetApp';
    case 'admin':
      return 'AdminApp';
    case 'customer':
    default:
      return 'CustomerApp';
  }
}

export function useUserRole(): UserRole {
  return useAuthStore((s) => s.role) ?? 'customer';
}
