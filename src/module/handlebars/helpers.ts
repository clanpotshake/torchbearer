export default function registerHandlebarsHelpers(): void {
  Object.entries(helpers).forEach(([key, helper]) => Handlebars.registerHelper(key, helper));
}
const helpers = {
  htmlToPlainText: (input: string | null | undefined): string | null | undefined => {
    if (!input) return;
    return $(input).text();
  },
  isEmpty: (input: Array<unknown> | null | undefined): boolean => (input?.length ?? 0) === 0,
};
