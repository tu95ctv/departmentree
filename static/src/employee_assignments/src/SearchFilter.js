import React, { Fragment, useState } from 'react'
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { useStateWithCallbackLazy } from 'use-state-with-callback'

const calculateDomain = selectedCountries => {
    let tmp = {}
    for(let i in selectedCountries) {
        const v = selectedCountries[i]
        tmp[v.searchType] ||= []
        tmp[v.searchType].push(['name','ilike',v.value])
        if (tmp[v.searchType].length > 1) {
            tmp[v.searchType].unshift('|')
        }
    }
    return tmp  
}

const Main = ({ data, selectedCountries, setSelectedCountries, setSearch }) => {
    const [filteredCountries, setFilteredCountries] = useState([]);//
    
    const labelTemplate = (c, event) => {
        return (
            <span>
            <span style={{ color: 'red', borderBottom: '0.5px' }}>{c.label}</span> | {event.query}
            </span>
        )
    }
    const searchCountry = (event) => {
        const tmp = data.map(c => {
            return {
                ...c,
                label: labelTemplate(c, event),
                value: event ? event.query : null,
            }
        })
        setFilteredCountries(tmp)
    }

    const onChange = (e) => {
        console.log('***e.value***',e.value)
        setSelectedCountries(e.value)
        s = e.value
        tmp1 = [calculateDomain(s)]
        setSearch(tmp1)


    }

    // const onClear = () => {
    //     // setSelectedCountries([])
    //     setSelectedCountries([], s => {
    //         setSearch([])
            
    //     })
    // }

    const onClear = () => {
        // setSelectedCountries([])
        setSelectedCountries([])
        setSearch([])
    }



    
    return (
        <Fragment>
            <AutoComplete
                value={selectedCountries} 
                suggestions={filteredCountries} 
                completeMethod={searchCountry} 
                field="label" 
                multiple 
                onChange={onChange}
                autoFocus={true}
                tabindex={0}
            />
            &nbsp;
            <Button onClick={onClear} icon="pi pi-times"></Button>
        </Fragment>
    )
}

export default Main
