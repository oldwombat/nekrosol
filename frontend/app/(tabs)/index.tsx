import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';

import { base, buttons, Colors, form } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  getStatItems,
  locationItems,
  missionItems,
  type PlayerProfile,
  skillItems,
} from './home-data';
import { type ActionType, useHomeAuth } from './home-auth';

export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeSkillTip, setActiveSkillTip] = useState<string | null>(null);
  const [selectedMissionId, setSelectedMissionId] = useState<string>(missionItems[0]?.id ?? '');
  const [selectedLocationId, setSelectedLocationId] = useState<string>(locationItems[0]?.id ?? '');
  const {
    loading,
    actionLoading,
    player,
    inventoryItems,
    inventoryCounts,
    errorMessage,
    actionMessage,
    loadCurrentPlayer,
    onSubmit,
    onAction,
  } = useHomeAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const palette = Colors[isDark ? 'dark' : 'light'];

  useEffect(() => {
    void loadCurrentPlayer();
  }, [loadCurrentPlayer]);

  const authInputStyle = [
    form.input,
    {
      borderColor: palette.tabIconDefault,
      color: palette.text,
      backgroundColor: palette.background,
    },
  ];

  const statItems = getStatItems(player);
  const selectedMission = missionItems.find((mission) => mission.id === selectedMissionId) ?? missionItems[0];
  const selectedLocation = locationItems.find((location) => location.id === selectedLocationId) ?? locationItems[0];
  const usableActions: ActionType[] = ['SPD-1', 'MED-1', 'RAD-X'];

  const onUseInventoryItem = async (action: string) => {
    if (!(usableActions as string[]).includes(action)) {
      return;
    }

    const currentCount = inventoryCounts[action] ?? 0;

    if (currentCount < 1) {
      return;
    }

    await onAction(action as ActionType);
  };

  const onRunMission = async (action: ActionType | null) => {
    if (!action) {
      return;
    }

    await onAction(action);
  };

  return (
    <View style={[base.container, { flex: 1, justifyContent: 'flex-start', width: '100%' }]}>
      <Text style={[base.title, { color: palette.text }]}>Home</Text>

      {player ? (
        <ScrollView
          style={{ width: '100%', flex: 1 }}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          showsVerticalScrollIndicator
        >
          <Text style={[base.paragraph, { color: palette.text }]}>Welcome back, {player.displayName ?? 'Player'}.</Text>
          <View style={{ width: '100%', gap: 12 }}>
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'stretch', gap: 12 }}>
              <View style={{ flex: 1, gap: 10 }}>
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

              <View
                style={{
                  width: '42%',
                  minWidth: 240,
                  borderWidth: 1,
                  borderColor: palette.tabIconDefault,
                  borderRadius: 10,
                  padding: 12,
                  backgroundColor: palette.background,
                  gap: 8,
                }}
              >
                <Text style={[base.subtitle, { color: palette.text }]}>Player Skills</Text>
                {skillItems.map((skill) => {
                  const value = Number(player?.[skill.key as keyof PlayerProfile] ?? 0);
                  const isOpen = activeSkillTip === skill.key;
                  return (
                    <View key={skill.key} style={{ gap: 4 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={[base.comments, { color: palette.text, fontStyle: 'normal', flex: 1 }]}>
                          {skill.label}: {value}
                        </Text>
                        <Pressable
                          onPress={() => setActiveSkillTip(isOpen ? null : skill.key)}
                          style={{ paddingHorizontal: 6, paddingVertical: 2 }}
                        >
                          <Text style={{ color: palette.link, fontWeight: '700' }}>ⓘ</Text>
                        </Pressable>
                      </View>
                      {isOpen ? (
                        <Text style={[base.comments, { color: palette.icon }]}>{skill.tip}</Text>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </View>

            <View
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: palette.tabIconDefault,
                borderRadius: 10,
                padding: 12,
                backgroundColor: palette.background,
                gap: 10,
              }}
            >
              <Text style={[base.subtitle, { color: palette.text }]}>Missions</Text>
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'stretch', gap: 12 }}>
                <View style={{ width: '42%', minWidth: 240, gap: 8 }}>
                  {missionItems.map((mission) => {
                    const active = mission.id === selectedMission?.id;
                    return (
                      <Pressable
                        key={mission.id}
                        onPress={() => setSelectedMissionId(mission.id)}
                        style={{
                          borderWidth: 1,
                          borderColor: active ? palette.link : palette.tabIconDefault,
                          borderRadius: 8,
                          padding: 10,
                          backgroundColor: palette.background,
                          gap: 4,
                        }}
                      >
                        <Text style={[base.comments, { color: palette.text, fontStyle: 'normal', fontWeight: '700' }]}>
                          {mission.title}
                        </Text>
                        <Text style={[base.comments, { color: palette.icon }]}>{mission.summary}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: palette.tabIconDefault,
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: palette.background,
                    gap: 8,
                  }}
                >
                  <Text style={[base.subtitle, { color: palette.text }]}>{selectedMission?.title}</Text>
                  <Text style={[base.comments, { color: palette.text, fontStyle: 'normal' }]}>
                    {selectedMission?.details}
                  </Text>
                  {selectedMission?.action ? (
                    <Pressable
                      style={[
                        buttons.secondary,
                        {
                          backgroundColor: palette.background,
                          borderColor: palette.tabIconDefault,
                          borderWidth: 1,
                          alignSelf: 'flex-start',
                        },
                        actionLoading === selectedMission.action && buttons.disabled,
                      ]}
                      onPress={() => onRunMission(selectedMission.action)}
                      disabled={actionLoading !== null}
                    >
                      <Text style={[buttons.text, { color: palette.text }]}>Run Mission</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </View>

            <View
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: palette.tabIconDefault,
                borderRadius: 10,
                padding: 12,
                backgroundColor: palette.background,
                gap: 8,
              }}
            >
              <Text style={[base.subtitle, { color: palette.text }]}>Inventory</Text>
              {inventoryItems.length === 0 ? (
                <Text style={[base.comments, { color: palette.icon }]}>No inventory items found.</Text>
              ) : null}
              {inventoryItems.map((item) => {
                const count = inventoryCounts[item.itemKey] ?? item.quantity ?? 0;
                const isUsable = (usableActions as string[]).includes(item.itemKey);
                const isUsing = isUsable ? actionLoading === (item.itemKey as ActionType) : false;
                return (
                  <View
                    key={`${item.id ?? item.itemKey}-${item.itemKey}`}
                    style={{
                      borderWidth: 1,
                      borderColor: palette.tabIconDefault,
                      borderRadius: 8,
                      padding: 10,
                      backgroundColor: palette.background,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[base.comments, { color: palette.text, fontStyle: 'normal', fontWeight: '700' }]}>
                        {item.itemKey} x{count}
                      </Text>
                    </View>
                    <Pressable
                      style={[
                        buttons.secondary,
                        {
                          backgroundColor: palette.background,
                          borderColor: palette.tabIconDefault,
                          borderWidth: 1,
                          minWidth: 84,
                        },
                        (!isUsable || count < 1 || isUsing) && buttons.disabled,
                      ]}
                      onPress={() => onUseInventoryItem(item.itemKey)}
                      disabled={!isUsable || count < 1 || actionLoading !== null}
                    >
                      <Text style={[buttons.text, { color: palette.text }]}>
                        {isUsing ? '...' : isUsable ? 'Use' : 'N/A'}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>

            <View
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: palette.tabIconDefault,
                borderRadius: 10,
                padding: 12,
                backgroundColor: palette.background,
                gap: 8,
              }}
            >
              <Text style={[base.subtitle, { color: palette.text }]}>Nekrosol</Text>
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'stretch', gap: 12 }}>
                <View style={{ width: '42%', minWidth: 240, gap: 8 }}>
                  {locationItems.map((location) => {
                    const active = location.id === selectedLocation?.id;
                    return (
                      <Pressable
                        key={location.id}
                        onPress={() => setSelectedLocationId(location.id)}
                        style={{
                          borderWidth: 1,
                          borderColor: active ? palette.link : palette.tabIconDefault,
                          borderRadius: 8,
                          padding: 10,
                          backgroundColor: palette.background,
                          gap: 4,
                        }}
                      >
                        <Text style={[base.comments, { color: palette.text, fontStyle: 'normal', fontWeight: '700' }]}>
                          {location.name}
                        </Text>
                        <Text style={[base.comments, { color: palette.icon }]}>{location.summary}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: palette.tabIconDefault,
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: palette.background,
                    gap: 8,
                  }}
                >
                  <Text style={[base.subtitle, { color: palette.text }]}>{selectedLocation?.name}</Text>
                  <Text style={[base.comments, { color: palette.text, fontStyle: 'normal' }]}>
                    {selectedLocation?.details}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {actionMessage ? <Text style={[base.comments, { color: palette.icon }]}>{actionMessage}</Text> : null}
        </ScrollView>
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
            onPress={() => onSubmit({ email, password, onAuthenticated: () => setPassword('') })}
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
