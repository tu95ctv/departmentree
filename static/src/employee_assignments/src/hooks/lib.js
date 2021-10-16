const mapping = {
    'and': '&',
    'or': '|',
    'contains': 'ilike'
  }
  const convert = (f) => {
    const operator = f[1]
    const xx = operator === 'or' || operator === 'and'
    if (!xx) {
      return [f.map(x => {
        if (mapping[x]) {
          return mapping[x]
        } else {
          return x
        }
      })]
    } else {
      let left = f[0]
      let right = f[2]
      return [mapping[operator], ...convert(left), ...convert(right)]
    }
}
export default convert
