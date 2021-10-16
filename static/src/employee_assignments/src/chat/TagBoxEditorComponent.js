import React from 'react';
import TagBox from 'devextreme-react/tag-box';
import ArrayStore from 'devextreme/data/array_store';

const Main = (props) => {
    console.log('data', props)
    function onValueChanged(e) {
        setValue(e.value && e.value.length ? e.value : null);
    }
    const categories = value.selection.map(x => ({
        Id: x[0],
        Name: x[1],
    }))
   
    return (
        <TagBox           
            items={categories}
            valueExpr="Id"
            onValueChanged={onValueChanged}
            width="auto"
            displayExpr="Name"
        />
    );
}
export default Main
