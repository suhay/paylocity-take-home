import { useQuery } from '@tanstack/react-query'

import { Company } from '@/types'

export function useCompany(companyId: number) {
  const company = useQuery({
    queryKey: ['company'],
    queryFn: async () => {
      const response = await fetch(`/company/${companyId}`)
      return (await response.json()).data
    },
  })

  return {
    company: company.data as Company,
    isLoading: company.isLoading,
    isError: company.isError,
    error: company.error,
  }
}
