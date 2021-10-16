import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import useData from './hooks/useData'
import { list_to_tree } from './utils'
const calculateHeader = (data, level = 1) => {
    return 1
}
const calculateData = (vde) => {
    let result = []
    for (const [key, value] of Object.entries(vde)) {
        let tmp = { ban_id: key }
        for (const [key2, value2] of Object.entries(value)) {
            if (value2) {
                tmp[key2] = value2                
            }
        }
        result.push(tmp)
    }
    return result
}
const DataTableColGroupDemo = () => {
    const data = useData('todo.todo.hello_world')
    const virtual_departments = useData('hr.department.get_virtual_departments')
    const vde = useData('hr.department.get_virtual_departments_with_employees')
    const isLoading = !data || !virtual_departments || !vde
    if (isLoading) {
        return <div>...loading</div>
    }
    const sales = [
        {product: 'Bamboo Watch', lastYearSale: 51, thisYearSale: 40, lastYearProfit: 54406, thisYearProfit: 43342},
        {product: 'Black Watch', lastYearSale: 83, thisYearSale: 9, lastYearProfit: 423132, thisYearProfit: 312122},
        {product: 'Blue Band', lastYearSale: 38, thisYearSale: 5, lastYearProfit: 12321, thisYearProfit: 8500},
        {product: 'Blue T-Shirt', lastYearSale: 49, thisYearSale: 22, lastYearProfit: 745232, thisYearProfit: 65323},
        {product: 'Brown Purse', lastYearSale: 17, thisYearSale: 79, lastYearProfit: 643242, thisYearProfit: 500332},
        {product: 'Chakra Bracelet', lastYearSale: 52, thisYearSale:  65, lastYearProfit: 421132, thisYearProfit: 150005},
        {product: 'Galaxy Earrings', lastYearSale: 82, thisYearSale: 12, lastYearProfit: 131211, thisYearProfit: 100214},
        {product: 'Game Controller', lastYearSale: 44, thisYearSale: 45, lastYearProfit: 66442, thisYearProfit: 53322},
        {product: 'Gaming Set', lastYearSale: 90, thisYearSale: 56, lastYearProfit: 765442, thisYearProfit: 296232},
        {product: 'Gold Phone Case', lastYearSale: 75, thisYearSale: 54, lastYearProfit: 21212, thisYearProfit: 12533}
    ];

    const lastYearSaleBodyTemplate = (rowData) => {
        return `${rowData.lastYearSale}%`;
    }

    const thisYearSaleBodyTemplate = (rowData) => {
        return `${rowData.thisYearSale}%`;
    }

    const lastYearProfitBodyTemplate = (rowData) => {
        return <div onClick={() => console.log(rowData)}>{formatCurrency(rowData.lastYearProfit)}</div>;
    }

    const thisYearProfitBodyTemplate = (rowData) => {
        return `${formatCurrency(rowData.thisYearProfit)}`;
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    }

    const lastYearTotal = () => {
        let total = 0;
        for(let sale of sales) {
            total += sale.lastYearProfit;
        }

        return formatCurrency(total);
    }

    const thisYearTotal = () => {
        let total = 0;
        for(let sale of sales) {
            total += sale.thisYearProfit;
        }

        return formatCurrency(total);
    }
    let headerGroup = <ColumnGroup key="group1">
                        <Row>
                            <Column header="Ban" rowSpan={4} />
                            <Column header="Sale Rate" colSpan={1} />
                        </Row>
                        <Row>
                            <Column header="Sale Rate" colSpan={1} />
                            <Column header="Sales" colSpan={1}  />
                            <Column header="Profits" colSpan={1}  />
                        </Row>
                        <Row>
                            <Column header="Sale Rate" colSpan={1}/>
                            <Column header="Sales" colSpan={1} />
                            <Column header="Profits" colSpan={1} />
                        </Row>
                        <Row>
                            <Column header="Sale Rate" colSpan={1} />
                            <Column header="Sales" colSpan={1} />
                            <Column header="Profits" colSpan={1} />
                            <Column header="Last Year" sortable field="lastYearSale"/>
                            <Column header="This Year" sortable field="thisYearSale"/>
                            <Column header="Last Year" sortable field="lastYearProfit"/>
                            <Column header="This Year" sortable field="thisYearProfit"/>
                        </Row>
                    </ColumnGroup>;

    let footerGroup = <ColumnGroup>
                        <Row>
                            <Column footer="Totals:" colSpan={3} footerStyle={{textAlign: 'right'}}/>
                            <Column footer={lastYearTotal} />
                            <Column footer={thisYearTotal} />
                        </Row>
                        </ColumnGroup>;
    return (
        <div>
            {<div>{JSON.stringify(data, null, 2)}</div>}
            {<div>{JSON.stringify(virtual_departments, null, 2)}</div>}
            {<div>{JSON.stringify(calculateData(vde), null, 2)}</div>}
            <div className="card">
                <DataTable value={sales} headerColumnGroup={headerGroup} footerColumnGroup={footerGroup}>
                    <Column field="product" />
                    <Column field="lastYearSale" body={lastYearSaleBodyTemplate} />
                    <Column field="thisYearSale" body={thisYearSaleBodyTemplate} />
                    <Column field="lastYearProfit" body={lastYearProfitBodyTemplate} />
                    <Column field="thisYearProfit" body={thisYearProfitBodyTemplate} />
                </DataTable>
            </div>
        </div>
    );
}

export default DataTableColGroupDemo
