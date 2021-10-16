import fetcher from './fetcher'
import { useCacheContext } from '../contexts/cache'
const useMutate = (cacheKey = 'todo.todo.hello_world', context = {}) => {
    const { refresh } = useCacheContext()
    const mutation = async (args) => {
        const res = await fetcher(cacheKey, args, {}, context)
        refresh()
        return res
    }
    return mutation
}
export default useMutate