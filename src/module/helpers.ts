import { DisplayClass, TBItemData } from './items/TBItem';
import { Ability, TracksTests } from './actors/TBActor';

export type StringIndexedObject<T> = { [i: string]: T };
export type TestString = "Ob1" | "Ob2" | "Ob3" | "Ob4" | "Ob5" | "Ob6" | "Ob7"| "Ob8"| "Ob9";

export function toDictionary(list: string[]): StringIndexedObject<string> {
  const o: StringIndexedObject<string> = {};
  list.forEach((s) => (o[s] = s.titleCase()));
  return o;
}

export function updateTestsNeeded(ability: Ability): void {
  const values = AbilityLookup[ability.rank] || { pass: 0, fail: 0 };
  ability.passes = values.pass;
  ability.fails = values.fail;
  // TODO attempts
  ability.attempts = 0;
  ability.cssClass = canAdvance(ability) ? 'can-advance' : '';
}

export function canAdvance(skill: TracksTests): boolean {
  const enoughPasses = skill.passes >= (skill.passesNeeded || 0);
  const enoughFails = skill.fails >= (skill.failsNeeded || 0);
  const enoughAttempts = (skill.attempts || 0) >= (skill.attemptsNeeded || 10);

  return (enoughPasses && enoughFails) || enoughAttempts;
}

export function slugify(name: string): string {
  return name.trim().replace(' ', '-');
}

const AbilityLookup = {
  '1': { pass: 1, fail: 0 },
  '2': { pass: 2, fail: 1 },
  '3': { pass: 3, fail: 2 },
  '4': { pass: 4, fail: 3 },
  '5': { pass: 5, fail: 4 },
  '6': { pass: 6, fail: 5 },
  '7': { pass: 7, fail: 6 },
  '8': { pass: 8, fail: 7 },
  '9': { pass: 9, fail: 8 },
};

export interface DragData {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  actorId?: string;
  id?: string;
  pack?: string;
}

export interface ItemDragData extends DragData {
  data?: DeepPartial<TBItemData>;
}
export interface StatDragData extends DragData {
  data: {
    name: string;
    path: string;
  };
}
