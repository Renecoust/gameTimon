let canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
let ctx = canvas.getContext('2d');
let then,now,elapsed,fpsInterval;
let sec = 0,
    min = 0,
    time_s = '00',
    time_m = '00';
let pause = true;
let pause_scane = document.getElementById('pause');
let death_scane = document.getElementById('death');
let win_scane = document.getElementById('finish');
let start_scane = document.getElementById('start_s');
let nicknamee = document.getElementById('nickname');
let nick = 'none';
let but_start = document.getElementById('b_start');
let video_s = document.getElementById('video_s');
let video_c = document.getElementById('video_c');
let user1_img = document.getElementById('player1');
let user2_img = document.getElementById('player2');
let instt_s = document.getElementById('instt');

var a_background      = document.getElementById('aud');
a_background.volume = 0.03;

function loadAudio(arr,vol) {
	var audio = document.createElement('audio');
	for (var i = 0; i < arr.length; i++) {
		var source = document.createElement('source');
		source.src = arr[i];
		audio.appendChild(source);
	}

	audio.volume = vol || 1;

	var o = {
		dom : false,
		state : 'stop',

		play : function () {
			this.dom.currentTime = 0;
			this.dom.play();
			this.state = 'play';
		},
		pause : function () {
			this.dom.pause();
			this.state = 'pause';
		},
		stop : function () {
			this.dom.pause();
			this.dom.currentTime = 0;
			this.state = 'stop';
		},
		setVolume : function () {
			this.dom.volume = vol || 1;
		}
	};
	o.dom = audio;
	return o;
}

let keys = {
    'left' : 37,
    'up' : 38,
    'right' : 39,
    'down' : 40,
    'esc' : 27,
    'space' : 32
}
let keysDown = {};
let in_chek = false;
function intsru() {
    if (!in_chek) {
        instt_s.style.top = "30%";
        in_chek = true;
    }else if(in_chek)  {
        instt_s.style.top = "-30%";
        in_chek = false;
    }
}
window.addEventListener('load',() => {
    window.addEventListener('keydown',(e) => {
        keyDown(e.keyCode);
        if (e.keyCode == 27 && pause) {
            pause_scane.style.display = 'none';
            pause = false;
        }else if (e.keyCode == 27 && !pause) {
            pause_scane.style.display = 'block';
            pause = true;
        }
        if (ifKeyDown('space')) {
            pause = false;
            video_s.style.display = 'none';
        }
    });
    nicknamee.addEventListener('focus',() => {
        if (nicknamee.value != " ") {
            but_start.disabled = false;
        }
    });
    user1_img.addEventListener('click',() => {
        user1_img.className = 'playerb2';
        user2_img.className = 'playerb1';
    });
    user2_img.addEventListener('click',() => {
        user2_img.className = 'playerb2';
        user1_img.className = 'playerb1';
    });
    but_start.addEventListener('click',() => {
        start_scane.style.display = 'none';
        nick = nicknamee.value;
        a_background.play();
        video_s.style.display = 'block';
        video_c.src= 'assets/video/fon.gif';
        setTimeout(function(){
            pause = false;
            video_s.style.display = 'none';
        },4000);

    });
    window.addEventListener('keyup',(e) => {
        keyUp(e.keyCode);
    });
});
Background = {
    sWidth : 5000,
    sHeight : 2227,
    width : 5000 * 0.9,
    height : 2227 * 0.9,
    x: 0,
    xMap: 0,
    y : canvas.height - (2227 * 0.9) + 400,
    screen_w : canvas.width, 
    color : '#7AB71E',
    src : 'assets/images/background1.png',
    draw : function() {
        canvas.style.background = this.color;
        ctx.font = 'bold 30px Segue UI';
        drawImage(this.src, 0,0, this.sWidth,this.sHeight, this.x,this.y, this.width,this.height);
    }
}
Player = {
    x: 10,
    y: canvas.height - 40 * 2,
    xMap: 0,
    yMap: 0,
    yPrev: 0,
    xPrev: 0,
    xVelocity : 0,
    yVelocity : 0,
    speed: 10,
    sWidth: 36,
    sHeight: 45,
    dWidth: 36 * 2,
    dHeight: 45 * 2,
    height: 36 * 2,
   width: 45 * 2,
    hp : 100,
    maxSpeed : 20,
    dd : 0.5,
    jumping : true,
    score: 0,
    frameIndex: 0,
    tickCount: 0,
    ticksPerFrame: 4,
    numberOfFrames: 9,
    reflect: false,
    draw: function () {
        ctx.fillStyle = 'blue';
        ctx.fillStyle = '#FF7369';
        ctx.fillRect(10,10,2 * this.hp, 30);
        ctx.fillText(nick,50,90);
        ctx.fillStyle = '#FFEC73';
        ctx.fillText('Счёт :'+this.score,10,canvas.height - 20);
        if ( ( !ifKeyDown('right') && !ifKeyDown('left') ) || ( ifKeyDown('right') && ifKeyDown('left') ) )  {
            this.sWidth = 38;
            this.sHeight = 42;
            this.dWidth = 38 * 2;
            this.dHeight = 42  * 2;
            this.numberOfFrames = 4;
            drawImage('assets/images/timon_stance.png',this.frameIndex * this.sWidth, 0,this.sWidth,this.sHeight,this.x,this.y,this.dWidth,this.dHeight,this.reflect);
        }else if (ifKeyDown('right')) {
            this.reflect = false;
            this.sWidth = 36;
            this.sHeight = 45;
            this.dWidth = 36 * 2;
            this.dHeight = 45  * 2;
            this.numberOfFrames = 9;
            drawImage('assets/images/timon_running.png',this.frameIndex * this.sWidth, 0,this.sWidth,this.sHeight,this.x,this.y,this.dWidth,this.dHeight,this.reflect);            
        }else if (ifKeyDown('left')) {
            this.reflect = true;
            this.sWidth = 36;
            this.sHeight = 45;
            this.dWidth = 36 * 2;
            this.dHeight = 45  * 2;
            this.numberOfFrames = 9;
            this.numberOfFrames = 9;
            drawImage('assets/images/timon_running.png',this.frameIndex * this.sWidth, 0,this.sWidth,this.sHeight,this.x,this.y,this.dWidth,this.dHeight,this.reflect);            
        }else if (ifKeyDown('up') && !this.jumping) {
            this.reflect = true;
            this.sWidth = 36;
            this.sHeight = 45;
            this.dWidth = 36 * 2;
            this.dHeight = 45  * 2;
            this.numberOfFrames = 9;
            this.numberOfFrames = 9;
            drawImage('assets/images/timon_running.png',this.frameIndex * this.sWidth, 0,this.sWidth,this.sHeight,this.x,this.y,this.dWidth,this.dHeight,this.reflect); 
        }
    },
    update: function () {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            if (this.frameIndex < this.numberOfFrames - 1) {
                this.frameIndex++;
            } else {
                this.frameIndex = 0;
            }
        }
        this.xPrev = this.x;
        this.yPrev = this.y;
        this.xMap += this.xVelocity;
        Background.xMap += this.xVelocity;
        this.yMap += this.xVelocity;
        this.y += this.yVelocity;
        if (this.x <= canvas.width / 2 || this.xMap <= canvas.width / 2) {
            this.x += this.xVelocity;
        }
        if ( Background.xMap + canvas.height / 2 >= 3900 ) {
            this.x += this.xVelocity;
        }
        if (this.xMap >= canvas.width / 2 && this.xMap <= 3500) {
            this.x = canvas.width / 2;
        }
        if ( Background.xMap >= 4300 ) {
            pause = true;
            win_scane.style.display = 'block';
        }
        this.yVelocity += 0.9;
        if (this.yVelocity >= 10) {
            this.yVelocity += 0;
        }
        if (this.hp <= 0) {
            pause = true;
            death_scane.style.display = 'block';
        }
        if (this.hp <= 100) {
            this.hp = 100;
        }
        if(this.x <= this.dWidth) {
            this.x = this.dWidth;
        }
        if(this.x >= canvas.width - this.dWidth) {
            this.x = canvas.width - this.dWidth;
        }
        if (this.y >= canvas.height - this.dHeight) {
            this.y = canvas.height - this.dHeight;
            this.jumping = false;
            this.yVelocity = 0; 
        }
    },
    move: function () {
        if ( ( !ifKeyDown('right') && !ifKeyDown('left') ) || ( ifKeyDown('right') && ifKeyDown('left') ) )  {
            this.xVelocity = 0;
        }
        if (ifKeyDown('right') && !ifKeyDown('down')) {
            this.xVelocity = this.speed;
            
        }
        if (ifKeyDown('left') && !ifKeyDown('down')) {
            this.xVelocity = -this.speed;
        }
        if (ifKeyDown('up') && !this.jumping) {
            this.yVelocity = -20;
            this.jumping = true;
        }
        if (ifKeyDown('down') && this.y >= canvas.height - this.height - 20) {
            this.y = canvas.height;
        }
    }
}

let platforms = [];
let gienas = [];
let gusinizas = [];
let k;
for (let i = 2; i < 14; i++) {
    k = rand(5,7);
    platforms.push(new platform(i * 600,canvas.height - canvas.height / k));
    gusinizas.push(new gusiniza(i * 600 + 60,canvas.height - canvas.height / k - 20));
}
let num = 1;
setInterval(function(){
if (num < 5) {
    gienas.push(new giena(rand(600,1100) * num,canvas.height - 52 * 2));
    num++;
}
}, rand(500,2000));
ctx.font = '30px Arial';
function main() {
    if (!pause) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillText(time_m + ':' + time_s,canvas.width - 80,30);
        Background.draw();
        Player.draw();
        Player.update();
        Player.move();
        platforms.forEach(element => {
            element.draw();
        });
        gienas.forEach(element => {
            element.draw();
            element.move();
            if (isCollided(Player,element)) {
                Player.hp -= 30;
                Player.xVelocity -= 20;
                Player.yVelocity -= 10;
            }
            if (Player.x >= canvas.width / 2  && !(Background.xMap + canvas.height / 2 >= 3900) ) {
                element.xStart += -Player.xVelocity;
                element.xEnd += -Player.xVelocity;
                element.x += -Player.xVelocity;
                element.xMap += -Player.xVelocity;
            }
        });
        if (Player.x >= canvas.width / 2  && !(Background.xMap + canvas.height / 2 >= 3900) ) {
            if ( Background.xMap + canvas.height / 2 >= 3900 ) {
                Background.x += 0;
            }else {
                Background.x += -Player.xVelocity / 2;
            }
        }
        for (let i = 0; i < gusinizas.length; i++) {
            gusinizas[i].draw();        
            if (Player.x >= canvas.width / 2) {
                if ( Background.xMap + canvas.height / 2 >= 3900 ) {
                    gusinizas[i].x += 0;
                }else {
                    gusinizas[i].x += -Player.xVelocity;
                }
            }
            if (isCollided(Player,gusinizas[i])) {
                gusinizas.splice(i,1);
                Player.hp += 10;
                Player.score += 1;
            }
        }
        platforms.forEach(element => {
            if (Player.x >= canvas.width / 2) {
                if ( Background.xMap + canvas.height / 2 >= 3900 ) {
                    element.x += 0;
                }else {
                    element.x += -Player.xVelocity;
                }
            }
        collideHandler(Player,element);
        });
    }
}
startAnimation(60);

function platform(x,y) {
    this.x = x,
    this.y = y + 5,
    this.width = 1280 / 7,
    this.height = 640 / 7 - 10,
    this.dWidth = 1280 / 7,
    this.dHeight = 640 / 7,
    this.sHeight = 640,
    this.sWidth = 1280,
    this.draw = () => {
        drawImage('assets/images/land.png',0,0,this.sWidth,this.sHeight,this.x,this.y - 5,this.dWidth,this.dHeight);
    }
}
function giena(x,y) {
    this.x = x,
    this.y = y,
    this.xStart = x,
    this.xEnd = x - 500,
    this.xMap = x,
    this.yMap = y,
    this.sWidth = 72,
    this.sHeight = 52,
    this.dWidth = 72 * 2,
    this.dHeight = 52 * 2,
    this.width = 72 * 2,
    this.height = 52 * 2,
    this.frameIndex = 0,
    this.tickCount = 0,
    this.ticksPerFrame = 5,
    this.numberOfFrames = 12,
    this.reflect = false,
    this.draw = () => {
        drawImage('assets/images/Hyenas.png',this.frameIndex * this.sWidth, 0,this.sWidth,this.sHeight,this.x,this.y,this.dWidth,this.dHeight,this.reflect);
    },
    this.move = () => {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            if (this.frameIndex < this.numberOfFrames - 1) {
                this.frameIndex++;
            } else {
                this.frameIndex = 0;
            }
        }
        this.x = this.xMap;
        this.y = this.yMap;
        if (!this.reflect) {
            this.xMap += 2;
        }else {
            this.xMap -= 2;
        }
        if (this.xMap >= this.xStart) {
            this.reflect = true;
        }
        if (this.xMap <= this.xEnd) {
            this.reflect = false;
        }
    }
}
function gusiniza(x,y) {
    this.x = x,
    this.y = y,
    this.width = 512 / 15,
    this.height = 512 / 15,
    this.sHeight = 512,
    this.sWidth = 512,
    this.ref = false,
    this.draw = () => {
        drawImage('assets/images/caterpillar.png',0,0,this.sWidth,this.sHeight,this.x,this.y,this.width,this.height);
    }
}
function timer() {
    if (!pause) {
        Player.hp -= 1;
        sec++;
        if (sec >= 60) {
            min++
            sec = 0;
        }
        if (sec < 10) {
            time_s = '0' + sec;
        }else {
            time_s = ''+sec;
        }
        if (min < 10) {
            time_m = '0' + min;
        }else {
            time_m = ''+min;
        }
    }
    setTimeout(timer,1000);
}
timer();
function keyUp(keyCode) {
    keysDown[keyCode] = false;
}
function keyDown(keyCode) {
    keysDown[keyCode] = true;
}
function ifKeyDown(keyName) {
    return keysDown[keys[keyName]] == true;
}
function isCollided(obj,obj2) {
    if (   obj.x + obj.width > obj2.x
        && obj.x < obj2.x + obj2.width
        && obj.y + obj.height > obj2.y
        && obj.y < obj2.y + obj2.height) {
        return true;
    }
    return false;
}
function collideHandler(obj,obj2) {
    if (isCollided(obj,obj2)) {
        if (obj.yPrev + obj.height <= obj2.y) {
            obj.y = obj2.y - obj.height;
            obj.yVelocity = 0;
            obj.jumping = false;
        }else if (obj.yPrev >= obj2.y + obj2.height) {
            obj.y = obj2.y + obj2.height;
            obj.yVelocity = 0;
        }else if (obj.xPrev >= obj2.x + obj2.width) {
            obj.x = obj2.x + obj2.width;
            obj.xVelocity = 0;
        }else if (obj.xPrev + obj.width <= obj2.x) {
            obj.x = obj2.x - obj.width;
            obj.xVelocity = 0;
        }
    }
}
function startAnimation(fps) {
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    animation(then);
}
function animation(newTime) {
    window.requestAnimationFrame(animation);
    now = newTime;
    elapsed = now - then;
    if (elapsed > fpsInterval){
        then = now - (elapsed % fpsInterval);
        main();
    }
}
function drawImage(src,sX,sY,sW,sH,dX,dY,dW,dH,reflect,angle) {
    let a = angle / 180 * Math.PI;
    let img = new Image;
    img.src = src;
    if (reflect) {
        ctx.save();
        ctx.scale(-1,1);
    }
    if (a) {
        ctx.save();
        ctx.translate(dX - dW / 2,dY - dH / 2);
        ctx.rotate(a);
        ctx.translate(-dX - dW / 2,-dY - dH / 2);
    }
    if (reflect) {
        ctx.drawImage(img,sX,sY,sW,sH,-dX - dW,dY,dW,dH);
        ctx.restore();
    }else if (a) {
        ctx.drawImage(img,sX,sY,sW,sH,dX,dY,dW,dH);
        ctx.restore();
    }
    else {
        ctx.drawImage(img,sX,sY,sW,sH,dX,dY,dW,dH);
    }
}
function rand(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}
function restart() {
platforms = [];
gienas = [];
gusinizas = [];
Player.x = 10;
Player.y = canvas.height - 40 * 2;
Player.xMap = 0;
Player.yMap = 0;
Player.yPrev = 0;
Player.xPrev = 0;
Player.hp = 100;
Background.x = 0;
Background.xMap = 0;
for (let i = 2; i < 14; i++) {
    k = rand(3,5);
    platforms.push(new platform(i * 600,canvas.height - canvas.height / k));
    gusinizas.push(new gusiniza(i * 600 + 60,canvas.height - canvas.height / k - 20));
}
num = 1;
pause = false;
win_scane.style.display = 'none';
death_scane.style.display = 'none';
sec = 0;
min = 0;
time_s = '00';
time_m = '00';
score = 0;
a_background.currentTime = 0;
}