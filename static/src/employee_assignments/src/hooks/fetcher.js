import Rpc from '../service'
const rpc = new Rpc();

const fetcher = async (cacheKey, args = [], kwargs = {}, context = {}, domain = [], orderBy = {}) => {
    console.log('<<fetcher,cacheKey, args ',cacheKey, args)
    const tt = cacheKey.split(':')
    const [caches, route] = tt
    const tmp = caches.split('.')
    const [method] = tmp.splice(-1, 1)
    const model = tmp.join('.')

    let params = {
        route,
        model,
        method,
        args,
        kwargs,
        context,
        domain,
        orderBy,
    };
    // console.log('>>fetcher, params ',cacheKey,  params)
    try {
        const res = await rpc.query(params)
        return res
    } catch (e) {
        throw e;
    }
}
export default fetcher