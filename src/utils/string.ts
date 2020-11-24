export const isJson = (str: any): boolean => {
  try {
    const obj = JSON.parse(str)
    return (obj instanceof Object)
  } catch (err) {
    return false
  }
}


