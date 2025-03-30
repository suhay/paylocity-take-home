import { Employee } from '@/types'

export function needsAudit(oldEmployeeRecord: Employee, newEmployeeRecord: Employee): boolean {
  if (oldEmployeeRecord.firstName !== newEmployeeRecord.firstName) {
    return true
  }

  if (oldEmployeeRecord.lastName !== newEmployeeRecord.lastName) {
    return true
  }

  if (oldEmployeeRecord.spouse !== newEmployeeRecord.spouse) {
    return true
  }

  if (oldEmployeeRecord.dependents !== newEmployeeRecord.dependents) {
    return true
  }

  if (oldEmployeeRecord.activePolicy !== newEmployeeRecord.activePolicy) {
    return true
  }

  return false
}
