import { Employee } from '@/types'
import { getDiscount } from '../services/database'

type Discount = {
  flatValue?: number
  percentageValue?: number
}

export function calculateDiscounts(employee: Employee): Discount {
  const { discounts } = employee

  const discountList = discounts.split(',').filter((n) => n !== '')

  let flatValue = 0
  let percentageValue = 0

  if (discountList.length > 0) {
    for (const discount of discounts) {
      const theDiscount = getDiscount(Number(discount))

      if (theDiscount !== null) {
        flatValue += theDiscount.flatValue ?? 0
        percentageValue += theDiscount.percentageValue ?? 0
      }
    }
  }

  return {
    flatValue,
    percentageValue,
  }
}
