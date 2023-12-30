//constants
let inputdir = { x: 0, y: 0 };
let gameoveraudio = new Audio('./audio/gameover.mp3');
let moveaudio = new Audio('./audio/move.mp3');
let foodaudio = new Audio('./audio/food.mp3');
let winaudio = new Audio('./audio/win.mp3');

let lasttime = 0;
let speed = 7;
let speedup = 0;
let highscore = 0;
let score = 0;
let maxx = 33, maxy = 17;
let min = 2;
let rotate = 0;

let scoreval = document.querySelector('.scoreval');
let highscoreval = document.querySelector('.highscoreval');
let newrecord = document.querySelector('.newrecord');

if(localStorage.getItem('highscore')){
    highscore = localStorage.getItem('highscore');
    highscoreval.innerText=highscore;
}
else{
    localStorage.setItem('highscore',highscore);
}

let snakearr = [
    { x: 10, y: 9 }
];
let food = { x: 25, y: 9 };

// Functions
let main = ctime => {
    window.requestAnimationFrame(main);
    if ((ctime - lasttime) / 1000 < 1 / speed) {
        return;
    }
    // console.log(ctime);
    lasttime = ctime;
    startgame();
}

let direle;

let startgame = () => {

    let board = document.querySelector('.board');
    board.innerHTML = "";

    //Display Snake
    snakearr.forEach((e, index) => {
        let snakeele = document.createElement('div');
        snakeele.style.gridRowStart = e.y;
        snakeele.style.gridColumnStart = e.x;
        if (index === 0){
            snakeele.classList.add('head');
            direle = snakeele;
            snakeele.style.transform = `rotate(${rotate}deg)`;
        }else{
            snakeele.classList.add('snake');
        }
        board.appendChild(snakeele);
    })

    //Display Food
    let foodele = document.createElement('div');
    foodele.style.gridRowStart = food.y;
    foodele.style.gridColumnStart = food.x;
    foodele.classList.add('food');
    board.appendChild(foodele);

    //new food
    if (snakearr[0].y === food.y && snakearr[0].x === food.x) {
        foodaudio.play();
        score += 1;
        speed += 0.2
        // speedup +=1;
        // if(speedup === 5){
        //     speed+=1;
        //     speedup = 0;
        // }
        scoreval.innerText = score;
        if (score > highscore && highscore !== 0) {
            newrecord.style.fontSize = '2.8vw';
        }
        snakearr.unshift({ x: snakearr[0].x + inputdir.x, y: snakearr[0].y + inputdir.y })
        food = {
            x: Math.round(Math.random() * (maxx - min) + min),
            y: Math.round(Math.random() * (maxy - min) + min)
        }
    }

    //Move snake
    for (let i = snakearr.length - 2; i >= 0; i--) {
        snakearr[i + 1] = { ...snakearr[i] };
    }
    snakearr[0].x += inputdir.x;
    snakearr[0].y += inputdir.y;

    //Collide
    let iscollide = snake => {

        //body collide
        for (let i = 2; i < snakearr.length; i++) {
            if (snake[i].x === snake[1].x && snake[i].y === snake[1].y) {
                return true;
            }
        }

        //wall collide
        if (snake[0].x > maxx + 3 || snake[0].x < 0 || snake[0].y > maxy + 3 || snake[0].y < 0) {
            return true;
        }
    }

    //game over
    if (iscollide(snakearr)) {
        gameoveraudio.play();
        inputdir = { x: 0, y: 0 };
        speed = 7;
        alert("Game Over! Press Enter key to Continue");
        newrecord.style.fontSize = '0';
        snakearr = [{ x: 10, y: 7 }];
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore',highscore);
            highscoreval.innerText = highscore;
        }
        score = 0;
        scoreval.innerText = score;
    }

}

//Key Control and Game logic
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputdir = { x: 0, y: 1 }; //start the game
    moveaudio.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUP");
            inputdir.x = 0;
            inputdir.y = -1;
            // document.querySelector('.head').style.transform = `rotate(-90deg)`;
            rotate = -90;
            direle.classList.add('up');
            break;
        case "ArrowDown":
            console.log("ArrowDown");
            inputdir.x = 0;
            inputdir.y = 1;
            // document.querySelector('.head').style.transform = `rotate(90deg)`;
            rotate = 90;
            break;
        case "ArrowLeft":
            console.log("ArrowLeft");
            inputdir.x = -1;
            inputdir.y = 0;
            // document.querySelector('.head').style.transform = `rotate(180deg)`;
            rotate = 180;
            break;
        case "ArrowRight":
            console.log("ArrowRight");
            inputdir.x = 1;
            inputdir.y = 0;
            // document.querySelector('.head').style.transform = `rotate(0deg)`;
            rotate = 0;
            break;
    }
})
