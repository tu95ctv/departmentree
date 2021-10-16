import React from 'react';
import 'devextreme/data/odata/store';
import DataGrid, { ColumnChooser, ColumnFixing, FilterPanel, FilterBuilderPopup, Column, Paging, Pager, SearchPanel, Scrolling, Summary, GroupItem, RemoteOperations, Grouping, GroupPanel, } from 'devextreme-react/data-grid';
import useStore from '../hooks/useStore'
import useCloseModal from '../hooks/useCloseModal'
import './App.css'
function calculateFilterExpression(filterValue, field) {
  return filterValue && filterValue.length
    && Array.prototype.concat.apply([], filterValue.map(function(value) {
      return [[field.dataField, '=', value], 'or'];
    })).slice(0, -1);
}
const customOperations = [{
  name: "anyof",
  caption: "Is any of",
  icon: "check",
  calculateFilterExpression,
}]



const App = ({ modelName = 'hr.contract' }) => {
  const dataGridRef = React.createRef();
  const { fields, store, arch } = useStore(modelName)
  
  const refresh = () => {
    if (dataGridRef.current && dataGridRef.current.instance) {
      dataGridRef.current.instance.refresh()
    }
  }
  useCloseModal(refresh)
  const columns = fields ? fields.map(t => {
    return (
      <Column
        key={t.dataField}
        dataField={t.dataField}
        dataType={t.dataType}
        fixed={Boolean(t.fixed)}
        caption={t.string}
        cellRender={t.cellRender}
        allowSorting={t.sortable}
      />
    )
  }) : []
  let groupItems = fields ? fields.filter(t => {
    return t.group_operator === 'sum'
  }).map(t => {
    return (
        <GroupItem
          key={t.dataField}
          column={t.dataField}
          summaryType={t.group_operator}
          displayFormat="Total: {0}"
          showInGroupFooter={true}
          alignByColumn={true} />
    )
  }) : []
  groupItems = [
    <GroupItem
      key={'id'}
      column={'id'}
      summaryType="count"
      alignByColumn={true} 
      displayFormat="{0}"
    />
    ,
    ...groupItems
  ]
  const filterBuilderPopupPosition = {
    of: window,
    at: 'top',
    my: 'top',
    offset: { y: 10 }
  };
  const filterBuilder = {
    allowHierarchicalFields: true,
    fields,
    customOperations
  };
  const onSelectionChanged = (vals) => {
    console.log('vals', vals)
  }
  const onFocusedRowChanged = ({ row }) => {
    console.log('row', row)
  }
  const onRowDblClick = (e) => {
    if (window.action_manager) {
      const action = {
        "type": "ir.actions.act_window", 
        "context": {form_view_initial_mode: 'readonly'}, 
        "name": `${e.data.name}`, 
        "flags": {}, 
        "target": "new", 
        "res_id": e.data.id,
        "res_model": modelName, 
        "views": [[false, 'form']], 
        "view_mode": "form"
      }
      window.action_manager.do_action(action);
    }
  }

  const newContract = () => {
    if (window.action_manager) {
      const action = {
        "type": "ir.actions.act_window", 
        "context": {form_view_initial_mode: 'readonly'}, 
        "name": `New contract`, 
        "flags": {}, 
        "target": "new", 
        "res_model": modelName, 
        "views": [[false, 'form']], 
        "view_mode": "form"
      }
      window.action_manager.do_action(action);
    }
  }
  const heading = arch && arch.tree.string
  return (
    <div id="abc">
      <h1>{heading}</h1>
      <button onClick={refresh}>Refresh</button>
      <button onClick={newContract}>New {heading}</button>
      <div>
        <DataGrid
          ref={dataGridRef}
          filterBuilder={filterBuilder}
          dataSource={store}
          repaintChangesOnly={true}
          showBorders={true}
          wordWrapEnabled={true}
          allowColumnResizing={true}
          columnResizingMode={'nextColumn'}
          allowColumnReordering={true}
          showColumnLines={true}
          showRowLines={true}
          showBorders={true}
          rowAlternationEnabled={true}
          selection={{ mode: 'multiple' }}
          onSelectionChanged={onSelectionChanged}
          onFocusedRowChanged={onFocusedRowChanged}
          focusedRowEnabled={true}
          onRowDblClick={onRowDblClick}
        >
          <ColumnChooser enabled={true} />
          <ColumnFixing enabled={true} />
          <RemoteOperations groupPaging={true} />
          <SearchPanel visible={true} />
          <Grouping autoExpandAll={false} contextMenuEnabled={true} />
          <GroupPanel visible={true} />
          <FilterPanel visible={true} />
          <FilterBuilderPopup position={filterBuilderPopupPosition} />
          <Scrolling mode="virtual" rowRenderingMode="virtual" />
          {columns}
          <Paging defaultPageSize={80} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[80, 120, 240]}
          />
          <Summary>
          {groupItems}
          </Summary>
        </DataGrid>
      </div>
    </div>
  )
}

export default App;
