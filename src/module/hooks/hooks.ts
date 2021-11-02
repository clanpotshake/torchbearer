import registerForInitHooks from './init';
import registerSetupHooks from './setup';
import registerRenderHooks from './render';

export default function registerForHooks(): void {
  registerForInitHooks();
  registerSetupHooks();
  registerRenderHooks();
}
