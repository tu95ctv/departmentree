import React from 'react';
import 'devextreme/data/odata/store';
import DataGrid, { ColumnChooser, ColumnFixing, FilterPanel, FilterBuilderPopup, Column, Paging, Pager, Editing, SearchPanel, Scrolling, Summary, GroupItem, RemoteOperations, Grouping, GroupPanel, } from 'devextreme-react/data-grid';
import useStore from '../hooks/useStore'

const dataGridRef = React.createRef();
const fields = [{
  dataField: "name",
  dataType: "string",
  fixed: true,
}, {
  dataField: "priority",
  dataType: "number"
}, {
  dataField: "kanban_state",
  dataType: "string"
}]
const columns = fields.map(t => {
  return (
    <Column
      key={t.dataField}
      dataField={t.dataField}
      dataType={t.dataType}
      fixed={Boolean(t.fixed)}
    />
  )
})
const App = ({ model = 'todo.todo', heading = 'Todo' }) => {
  const store = useStore(model)

  const filterBuilderPopupPosition = {
    of: window,
    at: 'top',
    my: 'top',
    offset: { y: 10 }
  };
  const filterBuilder = {
    allowHierarchicalFields: true
  };
  return (
    <DataGrid
        ref={dataGridRef}
        dataSource={store}
        repaintChangesOnly={true}
        showBorders={true}
        wordWrapEnabled={true}
        filterBuilder={filterBuilder}
        allowColumnResizing={true}
        columnResizingMode={'widget'}
        allowColumnReordering={true}
        showColumnLines={true}
        showRowLines={true}
        showBorders={true}
        rowAlternationEnabled={true}
    >
        <ColumnChooser enabled={true} />
        <ColumnFixing enabled={true} />
        <RemoteOperations groupPaging={true} />
        <SearchPanel visible={true} />
        <Grouping autoExpandAll={false} />
        <GroupPanel visible={true} />
        <FilterPanel visible={true} />
        <FilterBuilderPopup position={filterBuilderPopupPosition} />
        <Scrolling mode="virtual" rowRenderingMode="virtual" />
        <Editing
        mode="form"
        allowUpdating={true}
        allowAdding={true}
        allowDeleting={true}
        />
        {columns}
        <Paging defaultPageSize={80} />
        <Pager
        showPageSizeSelector={true}
        allowedPageSizes={[80, 120, 240]}
        />
        <Summary>
        <GroupItem
        column="id"
        summaryType="count" />
        </Summary>
    </DataGrid>
  );
}

export default App;
