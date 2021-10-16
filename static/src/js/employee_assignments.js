odoo.define('department_matrix.dep_matrix', function (require) {
    "use strict";

    var AbstractAction = require('web.AbstractAction');
    window.odoo_Dialog = require('web.Dialog');
    window.core = require('web.core');
    
    var CustomPageWidget = AbstractAction.extend({
        template: 'dep_matrix_js_template1',
        init: function (parent, action) {
            this._super.apply(this, arguments);
            window.action_manager = parent;
            window.react_params = action.params;
        },
    });

    core.action_registry.add('department_matrix.dep_matrix', CustomPageWidget);

    return CustomPageWidget;

})
