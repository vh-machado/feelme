function formatEmojiEmotion(emotions) {
  const emotionEmojis = {
    'Alegria': '🤩',
    'Tristeza': '😢',
    'Raiva': '😡',
    'Medo': '😱',
    'Surpresa': '😲',
    'Nojo': '🤢',
    'Satisfação': '😊',
    'Ansiedade': '😰',
    'Decepção': '😞',
    'Dúvida': '🤔',
    'Frustração': '😣',
    'Vergonha': '😳',
    'Desespero': '😫',
    'Entusiasmo': '😃',
    'Alívio': '😌',
    'Desânimo': '😔',
    'Culpa': '😖',
    'Indiferença': '😐',
    'Inveja': '😒',
    'Luto': '😭'
  }

  const formattedEmotions = []

  for (const emotion of emotions) {
    formattedEmotions.push({ emoji: emotionEmojis[emotion], description: emotion })
  }

  return formattedEmotions
}

module.exports = { formatEmojiEmotion };
