/**
 * if param is not an array, it puts it in an array
 * @param thing the thing that is or will be an array
 */
const ensureArray = (thing: any) => (thing ? (Array.isArray(thing) ? thing : [thing]) : [])

/**
 * converts hex code to rgba
 * @param hex hex color code
 * @param alpha transparency
 */
const hex2rgba = (hex: string, alpha = 1) => {
  if (!hex) return hex

  const matched = hex.match(/\w\w/g)

  if (matched) {
    const [r, g, b] = matched.map((x) => parseInt(x!, 16))

    return `rgba(${r},${g},${b},${alpha})`
  }

  return hex
}

/**
 * Converts to lower case removes special chars + spaces and joins with hyphens
 * Converts for example: Filter title to id attribute
 *
 * @param title title to convert to id attribute
 */
const titleToId = (title: string) => {
  const clean = title.toLowerCase().match(/[a-zA-Z]+/g)

  if (clean && clean.length) return `${clean.join('-').trim()}`

  return ''
}

/**
 * Converts 'CapitalLetterDisplayName' to display with spaces
 * 'Capital Letter Display Name'
 * @param enumString CapitalLetterDisplayName
 */
const enumToDisplayName = (enumString: string) => {
  let displayString = enumString.replace(/([a-z])([A-Z])/g, '$1 $2')
  displayString = displayString.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')

  return displayString
}

export {ensureArray, hex2rgba, titleToId, enumToDisplayName}
