from odoo import models, fields, api, _, tools
import logging
_logger = logging.getLogger(__name__)

class HrDepartment(models.Model):
    _inherit = 'hr.department'
    # department_group_id = fields.Many2one(
    #     comodel_name = 'hr.department.group',
    #     string = 'Department Group'
    # )
    is_virtual = fields.Boolean(string = 'Is virtual' )
    tree_path = fields.Char(string = 'Tree path', compute = '_compute_tree_path', store = True)


    @tools.ormcache('ndt')
    def test_cache(self,ndt):
        print ('***vào trong test_cache***')
        return 10*ndt

    
    def tc(self,ndt):
        print ('***vào trong test_cache***')
        return 10*ndt





    def get_domain_em_ids(self):
        if self._context.get('ban_id'):
            return [('virtual_department_id','=', self._context.get('ban_id'))]
        return []

    employee_ids = fields.One2many('hr.employee','department_id', domain=get_domain_em_ids)

    @api.depends('parent_id.tree_path')
    def _compute_tree_path(self):
        for rec in self:
            if not rec.parent_id:
                rec.tree_path = str(rec.id)
            else:
                rec.tree_path = str(rec.parent_id.tree_path) + ',' + str(rec.id)

    @api.model
    def get_department_tree(self, args = []):
        if args and 'department' in args and len(args['department']) > 0:
            domain = [('is_virtual', '=', False)]
            domain = domain + args['department']
            where, where_params = self._compute_domain(domain, 'hr.department')
            query = """
            WITH RECURSIVE ctename AS (
            SELECT id, name, parent_id,
                    tree_path AS path
            FROM hr_department
            where %(where)s
            UNION
                SELECT p.id, p.name, p.parent_id,
                        p.tree_path as path
                FROM hr_department p
                    JOIN ctename ON p.id = ctename.parent_id
            )
            SELECT id, name as title, parent_id, path FROM ctename
            order by name;
            """ % {
                'where': where,
            }
            self.env.cr.execute(query, where_params)
            return self.env.cr.dictfetchall()
        else:
            domain = [('is_virtual', '=', False), ('parent_id', '=', False)]
            where, where_params = self._compute_domain(domain, 'hr.department')
            query = """
            WITH RECURSIVE ctename AS (
            SELECT id, name, parent_id, 0 AS level,
                    tree_path AS path
            FROM hr_department
            where %(where)s
            UNION
                SELECT p.id, p.name, p.parent_id, ctename.level + 1,
                        p.tree_path as path
                FROM hr_department p
                    JOIN ctename ON p.parent_id = ctename.id
                WHERE ctename.level <= 20
            )
            SELECT DISTINCT id, name as title, parent_id, level, path, NULL as children FROM ctename
            order by name
            ;
            """ % {
                'where': where,
            }
            self.env.cr.execute(query, where_params)
            return self.env.cr.dictfetchall()


    # @api.model
    # def get_department_tree(self, args = []):
    #     _logger.warning('args_is %s' % args)
    #     domain = [('is_virtual', '=', False)]
    #     if args and 'department' in args:
    #         domain = domain + args['department']
    #     rs = self.search_read(domain,['id','name','parent_id','tree_path'])
    #     rs2 = [{
    #         'id':i['id'],
    #         'title':i['name'],
    #         'parent_id':i['parent_id'],
    #         'path':i['tree_path']
    #     } for i in rs]
    #     return rs2

    def _compute_domain(self, domain, model, alias = False):
        self.env[model]._flush_search(domain)
        query = self.env[model]._where_calc(domain)
        self.env[model]._apply_ir_rules(query, 'read')
        _, where, where_params = query.get_sql()
        if alias:
            where = where.replace(model.replace('.', '_'), alias)
        return where, where_params

    @api.model
    def get_virtual_departments_with_employees(self, args = []):
        employee_domain = []
        if args and 'employee' in args:
            employee_domain = args['employee']
        employee_where, employee_where_params = self._compute_domain(employee_domain, 'hr.employee', 'e')
        sql = """
        with tmp1 as (
        select e.id as employee_id,
            e.name as employee_name,
            hd.id as department_name,
            j.id as job_title,
            row_number() over (partition by department_id, virtual_department_id order by e.id) as rn
        from hr_employee e
        right outer join hr_department hd on hd.id = e.department_id
        right outer join hr_department j on j.id = e.virtual_department_id
        where %(employee_where)s
        )
        SELECT
        jsonb_object_agg(key, value) as result
        FROM (
        SELECT
            jsonb_build_object(
                department_name, 
                jsonb_object_agg(key, value)
            ) as departments
        FROM (
            SELECT
                case department_name when NULL then 0 else department_name end,
                jsonb_build_object(job_title, jsonb_agg(json_build_object(
                        'employee_name', employee_name,
                        'id', employee_id,
                        'rn', rn
                    ))) AS job_title
            FROM tmp1
            where rn <= 5
            GROUP BY department_name, job_title
            
        ) s,
        jsonb_each(job_title)

        GROUP BY department_name
        ) s,
        jsonb_each(departments)
        """ % {
            'employee_where': employee_where
        }
        self.env.cr.execute(sql, employee_where_params)
        result = self.env.cr.fetchone()
        return result[0]

    @api.model
    def get_virtual_departments(self, args = []):
        domain = []
        if args and 'virtual_department' in args:
            domain = args['virtual_department']
        where, where_params = self._compute_domain(domain, 'hr.department')
        _logger.info('where_is %s %s' % (where, where_params))
        sql = """
        with tmp1 as (
            select id, name, is_virtual
            from hr_department
            where is_virtual = true
            and %(where)s 
        )
        select json_object_agg(id, name)
        from tmp1
        """ % {
            'where': where
        }

        self.env.cr.execute(sql, where_params)
        result = self.env.cr.fetchone()
        return result[0]

    @api.model
    def get_virtual_departments_tree(self, args = []):
        domain = [('is_virtual', '=', True), ('parent_id', '=', False)]
        where, where_params = self._compute_domain(domain, 'hr.department')
        query = """
        WITH RECURSIVE ctename AS (
        SELECT id, name, parent_id, 0 AS level,
                tree_path AS path
        FROM hr_department
        where %(where)s
        UNION
            SELECT p.id, p.name, p.parent_id, ctename.level + 1,
                    p.tree_path as path
            FROM hr_department p
                JOIN ctename ON p.parent_id = ctename.id
            WHERE ctename.level <= 20
        )
        SELECT DISTINCT id, name as title, parent_id, level, path, NULL as children FROM ctename
        order by level
        ;
        """ % {
            'where': where,
        }
        self.env.cr.execute(query, where_params)
        rs =  self.env.cr.dictfetchall()
        print ('***rs***', rs)
        return rs