import { getGame } from './helpers';

declare global {
  interface FlagConfig {
    ChatMessage: {
      tb?: {
        flavorData?: Record<string, string | number | null>;
      };
    };
  }
}

export class TBChatMessage extends ChatMessage {
  /** @override */
  prepareData(): void {
    super.prepareData();
    if (this.data.flavor) {
      const game = getGame();
      const flavorData = Object.fromEntries(
        Object.entries(this.data.flags.tb?.flavorData ?? {}).map(([key, value]) => [
          key,
          typeof value === 'string' ? game.i18n.localize(value) : value,
        ]),
      );
      this.data.flavor = game.i18n.localize(this.data.flavor, flavorData);
    }
  }
}
