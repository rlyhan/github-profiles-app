export const sortByKey = (obj, property) => {
  return obj.sort((a, b) => {
    return (
      parseInt(b[property]) > parseInt(a[property])) ? 1 : (
        (parseInt(b[property]) < parseInt(a[property])) ? -1 : 0)
  })
}
