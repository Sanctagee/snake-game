const user = prompt("Please, enter your name");
// Responsive canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    const container = canvas.parentElement;
    const size = Math.min(container.offsetWidth, window.innerHeight * 0.6);
    
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    
    // Set actual rendering dimensions
    canvas.width = 400;
    canvas.height = 400;
    
    // Scale the drawing context
    const scale = size / 400;
    ctx.scale(scale, scale);
}


// Initial setup
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

canvas.width = 400;
canvas.height = 400;

// Defining relevant values
const boxSize = 20;
let snake = [{x: 9 * 20, y: 10 * 20}];
let direction = "RIGHT";
let food = generateFood();
let score = 0;
let foodCount = 0;
let bigFood = null;
let bigFoodTimer = null;

// To create function that will change the direction of the snake

document.addEventListener("keydown", changeDirection);
function changeDirection (event){
    if(event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if(event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

// To generate random food at random positions on the canvas
function generateFood(){
    return{
        x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
    };
};

// Let us now draw the snake
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0? "darkred" : "pink";
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    //     ctx.strokeStyle = "black";
    //     ctx.strokeRect(segment.x, segment.y, boxSize, boxSize);
    })
}

// Let us now draw the food (circular big and small food)
function drawFood(){
    ctx.fillStyle = "red"
    ctx.beginPath();
    ctx.arc(food.x + boxSize / 2, food.y + boxSize /2, boxSize/2, 0, Math.PI * 2);
    ctx.fill()
}
 
// As for the big food
function drawBigFood(){
    if(bigFood){
        ctx.fillStyle = "blue"
        ctx.beginPath();
        ctx.arc(bigFood.x + boxSize , bigFood.y + boxSize, boxSize, 0, Math.PI * 2);
        ctx.fill()
    }
}

// To make the snake move:

function moveSnake(){
    const head = {...snake[0] }; //This will create a new head object

    if(direction === "UP") head.y -= boxSize;
    if(direction === "DOWN") head.y += boxSize;
    if(direction === "LEFT") head.x -= boxSize;
    if(direction === "RIGHT") head.x += boxSize;

    snake.unshift(head)

    // To make the snake grow in length as well as increment the score

    if(head.x === food.x && head.y === food.y) {
        score += 6;
        foodCount++;
        food = generateFood();

            if(foodCount === 4){
            bigFood = generateFood();
            bigFoodTimer = setTimeout(() =>{
                bigFood = null;
            }, 10000) // 10 seconds interval
            foodCount = 0 // after that, the food disappears
            }    
        } else if(bigFood && head.x === bigFood.x && head.y === bigFood.y){
        score += 15 // score is incremented by 10 points when the snake eats big food
        bigFood = null
        clearTimeout(bigFoodTimer);
        } else{
            snake.pop(); 
        };

};



// Now let us consider what happens when snake hits the wall of the canvas or itself

function checkCollision(){
    const head = snake[0];

    if(
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        // When any of these happens, the function below should be performed
    ) {
        alert(`The Game is over! Hello ${user}, Your score is: ${score} points`);
        if (score >= 100){
            alert(`🎊🎉Congratulations ${user}! You have made high points👍🎉`)
        }else{
            alert(`👺Sorry ${user} try again... Your score is lessthan 100😕`)
        }
        // Auto-update copyright year
        document.getElementById('year').textContent = new Date().getFullYear();
        clearInterval(gameLoop);
    }
}

function drawGame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawBigFood();

    //To display the score on the canvas

    ctx.fillStyle = "black"
    ctx.font = "22px Arial";
    ctx.fillText(`Score: ${score}`, 20, 30);

}

// To initiate the game
function updateGame(){
    moveSnake()
    checkCollision()
}

const gameLoop = setInterval(() =>{
    updateGame(); // clears he canvas and redraws the snake, food, and big food
    drawGame()  //Handles the game logic, including movement and collision check
}, 150); //is set at 0.09secs