import { useCallback, useMemo, useState } from 'react';

import type { PlayerProfile } from './home-data';
import { useHomeInventory } from './home-inventory';

export type ActionType = 'SPD-1' | 'MED-1' | 'RAD-X' | 'BEG';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

type SubmitArgs = {
  email: string;
  password: string;
  onAuthenticated?: () => void;
};

type SignOutArgs = {
  onSignedOut?: () => void;
};

export function useHomeAuth() {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<ActionType | null>(null);
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const authUrl = useMemo(
    () => ({
      login: `${API_BASE_URL}/api/players/login`,
      signup: `${API_BASE_URL}/api/players`,
      me: `${API_BASE_URL}/api/players/me`,
      logout: `${API_BASE_URL}/api/players/logout`,
      actions: `${API_BASE_URL}/api/player-actions`,
      inventory: `${API_BASE_URL}/api/player-inventory`,
    }),
    [],
  );
  const { inventoryItems, inventoryCounts, loadInventory, resetInventory, mergeInventoryCounts } =
    useHomeInventory(authUrl.inventory);

  const loadCurrentPlayer = useCallback(async () => {
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
      await loadInventory();
    } catch (error) {
      console.error('Error loading player session:', error);
      setPlayer(null);
    }
  }, [authUrl.me, loadInventory]);

  const onSubmit = useCallback(async ({ email, password, onAuthenticated }: SubmitArgs) => {
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
        await loadInventory();
        onAuthenticated?.();
        return;
      }

      if (loginResponse.status !== 401) {
        throw new Error('Unable to authenticate with these credentials');
      }

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
      await loadInventory();
      onAuthenticated?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }, [authUrl.login, authUrl.signup]);

  const onSignOut = useCallback(async ({ onSignedOut }: SignOutArgs = {}) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      await fetch(authUrl.logout, {
        method: 'POST',
        credentials: 'include',
      });
      setPlayer(null);
      resetInventory();
      onSignedOut?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign out';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }, [authUrl.logout]);

  const onAction = useCallback(async (action: ActionType): Promise<boolean> => {
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
      mergeInventoryCounts(data?.inventoryCounts);

      await loadInventory();

      if (action === 'BEG') {
        setActionMessage(`You begged and received ${data?.gain ?? 0} credits.`);
      } else {
        setActionMessage(`${action} applied successfully.`);
      }

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Action failed';
      setErrorMessage(message);
      return false;
    } finally {
      setActionLoading(null);
    }
  }, [authUrl.actions, loadInventory, mergeInventoryCounts]);

  return {
    loading,
    actionLoading,
    player,
    inventoryItems,
    inventoryCounts,
    errorMessage,
    actionMessage,
    loadCurrentPlayer,
    loadInventory,
    onSubmit,
    onSignOut,
    onAction,
  };
}
