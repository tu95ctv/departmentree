# -*- coding: utf-8 -*-
from odoo import api, fields, models
import re
from odoo.tools import float_round,float_compare
from odoo.exceptions import UserError
from unittest import TestCase
from datetime import datetime, timedelta
from odoo import tools
xmlidmodule = ''

class DemoData(models.AbstractModel):
    _name = 'tool.test'

    @tools.ormcache('ndt')
    def test_cache(self,ndt):
        print ('***vào trong test_cache***')
        return 10*ndt
    
    def setup_begin1(self):
        return \
            {

                'em1':   {
                    'department_name': 'Phong A1',
                    'virtual_department_name': 'Ban 1',
                    'employee_name': 'David A'
                },

               'em2':   {
                    'department_name': 'Phong A2',
                    'virtual_department_name': 'Ban 2',
                    'employee_name': 'David B'
                },
            }

    @api.model
    def create_demo_data(self):
        for key in self.setup_begin1():
            self._create_employee_id(key)

    # @api.model
    # def create_demo_data(self):
    #     pass
    
    def _create_employee_id(self, key, xmlidmodule=xmlidmodule):
        master = self.setup_begin1()
        dt = master[key]
        DP = self.env['hr.department']
        JOB = self.env['hr.job']
        EM = self.env['hr.employee']
        CT = self.env['hr.contract']
  

        #######create department####
        department_name = dt['department_name']
        rs = []
        vals = {
            'name': department_name,
        }
        model = 'hr.department'
        deparment_id = self.create_record_with_xmlid1(
            department_name, model, vals, xmlidmodule)
        rs.append(deparment_id)


        #######create virtual department####
        department_name = dt['virtual_department_name']
        rs = []
        vals = {
            'name': department_name,
        }
        model = 'hr.department'
        virtual_deparment_id = self.create_record_with_xmlid1(
            department_name, model, vals, xmlidmodule)


        #######create Employee####
        name = dt['employee_name']
        rs = []
        vals = {
            'department_id': deparment_id.id,
            'virtual_deparment_id':virtual_deparment_id.id,
            'name': name,
        }
        model = 'hr.employee'
        employee_id = self.create_record_with_xmlid1(
            name, model, vals, xmlidmodule)
        rs.append(employee_id)
        return rs

  
    def xmlid_to_object_fix_module(self, name, model_name, xmlidmodule=xmlidmodule, raise_if_not_found=True):
        # name = re.sub('\s+', '_', name)
        # xmlid = xmlidmodule + '.' + name
        # I = self.env['ir.model.data']
        # obj = I.xmlid_to_object(xmlid)

        name = self.add_xmlidmodule_name(name, xmlidmodule)
        obj = self.env[model_name].search([('name', '=', name)])
        if raise_if_not_found and not obj:
            raise UserError(
                'Not found obj with name : %s, model: %s' % (name, model_name))
        return obj

    def add_xmlidmodule_name(self, name, xmlidmodule):
        name = ((xmlidmodule + ' ') if xmlidmodule else '') + name
        return name

    def create_record_with_xmlid1(self, name, model, vals, xmlidmodule=xmlidmodule):
        # name = re.sub('\s+', '_', name)
        # I = self.env['ir.model.data']
        # xml_id = xmlidmodule + '.' + name
        obj = self.xmlid_to_object_fix_module(
            name, model, xmlidmodule=xmlidmodule, raise_if_not_found=False)
        if obj:  # update
            pass
            # obj.write(vals)
        else:
            name = self.add_xmlidmodule_name(name, xmlidmodule)
            vals['name'] = name
            obj = self.env[model].create(vals)
            # self.env['ir.model.data'].create({
            #     'name': name,
            #     'model': model,
            #     'module': xmlidmodule,
            #     'res_id': obj.id,
            # })
        return obj
