import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'ROZO Bananary',
  projectId: 'ab8fa47f01e6a72c58bbb76577656051',
  chains: [base],
  ssr: false, // If your dApp uses server side rendering (SSR)
});