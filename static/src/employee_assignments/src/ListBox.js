import React, { useState } from 'react';
import { ListBox } from 'primereact/listbox';

const ListBoxDemo = () => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedCountries, setSelectedCountries] = useState(null);
    const cities = [
        {name: 'New York', code: 'NY'},
        {name: 'Rome', code: 'RM'},
        {name: 'London', code: 'LDN'},
        {name: 'Istanbul', code: 'IST'},
        {name: 'Paris', code: 'PRS'}
    ];
    const countries = [
        {name: 'Australia', code: 'AU'},
        {name: 'Brazil', code: 'BR'},
        {name: 'China', code: 'CN'},
        {name: 'Egypt', code: 'EG'},
        {name: 'France', code: 'FR'},
        {name: 'Germany', code: 'DE'},
        {name: 'India', code: 'IN'},
        {name: 'Japan', code: 'JP'},
        {name: 'Spain', code: 'ES'},
        {name: 'United States', code: 'US'}
    ];

    const countryTemplate = (option) => {
        return (
            <div className="country-item">
                <img alt={option.name} src="showcase/demo/images/flag_placeholder.png" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${option.code.toLowerCase()}`} />
                <div>{option.name}</div>
            </div>
        );
    }

    return (
        <div>
            <div className="card">
                <h5>Single</h5>
                <ListBox value={selectedCity} options={cities} onChange={(e) => setSelectedCity(e.value)} optionLabel="name" style={{width: '15rem'}} />

                <h5>Advanced with Templating, Filtering and Multiple Selection</h5>
                <ListBox value={selectedCountries} options={countries} onChange={(e) => setSelectedCountries(e.value)} multiple filter optionLabel="name"
                    itemTemplate={countryTemplate} style={{width: '15rem'}} listStyle={{maxHeight: '250px'}} />
            </div>
        </div>
    );
}
export default ListBoxDemo