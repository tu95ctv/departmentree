import React, { useContext } from 'react'
import { mutate } from 'swr'
const CacheContext = React.createContext({})
export const CacheProvider = ({ children, value }) => {
    const refresh = async () => {
        for (const entry of Object.entries(value.cacheKeys)) {
            await mutate(entry[1])
        }
    }
    const cacheValue = {
        ...value,
        refresh,
    }
    return (
        <CacheContext.Provider value={cacheValue}>{children}</CacheContext.Provider>
    )
}
export const useCacheContext = () => {
    return useContext(CacheContext)
}
export default CacheProvider