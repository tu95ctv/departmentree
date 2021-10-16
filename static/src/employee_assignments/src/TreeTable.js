import React, { useState } from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import useData from "./hooks/useData";
import AutoComplete from "./AutoComplete";
import { OverlayPanel } from "primereact/overlaypanel";
import SearchFilter from "./SearchFilter";
import { Button } from "primereact/button";
import useMutate from "./hooks/useMutate";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { useOdooContext } from "./contexts/odoo";
import CacheProvider, { useCacheContext } from "./contexts/cache";
import { ScrollPanel } from "primereact/scrollpanel";
import ReactTooltip from "react-tooltip";
import { ProgressSpinner } from 'primereact/progressspinner';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import phong_line_first_url from './phong_line_first.png'
import phong_line_last_url from './phong_line_last.png'
import middle_line_url from './header_middel_line.png'
import phong_line_middle_url from './phong_line1.png'
import { Fragment } from "react";

const rootUrl = `/department_matrix/static/src/employee_assignments/dist`
const common = {
  backgroundSize: '100% 100%',
  height: '100px',
  marginBottom: '0px',
  paddingBottom: '0px',
  border: 'none'
}
const ban_box = it => {
  if (!it.no_name){
    return (<div className="ban_box">{it.title} {it.path}</div>)
  }
  else
      {
      return (<div className="ban_box"></div>)
      }
      

}
const calculateHeaderGroup = (val) => {
  console.log('***ban items ndt***', val)
  const tmp = val.sort((a, b) => a.level - b.level)

  const levels = {}
  tmp.forEach((item) => {
    levels[item.level] ||= []
    // levels[item.level][item.parent_id || 'root'] ||= []
    levels[item.level].push(item)
  })

  

  console.log('levels', levels)
  let result = []
  
  Object.keys(levels).forEach(lvl2 => {
      const t = levels[lvl2].map((it, idx) => {
        let header1 = null
        if (!it.no_name){
           header1 = (<div className="ban_box">{it.title} {it.path}</div>)
        }
        else
            {
             header1 =  null
            }
      
        // let header1 =   (<div className="ban_box">{it.title} {it.path}</div>) 
       
        return (<Column key={`lvl_${lvl2}_${idx}`} header={header1}  colSpan={it.colSpan}  className={it.bg_class}/>)
        
     
       
      } 
    )
    result.push(
      <Row key={`row_${lvl2}`}>
        {t}
      </Row>
    )
  })
  
  return (
    <ColumnGroup>
      <Row key={`row_0`}>
        <Column rowSpan={5} style={{...common }}></Column>
      </Row>
      {result}
    </ColumnGroup>
  );
}

const searchTypes = [
  { searchType: "employee", label: "Employee" },
];

function convertNode(node, vde) {
  if (vde[node.id] && vde[node.id] !== "undefined") {
    const tmp = vde[String(node.id)];
    let data = { name: node.title };
    for (const [key, value] of Object.entries(tmp)) {
      data[key] = value ? value : "";
    }
    return {
      children: node.children,
      data,
      key: String(node.id),
    };
  } else {
    return {
      children: node.children,
      data: { name: node.title },
      key: String(node.id),
    };
  }
}
export function list_to_tree_ban(list, handler = x => x) {
  var map = {},
    node,
    roots = [],
    i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i; // initialize the map
    list[i].children = []; // initialize the children
    list[i].leaf = true;
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parent_id) {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node.parent_id]].children.push(handler(node));
      list[map[node.parent_id]].leaf = false;
    } else {
      roots.push(handler(node));
    }
  }
  return roots;
}
export function list_to_tree(list, vde) {
  var map = {},
    node,
    roots = [],
    i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i; // initialize the map
    list[i].children = []; // initialize the children
    list[i].leaf = true;
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parent_id) {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node.parent_id]].children.push(convertNode(node, vde));
      list[map[node.parent_id]].leaf = false;
    } else {
      roots.push(convertNode(node, vde));
    }
  }
  return roots;
}

const Cell2 = (props) => {
  const { node, phong_id, ban_id, search, employee_show } = props;
  const { mini_dep_form_id_n } = useCacheContext();
  const show_em = (dep_id, mini_dep_form_id_n) => (e) => {
    e.preventDefault();
    res_id = parseInt(dep_id);
    res_id = res_id ? res_id : false;
    if (window.action_manager) {
      console.log("dep_id", dep_id);
      action = {
        type: "ir.actions.act_window",
        name: "All Emps in this Des and Ban",
        flags: {},
        target: "new",
        res_model: "hr.department",
        views: [[mini_dep_form_id_n, "form"]],
        view_mode: "form",
        context: { ban_id: parseInt(ban_id) },
      };
      if (res_id) {
        action["res_id"] = res_id;
      } else {
      }
      window.action_manager.do_action(action);
    }
  };

  return node ? (
    <Cell
      employee_show = {employee_show}
      node={node.data[ban_id]}
      phong_id={phong_id}
      ban_id={ban_id}
      search={search}
    />
  ) : null;
};


const Cell = ({ node, employee_show, ...rest }) => {
  const { phong_id, ban_id } = rest;
  const mutate1 = useMutate("hr.employee.write");
  const [employees, setEmployees] = React.useState(node || []);

  const toggle = (e, isDrop = false) => {
    if (op.current) {
        op.current.toggle(e)
        op.current.transformOrigin = 'unset !important'
        op.current.top = 'unset !important'
        if (!isDrop) {
            setEmployees(node || [])
        }
    }
  }

  const op = React.useRef(null);
  const onDrop = async (ev) => {
    let id = ev.dataTransfer.getData("id");
    const newArr = JSON.parse(id);
    if (newArr) {
      const vals = [
        [newArr.id],
        {
          department_id: parseInt(phong_id),
          virtual_department_id: parseInt(ban_id),
        },
      ];
      await mutate1(vals);
    }
  };
  const onDragOver = (ev) => {
    ev.preventDefault();
  };

  const closeOverlay = () => {
    if (op.current) {
      op.current.hide();
    }
  };

  employee_show = employee_show ? employee_show : <div className="child" ><p className="ndt_plus">+</p></div>
  return (
    <div onDrop={onDrop} onDragOver={onDragOver}>
      {phong_id}_{ban_id}
      <div onClick={toggle}>{employee_show}</div>
        
        <OverlayPanel ref={el => op.current = el} showCloseIcon  id="overlay_panel" style={{ width: '80%' }}>
            <AutoComplete node={employees} closeOverlay={closeOverlay} {...rest} />
        </OverlayPanel>
    </div>
)
};

const useCloseModal = () => {
  const { odoo_params } = useOdooContext();
  const { refresh } = useCacheContext();
  React.useEffect(() => {
    if (window.odoo_Dialog) {
      window.odoo_Dialog.include({
        destroy: function (options) {
          if (odoo_params.name === "employee_assignments") {
            refresh();
          }
        },
      });
    }
  }, []);
};
const calculateExpandedKeys = (search, data, vde) => {
  if (search.length === 0 || !data) {
    return {};
  } else {
    if (search[0] && search[0].department) {
      return data.reduce((pr, cu) => {
        return {
          ...pr,
          [cu.id]: true,
        };
      }, {});
    }

    return Object.keys(vde).reduce((prev, cur) => {
      const item = data.filter((d) => d.id === parseInt(cur))[0];
      const firstPath = item?.path.split(",");
      if (firstPath) {
        const tmp = firstPath.reduce((pr, c) => {
          return {
            ...pr,
            [parseInt(c)]: true,
          };
        }, {});
        return {
          ...prev,
          ...tmp,
        };
      } else {
        return prev;
      }
    }, {});
  }
};
const calculateFullExpandedKeys = (search, data) => {
  if (search === [] || !data) {
    return {};
  } else {
    return data.reduce((prev, cur) => {
      return {
        ...prev,
        [cur.id]: true,
      };
    }, {});
  }
};

const add_department = ({ is_ban }) => () => {
  let context = {}
  if (window.action_manager) {
    if (is_ban) {
      context = { default_is_virtual: true };
    }

    const action = {
      type: "ir.actions.act_window",
      name: "Add department",
      context,
      flags: {},
      target: "new",
      res_model: "hr.department",
      views: [[false, "form"]],
      view_mode: "form",
    };
    window.action_manager.do_action(action);
  }
};

const employeeTemplate = (option) => {
  const onDragStart = (ev, id) => {
    ev.dataTransfer.setData("id", JSON.stringify(id, null, 2));
  };
  const onDragOver = (ev) => {
    ev.preventDefault();
  };
  const employee_form_action = (option) => () => {
    if (window.action_manager) {
      const action = {
        type: "ir.actions.act_window",
        context: { form_view_initial_mode: "readonly" },
        name: `${option.employee_name}`,
        flags: {},
        target: "new",
        res_id: option.id,
        res_model: "hr.employee",
        views: [[false, "form"]],
        view_mode: "form",
      };
      window.action_manager.do_action(action);
    }
  };
  
  return (
    <div onDragStart={(e) => onDragStart(e, option)} onDragOver={onDragOver} data-tip data-for={`happyFace-${option.id}`}>
      {/* getContent={() =>option.employee_name} */}
        <ReactTooltip id={`happyFace-${option.id}`} type='warning' >
        {option.employee_name}
      </ReactTooltip>
      

      <div className="child" onDoubleClick={employee_form_action(option)}>
        <img  className="ndt_cell_image" src={`/web/image/hr.employee/${option.id}/image_1920`}  style={{width:"40px", height:"40px", border_radius: '50%'}}/>
        
        </div>
    </div>
  );
};

const View = (props) => {
  const {
    search,
    setSearch,
    selectedCountries,
    setSelectedCountries,
    data1,
    virtual_departments,
    vde,
    bans,
  } = props;
  useCloseModal();

  const init = React.useMemo(() => {
    if (search.length === 0) {
      return {};
    } else {
      return calculateExpandedKeys(search, data1, vde);
    }
  }, [search]);
  const [expandedKeys, setExpandedKeys] = useState(init);

  const onSearch = () => {
    if (search) {
      setExpandedKeys(calculateExpandedKeys(search, data1, vde));
    } else {
      setExpandedKeys({});
    }
  };

  const onToggle = (e) => {
    setExpandedKeys(e.value);
  };

  const toggleApplications = () => {
    if (Object.keys(expandedKeys).length > 0) {
      setExpandedKeys({});
    } else {
      setExpandedKeys(calculateFullExpandedKeys(search, data1));
    }
  };

  const setSearch1 = (s) => {
    setSearch(s);
    toggleApplications();
  };

  const body = (ban_id) => (node) => {
    const employee_data = node.data && node.data[ban_id] ? node.data[ban_id] : null;
    const employee_show = employee_data
      ? employee_data.map((n) => <Fragment key={`ed_${n.id}`}>{employeeTemplate(n)}</Fragment>)
      : null;
    const phong_id = node.key;
    return (
      <Cell2 node={node} phong_id={phong_id} ban_id={ban_id} search={search} employee_show={employee_show} />
    );
  };

  const body_phong =(node) =>{
    console.log('node ở body_phong',node)
    let ten_phong = node.data.name
    
    return (
      <div className="phong_box">
        <p>{ten_phong}-{node.key}</p>
      </div>
    )
  }

  const columns1 = Object.entries(virtual_departments).map((x) => {
    let [key, value] = x;
    value = value + '1'
    const fc = body(key)
    return (
      <Column
        key={`vt-${key}`}
        body={fc}
        field={String(key)}
        style={{
          textAlign: "left",
          height: "3.5em",
          borderBottom: "thin solid #A9A9A9",
        }}
      ></Column>
    );
  });
  const columns = [
    <Column
      key="name"
      field="name"
      body={body_phong}
      header="Phòng/ban"
      expander
      style={{ textAlign: "left", border: "thin solid #A9A9A9" }}
    />,
    ...columns1,
  ];
  const value = list_to_tree(data1, vde);
  
  return (
    <div className="p-grid p-dir-col">
      <div className="p-col">
        <div className="p-grid">
          <div className="p-col-12">
            <SearchFilter
              setSearch={setSearch1}
              data={searchTypes}
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
            />
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-12">
            <Button onClick={onSearch} label="Search" />
            &nbsp;
            <Button onClick={toggleApplications} label="Toggle Applications" />
          </div>
        </div>
      </div>
      <div className="p-col">
        <Button onClick={add_department({ is_ban: false })}>
          Add department
        </Button>{" "}
        &nbsp;
        <Button onClick={add_department({ is_ban: true })}>
          Add virtual Department{" "}
        </Button>
      </div>

      <div className="p-col">
        <TreeTable
          headerColumnGroup={calculateHeaderGroup(bans)}
          value={value}
          reorderableColumns
          expandedKeys={expandedKeys}
          onToggle={onToggle}
        >
          {columns}
        </TreeTable>
      </div>
    </div>
  );
};

const TreeTableEditDemo = (props) => {
  const { mini_dep_form_id_n, data1, bans, virtual_departments } = props;
  const [search, setSearch] = useStateWithCallbackLazy([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  
  const [vde, key3] = useData("hr.department.get_virtual_departments_with_employees", search);
  
  const isLoading = !data1 || !vde || !bans;
  if (isLoading) {
    return <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s"/>
  }

  const cacheKeys = { key3 };
  return (
    <CacheProvider value={{ cacheKeys, mini_dep_form_id_n }}>
      <ScrollPanel style={{ width: "100%", height: "1000px" }}>
        <View
          search={search}
          setSearch={setSearch}
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          data1={data1}
          bans={bans}
          virtual_departments={virtual_departments}
          vde={vde}
        />
      </ScrollPanel>
    </CacheProvider>
  );
};
const treeTraverse = (tree, handler1) => {
  tree.forEach(item => {    
    treeTraverse(item.children, handler1)
    handler1(item)
  })
}

// treeTraverse2 là hàm thực hiện hàm handler1 trước rồi mới tới treeTraverse sau
const treeTraverse2 = (tree, handler1) => {
  tree.forEach(item => {    
    handler1(item)
    treeTraverse2(item.children, handler1)
  })
}


const treeReduce = (tree, reducer) => {
  tree.forEach(item => {
    reducer.push(item)
    treeReduce(item.children, reducer)
  })
}
const ParentTree = (props) => {
  const mini_dep_form_id = useData("ir.model.data.xmlid_to_res_id", {
    args: ["department_matrix.hr_department_form_inherit_mini"]
    
  });
  const [data1] = useData("hr.department.get_department_tree", {});
  const [bans] = useData("hr.department.get_virtual_departments_tree", {});
  const [bans_groups] = useData('hr.department.web_read_group', {
    args: [
      [['is_virtual','=', true]],
      ['parent_id'],
      ['parent_id']
    ]
  })
  //mini_dep_form_id_n = parseInt(mini_dep_form_id)
  // console.log('mini_dep_form_id_n 1***', mini_dep_form_id_n)

  const isLoading = !mini_dep_form_id || !data1 || !bans || !bans_groups;
  if (isLoading) {
    return <div>...loading</div>;
  }
  const { groups } = bans_groups
  const bg = groups.reduce((prev, cur) => {
    if (cur['parent_id'][0]) {
      return {
        ...prev,
        [cur['parent_id'][0]]: cur['parent_id_count']
      }
    } else {
      return {
        ...prev,
      }
    }
  }, [])
  const bans_with_children_count = bans.map((b) => {
    const children_count = bg[b.id] ? bg[b.id] : 0
      return {
        ...b,
        children_count,
      }
  })
  const test = list_to_tree_ban(bans_with_children_count)  

  let max_level = 0 
  treeTraverse(test, item => {
      if (item.level > max_level){
        max_level = item.level
      }
    }
  )

  console.log('*******8max_level****', max_level)
  
  treeTraverse2(test, item=>{
    if (item.children.length ==0 && item.level <  max_level){
        let new_item = {...item}
        new_item.level +=1
        new_item.no_name = true
        // if (item.level ==  max_level ){
        //   new_item.children_count = 0
        // }else {
        //   new_item.children_count = 1
        //   }
        item.children = [new_item]
      }
    }
  )

  
  console.log ('****test1234***', test)

  let acc = []
  treeTraverse(test, item => {
    if (item.level==0){
      item.bg_class = 'middle_line'

    }
    let children = item.children
    if (children.length ===0) {
      item.colSpan = 1
    } else {
      item.colSpan = item.children.reduce((p, c) => p + c.colSpan, 0)
      
      if (children.length ===1){
        children[0].bg_class = 'middle_line'

      }
      else if (children.length > 1){
        children[0].bg_class = 'phong_line_first'
        children[children.length-1].bg_class = 'phong_line_last'
        let i = 1
        for(i=1; i<children.length -1; i++){
          children[i].bg_class = 'phong_line_middle'
        }
      }
      
      
    }
  })
  
  treeReduce(test, acc)
  
  const virtual_departments = bans_with_children_count.filter(b => b.children_count === 0).reduce((prev, cur) => {
    return {
      ...prev,
      [cur.id]: cur.name
    }
  }, {})
  
  
  return (
    <TreeTableEditDemo
      mini_dep_form_id_n={parseInt(mini_dep_form_id)}
      data1={data1}
      bans={acc}
      virtual_departments={virtual_departments}
      {...props}
    />
  );
};

export default ParentTree;