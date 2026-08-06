// export function sortByField(array, field) {
//   if (!Array.isArray(array) || typeof field !== "string" || !field) {
//     return []
//   }

//   return [...array].sort((a, b) => {
//     const valueA = a[field]
//     const valueB = b[field]

//     if (typeof valueA === "string" && typeof valueB === "string") {
//       return valueA.localeCompare(valueB)
//     }

//     return valueB - valueA
//   })
// }

export function sortByField(array, field, order = "des") {

  return [...array].sort((a, b) => {
    const valueA = a[field]
    const valueB = b[field]

    // Handle strings
    if (typeof valueA === "string" && typeof valueB === "string") {
      return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    }

    // Handle numbers, booleans, dates, etc.
    if (valueA < valueB) return order === "asc" ? -1 : 1
    if (valueA > valueB) return order === "asc" ? 1 : -1

    return 0
  })
}
