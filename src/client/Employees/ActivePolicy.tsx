import { Check, X } from 'react-feather'

export function ActivePolicy({ activePolicy }: { activePolicy: boolean }) {
  return activePolicy ? <Check /> : <X />
}
