/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your system, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your system.
 */

// Import TypeScript modules
import { TBItem } from './item/TBItem';
import { TBActor } from './actor/TBActor';
import { TB } from './config';
import registerForHooks from './hooks/hooks';

// Initialize system
registerForHooks();

// Setup system
Hooks.once('setup', async () => {
  // Do anything after initialization but before
  // ready
});

// When ready
Hooks.once('ready', async () => {
  // Do anything once the system is ready
});

// Add any additional hooks if necessary

declare global {
  interface Game {
    tb: {
      TBActor: typeof TBActor;
      TBItem: typeof TBItem;
      TB: typeof TB;
      // migration: typeof migration;
      // macros: typeof macros;
    };
  }

  interface CONFIG {
    TB: typeof TB;
  }
}
