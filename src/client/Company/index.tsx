import { ListItem } from '../Employees/ListItem'
import { centsToDollars } from '../utils/centsToDollars'
import { useCompany } from './useCompany'
import { useEmployees } from './useEmployees'

export function Company({ companyId }: { companyId: number }) {
  const { company, isLoading } = useCompany(companyId)
  const { employees, isLoading: isLoadingEmployees } = useEmployees(companyId)

  if (isLoading || isLoadingEmployees) {
    return (
      <div className='max-w-7xl mx-auto p-8 text-center relative z-10'>
        <h1 className='text-4xl font-bold mb-4'>Company</h1>
        <p className='text-lg text-gray-600'>Loading...</p>
      </div>
    )
  }

  return (
    <div className='max-w-7xl'>
      <h1 className='text-4xl font-bold mb-4'>Company {company.id}</h1>
      <section>
        <div>Employee Cost: {centsToDollars(company.employeeCost)}</div>
        <div>Dependent Cost: {centsToDollars(company.dependentCost)}</div>
        <div>Spouse Cost: {centsToDollars(company.spouseCost)}</div>
        <div>Pay Periods per Year: {company.payPeriodsPerYear}</div>
        <div>Premium Schedule: {company.premiumScheduleMonths}</div>
      </section>
      <div>
        <div className='flex flex-row gap-2 items-end mb-2'>
          <div className='w-13 mr-1 text-left'>Eligible</div>
          <div className='w-13 mr-1 text-left'>Active Policy</div>
          <div className='flex-1 text-left'>Employee Name</div>
          <div className='w-[128px] text-left'>Discounts</div>
          <div className='w-[120px] text-left'>Total Deduction</div>
          <div className='w-[40px] mr-4'></div>
        </div>
        {employees.map((employee) => (
          <ListItem key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  )
}
