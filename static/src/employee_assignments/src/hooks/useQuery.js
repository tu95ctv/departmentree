import fetcher from './fetcher'

const useQuery = (cacheKey = 'todo.todo.hello_world', context = {}) => {
    const query = async (kargs, domain = [], sort = {}) => {
        const res = await fetcher(cacheKey, [], kargs, context, domain, sort)
        return res
    }
    return query
}

export default useQuery