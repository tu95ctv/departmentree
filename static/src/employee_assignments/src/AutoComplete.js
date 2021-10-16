import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
// import data from './service/CountryService';
import useQuery from './hooks/useQuery'
import useMutate from './hooks/useMutate'
import { arr_diff } from './utils'
const AutoCompleteDemo = ({ node, phong_id, ban_id, closeOverlay }) => {
    const query = useQuery('hr.employee.name_search')
    const mutate = useMutate('hr.employee.write')
    const data = node.map(n => ({
        name: n.employee_name,
        code: n.id
    }))
    const [selectedCountries, setSelectedCountries] = useState(data);
    const [filteredCountries, setFilteredCountries] = useState(null);

    const searchCountry = (event) => {
        setTimeout(async () => {
            let filteredCountries;
            if (!event.query.trim().length) {
                filteredCountries = [...data];
            }
            else {
                filteredCountries = await query({
                    limit: 8,
                    name: event.query || "",
                    operator: 'ilike'
                })
                setFilteredCountries(filteredCountries.map(n => ({
                    name: n[1],
                    code: n[0]
                })));
            }
        }, 250);
    }

    const itemTemplate = (item) => {
        return (
            <div className="country-item">
                <div>{item.name}</div>
            </div>
        );
    }
    const onChange = (e) => {
        setSelectedCountries(e.value)
    }
    const onSave = async () => {
        const ids = selectedCountries.map(n => n.code)
        const removedIds = arr_diff(node.map(n => n.id), ids)
        const removeVals = [
            removedIds.map(n => parseInt(n)),
            {
                department_id: null,
                virtual_department_id: null
            }
        ]
        await mutate(removeVals)
        const vals = [
            ids,
            {
                department_id: parseInt(phong_id),
                virtual_department_id: parseInt(ban_id)
            }
        ]
        await mutate(vals)
        closeOverlay()
    }
    return (
        <div className="p-grid p-dir-col">
            <div className="p-col"><AutoComplete autoFocus={true} value={selectedCountries} itemTemplate={itemTemplate} suggestions={filteredCountries} completeMethod={searchCountry} field="name" multiple onChange={onChange} /></div>
            <div className="p-col"><i className="pi pi-save hover" style={{'fontSize': '2em'}} onClick={onSave}></i></div>
        </div>
    )
}
export default AutoCompleteDemo       