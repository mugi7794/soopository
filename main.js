
// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas)

// 이미지 설정
let backgroundImage, spaceship, bullet, enemy, gameoverImage;
let gameOver = false // true면 게임이 끝남
let score = 0;
// 우주선 좌표
let spaceshipx = canvas.width/2 - 32
let spaceshipy = canvas.height - 64

let bulletList = []; // 총알들을 저장하는 리스트
function Bullet(){
    this.x= 0;
    this.y= 0;
    this.init=function(){
        this.x = spaceshipx + 20
        this.y = spaceshipy
        this.alive = true // true면 살아있는 총알 false면 죽은 총알
        bulletList.push(this)
    }

    this.update = function(){
        this.y -= 10;
    }

    this.checkhit = function(){
        for(let i= 0; i<EnemyList.length; i++){
        if(this.y <= EnemyList[i].y && this.x>= EnemyList[i].x && this.x<= EnemyList[i].x+40){
            score++;
            this.alive = false //죽은 총알
            EnemyList.splice(i, 1);
        }
            
        }
    }
    
}

function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}

// 적군
let EnemyList = [];
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = generateRandomValue(0, canvas.width-48)
        this.y = 0;
        EnemyList.push(this)
    }
    this.update = function(){
        this.y += 2;
        if(this.y >= canvas.height-48){
            gameOver = true;
        
        }

    }
}



function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="image/background.png"

    spaceship = new Image();
    spaceship.src ="image/spaceship.png"

    bullet = new Image();
    bullet.src = "image/bullet.png"

    enemy = new Image();
    enemy.src = "image/enemy.png"

    gameoverImage = new Image();
    gameoverImage.src = "image/gameover.png"
}


// 눌렀다 뗏을 때의 이벤트
let keysdown={}
function setupKeyboardListener(){
    document.addEventListener("keydown", (event)=>{

        keysdown[event.keyCode] = true
        console.log("키다운 객체에 들어간 값은?", keysdown)
    })
    document.addEventListener("keyup", function(){
        delete keysdown[event.keyCode]
        console.log("버튼 클릭후", keysdown);

        if(event.keyCode == 32){
            createBullet()
        }
    })
}

// 총알 만드는 함수
function createBullet(){
    let b = new Bullet();
    b.init()
}

// 적군 생성 함수
function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init()
    },300)// 1000 = 1s
    //setInterval(호출하고 싶은 함수, 호출하고 싶은 시간)
}


// 좌표 바꾸기 
function update(){
    if(39 in keysdown){
        spaceshipx += 5;
    } //right
    if(37 in keysdown){
        spaceshipx -= 5;
    }// left
    if(40 in keysdown){
        spaceshipy += 5;
    }else if(38 in keysdown)
        spaceshipy -= 5;

    // 우주선의 좌표값이 경기장 안에서만 있게 하기
    if(spaceshipx <= 0){
        spaceshipx = 0;
    }
    if(spaceshipx > canvas.width-64){
        spaceshipx = canvas.width-64
    }
    if(spaceshipy <=0){
        spaceshipy = 0;
    }
    if(spaceshipy > canvas.height-64){
        spaceshipy = canvas.height-64
    }

    //총알의 y좌표 업데이트하는 함수 호출
    for(let i = 0; i<bulletList.length; i++){
        if(bulletList[i].alive){
        bulletList[i].checkhit()
        bulletList[i].update()
        }
    }

    for(let i = 0; i<EnemyList.length; i++){
        EnemyList[i].update()
    }
}

// 이미지를 보여주는 함수
function render(){
    
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceship, spaceshipx, spaceshipy);
    ctx.fillText(`score: ${score}`, 20, 30);
    ctx.fillStyle="white";
    ctx.font = "20px Arial";
    
    for(let i = 0; i<bulletList.length; i++){
        if(bulletList[i].alive){
        ctx.drawImage(bullet, bulletList[i].x, bulletList[i].y)
        }
    }
    // (이미지, x좌표,y좌표, 위드, 헤이트)
    for(let i = 0; i<EnemyList.length; i++){
        ctx.drawImage(enemy, EnemyList[i].x, EnemyList[i].y)
    }
}

// render 를 계속 보여주기 위함
function main(){
    if(!gameOver){
    update(); // 좌표값 업데이트
    render(); // 그리기
    requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameoverImage, 10, 100, 380, 380)
    }

} 

loadImage();
setupKeyboardListener();
createEnemy();
main();


// 방향키를 누르면 xy좌표가 바뀌고
// 다시render

// 총알만들기
// 스페이스바를 누르면 총알 발사
// 총알이 발사 == 총알의 y값  -- , 총알의 x값은 ? 스페이스를 누른 순간의 우주선의 x좌표와 같다
// 발사된 총알들은 총알 배열에 저장한다
// 모든 총알들은 x,y 좌표값이 있어야 한다.
// 총알 배열을 가지고 render 한다.```````