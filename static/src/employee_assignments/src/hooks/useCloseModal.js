import React from 'react'
const useCloseModal = (onClose) => {
    React.useEffect(() => {
        if (window.odoo_Dialog) {
          window.odoo_Dialog.include({
            destroy: function(options) {
                if (onClose) {
                    onClose(options)
                }
            }
          })
        }
    }, [])
}

export default useCloseModal