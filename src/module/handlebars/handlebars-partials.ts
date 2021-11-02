export default async function registerHandlebarsPartials(): Promise<void> {
  // register every component and tab used in the main sheet classes
  const templatePaths = [
    'systems/torchbearer2e/templates/sheets/actor/components/bio-data.hbs',
    'systems/torchbearer2e/templates/sheets/actor/components/skill.hbs',
    'systems/torchbearer2e/templates/sheets/actor/components/skills.hbs',
    'systems/torchbearer2e/templates/sheets/item/components/body.hbs',
    'systems/torchbearer2e/templates/sheets/item/components/sheet-header.hbs',
    'systems/torchbearer2e/templates/sheets/item/tabs/description.hbs',
    'systems/torchbearer2e/templates/sheets/item/tabs/details.hbs',
    'systems/torchbearer2e/templates/sheets/item/tabs/effects.hbs',
  ];
  await loadTemplates(templatePaths);
}
