import React from 'react'
import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Rpc from "./service";
import { list_to_tree } from './utils'
const rpc = new Rpc();
const Main = () => {
    const [data, setData] = React.useState([])
    React.useEffect(() => {
        let args = [{}];

        let params = {
        model: "todo.todo",
        method: "hello_world",
        args: args,
        kwargs: {
        },
        };
        rpc.query(params).then((res) => {
        console.log(list_to_tree(res.result));
        setData(list_to_tree(res.result))
        });
    }, []);
    const onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };
    
    return (
        <Tree
          showLine
          switcherIcon={<DownOutlined />}
          onSelect={onSelect}
          treeData={data}
        />
      );

}

export default Main

