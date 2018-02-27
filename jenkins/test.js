

console.log('\n\n\n ENV VARS:\n\n')
console.log(`${
  Object.entries(process.env).map(([key, value]) => {
    return `${key} :  ${value}`
  }).join('\n')
}`)