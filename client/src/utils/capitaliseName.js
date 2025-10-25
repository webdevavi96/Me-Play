function capitalizeName(name) {
  if (!name) return "";
  return name
    .split(" ") // split by space
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize first letter
    .join(" "); // join back
}

export default capitalizeName
