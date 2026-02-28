import { Pressable, Text, TextInput, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';

import { base, buttons, Colors, form } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type PlayerProfile = {
  id?: string | number;
  email?: string;
  displayName?: string;
  createdAt?: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

const formatDate = (input?: string) => {
  if (!input) return 'Unknown';
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatAge = (input?: string) => {
  if (!input) return 'Unknown';
  const created = new Date(input);
  if (Number.isNaN(created.getTime())) return 'Unknown';

  const now = new Date();
  const ms = now.getTime() - created.getTime();
  if (ms < 0) return 'Unknown';

  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days < 1) return 'Today';
  if (days === 1) return '1 day';
  return `${days} days`;
};

export default function AccountScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const palette = Colors[isDark ? 'dark' : 'light'];

  const authUrl = useMemo(
    () => ({
      me: `${API_BASE_URL}/api/players/me`,
    }),
    [],
  );

  const loadPlayer = async () => {
    setLoading(true);
    setMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch(authUrl.me, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Please sign in to view account settings.');
      }

      const data = await response.json();
      const nextPlayer = data?.user ?? null;
      setPlayer(nextPlayer);
      setDisplayName(nextPlayer?.displayName ?? '');
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Unable to load account.';
      setErrorMessage(messageText);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayer();
  }, []);

  const onSave = async () => {
    if (!player?.id) return;

    setSaving(true);
    setMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/players/${player.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          displayName: displayName.trim(),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.errors?.[0]?.message || 'Unable to save account settings.');
      }

      const data = await response.json();
      setPlayer(data?.doc ?? player);
      setDisplayName(data?.doc?.displayName ?? displayName.trim());
      setMessage('Account settings updated.');
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Unable to save account settings.';
      setErrorMessage(messageText);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = [
    form.input,
    {
      borderColor: palette.tabIconDefault,
      color: palette.text,
      backgroundColor: palette.background,
    },
  ];

  if (loading) {
    return (
      <View style={base.container}>
        <Text style={[base.paragraph, { color: palette.text }]}>Loading account…</Text>
      </View>
    );
  }

  if (!player) {
    return (
      <View style={base.container}>
        <Text style={[base.paragraph, { color: palette.text }]}>No active player session.</Text>
        {errorMessage ? <Text style={form.error}>{errorMessage}</Text> : null}
      </View>
    );
  }

  return (
    <View style={base.container}>
      <Text style={[base.title, { color: palette.text }]}>Account</Text>
      <View style={form.inputGroup}>
        <Text style={[base.subtitle, { color: palette.text }]}>Email</Text>
        <Text style={[base.paragraph, { color: palette.icon }]}>{player.email ?? 'Unknown'}</Text>

        <Text style={[base.subtitle, { color: palette.text }]}>Display Name</Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Choose a display name"
          placeholderTextColor={palette.icon}
          style={inputStyle}
        />

        <Text style={[base.subtitle, { color: palette.text }]}>Created</Text>
        <Text style={[base.paragraph, { color: palette.icon }]}>{formatDate(player.createdAt)}</Text>

        <Text style={[base.subtitle, { color: palette.text }]}>Account Age</Text>
        <Text style={[base.paragraph, { color: palette.icon }]}>{formatAge(player.createdAt)}</Text>

        <Pressable
          style={[
            buttons.primary,
            {
              backgroundColor: palette.link,
            },
            saving && buttons.disabled,
          ]}
          onPress={onSave}
          disabled={saving}
        >
          <Text style={[buttons.text, { color: Colors.light.background }]}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Text>
        </Pressable>

        {message ? <Text style={[base.comments, { color: palette.icon }]}>{message}</Text> : null}
        {errorMessage ? <Text style={form.error}>{errorMessage}</Text> : null}
      </View>
    </View>
  );
}
