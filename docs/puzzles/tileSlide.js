// puzzles/tileSlide.js
//
// The azulejo tile-sliding puzzle (design doc: "Lisbon — the tile-map
// puzzle"). Pure logic, no DOM/canvas — a classic n-puzzle. Shuffled by
// random walk from the solved state, which guarantees solvability by
// construction (no parity-checking needed, no dead end possible).

export function createTileSlidePuzzle(size = 3, shuffleSteps = 120) {
  const n = size * size;
  // Solved state: cell i holds value (i+1) % n, so the blank (0) sits last.
  const tiles = Array.from({ length: n }, (_, i) => (i + 1) % n);

  let blank = n - 1;
  for (let k = 0; k < shuffleSteps; k++) {
    const br = Math.floor(blank / size);
    const bc = blank % size;
    const neighbors = [];
    if (br > 0) neighbors.push(blank - size);
    if (br < size - 1) neighbors.push(blank + size);
    if (bc > 0) neighbors.push(blank - 1);
    if (bc < size - 1) neighbors.push(blank + 1);
    const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[blank], tiles[pick]] = [tiles[pick], tiles[blank]];
    blank = pick;
  }

  function indexOf(r, c) {
    return r * size + c;
  }

  return {
    size,
    get tiles() {
      return tiles.slice();
    },
    blankPos() {
      const i = tiles.indexOf(0);
      return { r: Math.floor(i / size), c: i % size };
    },
    // Returns true if a tile at (r,c) was adjacent to the blank and moved.
    tryMove(r, c) {
      const { r: br, c: bc } = this.blankPos();
      const adjacent = (Math.abs(r - br) === 1 && c === bc) || (Math.abs(c - bc) === 1 && r === br);
      if (!adjacent) return false;
      const i = indexOf(r, c);
      const bi = indexOf(br, bc);
      [tiles[i], tiles[bi]] = [tiles[bi], tiles[i]];
      return true;
    },
    isSolved() {
      return tiles.every((v, i) => v === (i + 1) % n);
    },
    homeCellOf(value) {
      // Where a tile with this value belongs when solved.
      const i = value === 0 ? n - 1 : value - 1;
      return { r: Math.floor(i / size), c: i % size };
    },
  };
}
