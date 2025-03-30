import { Database } from 'bun:sqlite'

import { Audit, Company, Discount, Employee } from '../../types'

const db = new Database()

export function setup() {
  // const db = new Database('../mydb.sqlite', { create: true })
  db.run(`
    CREATE TABLE IF NOT EXISTS companies(
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      employeeCost INTEGER,
      spouseCost INTEGER,
      dependentCost INTEGER,
      premiumScheduleMonths INTEGER,
      payPeriodsPerYear INTEGER
    )`)

  db.run(`
    CREATE TABLE IF NOT EXISTS employees(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      firstName TEXT,
      lastName TEXT,
      discounts TEXT,
      eligible BOOLEAN,
      activePolicy BOOLEAN,
      spouse TEXT,
      dependents TEXT,
      pay INTEGER,
      payPeriodsPerYear INTEGER,
      CONSTRAINT fk_cId FOREIGN KEY (company_id) REFERENCES companies (id)
    )`)

  db.run(`
    CREATE TABLE IF NOT EXISTS discounts(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      label TEXT,
      flatValue INTEGER,
      percentageValue INTEGER,
      CONSTRAINT fk_cId FOREIGN KEY(company_id) REFERENCES companies(id)
    )`)

  db.run(`
    CREATE TABLE IF NOT EXISTS audits(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      author_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_cId FOREIGN KEY(employee_id) REFERENCES employees(id)
    )`)

  const company: Company = {
    id: 1,
    employeeCost: 100000,
    spouseCost: 50000,
    dependentCost: 50000,
    premiumScheduleMonths: 12,
    payPeriodsPerYear: 26,
  }

  addCompany(company)

  const discount: Discount = {
    id: 1,
    company_id: 1,
    label: '10% A',
    flatValue: 0,
    percentageValue: 0.1,
  }

  addDiscount(discount)

  const employee1: Employee = {
    id: 1,
    company_id: 1,
    firstName: 'John',
    lastName: 'Doe',
    discounts: '1',
    eligible: true,
    activePolicy: true,
    spouse: 'Artra Doe',
    dependents: '',
    pay: 200000,
    payPeriodsPerYear: null,
  }

  addEmployee(employee1)

  const employee2: Employee = {
    id: 2,
    company_id: 1,
    firstName: 'Thane',
    lastName: 'Beard',
    discounts: '',
    eligible: true,
    activePolicy: true,
    spouse: 'Feburn Beard',
    dependents: 'Thooden Beard, Frood Beard',
    pay: 200000,
    payPeriodsPerYear: null,
  }

  addEmployee(employee2)

  const employee3: Employee = {
    id: 2,
    company_id: 1,
    firstName: 'Jennifer',
    lastName: 'Albertson',
    discounts: '1',
    eligible: true,
    activePolicy: false,
    spouse: 'Leviten Albertson',
    dependents: 'Fender Albertson',
    pay: 200000,
    payPeriodsPerYear: null,
  }

  addEmployee(employee3)

  return db
}

export function addCompany(company: Company) {
  const stmt = db.prepare<undefined, [number, number, number, number, number]>(
    'INSERT INTO companies (employeeCost, spouseCost, dependentCost, premiumScheduleMonths, payPeriodsPerYear) VALUES (?, ?, ?, ?, ?)',
  )
  stmt.run(
    company.employeeCost,
    company.spouseCost,
    company.dependentCost,
    company.premiumScheduleMonths,
    company.payPeriodsPerYear,
  )
}

export function getCompanies(db: Database) {
  const stmt = db.prepare<Company[], []>('SELECT * FROM companies')
  return stmt.all()
}

export function getCompany(id: number) {
  const stmt = db.prepare<Company, [number]>('SELECT * FROM companies WHERE id = ?')
  return stmt.get(id)
}

export function updateCompany(company: Company) {
  if (!company.id) {
    throw new Error('Company ID is required for update')
  }

  const stmt = db.prepare<undefined, [number, number, number, number, number, number]>(
    'UPDATE companies SET employeeCost = ?, spouseCost = ?, dependentCost = ?, premiumScheduleMonths = ?, payPeriodsPerYear = ? WHERE id = ?',
  )
  stmt.run(
    company.employeeCost,
    company.spouseCost,
    company.dependentCost,
    company.premiumScheduleMonths,
    company.payPeriodsPerYear,
    company.id,
  )
}

export function deleteCompany(id: number) {
  const stmt = db.prepare<undefined, [number]>('DELETE FROM companies WHERE id = ?')
  stmt.run(id)
}

export function getEmployees(companyId: number) {
  const stmt = db.prepare<Employee, [number]>('SELECT * FROM employees WHERE company_id = ?')
  return stmt.all(companyId)
}

export function getEmployee(companyId: number, id: number) {
  const stmt = db.prepare<Employee, [number, number]>(
    'SELECT * FROM employees WHERE id = ? and company_id = ?',
  )
  return stmt.get(id, companyId)
}

export function addEmployee(employee: Employee) {
  const stmt = db.prepare<
    undefined,
    [number, string, string, string, boolean, boolean, string, string, number, number | null]
  >(
    'INSERT INTO employees (company_id, firstName, lastName, discounts, eligible, activePolicy, spouse, dependents, pay, payPeriodsPerYear) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  )
  stmt.run(
    employee.company_id,
    employee.firstName,
    employee.lastName,
    employee.discounts,
    employee.eligible,
    employee.activePolicy,
    employee.spouse,
    employee.dependents,
    employee.pay,
    employee.payPeriodsPerYear,
  )
}

export function updateEmployee(employee: Employee) {
  if (!employee.id) {
    throw new Error('Employee ID is required for update')
  }

  const stmt = db.prepare<
    undefined,
    [
      number,
      string,
      string,
      string,
      boolean,
      boolean,
      string,
      string,
      number,
      number | null,
      number,
    ]
  >(
    'UPDATE employees SET company_id = ?, firstName = ?, lastName = ?, discounts = ?, eligible = ?, activePolicy = ?, spouse = ?, dependents = ?, pay = ?, payPeriodsPerYear = ? WHERE id = ?',
  )
  stmt.run(
    employee.company_id,
    employee.firstName,
    employee.lastName,
    employee.discounts,
    employee.eligible,
    employee.activePolicy,
    employee.spouse,
    employee.dependents,
    employee.pay,
    employee.payPeriodsPerYear,
    employee.id,
  )
}

export function deleteEmployee(id: number) {
  const stmt = db.prepare<undefined, [number]>('DELETE FROM employees WHERE id = ?')
  stmt.run(id)
}

export function getDiscounts(companyId: number) {
  const stmt = db.prepare<Discount, [number]>('SELECT * FROM discounts WHERE company_id = ?')
  return stmt.all(companyId)
}

export function getDiscount(id: number) {
  const stmt = db.prepare<Discount, [number]>('SELECT * FROM discounts WHERE id = ?')
  return stmt.get(id)
}

export function addDiscount(discount: Discount) {
  const stmt = db.prepare<undefined, [number, string, number, number]>(
    'INSERT INTO discounts (company_id, label, flatValue, percentageValue) VALUES (?, ?, ?, ?)',
  )
  stmt.run(discount.company_id, discount.label, discount.flatValue, discount.percentageValue)
}

export function updateDiscount(discount: Discount) {
  if (!discount.id) {
    throw new Error('Discount ID is required for update')
  }

  const stmt = db.prepare<undefined, [number, string, number, number, number]>(
    'UPDATE discounts SET company_id = ?, label = ?, flatValue = ?, percentageValue = ? WHERE id = ?',
  )
  stmt.run(
    discount.company_id,
    discount.label,
    discount.flatValue,
    discount.percentageValue,
    discount.id,
  )
}

export function deleteDiscount(id: number) {
  const stmt = db.prepare<undefined, [number]>('DELETE FROM discounts WHERE id = ?')
  stmt.run(id)
}

export function getAudits(employeeId: number) {
  const stmt = db.prepare<Audit, [number]>('SELECT * FROM audits WHERE employee_id = ?')
  return stmt.all(employeeId)
}

export function getAudit(id: number) {
  const stmt = db.prepare<Audit, [number]>('SELECT * FROM audits WHERE id = ?')
  return stmt.get(id)
}

export function addAudit(audit: Audit) {
  const stmt = db.prepare<undefined, [number, string]>(
    'INSERT INTO audits (employee_id, type) VALUES (?, ?)',
  )
  stmt.run(audit.employee_id, audit.type)
}

export function updateAudit(audit: Audit) {
  if (!audit.id) {
    throw new Error('Audit ID is required for update')
  }

  const stmt = db.prepare<undefined, [number, string, number]>(
    'UPDATE audits SET employee_id = ?, type = ? WHERE id = ?',
  )
  stmt.run(audit.employee_id, audit.type, audit.id)
}

export function deleteAudit(id: number) {
  const stmt = db.prepare<undefined, [number]>('DELETE FROM audits WHERE id = ?')
  stmt.run(id)
}
