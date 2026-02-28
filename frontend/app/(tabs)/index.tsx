import { Pressable, Text, TextInput, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';

import { base, buttons, Colors, form } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type PlayerProfile = {
  id?: string | number;
  email?: string;
  displayName?: string | null;
  credits?: number | null;
  creditsMax?: number | null;
  energy?: number | null;
  energyMax?: number | null;
  health?: number | null;
  healthMax?: number | null;
  radiation?: number | null;
  radiationMax?: number | null;
};

type ActionType = 'SPD-1' | 'MED-1' | 'RAD-X' | 'BEG';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<ActionType | null>(null);
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const palette = Colors[isDark ? 'dark' : 'light'];

  const authUrl = useMemo(
    () => ({
      login: `${API_BASE_URL}/api/players/login`,
      signup: `${API_BASE_URL}/api/players`,
      me: `${API_BASE_URL}/api/players/me`,
      logout: `${API_BASE_URL}/api/players/logout`,
      actions: `${API_BASE_URL}/api/player-actions`,
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

  const onAction = async (action: ActionType) => {
    setActionLoading(action);
    setErrorMessage(null);
    setActionMessage(null);

    try {
      const response = await fetch(authUrl.actions, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Action failed');
      }

      setPlayer(data?.player ?? null);

      if (action === 'BEG') {
        setActionMessage(`You begged and received ${data?.gain ?? 0} credits.`);
      } else {
        setActionMessage(`${action} applied successfully.`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Action failed';
      setErrorMessage(message);
    } finally {
      setActionLoading(null);
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

  const statItems = player
    ? [
      { key: 'credits', label: 'Credits', value: player.credits ?? 0, max: player.creditsMax ?? 1000000 },
      { key: 'energy', label: 'Energy', value: player.energy ?? 0, max: player.energyMax ?? 10 },
      { key: 'health', label: 'Health', value: player.health ?? 0, max: player.healthMax ?? 100 },
      { key: 'radiation', label: 'Radiation', value: player.radiation ?? 0, max: player.radiationMax ?? 100 },
    ]
    : [];

  return (
    <View style={base.container}>
      <Text style={[base.title, { color: palette.text }]}>Home</Text>

      {player ? (
        <View style={form.inputGroup}>
          <Text style={[base.paragraph, { color: palette.text }]}>Welcome back, {player.displayName ?? 'Player'}.</Text>
          <View style={{ gap: 10 }}>
            {statItems.map((stat) => {
              const safeMax = stat.max > 0 ? stat.max : 1;
              const percent = Math.max(0, Math.min(100, Math.round((stat.value / safeMax) * 100)));
              return (
                <View
                  key={stat.key}
                  style={{
                    borderWidth: 1,
                    borderColor: palette.tabIconDefault,
                    borderRadius: 10,
                    padding: 12,
                    backgroundColor: palette.background,
                    gap: 6,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[base.subtitle, { color: palette.text }]}>{stat.label}</Text>
                    <Text style={[base.subtitle, { color: palette.text }]}>
                      {stat.value.toLocaleString()} / {safeMax.toLocaleString()}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      height: 8,
                      borderRadius: 999,
                      overflow: 'hidden',
                      backgroundColor: palette.tabIconDefault,
                    }}
                  >
                    <View
                      style={{
                        width: `${percent}%`,
                        height: '100%',
                        backgroundColor: palette.link,
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          <Text style={[base.subtitle, { color: palette.text }]}>Actions</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {(['SPD-1', 'MED-1', 'RAD-X', 'BEG'] as ActionType[]).map((action) => (
              <Pressable
                key={action}
                style={[
                  buttons.secondary,
                  {
                    backgroundColor: palette.background,
                    borderColor: palette.tabIconDefault,
                    borderWidth: 1,
                    minWidth: 90,
                  },
                  actionLoading === action && buttons.disabled,
                ]}
                onPress={() => onAction(action)}
                disabled={actionLoading !== null}
              >
                <Text style={[buttons.text, { color: palette.text }]}>
                  {actionLoading === action ? '...' : action}
                </Text>
              </Pressable>
            ))}
          </View>

          {actionMessage ? <Text style={[base.comments, { color: palette.icon }]}>{actionMessage}</Text> : null}
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
