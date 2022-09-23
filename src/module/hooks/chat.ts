export default function registerChatHooks(): void {
  ['click'].forEach((hook) => {
    // Hooks.on(hook, rerollDiceEvent);
  });
}

// function rerollDiceEvent(app: Application, html: JQuery) {
//   $(html)
//     .find('a')
//     .on('click', (ev: JQuery.FocusEvent<HTMLInputElement>) => {
//       ev.currentTarget.select();
//     });
// }
