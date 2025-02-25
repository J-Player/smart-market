import fs from "fs"

export const saveObjectToJsonFile = (data: any, path: string): void => {
  const stringifiedData = JSON.stringify(data, null, 2)
  fs.writeFileSync(path, stringifiedData)
}
export const writeTextFile = (text: string, path: string): void => fs.writeFileSync(path, text)
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))
export const equalsIgnoreCase = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()
export const xpath = (selector: string) => `::-p-xpath(${selector})`
export const parseNumber = (str: string) => Number(str.replace(',', '.'))
export const normalize = (str: string) => str.normalize("NFD").replace(/\p{M}/gu, "");
export const formatarString = (str: string) => str.replace(/\s+/g, " ").trim()