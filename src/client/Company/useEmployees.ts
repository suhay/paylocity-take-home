import { useQuery } from '@tanstack/react-query'

import { Employee } from '@/types'

export function useEmployees(companyId: number) {
  const employees = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await fetch(`/company/${companyId}/employees`)
      return (await response.json()).data
    },
  })

  return {
    employees: employees.data as Employee[],
    isLoading: employees.isLoading,
    isError: employees.isError,
    error: employees.error,
  }
}
