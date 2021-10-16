import React from 'react'
import LineTo from 'react-lineto';

const Main = () => {
    return (
        <div>
            <div className="A">Element A</div>
            <div className="B">Element B</div>
            <LineTo from="A" to="B" />
        </div>
    )
}
export default Main

