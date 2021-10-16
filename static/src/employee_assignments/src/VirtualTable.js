import React from 'react'
import { Table, Spin } from 'antd';
import Rpc from "./service";
const rpc = new Rpc();
const dataSource = [

];

const Main = () => {
    const [data, setData] = React.useState([])
    React.useEffect(() => {
        let args = [{}];

        let params = {
          model: "hr.department",
          method: "get_virtual_departments",
          args: args,
          kwargs: {
          },
        };
        rpc.query(params).then((res) => {
            setData(res.result)
        });
    }, []);
    if (data.length > 0) {
        const columns = data.map(d => {
            return {
                title: d.name,
                key: d.id,
            }
        })
        return (
            <Table columns={columns} dataSource={dataSource} />
        )
    } else {
        return (
            <Spin />
        )
    }

}

export default Main
