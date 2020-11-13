const ADDRESS_REGEX = /erd[A-Za-z0-9]{59}/

export const isValidAddress = (addr: string): boolean => !!ADDRESS_REGEX.exec(addr)
