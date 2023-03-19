import { useAccount, useEnsName } from 'wagmi'

export default function Account() {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })

  return (
    <div className='italic text-sm text-back border rounded-md p-1'>
      {ensName ?? address}
      {ensName ? ` (${address})` : null}
    </div>
  )
}
