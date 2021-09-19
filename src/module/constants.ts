import { toDictionary } from "./helpers";

export const systemName = "torchbearer";
export const socketName = "system.torchbearer";
export const settings = {
  version: "version",
  useGmDifficulty: "useGmDifficulty",
  gmDifficulty: "gmDifficulty",
  obstacleList: "obstacleList",
  itemImages: "itemImages",
  extendedTestData: "extendedTestData"
};
export const defaultImages = {
  // TODO get some images
  belief: 'icons/sundries/flags/banner-green.webp',
  instinct: 'icons/sundries/flags/banner-yellow.webp',
  goal: 'icons/sundries/flags/banner-yellow.webp',
  trait: 'icons/commodities/treasure/token-gold-gem-purple.webp',
  skill: 'icons/sundries/documents/document-official-capital.webp',
  armor: 'icons/equipment/chest/breastplate-collared-steel-grey.webp',
  possession: 'icons/equipment/feet/boots-collared-rounded-brown.webp',
  property: 'icons/environment/settlement/house-two-stories-small.webp',
  relationship: 'icons/environment/people/commoner.webp',
  'melee weapon': 'icons/weapons/swords/greatsword-crossguard-silver.webp',
  'ranged weapon': 'icons/weapons/bows/longbow-recurve-brown.webp',
  reputation: 'icons/commodities/treasure/medal-ribbon-gold-red.webp',
  affiliation: 'icons/commodities/treasure/crown-gold-laurel-wreath.webp',
  spell: 'icons/magic/light/hand-sparks-smoke-teal.webp',
  lifepath: 'icons/environment/people/group.webp',

  // trait images
  character: 'icons/sundries/gaming/rune-card.webp',
  die: 'icons/sundries/gaming/dice-runed-brown.webp',
  'call-on': 'icons/sundries/gaming/playing-cards.webp',
};

// TODO tb skill names
export type SkillTypeString =
  | 'academic'
  | 'artisan'
  | 'artist'
  | 'craftsman'
  | 'forester'
  | 'martial'
  | 'medicinal'
  | 'military'
  | 'musical'
  | 'peasant'
  | 'physical'
  | 'schoolofthought'
  | 'seafaring'
  | 'special'
  | 'social'
  | 'sorcerous'
  | 'training';

export const skillTypes = [
  'academic',
  'artisan',
  'artist',
  'craftsman',
  'forester',
  'martial',
  'medicinal',
  'military',
  'musical',
  'peasant',
  'physical',
  'schoolofthought',
  'seafaring',
  'special',
  'social',
  'sorcerous',
  'training',
];
export const skillTypeSelect = toDictionary(skillTypes);
export const skillImages: { [k in SkillTypeString]: string } = {
  "academic": "icons/sundries/documents/document-official-capital.webp",
  "artist": "icons/tools/hand/brush-paint-brown-white.webp",
  "artisan": "icons/tools/hand/chisel-steel-brown.webp",
  "craftsman": "icons/skills/trades/smithing-anvil-silver-red.webp",
  "forester": "icons/magic/nature/leaf-elm-sparkle-glow-green.webp",
  "martial": "icons/skills/melee/weapons-crossed-swords-purple.webp",
  "medicinal": "icons/magic/life/cross-yellow-green.webp",
  "military": "icons/environment/people/infantry-army.webp",
  "musical": "icons/skills/trades/music-notes-sound-blue.webp",
  "peasant": "icons/skills/trades/farming-sickle-harvest-wheat.webp",
  "physical": "icons/magic/control/buff-strength-muscle-damage-orange.webp",
  "schoolofthought": "icons/sundries/books/book-worn-blue.webp",
  "seafaring": "icons/tools/nautical/anchor-blue-orange.webp",
  "special": "icons/skills/trades/academics-investigation-puzzles.webp",
  "social": "icons/skills/social/diplomacy-handshake-yellow.webp",
  "sorcerous": "icons/magic/fire/flame-burning-hand-white.webp",
  "training": "icons/environment/settlement/target.webp"
};

