import React, { useContext } from 'react'

const OdooContext = React.createContext({})
export const OdooProvider = ({ children, value }) => {
    return (
        <OdooContext.Provider value={value}>{children}</OdooContext.Provider>
    )
}
export const useOdooContext = () => {
    return useContext(OdooContext)
}
export default OdooContext