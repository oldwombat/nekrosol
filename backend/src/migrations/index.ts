import * as migration_20260218_095609_init from './20260218_095609_init';
import * as migration_20260218_100505_player_auth from './20260218_100505_player_auth';
import * as migration_20260218_102706_lore_collection from './20260218_102706_lore_collection';

export const migrations = [
  {
    up: migration_20260218_095609_init.up,
    down: migration_20260218_095609_init.down,
    name: '20260218_095609_init',
  },
  {
    up: migration_20260218_100505_player_auth.up,
    down: migration_20260218_100505_player_auth.down,
    name: '20260218_100505_player_auth',
  },
  {
    up: migration_20260218_102706_lore_collection.up,
    down: migration_20260218_102706_lore_collection.down,
    name: '20260218_102706_lore_collection'
  },
];
