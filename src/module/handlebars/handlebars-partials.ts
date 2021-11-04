export default async function registerHandlebarsPartials(): Promise<void> {
  // register every component and tab used in the main sheet classes
  const templatePaths = [
    'systems/torchbearer/templates/sheets/actor/components/bio-data.hbs',
    'systems/torchbearer/templates/sheets/actor/components/bigs.hbs',
    'systems/torchbearer/templates/sheets/actor/components/rewards.hbs',
    'systems/torchbearer/templates/sheets/actor/components/traits.hbs',
    'systems/torchbearer/templates/sheets/actor/components/trait.hbs',
    'systems/torchbearer/templates/sheets/actor/components/skill.hbs',
    'systems/torchbearer/templates/sheets/actor/components/skills.hbs',
    'systems/torchbearer/templates/sheets/actor/components/abilities.hbs',
    'systems/torchbearer/templates/sheets/actor/components/wises.hbs',
    'systems/torchbearer/templates/sheets/actor/components/spell.hbs',
    'systems/torchbearer/templates/sheets/actor/components/spells.hbs',
    'systems/torchbearer/templates/sheets/actor/components/add-button.hbs',
    'systems/torchbearer/templates/sheets/item/components/body.hbs',
    'systems/torchbearer/templates/sheets/item/components/sheet-header.hbs',
    'systems/torchbearer/templates/sheets/item/tabs/description.hbs',
    'systems/torchbearer/templates/sheets/item/tabs/details.hbs',
    'systems/torchbearer/templates/sheets/item/tabs/effects.hbs',
  ];
  await loadTemplates(templatePaths);
}
