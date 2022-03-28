// SPDX-FileCopyrightText: 2021 Johannes Loher
//
// SPDX-License-Identifier: MIT

export function getCanvas(): Canvas {
  if (!(canvas instanceof Canvas) || !canvas.ready) {
    throw new Error(getGame().i18n.localize('TB.ErrorCanvasIsNotInitialized'));
  }
  return canvas;
}

export function getGame(): Game {
  if (!(game instanceof Game)) {
    throw new Error('Game is not initialized yet.'); // Cannot localize this as we would need to access game to do this.
  }
  return game;
}

export function getGameSafe(): Game | undefined {
  return game instanceof Game ? game : undefined;
}

/**
 * Tests if the given `value` is truthy.
 *
 * If it is not truthy, an {@link Error} is thrown, which depends on the given `message` parameter:
 * - If `message` is a string`, it is used to construct a new {@link Error} which then is thrown.
 * - If `message` is an instance of {@link Error}, it is thrown.
 * - If `message` is `undefined`, an {@link Error} with a default message is thrown.
 */
export function enforce(
  value: unknown,
  message?: string | Error,
  logToConsole = true,
): asserts value {
  if (!value) {
    if (!message) {
      message =
        getGameSafe()?.i18n.localize('TB2.ErrorUnexpectedError') ??
        'There was an unexpected error in the Torchbearer 2E system. For more details, please take a look at the console (F12).';
    }
    if (logToConsole) {
      console.log(message);
    }
    throw message instanceof Error ? message : new Error(message);
  }
}
