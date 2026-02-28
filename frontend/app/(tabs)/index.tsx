import { Pressable, Text, TextInput, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';

import { base, buttons, Colors, form } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type PlayerProfile = {
  id?: string | number;
  email?: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const palette = Colors[isDark ? 'dark' : 'light'];

  const authUrl = useMemo(
    () => ({
      login: `${API_BASE_URL}/api/players/login`,
      signup: `${API_BASE_URL}/api/players`,
      me: `${API_BASE_URL}/api/players/me`,
      logout: `${API_BASE_URL}/api/players/logout`,
    }),
    [],
  );

  const loadCurrentPlayer = async () => {
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
    } catch (error) {
      console.error('Error loading player session:', error);
      setPlayer(null);
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const loginResponse = await fetch(authUrl.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json().catch(() => null);
        setPlayer(loginData?.user ?? null);
        setPassword('');
        return;
      }

      if (loginResponse.status !== 401) {
        throw new Error('Unable to authenticate with these credentials');
      }

      // Auto-create a player account if login fails and email does not exist yet.
      // If the account already exists, this will fail and we surface a generic auth error.
      {
        const signupResponse = await fetch(authUrl.signup, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        if (!signupResponse.ok) {
          throw new Error('Unable to authenticate with these credentials');
        }
      }

      const secondLoginResponse = await fetch(authUrl.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!secondLoginResponse.ok) {
        throw new Error('Unable to authenticate with these credentials');
      }

      const loginData = await secondLoginResponse.json().catch(() => null);
      setPlayer(loginData?.user ?? null);
      setPassword('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const onSignOut = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      await fetch(authUrl.logout, {
        method: 'POST',
        credentials: 'include',
      });
      setPlayer(null);
      setPassword('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign out';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentPlayer();
  }, []);

  const authInputStyle = [
    form.input,
    {
      borderColor: palette.tabIconDefault,
      color: palette.text,
      backgroundColor: palette.background,
    },
  ];

  return (
    <View style={base.container}>
      <Text style={[base.title, { color: palette.text }]}>Player Access</Text>

      {player ? (
        <View style={form.inputGroup}>
          <Text style={[base.paragraph, { color: palette.text }]}>Signed in as {player.email ?? 'Player'}.</Text>
          <Text style={[base.comments, { color: palette.icon }]}>You can now continue and play the game.</Text>
          <Pressable
            style={[buttons.secondary, { backgroundColor: palette.background, borderWidth: 1, borderColor: palette.tabIconDefault }]}
            onPress={onSignOut}
            disabled={loading}
          >
            <Text style={[buttons.text, { color: palette.text }]}>{loading ? 'Signing out…' : 'Sign out'}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={form.inputGroup}>
          <Text style={[base.subtitle, { color: palette.text }]}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="player@example.com"
            placeholderTextColor={palette.icon}
            style={authInputStyle}
          />

          <Text style={[base.subtitle, { color: palette.text }]}>Password</Text>
          <TextInput
            secureTextEntry
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={palette.icon}
            style={authInputStyle}
          />

          <Pressable
            style={[
              buttons.primary,
              {
                backgroundColor: palette.link,
              },
              loading && buttons.disabled,
            ]}
            onPress={onSubmit}
            disabled={loading || !email || !password}
          >
            <Text style={[buttons.text, { color: Colors.light.background }]}>
              {loading ? 'Please wait…' : 'Sign in'}
            </Text>
          </Pressable>

          {errorMessage ? <Text style={form.error}>{errorMessage}</Text> : null}
          <Text style={[base.comments, { color: palette.icon }]}>If no account exists for this email, one will be created automatically.</Text>
        </View>
      )}
    </View>
  );
}
