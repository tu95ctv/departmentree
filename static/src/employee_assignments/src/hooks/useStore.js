import React, { useState } from 'react'
import useQuery from './useQuery'
import useMutate from './useMutate'
import CustomStore from 'devextreme/data/custom_store';
import useData from './useData'
import viMessages from 'devextreme/localization/messages/vi.json';
import { locale, loadMessages } from 'devextreme/localization';
import { XmlToJson } from './xml2json'
import { useId } from "react-id-generator";
import moment from 'moment'
window.groups = []
function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== '';
}
const mapping = {
    'and': '&',
    'or': '|',
    'contains': 'ilike',
    '&': '&',
    '|': '|',
    '<>': '!=',
}
function convertUnary(f) {
    const operator = f[0]
    const operand = mapEl(f[1])
    return [operator, ...convertAll(operand)]
}
function convertTernary(f) {
    let left = mapEl(f[0])
    const operator = f[1]
    let right = mapEl(f[2])
    return [mapping[operator], ...convertAll(left), ...convertAll(right)]
}
function isTernary(f) {
    const operator = f[1]
    return (operator === 'or' || operator === 'and' || operator === '&' || operator === '|')
}
function isUnary(f) {
    const operator = f[0]
    return operator === '!'
}

function mapEl(f) {
  return f.map(x => {    
    if (isNotEmpty(mapping[x])) {
      return mapping[x]
    } else {
      return x
    }    
  })
}

function transSubGroups(groups) {
  let result = []
  groups.forEach((m, idx) => {
    if (idx >= 1) {
      result.unshift('|')
    }
    result = [...result, ...m.__domain]
  })
  return result
}

function convertAll(f) {
  if (isUnary(f)) {
    return convertUnary(f)
  } else if (isTernary(f)) { 
    return convertTernary(f)      
  } else if (isNotEmpty(window.groups[f[0]])) {
    return transSubGroups(window.groups[f[0]])
  } else {
    return [mapEl(f)]
  }
}

const createStore = ({ groupQuery, query, insert, update, remove, data }) => {
    const [arch, fields, originFields] = data
    const modelName = arch.tree.string
    const customStore = new CustomStore({
      key: 'id',
      load: async (loadOptions) => {
        const {
          skip,
          take,
          sort,
          filter,
          group,
          groupSummary,
        } = loadOptions
        console.log('loadOptions', loadOptions)
        const limit = take
        const offset = skip
        
        let finalDomain = isNotEmpty(filter) ? convertAll(filter) : []
        
        let kwargs = {
          limit,
          offset,
        }
        if (isNotEmpty(group) && isNotEmpty(originFields)) {
          gSum = groupSummary ? groupSummary.map(g => g.selector) : []
          kwargs = {
            ...kwargs,
            domain: finalDomain,
            fields: groupSummary ? groupSummary.map(g => g.selector) : [],
            groupby: group.map(g => g.selector),
            lazy: true,
          }
          const len = group.length
          const firstGroup = group[len - 1].selector
          const data = await groupQuery(kwargs, finalDomain, group.map(t => {
            return {
              name: t.selector,
              asc: !t.desc
            }
          }))
          window.groups ||= {}
          if (originFields && originFields[firstGroup] 
            && (originFields[firstGroup].type === 'selection' 
            || originFields[firstGroup].type === 'date' 
            || originFields[firstGroup].type === 'datetime')) {
            window.groups[firstGroup] = data.groups
          }
          
          const isSelection = originFields[firstGroup].type === 'selection'
          const isMany2One = originFields[firstGroup].type === 'many2one'
          const isDateTime = originFields[firstGroup].type === 'datetime'
          const isDate = originFields[firstGroup].type === 'date'
          const tmp = data.groups.map(g => { 
            let key = g[firstGroup]
            if (isSelection) {
              lt =  originFields[firstGroup].selection.filter(a => a[0] === g[firstGroup])[0]
              key = lt ? lt[1] : false 
            }
            if (isMany2One) {
              key = g[firstGroup] ? g[firstGroup][1] : false
            }
            if (isDateTime) {
              key = g[firstGroup] ? (moment(g[firstGroup]).format('YYYY-MM-DD HH:mm')) : false
            }
            if (isDate) {
              key = g[firstGroup] ? (moment(g[firstGroup]).format('YYYY-MM-DD')) : false
            }
            let summary = [parseInt(g[`${firstGroup}_count`])]
            gSum.forEach(gs => {
              if (isNotEmpty(g[gs])) {
                summary.push(parseFloat(g[gs]))
              }
            })
            return {
              key,
              items: null,
              count: parseInt(g[`${firstGroup}_count`]),
              summary,
            }
          })         
          return {
            data: tmp,
            groupCount: data.length,
            totalCount: data.length,
          }
        } else {
          const data = await query(kwargs, finalDomain, sort ? sort.map(t => ({
            name: t.selector,
            asc: !t.desc
          })) : [])
          return {
            data: data.records,
            totalCount: data.length,
          }
        }
      },
      insert: (values) => insert([values]),
      update: (key, values) => update([key, values]),
      remove: (key) => remove([key])
    })
    return customStore
}
function initMessages() {
  loadMessages(viMessages);
}

const cellRender = (val) => (data) => {
  if (val.type === 'selection') {
    const tmp = val.selection.filter(i => i[0] === data.value)[0]
    return tmp ? tmp[1] : null
  } else if (val.type === 'many2one') {
    return data.value[1]    
  } else if (val.type === 'datetime') {
    return <span>{data.value && moment(data.value).format('YYYY-MM-DD HH:mm:ss')}</span>
  } else if (val.type === 'date') {
    return <span>{data.value && data.value && moment(data.value).format('YYYY-MM-DD')}</span>
  } else {
    return data.value
  }
}
const convertType = valType => {
  if (valType === 'char') {
    return 'string'
  } else {
    return valType
  }
}
const calculateFilterOperations = valType => {
  if (valType === 'datetime' || valType === 'date') {
    return ['=', '<=', '>=', '<', '>', '<>']
  } else if (valType === 'selection') {
    return ['anyof', '=']
  } else {
    return ['contains', '=', '<>']
  }
}

const convertFields = data => {
  const tmp = data.fields_views.list.fields
  const arch = new XmlToJson(data.fields_views.list.arch)
  let result = []
  for(let [key, val] of Object.entries(tmp)) {
    result.push({
      ...val,
      dataField: key,
      dataType: convertType(val.type),
      allowSorting: val.sortable,
      cellRender: cellRender(val),      
      filterOperations: calculateFilterOperations(val.type),
    })
  }
  return [arch, result, tmp]
}

const useStore = (model, domain = []) => {
    const [htmlId] = useId();
    const [views] = useData(`${model}.load_views`, [], { views: [[false, "list"]]})
    const query = useQuery(`${model}.search_read:/web/dataset/search_read`)
    const groupQuery = useQuery(`${model}.web_read_group`)
    const insert = useMutate(`${model}.create`)
    const update = useMutate(`${model}.write`)
    const remove = useMutate(`${model}.unlink`)
    const [arch, fields, originFields] = views?.fields_views ? convertFields(views) : []
    const store = arch ? createStore({ groupQuery, query, insert, update, remove, data: [arch, fields, originFields], domain, htmlId }) : null
    React.useEffect(() => {
      initMessages()
      locale('vi')
    }, [])
    
    return { 
      store,
      arch,
      fields,
      originFields,
    }
}
export default useStore
