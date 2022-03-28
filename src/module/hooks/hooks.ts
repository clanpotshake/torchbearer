import registerForInitHooks from './init';
import registerSetupHooks from './setup';
import registerRenderHooks from './render';
import registerLogicHooks from './logic';

export default function registerForHooks(): void {
  registerForInitHooks();
  registerSetupHooks();
  registerRenderHooks();
  registerLogicHooks();
}
