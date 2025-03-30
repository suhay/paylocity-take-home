import { ChevronRight } from 'react-feather'
import { useNavigate } from 'react-router'

import { Employee } from '@/types'
import { Discounts } from '../Discount/Discounts'
import { centsToDollars } from '../utils/centsToDollars'
import { ActivePolicy } from './ActivePolicy'
import { Eligible } from './Eligible'

export function ListItem({ employee }: { employee: Employee }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/${employee.company_id}/${employee.id}`)
  }

  return (
    <section className='bg-white rounded-lg shadow-md mb-4 hover:bg-gray-100 w-[700px]'>
      <button
        className='w-full flex flex-row justify-between p-4 items-center cursor-pointer'
        onClick={handleClick}
      >
        <div className='w-13 mr-1'>
          <Eligible eligible={employee.eligible} />
        </div>
        <div className='w-13 mr-1'>
          <ActivePolicy activePolicy={employee.activePolicy} />
        </div>
        <div className='flex flex-row flex-1'>
          <div className='text-left mr-1.5'>{employee.firstName}</div>
          <div>{employee.lastName}</div>
        </div>
        <div className='w-[128px] text-left flex flex-row gap-4 items-start'>
          <Discounts discounts={employee.discounts} companyId={employee.company_id} />
        </div>
        <div className='w-[120px] text-left'>{centsToDollars(employee.totalDeduction)}</div>
        <div className='w-[40px]'>
          <ChevronRight />
        </div>
      </button>
    </section>
  )
}
