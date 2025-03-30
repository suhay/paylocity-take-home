import { Discount } from './Discount'

export function Discounts({ discounts, companyId }: { discounts: string; companyId: number }) {
  const discountsList = discounts.split(',').filter((n) => n !== '')

  return (
    <>
      {discountsList.map((discount) => (
        <Discount companyId={companyId} discountId={Number(discount)} />
      ))}
    </>
  )
}
