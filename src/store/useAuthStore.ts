import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

import { supabase } from '../services/supabase';
import type { User, UserRole } from '../types';

interface AuthState {
  session: Session | null;
  profile: User | null;
  role: UserRole | null;
  isLoading: boolean;
  isInitialized: boolean;
  initialize: () => () => void;
  fetchProfile: (userId: string) => Promise<UserRole | null>;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  role: null,
  isLoading: true,
  isInitialized: false,

  fetchProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      set({ profile: null, role: 'customer' });
      return 'customer';
    }

    const profile = data as User;
    set({ profile, role: profile.role });
    return profile.role;
  },

  setSession: (session) => {
    set({ session });
  },

  initialize: () => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        set({ session, isLoading: !!session });

        if (session?.user) {
          await get().fetchProfile(session.user.id);
        }
      } finally {
        if (mounted) {
          set({ isLoading: false, isInitialized: true });
        }
      }
    };

    bootstrap();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        set({ session, isLoading: false, isInitialized: true });

        if (session?.user) {
          await get().fetchProfile(session.user.id);
        } else {
          set({ profile: null, role: null });
        }
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, profile: null, role: null });
  },
}));
