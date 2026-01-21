import { generateMnemonic,mnemonicToSeedSync  } from 'bip39';

export const mn=generateMnemonic();
export const seed=mnemonicToSeedSync(mn);
