import useSWR from 'swr'
import fetcher from './fetcher'

const useData = (cacheKey = 'todo.todo.hello_world', { args = [], kwargs = {}, domain = [], orderBy = [], context = {} }) => {
    const hKey = JSON.stringify({ args })
    const hDomain = JSON.stringify({ domain })
    const hOrder = JSON.stringify({ orderBy })
    const cKey = `${cacheKey}_${hKey}_${hDomain}_${hOrder}`
    const { data } = useSWR(cKey, () => fetcher(cacheKey, args, kwargs, context, domain, orderBy), {
        revalidateOnFocus: true,
        revalidateOnMount: true,
        revalidateOnReconnect: true,
        refreshWhenOffline: false,
        refreshWhenHidden: true,
        refreshInterval: 0
    })

    // console.log ('>>useData', cacheKey, 'args',args)


    return [data && data.result ? data.result : data, cKey]
}
export default useData