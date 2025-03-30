import { Check, X } from 'react-feather'

export function Eligible({ eligible }: { eligible: boolean }) {
  return eligible ? <Check /> : <X />
}
