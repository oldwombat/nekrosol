import { useRouter, usePathname } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Colors, menu, typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type PlayerProfile = {
  id?: string | number;
  email?: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const palette = Colors[isDark ? 'dark' : 'light'];

  const authUrl = useMemo(
    () => ({
      me: `${API_BASE_URL}/api/players/me`,
      logout: `${API_BASE_URL}/api/players/logout`,
    }),
    [],
  );

  const loadSession = async () => {
    try {
      const response = await fetch(authUrl.me, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        setPlayer(null);
        return;
      }

      const data = await response.json();
      setPlayer(data?.user ?? null);
    } catch {
      setPlayer(null);
    }
  };

  useEffect(() => {
    loadSession();
  }, [pathname]);

  const navigateTo = (path: '/' | '/lore' | '/account') => {
    setMenuOpen(false);
    router.push(path);
  };

  const onSignOut = async () => {
    try {
      await fetch(authUrl.logout, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setPlayer(null);
      setMenuOpen(false);
      router.replace('/');
    }
  };

  return (
    <View style={{ backgroundColor: palette.background, borderBottomWidth: 1, borderBottomColor: palette.tabIconDefault }}>
      <View
        style={{
          height: 56,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ color: palette.text, fontSize: typography.bodySize + 2, fontWeight: '700' }}>Nekrosol</Text>
        <Pressable
          style={menu.trigger}
          onPress={() => setMenuOpen((value) => !value)}
          accessibilityRole="button"
          accessibilityLabel="Open navigation menu"
        >
          <Text style={{ color: palette.text, fontSize: 22, lineHeight: 22 }}>☰</Text>
        </Pressable>
      </View>

      {menuOpen ? (
        <View style={[menu.card, { backgroundColor: palette.background, borderColor: palette.tabIconDefault }]}>
          <Pressable style={menu.item} onPress={() => navigateTo('/')}>
            <Text style={{ color: palette.text }}>Home</Text>
          </Pressable>

          {player ? (
            <>
              <Pressable style={menu.item} onPress={() => navigateTo('/account')}>
                <Text style={{ color: palette.text }}>Account</Text>
              </Pressable>
              <Pressable style={menu.item} onPress={onSignOut}>
                <Text style={{ color: palette.text }}>Sign Out</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={menu.item} onPress={() => navigateTo('/')}>
              <Text style={{ color: palette.text }}>Sign In</Text>
            </Pressable>
          )}

          <Pressable style={menu.item} onPress={() => navigateTo('/lore')}>
            <Text style={{ color: palette.text }}>Lore</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}