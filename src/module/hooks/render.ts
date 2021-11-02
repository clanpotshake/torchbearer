export default function registerRenderHooks(): void {
  ['renderApplication', 'renderActorSheet', 'renderItemSheet'].forEach((hook) => {
    Hooks.on(hook, selectTargetInputOnFocus);
  });
}

function selectTargetInputOnFocus(app: Application, html: JQuery) {
  $(html)
    .find('input')
    .on('focus', (ev: JQuery.FocusEvent<HTMLInputElement>) => {
      ev.currentTarget.select();
    });
}
