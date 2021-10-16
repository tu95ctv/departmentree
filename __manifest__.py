# -*- coding: utf-8 -*-
{
    'name': "Department Matrix trobz",  # Module title
    'summary': "Manage Department Tree with Employees",  # Module subtitle phrase
    'description': """
Manage Library
==============
Description related to library.
    """,  # Supports reStructuredText(RST) format
    'author': "Trobz",
    'website': "http://www.example.com",
    'category': 'Tools',
    'version': '14.0.1',
    'depends': ['base', 'hr_contract'],
    # This data files will be loaded at the installation (commented because file is not added in this example)
    'data': [
        # 'security/ir.model.access.csv',
        # 'data/hr.department.group.csv',
        # 'data/resource.resource.csv',
        'data/hr.department.csv',
        #'data/res_partner_data.xml',
        #'data/hr_data.xml',
        #'data/hr_demo.xml',



        # 'views/hr_department_group_view.xml',
        'views/react.dev.xml',
        'views/hr_department_view.xml',
        'views/hr_employee_view.xml',
        'views/views.xml',



    ],
    'qweb': ["static/src/xml/base.dev.xml"]
    # This demo data files will be loaded if db initialize with demo data (commented because file is not added in this example)
    # 'demo': [
    #     'demo.xml'
    # ],
}
