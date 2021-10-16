import React from "react";
import { useOdooContext } from './contexts/odoo'
import TreeTable from './TreeTable'
import OrgChart from './OrgChart'
import Grantt from './Grantt'
import Rtc from './chat/App'
/*
const TreeTable = React.lazy(() => import('./TreeTable'))
const OrgChart = React.lazy(() => import('./OrgChart'))
const Grantt = React.lazy(() => import('./Grantt'))
*/
const App = (props) => {    
    const { odoo_params } = useOdooContext()
    const { name } = odoo_params || { name: 'employee_assignments' }
    const [data, setData] = React.useState(null)
    React.useEffect(() => {
      try {
        const ws = new WebSocket("ws://localhost:3000/");
        ws.onmessage = ({data}) => {
          setData(data)
        }
      } catch(err) {
        console.log(err);
      }
    }, [])
    return (
        <div>
          <If condition={name === 'employee_assignments'}>
            <TreeTable {...props} />
          </If>
          <If condition={name === 'org_chart'}>
            <OrgChart {...props} />
          </If>
          <If condition={name === 'grantt'}>
            <Grantt {...props} />
          </If>
          <If condition={name === 'rtc'}>
            <Rtc modelName="hr.employee" {...props} />
          </If>
        </div>
    );
};

export default App;
