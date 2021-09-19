import { ItemDragData } from '../helpers';
import { getImage, MacroData } from './Macro';
import { TBItem, TBItemData } from '../items/TBItem';
import { TBActor } from '../actors/TBActor';

export function CreateEditMacro(data: ItemDragData): MacroData | null {
  if (!data.actorId) {
    return null;
  }
  const itemData = data.data as TBItemData & { _id: string };
  return {
    name: `Edit ${itemData.name}`,
    type: 'script',
    command: `game.burningwheel.macros.showOwnedItem("${data.actorId}", "${data.id}");`,
    img: getImage(itemData.img, itemData.type),
  };
}

export function RollEditMacro(actorId: string, itemId: string): void {
  const actor = game.actors?.find((a) => a.id === actorId) as TBActor;
  if (!actor) {
    ui.notifications?.notify(
      'Unable to find actor linked to this macro. Were they deleted?',
      'error',
    );
    return;
  }

  const item = actor.items.get(itemId) as TBItem | null;
  if (!item) {
    ui.notifications?.notify('Unable to find item linked to this macro. Was it deleted?', 'error');
    return;
  }
  item.sheet?.render(true);
}
