import { useQuery } from '@tanstack/react-query'

import { Employee } from '@/types'

export function useEmployee(companyId: number, employeeId: number) {
  const employee = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: async () => {
      const response = await fetch(`/company/${companyId}/employee/${employeeId}`)
      return (await response.json()).data
    },
  })

  return {
    employee: employee.data as Employee,
    isLoading: employee.isLoading,
    isError: employee.isError,
    error: employee.error,
  }
}
