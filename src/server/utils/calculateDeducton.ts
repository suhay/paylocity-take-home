import { Company, Employee } from '@/types'
import { calculateDiscounts } from './calculateDiscounts'

export function calculateDeduction(company: Company, employee: Employee): number {
  const { employeeCost, spouseCost, dependentCost, payPeriodsPerYear } = company
  const { spouse, dependents, payPeriodsPerYear: payPeriodsPerYearEmployee } = employee

  const payPeriods = payPeriodsPerYearEmployee ?? payPeriodsPerYear

  let totalDeduction = employeeCost

  if (spouse) {
    totalDeduction += spouseCost
  }

  const dependentList = dependents.split(',').filter((n) => n !== '')
  if (dependentList.length > 0) {
    totalDeduction += dependentCost * dependentList.length
  }

  const { flatValue, percentageValue } = calculateDiscounts(employee)

  if (flatValue && flatValue > 0) {
    totalDeduction -= flatValue
  }

  if (percentageValue && percentageValue > 0) {
    totalDeduction -= totalDeduction / (percentageValue * 100)
  }

  const perPayPeriodDeduction = totalDeduction / payPeriods

  return Number(perPayPeriodDeduction.toFixed(0))
}
