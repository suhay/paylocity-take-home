import { serve } from 'bun'
import index from './index.html'
import {
  addAudit,
  getCompany,
  getEmployee,
  getEmployees,
  setup,
  updateEmployee,
} from './services/database'
import { Audit, Employee } from './types'
import { needsAudit } from './utils/needsAudit'

const db = setup()

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/company/:companyId': async (req) => {
      const companyId = Number(req.params.companyId)
      const company = getCompany(companyId)

      return Response.json({
        data: company,
      })
    },

    '/company/:companyId/employees': async (
      req: Bun.BunRequest<'/company/:companyId/employees'>,
    ) => {
      const companyId = Number(req.params.companyId)
      const employees = getEmployees(companyId)

      return Response.json({
        data: employees,
      })
    },

    '/company/:companyId/employee/:employeeId': async (
      req: Bun.BunRequest<'/company/:companyId/employee/:employeeId'>,
    ) => {
      if (req.method === 'GET') {
        const companyId = Number(req.params.companyId)
        const employeeId = Number(req.params.employeeId)
        const employee = getEmployee(companyId, employeeId)

        if (!employee) {
          return Response.json({
            error: 'Employee not found',
            status: 404,
          })
        }

        return Response.json({
          data: employee,
        })
      }

      if (req.method === 'POST') {
        const companyId = Number(req.params.companyId)
        const employeeId = Number(req.params.employeeId)
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

      return Response.json({
        error: 'Method not allowed',
        status: 405,
      })
    },
  },

  development: process.env.NODE_ENV !== 'production',
})

console.log(`🚀 Server running at ${server.url}`)
