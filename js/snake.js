/**
 * Created by User on 07.07.2017.
 */


var myVar;
var finish = false;
var momentum;
var settings = {
    dynamic: false,
    momentum: 0,
    size: 0
};


var matrix;
var flag = true;
var snakeBodySize = 3;
var snakeBody = {
    HEAD: 1,
    TAIL: 2
}
var whichSide = {
    UP: 0,
    DOWN: 1,
    RIGHT: 2,
    LEFT: 3
};
var side = whichSide.RIGHT;
var previousSide = whichSide.RIGHT;
var x = 0;
var y = 0;

var snake = [];
function snakeCords(X, Y) {
    this.X = X;
    this.Y = Y;
}


document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
        if (previousSide != whichSide.DOWN)
            side = whichSide.UP;
    }
    else if (e.keyCode == '40') {
        // down arrow
        if (previousSide != whichSide.UP)
            side = whichSide.DOWN;
    }
    else if (e.keyCode == '37') {
        // left arrow
        if (previousSide != whichSide.RIGHT)
            side = whichSide.LEFT;
    }
    else if (e.keyCode == '39') {
        //right arrow
        if (previousSide != whichSide.LEFT)
            side = whichSide.RIGHT;
    }
}

function coords(xCord, yCord) {
    return settings.size * xCord + yCord;
}


function clearTail() {
    matrix[snake[0].X][snake[0].Y] = 0;
    snake = snake.slice(1, snake.length);
}

function generateFood() {
    var randX = Math.floor(Math.random() * settings.size);
    var randY = Math.floor(Math.random() * settings.size);
    if (matrix[randX][randY] == 0)
        matrix[randX][randY] = -1;
    else
        generateFood();
}

function changeSpeed() {
    if (settings.dynamic)
        if (momentum > 60) {
            momentum -= 5;
            clearInterval(myVar);
            myVar = setInterval(function () {
                previousSide = side;
                start(side);
            }, momentum);
        }
}

function start(direction) {
    // snakeBodySize++;
    $('.description').text("X: " + snake[snake.length - 1].X + " Y: " + snake[snake.length - 1].Y + " SIZE: " + snakeBodySize + " SPEED: " + momentum);
    var doc = document.getElementById("matrix").getElementsByTagName("td");
    matrix[x][y] = snakeBody.TAIL;
    $(doc[coords(x, y)]).removeClass('head');
    switch (direction) {
        case whichSide.UP:
            x--;
            if (x < 0)
                x = settings.size - 1;
            break;
        case whichSide.RIGHT:
            y++;
            if (y > settings.size - 1)
                y = 0;
            break;
        case whichSide.DOWN:
            x++;
            if (x > settings.size - 1)
                x = 0;
            break;
        case whichSide.LEFT:
            y--;
            if (y < 0)
                y = settings.size - 1;
            break;
    }

    if (matrix[x][y] == -1) {
        $(doc[coords(x, y)]).removeClass('food');
        snakeBodySize++;
        if (snakeBodySize % 2 == 0)
            changeSpeed();
        generateFood();
    } else
        clearTail();
    if (matrix[x][y] > 0) {
        $('.description').text("X: " + snake[snake.length - 1].X + " Y: "
            + snake[snake.length - 1].Y + " X: " + snake[0].X + " Y: " + snake[0].Y);
        clearInterval(myVar);
        alert("PRZEGRALES");
        finish = true;
    }
    matrix[x][y] = snakeBody.HEAD;
    snake.push(cord(x, y));
    paint();
}

function paint() {
    if (!finish) {
        var doc = document.getElementById("matrix").getElementsByTagName("td");

        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] == 1)
                    $(doc[coords(i, j)]).addClass('head');
                else if (matrix[i][j] == 2)
                    $(doc[coords(i, j)]).addClass('snake');
                else if (matrix[i][j] == -1)
                    $(doc[coords(i, j)]).addClass('food');
                else
                    $(doc[coords(i, j)]).removeClass('snake');
            }
        }
    }
    else {
        clearBut();
        finish = false;
    }
}

function clearMatrix() {
    for (var i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(settings.size);
        for (var j = 0; j < matrix[i].length; j++) {
            matrix[i][j] = 0;
        }
    }
}

function createMatrix() {
    $('#matrix').empty();
    matrix = new Array(settings.size);
    var doc = document;

    var fragment = doc.createDocumentFragment();

    for (var i = 0; i < matrix.length; i++) {
        var tr = doc.createElement("tr");
        matrix[i] = new Array(settings.size);
        for (var j = 0; j < matrix[i].length; j++) {
            var td = doc.createElement("td");
            tr.appendChild(td);
            matrix[i][j] = 0;
        }
        fragment.appendChild(tr);
    }

    var table = doc.createElement("table");
    table.appendChild(fragment);
    doc.getElementById("matrix").appendChild(table);
    clearMatrix();
}
function cord(xCord, yCord) {
    return new snakeCords(xCord, yCord);
}

function init() {
    var doc = document.getElementById("matrix").getElementsByTagName("td");
    x = 0
    y = 2;
    matrix[x][y] = snakeBody.HEAD;
    matrix[x][y - 1] = snakeBody.TAIL;
    matrix[x][y - 2] = snakeBody.TAIL;
    snake.push(cord(x, (y - 2)));
    snake.push(cord(x, (y - 1)));
    snake.push(cord(x, y));

    $(doc[coords(x, y)]).addClass('head');
    $(doc[coords(x, (y - 1))]).addClass('snake');
    $(doc[coords(x, (y - 2))]).addClass('snake');

}
function clearBut() {
    $('td').removeClass('snake');
    $('td').removeClass('food');
    $('td').removeClass('head');
    $('#matrix').empty();
    snake = [];

    side = whichSide.RIGHT;
    x = 0;
    y = 2;
    momentum = settings.momentum;
    snakeBodySize = 3;
    clearInterval(myVar);
    flag = true;
    createMatrix();
    init();
    generateFood();
    $('.description').text("X: " + snake[snake.length-1].X +
        " Y: " + snake[snake.length-1].Y);
}

function main() {

    $('#id1').click(function () {
        if (flag == true) {
            flag = false;
            myVar = setInterval(function () {
                previousSide = side;
                start(side);
            }, momentum);
        }
        else {
            flag = true;
            clearInterval(myVar);
        }
    });
    $('#id2').click(function () {
        clearBut();
    });
    $('#accept').click(function () {
        $('.game').removeClass('game');

        var value = $('input[name="speed"]:checked').val();
        if (value != "dynamic") {
            settings.momentum = parseInt(value);
            momentum = settings.momentum;
            settings.dynamic = false;
        } else {
            settings.momentum = 140;
            momentum = settings.momentum;
            settings.dynamic = true;
        }
        settings.size = parseInt($('input[name="size"]').val());

        clearBut();
    });
}

$(document).ready(main);