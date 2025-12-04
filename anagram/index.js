let words = ['kita', 'atik', 'tika', 'aku', 'kia', 'makan', 'kua']

const groupedAnagrams = words => {
  let grouped = {}

  for (let i = 0; i < words.length; i++) {
    let word = words[i]

    let freq = new Array(26).fill(0)
    for (let j = 0; j < word.length; j++) {
      let charCode = word.charCodeAt(j) - 97
      freq[charCode]++
    }

    let key = freq.join(',')
    if (grouped[key] === undefined) {
      grouped[key] = [word]
    } else {
      grouped[key].push(word)
    }
  }

  let result = []
  for (let k in grouped) {
    result.push(grouped[k])
  }
  return result
}

console.log(groupedAnagrams(words))
