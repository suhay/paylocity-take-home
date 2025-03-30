import { useQuery } from '@tanstack/react-query'

import { Discount } from '@/types'

export function useDiscount(companyId: number, discountId: number) {
  const discount = useQuery({
    queryKey: ['discount', discountId],
    queryFn: async () => {
      const response = await fetch(`/company/${companyId}/discount/${discountId}`)
      return (await response.json()).data
    },
  })

  return {
    discount: discount.data as Discount,
    isLoading: discount.isLoading,
    isError: discount.isError,
    error: discount.error,
  }
}
