/* eslint-disable @typescript-eslint/no-unused-vars */
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
// import { cookieStorage, createStorage } from "wagmi";
// import { sepolia } from "wagmi/chains";
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from "wagmi/chains";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

// const metadata = {
//   name: "Web3Modal",
//   description: "Web3Modal",
//   url: "https://web3modal.com",
//   icons: ["https://avatars.githubusercontent.com/u/37784886"],
// };

// export const config = defaultWagmiConfig({
//   chains: [sepolia],
//   projectId,
//   metadata,
//   ssr: true,
//   storage: createStorage({
//     storage: cookieStorage,
//   }),
// });

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
