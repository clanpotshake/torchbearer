import { getImage, getMacroRollPreset, MacroData } from './Macro';
import { Skill, SkillDataRoot } from '../items/TBSkill';
import { ItemDragData } from '../helpers';
import { TBActor } from '../actors/TBActor';

export function CreateSkillRollMacro(data: ItemDragData): MacroData | null {
  if (!data.actorId) {
    return null;
  }
  const skillData = data.data as SkillDataRoot & { _id: string };
  return {
    name: `Test ${skillData.name}`,
    type: 'script',
    command: `game.burningwheel.macros.rollSkill("${data.actorId}", "${data.id}");`,
    img: getImage(skillData.img, 'skill'),
  };
}

export function RollSKillMacro(actorId: string, skillId: string): void {
  const actor = game.actors?.find((a) => a.id === actorId) as TBActor;
  if (!actor) {
    ui.notifications?.notify(
      'Unable to find actor linked to this macro. Were they deleted?',
      'error',
    );
    return;
  }

  const skill = actor.items.get(skillId) as Skill | null;
  if (!skill) {
    ui.notifications?.notify('Unable to find skill linked in this macro. Was it deleted?', 'error');
    return;
  }

  const dataPreset: Partial<RollDialogData> = getMacroRollPreset(actor);
  if (actor.data.type === 'character') {
    if (skill.data.data.learning) {
      handleLearningRoll({ actor: actor as TBCharacter, skill, dataPreset });
    } else {
      handleSkillRoll({ actor: actor as TBCharacter, skill, dataPreset });
    }
  } else {
    handleNpcSkillRoll({ actor: actor as Npc, skill, dataPreset });
  }
}
