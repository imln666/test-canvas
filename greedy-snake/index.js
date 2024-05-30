const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let isEatFood = false;
let timer;
class RenderRandomFood {
  constructor(snake) {
    this.snake = snake;
    this.x = 0;
    this.y = 0;
  }
  render() {
    let isInSnake = true;
    let rect;
    while (isInSnake) {
      const x = Math.round((Math.random() * (canvas.width - 40)) / 40) * 40;
      const y = Math.round((Math.random() * (canvas.height - 40)) / 40) * 40;
      rect = new Rect(x, y, 40, 40, "blue");
      isInSnake =
        (this.snake.head.x === x && this.snake.head.y === y) ||
        this.snake.body.find((item) => item.x === x && item.y === y);
      this.x = x;
      this.y = y;
    }

    return rect;
  }
}
class Rect {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

function Snake(length = 0) {
  this.length = length;
  this.head = new Rect(canvas.width / 2, canvas.height / 2, 40, 40, "red");

  this.body = [];
  let x = this.head.x - 40;
  let y = this.head.y;
  for (let i = 0; i < this.length; i++) {
    const rect = new Rect(x, y, 40, 40, "yellow");
    this.body.push(rect);
    x -= 40;
  }
}
Snake.prototype.drawSnake = function () {
  if (isHit(snake)) {
    clearTimeout(timer);
    alert("Game Over! Please reload this page");
    return;
  }
  this.head.draw();
  for (let i = 0; i < this.body.length; i++) {
    this.body[i].draw();
  }
};
Snake.prototype.moveSnake = function () {
  const rect = new Rect(
    this.head.x,
    this.head.y,
    this.head.width,
    this.head.height,
    "yellow",
  );
  this.body.unshift(rect);
  isEatFood = food && this.head.x === food.x && this.head.y === food.y;
  if (!isEatFood) {
    this.body.pop();
  } else {
    food = new RenderRandomFood(this).render();
    food.draw();
    isEatFood = false;
  }
  switch (this.direction) {
    case 0:
      this.head.x -= this.head.width;
      break;
    case 1:
      this.head.y -= this.head.height;
      break;
    case 2:
      this.head.x += this.head.width;
      break;
    case 3:
      this.head.y += this.head.height;
      break;
  }
};

document.onkeydown = function (e) {
  e = e || Window.event;
  // ←ArrowLeft ⬆ArrowUp ➡ArrowRight ⬇ArrowDown
  switch (e.code) {
    case "ArrowLeft":
      snake.direction = snake.direction === 2 ? 2 : 0;
      break;
    case "ArrowUp":
      snake.direction = snake.direction === 3 ? 3 : 1;
      break;
    case "ArrowRight":
      snake.direction = snake.direction === 0 ? 0 : 2;
      break;
    case "ArrowDown":
      snake.direction = snake.direction === 1 ? 1 : 3;
      break;
  }
};

function isHit(snake) {
  const head = snake.head;
  const xLimit = head.x < 0 || head.x > canvas.width;
  const yLimit = head.y < 0 || head.y > canvas.height;
  const hitSelf = snake.body.find(({ x, y }) => head.x === x && head.y === y);
  return xLimit || yLimit || hitSelf;
}
const snake = new Snake(3);
snake.direction = 2;
snake.drawSnake();
let food = new RenderRandomFood(snake).render();
function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.moveSnake();
  snake.drawSnake();
  food.draw();
  clearInterval(timer);
  timer = setInterval(
    () => {
      clear();
    },
    (snake.length * 300) / snake.body.length,
  );
}
clear()
