const rows = 20, cols = 20;
const grid = document.getElementById("grid");
let cells = [], start = null, end = null;

for (let r = 0; r < rows; r++) {
  cells[r] = [];
  for (let c = 0; c < cols; c++) {
    const div = document.createElement("div");
    div.className = "cell";
    div.dataset.row = r;
    div.dataset.col = c;
    div.addEventListener("click", () => handleClick(r, c));
    grid.appendChild(div);
    cells[r][c] = div;
  }
}

function handleClick(r, c) {
  const cell = cells[r][c];
  if (!start) {
    start = { r, c };
    cell.classList.add("start");
  } else if (!end && !(r === start.r && c === start.c)) {
    end = { r, c };
    cell.classList.add("end");
  } else if (!(r === start.r && c === start.c) && !(r === end.r && c === end.c)) {
    cell.classList.toggle("wall");
  }
}

function startVisualization() {
  if (!start || !end) return alert("Set start and end points");
  const visited = [];
  const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const queue = [];

  dist[start.r][start.c] = 0;
  queue.push({ r: start.r, c: start.c });

  const directions = [[1,0], [-1,0], [0,1], [0,-1]];

  const interval = setInterval(() => {
    if (queue.length === 0) {
      clearInterval(interval);
      drawPath(prev);
      return;
    }

    const current = queue.shift();
    const { r, c } = current;

    if (r === end.r && c === end.c) {
      clearInterval(interval);
      drawPath(prev);
      return;
    }

    for (let [dr, dc] of directions) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const neighbor = cells[nr][nc];
        if (!neighbor.classList.contains("visited") &&
            !neighbor.classList.contains("wall") &&
            dist[nr][nc] === Infinity) {
          dist[nr][nc] = dist[r][c] + 1;
          prev[nr][nc] = { r, c };
          queue.push({ r: nr, c: nc });
          neighbor.classList.add("visited");
        }
      }
    }
  }, 30);
}

function drawPath(prev) {
  let { r, c } = end;
  const path = [];
  while (prev[r][c]) {
    path.push({ r, c });
    ({ r, c } = prev[r][c]);
  }
  path.reverse();
  for (const { r, c } of path) {
    if (!(r === start.r && c === start.c) && !(r === end.r && c === end.c)) {
      cells[r][c].classList.add("path");
    }
  }
}

//reset
function resetGrid() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.className = 'cell'; // removes all other classes
  });

  // Optional: reset internal state variables if you have them
  startCell = null;
  endCell = null;
  isStartSet = false;
  isEndSet = false;
}