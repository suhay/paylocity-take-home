export type Employee = {
  id?: number
  company_id: number
  firstName: string
  lastName: string
  discounts: string
  eligible: boolean
  activePolicy: boolean
  spouse: boolean
  dependents: number
  pay: number
  payPeriodsPerYear: number | null
  totalDeduction?: number
  auditReason?: string
}

export type Company = {
  id?: number
  employeeCost: number
  spouseCost: number
  dependentCost: number
  premiumScheduleMonths: number
  payPeriodsPerYear: number
}

export type Discount = {
  id?: number
  company_id: number
  label: string
  flatValue: number
  percentageValue: number
}

export type Audit = {
  id?: number
  employee_id: number
  type: string
  created_at: string
}
