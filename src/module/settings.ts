import { getGame } from './helpers';

export function registerSettings(): void {
  // Register any custom system settings here
  const game = getGame();

  /**
   * Track the migrations version of the latest migration that has been applied
   */
  game.settings.register('tb2', 'systemMigrationVersion', {
    name: 'System Migration Version',
    scope: 'world',
    config: false,
    type: Number,
    default: -1,
  });
}
export interface TBSettings {
  systemMigrationVersion: number;
}

export function getTBSettings(): TBSettings {
  // const game = getGame();
  return {
    systemMigrationVersion: 1, // TODO
    // systemMigrationVersion: game.settings.get('tb2', 'systemMigrationVersion'),
  };
}
