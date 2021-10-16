from odoo import models, fields, _, api
import logging
_logger = logging.getLogger(__name__)

class HrEmployee(models.Model):
    _inherit = 'hr.employee'
    virtual_department_id = fields.Many2one(
        comodel_name = 'hr.department',
        string = 'Virtual Department',
        domain = [('is_virtual', '=', True)]
    )
    department_id = fields.Many2one(
        comodel_name = 'hr.department',
        string = 'Department',
        domain = [('is_virtual', '=', False)]
    )

    @api.model
    def group_employees_by_department_id(self):
        _logger.debug('context is',self.env.context.get('hello'))
        sql = """
        WITH tmp AS (
            select department_id, count(*) as emp_count
            from hr_employee
            where active = true
            group by department_id
        )
        select department.name as category, 
            (100 * round ((0.0+emp_count)/(sum(emp_count) over())::DECIMAL, 2))::TEXT
             as value
        from tmp
        inner join hr_department department on department.id = tmp.department_id
        """
        self.env.cr.execute(sql)
        return self.env.cr.dictfetchall()

    @api.model
    def count_employees_wage_by_department_id(self):
        _logger.debug('context is',self.env.context.get('hello'))
        sql = """
        WITH tmp AS (
            select e.department_id, count(c.wage) as sum_wage
            from hr_contract c
            inner join hr_employee e on e.id = c.employee_id
            where e.active = true
            and c.active = true
            group by e.department_id
        )
        select department.name as category, 
        (100 * round ((0.0+sum_wage)/(sum(sum_wage) over())::DECIMAL, 2))::TEXT
             as value
        from tmp
        inner join hr_department department on department.id = tmp.department_id
        """
        self.env.cr.execute(sql)
        return self.env.cr.dictfetchall()
