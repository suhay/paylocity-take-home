import { useDiscount } from './useDiscount'

export function Discount({ discountId, companyId }: { discountId: number; companyId: number }) {
  const { discount, isLoading } = useDiscount(companyId, discountId)

  if (isLoading) {
    return <div></div>
  }

  return <div className='bg-gray-200 px-2 py-1 rounded-2xl'>{discount.label}</div>
}
