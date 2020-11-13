export const numToDateStr = (n: number): string => {
  const str = `${n}`

  switch (str.charAt(str.length - 1)) {
    case '1':
      return `${str}st`
    case '2':
      return `${str}nd`
    case '3':
      return `${str}rd`
    default:
      return `${str}th`
  }
}