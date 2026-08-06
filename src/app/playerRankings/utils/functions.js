export function sortByField(array, field) {
  if (!Array.isArray(array) || typeof field !== "string" || !field) {
    return []
  }

  return [...array].sort((a, b) => {
    const valueA = a[field]
    const valueB = b[field]

    if (typeof valueA === "string" && typeof valueB === "string") {
      return valueA.localeCompare(valueB)
    }

    return valueB - valueA
  })
}
