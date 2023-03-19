import { modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { configureChains, createClient, createStorage } from 'wagmi'
import { sepolia,goerli,mainnet,polygonMumbai } from 'wagmi/chains'
export const walletConnectProjectId = 'da9165b35fcee4df2a8c5af806e66463'

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, ...(process.env.NODE_ENV === 'development' ? [goerli,sepolia,polygonMumbai] : [goerli])],
  [walletConnectProvider({ projectId: walletConnectProjectId })],
)


export const client = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'My wagmi + Web3Modal App', chains }),
  provider,
  webSocketProvider,
})

export { chains }
