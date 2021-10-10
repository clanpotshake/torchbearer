import { getGame } from './helpers';

export function registerSettings(): void {
  // Register any custom system settings here
  // const game = getGame();
}
export interface TBSettings {
  systemMigrationVersion: number;
}

export function getTBSettings(): TBSettings {
  const game = getGame();
  return {
    systemMigrationVersion: game.settings.get('tb2', 'systemMigrationVersion'),
  };
}
