export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
  const templatePaths: string[] = [
    // Add paths to "systems/torchbearer2e/templates"
  ];

  return loadTemplates(templatePaths);
}
