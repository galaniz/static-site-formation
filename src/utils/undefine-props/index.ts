/**
 * Utils - undefine props
 */

/**
 * Function - set property in object or array of objects to undefined
 *
 * @param {object|object[]} obj
 * @param {string[]} props
 * @return {object|object[]}
 */

const undefineProps = (obj: FRM.AnyObject | FRM.AnyObject[], props: string[] = []): FRM.AnyObject | FRM.AnyObject[] => {
  if (typeof obj !== 'object' || obj === null || obj === undefined) {
    return obj
  }

  const isArr = Array.isArray(obj)

  let objArr = isArr ? obj : [obj]

  objArr = structuredClone(objArr)

  objArr.forEach((o: FRM.AnyObject) => {
    if (typeof o !== 'object' || o === null || o === undefined) {
      return
    }

    Object.keys(o).forEach((k) => {
      if (props.includes(k) && o[k] !== undefined) {
        o[k] = undefined
      }
    })
  })

  if (!isArr) {
    return objArr[0]
  }

  return objArr
}

/* Exports */

export default undefineProps
