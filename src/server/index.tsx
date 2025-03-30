import { serve } from 'bun'
import index from './index.html'
import {
  addAudit,
  addCompany,
  addEmployee,
  deleteCompany,
  getCompany,
  getDiscount,
  getEmployee,
  getEmployees,
  setup,
  updateCompany,
  updateEmployee,
} from './services/database'
import { Audit, Company, Employee } from '../types'
import { needsAudit } from './utils/needsAudit'
import { calculateDeduction } from './utils/calculateDeducton'

const db = setup()

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/company/:companyId': async (req: Bun.BunRequest<'/company/:companyId'>) => {
      const companyId = Number(req.params.companyId)

      if (req.method === 'GET') {
        const company = getCompany(companyId)

        return Response.json({
          data: company,
        })
      }

      if (req.method === 'PUT') {
        const body = (await req.json()) as Company
        addCompany(body)

        return Response.json({
          data: body,
        })
      }

      if (req.method === 'PATCH') {
        const company = getCompany(companyId)

        if (!company) {
          return Response.json({
            error: 'Company not found',
            status: 404,
          })
        }

        const body = (await req.json()) as Company

        updateCompany(body)

        return Response.json({
          data: body,
        })
      }

      if (req.method === 'DELETE') {
        const company = getCompany(companyId)

        if (!company) {
          return Response.json({
            error: 'Company not found',
            status: 404,
          })
        }

        deleteCompany(companyId)

        return Response.json({
          data: company,
        })
      }

      return Response.json({
        error: 'Method not allowed',
        status: 405,
      })
    },

    '/company/:companyId/employees': async (
      req: Bun.BunRequest<'/company/:companyId/employees'>,
    ) => {
      const companyId = Number(req.params.companyId)
      const employees = getEmployees(companyId)
      const company = getCompany(companyId)

      const employeesWithDeduction = employees.map((employee) => {
        if (employee.activePolicy && company !== null) {
          employee.totalDeduction = calculateDeduction(company, employee)
        }

        return employee
      })

      return Response.json({
        data: employeesWithDeduction,
      })
    },

    '/company/:companyId/employee/:employeeId': async (
      req: Bun.BunRequest<'/company/:companyId/employee/:employeeId'>,
    ) => {
      const companyId = Number(req.params.companyId)
      const employeeId = Number(req.params.employeeId)

      if (req.method === 'GET') {
        const employee = getEmployee(companyId, employeeId)
        const company = getCompany(companyId)

        if (!employee) {
          return Response.json({
            error: 'Employee not found',
            status: 404,
          })
        }

        if (employee.activePolicy && company !== null) {
          employee.totalDeduction = calculateDeduction(company, employee)
        }

        if (employee.payPeriodsPerYear === null) {
          employee.payPeriodsPerYear = company?.payPeriodsPerYear ?? null
        }

        return Response.json({
          data: employee,
        })
      }

      if (req.method === 'PUT') {
        const body = (await req.json()) as Employee
        addEmployee(body)

        return Response.json({
          data: body,
        })
      }

      if (req.method === 'PATCH') {
        const employee = getEmployee(companyId, employeeId)

        if (!employee) {
          return Response.json({
            error: 'Employee not found',
            status: 404,
          })
        }

        const body = (await req.json()) as Employee

        if (body.id !== employeeId) {
          return Response.json({
            error: 'Employee ID mismatch',
            status: 400,
          })
        }

        if (body.company_id !== companyId) {
          return Response.json({
            error: 'Company ID mismatch',
            status: 400,
          })
        }

        if (needsAudit(employee, body)) {
          if (!body.auditReason) {
            return Response.json({
              error: 'Audit reason is required',
              status: 400,
            })
          }

          const audit: Audit = {
            employee_id: employeeId,
            type: body.auditReason,
            created_at: new Date().toISOString(),
            author_id: 15,
          }

          addAudit(audit)
        }

        updateEmployee(body)

        return Response.json({
          data: {
            ...employee,
            ...body,
          },
        })
      }

      if (req.method === 'DELETE') {
        const employee = getEmployee(companyId, employeeId)

        if (!employee) {
          return Response.json({
            error: 'Employee not found',
            status: 404,
          })
        }

        deleteCompany(companyId)

        return Response.json({
          data: employee,
        })
      }

      return Response.json({
        error: 'Method not allowed',
        status: 405,
      })
    },

    '/company/:companyId/discount/:discountId': async (
      req: Bun.BunRequest<'/company/:companyId/discount/:discountId'>,
    ) => {
      const discountId = Number(req.params.discountId)

      if (req.method === 'GET') {
        const discount = getDiscount(discountId)

        if (!discount) {
          return Response.json({
            error: 'Discount not found',
            status: 404,
          })
        }

        return Response.json({
          data: discount,
        })
      }

      return Response.json({
        error: 'Method not allowed',
        status: 405,
      })
    },
  },

  development: process.env.NODE_ENV !== 'production',
})

console.log(`🚀 Server running at ${server.url}`)
