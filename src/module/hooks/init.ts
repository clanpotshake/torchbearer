import { getGame } from '../helpers';
import { TB } from '../config';
import { createTestRoll } from '../rolls/CheckFactory';
import { TBActor } from '../actor/TBActor';
import { TBItem } from '../item/TBItem';
import { TBActiveEffect } from '../ActiveEffect';
import { TBActorSheet } from '../actor/sheets/TBActorSheet';
import { TBItemSheet } from '../item/sheets/TBItemSheet';
import { TBChatMessage } from '../ChatMessage';

export default function registerForInitHooks(): void {
  Hooks.once('init', init);
}

async function init() {
  logger.info('Initializing Torchbearer 2E...');
  getGame().tb = {
    TBActor,
    TBItem,
    TB,
    // createTestRoll,
    // migration,
    // macros,
  };
  CONFIG.TB = TB;
  CONFIG.Actor.documentClass = TBActor;
  CONFIG.Item.documentClass = TBItem;
  CONFIG.ActiveEffect.documentClass = TBActiveEffect;
  CONFIG.ChatMessage.documentClass = TBChatMessage;
  CONFIG.Actor.typeLabels = TB.i18n.actorTypes;
  CONFIG.Item.typeLabels = TB.i18n.itemTypes;
  // CONFIG.Dice.types.push(TBTest)

  Actors.unregisterSheet('core', ActorSheet);
  Items.unregisterSheet('core', ItemSheet);
  Actors.registerSheet('tb2', TBActorSheet);
  Items.registerSheet('tb2', TBItemSheet);
}

declare global {
  interface Game {
    tb: {
      TBActor: typeof TBActor;
      TBItem: typeof TBItem;
      TB: typeof TB;
    };
  }
  interface CONFIG {
    TB: typeof TB;
  }
}
