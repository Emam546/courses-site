export function hasOwnProperty<K extends PropertyKey, T>(
  obj: unknown,
  key: K,
): obj is Record<K, T> {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
