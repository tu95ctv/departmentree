import { mutate } from 'swr'
import fetcher from '../hooks/fetcher'
export const trigger = (search = []) => {
    const key = 'hr.department.get_virtual_departments_with_employees'
    mutate([key, search])
}
