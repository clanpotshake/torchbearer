import { TBActor } from '../actor/TBActor';

export default function registerLogicHooks(): void {
  ['preUpdateActor'].forEach((hook) => {
    Hooks.on(hook, updateFirstClassSelect);
  });
}

function updateFirstClassSelect(actor: TBActor, update: JQuery) {
  // const isFirstClass = actor.data.data.career;
  const isFirstClass = true;
  if (actor.data.type === 'character' && isFirstClass) {
    // this is the first time this player character is selecting a class,
    //   give them the skills for that class
    Object.entries(update.data).map(([field, value]) => {
      if (field === 'career') {
        logger.info(`updating class to ${value}`);
        // TODO here we will look up the class's features and add them to the
        //   actor (or to the update payload?)
      }
    });
  }
}
