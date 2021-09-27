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
