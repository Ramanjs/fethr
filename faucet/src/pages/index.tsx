import { Web3Button } from '@web3modal/react'
import { useAccount, usePrepareContractWrite, useContractWrite} from 'wagmi'
import {faucetABI} from '../contract/faucet'
import Account from '../components/Account'
import {goerli} from 'wagmi/chains'
import Image from 'next/image'


function Page() {
  const { isConnected,address } = useAccount()
  const {config,error} = usePrepareContractWrite({
    address: '0xa4E6E77AC66d14d9DC1931112A134F5dd73c85aD',
    abi: faucetABI,
    functionName: 'faucet',
    chainId:goerli.id,
    args:[address],
  })
  const { data, isLoading, isSuccess, write }  = useContractWrite(config)

  const faucetFunction = async () => {
    if(!isConnected) {
      alert('Please connect your wallet');
      return
    }
    write?.()
  }
  
  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center relative'>
      <nav className='w-screen  flex items-center justify-between px-5 '>
        <div className='text-center flex items-center justify-center font-[800] h-[20%] text-3xl'>
          <Image src={'/logo.svg'} 
                 width={100} 
                 height={100} 
                 alt='fethr'/>
          0x<span className='text-[purple]'>Fethr</span>
        </div>

        {isConnected && <Account />}
        <Web3Button />
      </nav>


      <h2 className='font-Gazapacho font-[1000] italic text-center text-5xl text-back'>Faucet</h2>

      <div className='glass w-[90%] h-[70%] bg-main rounded-md relative z-10 flex flex-col p-5 items-center'>
        <button className='bg-main rounded-lg p-3 px-8 font-[1000] hover:bg-[#2e0b45] '
                onClick={faucetFunction}>
          Send Me FETH
        </button>
        {error && (
          <div>An error occurred preparing the transaction: {error.message?.split(/[=,]/)[1]}</div>
        )}
        <div className='flex flex-col w-full h-auto min-h-[20%] glass mt-10 rounded-md'>
          <div className='flex w-full justify-between px-5 bg-main rounded-lg font-[100]'>
            <h2>Your Transactions</h2>
          </div>
          <div className='flex w-full justify-between px-5  rounded-lg font-[100]'>
              <p>{data?.hash}</p>
          </div>
        </div>
      </div>


      <div className="absolute z-0 bottom-[-20rem] right-[-20rem] ">
        <Image  src={'/orangeOrb.svg'}
                  width={1000}
                  height={1000}
                  alt={'Feather'}/>
      </div>
      <div className="absolute z-0 top-[-20rem] left-[-20rem]">
        <Image  src={'/purpleOrb.svg'}
                  width={1000}
                  height={1000}
                  alt={'Feather'}/>
      </div>
    </div>
  )
}

export default Page
