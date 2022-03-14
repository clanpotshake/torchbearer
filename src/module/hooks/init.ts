import { getGame } from '../helpers';
import { TB } from '../config';
import { TBActor } from '../actor/TBActor';
import { TBItem } from '../item/TBItem';
import { TBActiveEffect } from '../ActiveEffect';
import { TBActorSheet } from '../actor/sheets/TBActorSheet';
import { TBItemSheet } from '../item/sheets/TBItemSheet';
import { TBChatMessage } from '../ChatMessage';
import registerHandlebarsPartials from '../handlebars/handlebars-partials';
import registerHandlebarsHelpers from '../handlebars/helpers';
import { TBTerm } from '../rolls/TBTerm';
import { TBRoll } from '../rolls/TBRoll';
import { createTestRoll } from '../rolls/CheckFactory';

export default function registerForInitHooks(): void {
  Hooks.once('init', init);
}

async function init() {
  logger.info(`Initializing Torchbearer 2E\n${TB.ASCII}`);
  getGame().tb = {
    TBActor,
    TBItem,
    TB,
    createTestRoll,
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
  CONFIG.Dice.types.push(TBTerm);
  CONFIG.Dice.terms.s = TBTerm;
  CONFIG.Dice.rolls.unshift(TBRoll);

  Actors.unregisterSheet('core', ActorSheet);
  Items.unregisterSheet('core', ItemSheet);
  Actors.registerSheet('tb', TBActorSheet, {
    label: 'TB2.TabbedCharacterSheet',
    makeDefault: false,
  });
  Items.registerSheet('tb', TBItemSheet, {
    makeDefault: true,
  });

  await registerHandlebarsPartials();
  registerHandlebarsHelpers();
}

declare global {
  interface Game {
    tb: {
      TBActor: typeof TBActor;
      TBItem: typeof TBItem;
      TB: typeof TB;
      createTestRoll: typeof createTestRoll;
      // migration: typeof migration;
      // macros: typeof macros;
    };
  }
  interface CONFIG {
    TB: typeof TB;
  }
}
