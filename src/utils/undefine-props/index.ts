/**
 * Utils - undefine props
 */

/**
 * Function - set property in object or array of objects to undefined
 *
 * @param {object|array<object>} obj
 * @param {array<string>} props
 * @return {object|array<object>}
 */

const undefineProps = (obj: object | object[], props: string[] = []): object | object[] => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  const isArr = Array.isArray(obj)

  let objArr = isArr ? obj : [obj]

  objArr = structuredClone(objArr)

  objArr.forEach((o: object) => {
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
