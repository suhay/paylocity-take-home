# Paylocity Take Home

## Story

As a benefits director, I want to be able to see a list of benefit eligible employees, how much they each are spending on premiums on each paycheck, see how many dependents they have, add and remove dependents, and apply and see discounts.

### Database Schema

|`employees`||
|:-|-|
|`id`|`number` - pk|
|`company_id`|`number` - fk|
|`firstName`|`string`|
|`lastName`|`string`|
|`discounts`|`discount_id[]`|
|`eligible`|`bool`|
|`activePolicy`|`bool`|
|`spouse`|`bool`|
|`dependents`|`number`|
|`pay`|`number`|
|`payPeriodsPerYear`|`number` or `null`|
  
---  
  
|`companies`||
|:-|-|
|`id`|`number` - pk|
|`employeeCost`|`number`|
|`spouseCost`|`number`|
|`dependentCost`|`number`|
|`premiumScheduleMonths`|`number`|
|`payPeriodsPerYear`|`number`|

---

|`discounts`||
|:-|-|
|`id`| `number` - pk|
|`company_id`| `number` - fk|
|`label`|`string`|
|`flatValue`|`number`|
|`percentageValue`|`number`|

---

|`audits`||
|:-|-|
|`id`| `number` - pk|
|`employee_id`|`number` - fk|
|`type`|`string`|
|`created_at`|`TIMESTAMP DEFAULT CURRENT_TIMESTAMP`|

### Eligible Employee List

`GET /company/:companyId/employees`

We first want to be able to retrieve a list of all eligible employees, regardless of if they are signed up for benefits or not. This will give us the ability to add benefits to current employees both during open enrollment, or for a life event.

```json
{
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "discounts": [],
      "eligible": true,
      "activePolicy": true,
      "totalDeduction": 100000
    }
  ]
}
```

#### Acceptance Criteria

- List all employees
- Display:
  - `eligibility`
  - `activePolicy`
  - `firstName`
  - `lastName`
  - `discounts`
  - `totalDeduction`
- Selecting an employee from the list will open a page showing just that employee

### Benefit Cost Fields

`GET,POST /company/:companyId`

On the employee list, we should be able to set the benefits cost.

```json
{
  "data": {
    "employeeCost": 100000,
    "spouseCost": 50000,
    "dependentCost": 50000,
    "premiumScheduleMonths": 12,
    "payPeriodsPerYear": 26
  }
}
```

#### Acceptance Criteria

- Add a button to unlock the benefit values
- Allow the `employeeCost`, `spouseCost`, `dependentCost`, and `premiumScheduleMonths` to be change
- We want to be able to set the default `payPeriodsPerYear` all employees will use, unless given a specific pay period
- When te values are changed and saved, the list of employees should update to use the new values

### Single Employee View

`GET /company/:companyId/employee/:employeeId`

As a benefits director, I want to be able to see an employee's specific circumstance when it comes to their benefits, cost, and number of dependents. Private data should only be seen while looking at a specific employee.

```json
{
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "discounts": [],
    "spouse": true,
    "dependents": 0,
    "eligible": true,
    "activePolicy": true,
    "pay": 200000,
    "payPeriodsPerYear": 26,
    "totalDeduction": 100000
  }
}
```

#### Considerations

Since we want to maintain a default `payPeriodsPerYear` unless the employee has a specific requirement for a different pay period schedule, this value should be `null` on the backend while performing the calculation to denote that we are to use the default value.

In a fast follow, we will want to get a list of all the employee's audits.

#### Acceptance Criteria

- The employee's profile displays showing
  - `id`
  - `firstName`
  - `lastName`
  - `discounts`
  - `spouse`
  - `dependents`
  - `eligible`
  - `activePolicy`
  - `pay`
  - `payPeriodsPerYear`
- Display what the cost is for the employee for benefits per pay period

### Changing Employee Details

`POST /company/:companyId/employee/:employeeId`

As a benefits director, we will want to be able to make slight adjustments to an employee's account that do not have to happen during open enrollment or as a result of a life event.

```json
{
  "data": {
    "pay": 3000000,
    "payPeriodPerYear": 12,
    "discounts": [],
    "eligible": true
  }
}
```

#### Acceptance Criteria

- Be able to change
  - `pay`
  - `payPeriodPerYear`
  - `discounts`
  - `eligible`
- Be sure we are only updating employees within the user's own company

### Changing Employee Benefits

`POST /company/:companyId/employee/:employeeId`

We will also want to have the ability to change an employee's elections including turning the policy off or on, adding or removing a spouse, adding or removing dependents. When editing benefits for current employees (adding, removing), we need to be able to determine if the change is during open enrollment or as a result of a qualified life event.

```json
{
  "data": {
    "firstName": "James",
    "lastName": "Bo",
    "spouse": true,
    "dependents": 3,
    "activePolicy": true,
    "updateTypw": "adoption"
  }
}
```

#### Acceptance Criteria

- Be able to change
  - `firstName`
  - `lastName`
  - `spouse`
  - `dependents`
  - `activePolicy`
- We should be able to set what the life event was for reporting and auditing purposes.
  - `type`
    - Civil union, birth, adoption, divorce, death, dependent became ineligible, loss of coverage, open enrollment
- This should be recorded to the `audits` table
- We should only prompt the user for an update reason if one of the above are being changed. If not, we do not need to ask and there will be no record to pit in the `audits` table
- The update should be rejected if an audit reason type is not provided

### Add Audit record

`Performed on the backend while updating benefits`

When a life change event results in the change of benefits, we need an `audits` record created stating why the change was made

#### Acceptance Criteria

- Record
  - `employee_id`
  - Type of change
  - Date of change
  - ID of person making change

---
  
<details>

<summary>Requirements for exercise</summary>

## Business Need
One of the critical functions that we provide for our clients is the ability to pay for their employees’ healthcare benefits package. A portion of these costs are deducted from their paycheck, and we handle that deduction. Create a front-end application that displays the total cost of their healthcare benefits package per paycheck.

### Calculation breakdown
- The cost of benefits is $1000/year for each employee
- Each dependent (children and possibly spouses) incurs a cost of $500/year
- Anyone whose name starts with ‘A’ gets a 10% discount, employee or dependent

### Assumptions
- All employees are paid $2000 per paycheck before deductions.
- There are 26 paychecks in a year.

### Requirements
- Mock out an API for the retrieval of employee/dependent data
  - Tip: All data can be stored client-side in memory
- List out the employee and their dependents
- Allow the user to change their elections and display a preview of the calculated benefits
- CRUD functionality
  - I.E Add/edit employee + dependents
- Allow the user to save their changes and reflect them on subsequent page loads
</details>