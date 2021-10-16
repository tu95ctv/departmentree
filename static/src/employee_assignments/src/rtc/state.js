import { proxy, useProxy } from 'valtio'

const state = proxy({ room_id: null, quality: 12 })
export const useSnapshot = () => {
    return useProxy(state)
}
export const resetRoom = () => {
    state.room_id = null
}
export const setState = (obj) => {
    state.room_id = obj.room_id
    state.quality = obj.quality
}
export default state
