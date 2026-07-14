import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { wardrobeSeed } from '../data';
import { Category, WardrobeItem } from '../types';

type AppContextValue = {
  isReady: boolean;
  isSignedIn: boolean;
  wardrobe: WardrobeItem[];
  bookedSlots: string[];
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  addWardrobeItem: (image: string, category: Category) => void;
  bookSlot: (stylistId: string, slot: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);
const SESSION_KEY = '@drape/session';
const WARDROBE_KEY = '@drape/wardrobe';
const BOOKINGS_KEY = '@drape/bookings';

export function AppProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(wardrobeSeed);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  useEffect(() => {
    async function hydrate() {
      try {
        const [session, storedWardrobe, storedBookings] = await Promise.all([
          AsyncStorage.getItem(SESSION_KEY),
          AsyncStorage.getItem(WARDROBE_KEY),
          AsyncStorage.getItem(BOOKINGS_KEY),
        ]);
        setIsSignedIn(Boolean(session));
        if (storedWardrobe) {
          setWardrobe(JSON.parse(storedWardrobe) as WardrobeItem[]);
        }
        if (storedBookings) {
          setBookedSlots(JSON.parse(storedBookings) as string[]);
        }
      } finally {
        setIsReady(true);
      }
    }
    void hydrate();
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      isReady,
      isSignedIn,
      wardrobe,
      bookedSlots,
      signIn: async (email) => {
        await AsyncStorage.setItem(SESSION_KEY, email.trim().toLowerCase());
        setIsSignedIn(true);
      },
      signOut: async () => {
        await AsyncStorage.removeItem(SESSION_KEY);
        setIsSignedIn(false);
      },
      addWardrobeItem: (image, category) => {
        const next: WardrobeItem[] = [
          {
            id: `local-${Date.now()}`,
            name: `New ${category.slice(0, -1)}`,
            category,
            image,
            color: '#E9E4DB',
          },
          ...wardrobe,
        ];
        setWardrobe(next);
        void AsyncStorage.setItem(WARDROBE_KEY, JSON.stringify(next));
      },
      bookSlot: (stylistId, slot) => {
        setBookedSlots((current) => {
          const next = [...current, `${stylistId}:${slot}`];
          void AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
          return next;
        });
      },
    }),
    [bookedSlots, isReady, isSignedIn, wardrobe],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error('useApp must be used within AppProvider');
  }
  return value;
}
