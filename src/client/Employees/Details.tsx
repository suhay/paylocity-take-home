import { useParams } from 'react-router'

import { Discounts } from '../Discount/Discounts'
import { centsToDollars } from '../utils/centsToDollars'
import { useEmployee } from './useEmployee'

export function Details() {
  const params = useParams()
  const companyId = Number(params.companyId)
  const employeeId = Number(params.employeeId)

  const { employee, isLoading } = useEmployee(companyId, employeeId)

  return (
    <div className='max-w-7xl mx-auto p-8 text-center relative z-10'>
      <h1 className='text-4xl font-bold mb-4'>Employee Details</h1>
      {isLoading ? (
        <p className='text-lg text-gray-600'>Loading...</p>
      ) : (
        <div>
          <h2 className='text-2xl font-bold mb-4'>
            {employee.firstName} {employee.lastName}
          </h2>
          <p>
            Discounts: <Discounts companyId={companyId} discounts={employee.discounts} />
          </p>
          <p>Eligible: {employee.eligible ? 'Yes' : 'No'}</p>
          <p>Active Policy: {employee.activePolicy ? 'Yes' : 'No'}</p>
          <p>Spouse: {employee.spouse}</p>
          <p>Dependents: {employee.dependents}</p>
          <p>Pay: {centsToDollars(employee.pay)}</p>
          <p>Pay Periods per Year: {employee.payPeriodsPerYear}</p>
          <p>Total Deduction per paycheck: {centsToDollars(employee.totalDeduction)}</p>
        </div>
      )}
    </div>
  )
}
