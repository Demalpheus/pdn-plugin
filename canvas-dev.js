const canvas  = document.getElementById('board');
const ctx = canvas.getContext("2d");
const colors = {
    red: "#CC0000",
    white: "#FDEEC6",
    light: "#FFFFCC",
    dark: "#669966"
}

console.log('Loading Js...');
//ctx.fillStyle = "#FF0000";
//ctx.fillRect(0, 0, 150, 75);
function Square(x, y, width, height, color, context) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.draw = function() {
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.width, this.height)
    }
};

function Piece(x, y, r, color, isKing, context) {
    this.x = x
    this.y = y 
    this.radius = r
    this.color = color
    this.isKing = isKing
    this.draw = function() {
        context.beginPath()
        context.lineWidth = 1
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = color
        context.fill()
        context.stroke()
        if (this.isKing == true) {
            context.beginPath()
            context.lineWidth = 3
            context.arc(this.x, this.y, this.radius / 1.75, 0, 2 * Math.PI);
            context.fillStyle = color
            context.fill()
            context.stroke()
        }
    }
};

function drawBoard() {
    // Color the background
    ctx.beginPath()
    ctx.fillStyle = colors.light
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fill()
    ctx.stroke()
    for (let index = 0; index < 8; index++) {
        if (index % 2 == 1) {
            // This is an odd row
            let start = 0
            for (let col = 1; col < 5; col++) {
                let s = new Square(start, index*60, 60, 60, colors.dark, ctx).draw()
                start += 120
            }
        } else {
            // This is an even row
            let start = 60
            for (let col = 1; col < 5; col++) {
                let s = new Square(start, index*60, 60, 60, colors.dark, ctx).draw()
                start += 120
            }
        }     
    }
}

function getPiecePlacements(canvas) {
    // Determine the locations to place pieces for all 32 playable squares
    let boardWidth = canvas.width
    let square = boardWidth / 8
    let placements = []
    for (let index = 0; index < 32; index++) {
       if (index < 4) {
           // squares 1-4, first row
           placements.push([ ((index * 2 * square) + (square * 1.5)), (0.5 * square) ])
       } else if (index < 8) {
           // squares 5-8, second row
           placements.push([ (((index - 4) * 2 * square) + (square * 0.5)), (1.5 * square)])
       } else if (index < 12) {
           // squares 9-12, third row
           placements.push([ (((index - 8) * 2 * square) + (square * 1.5)), (2.5 * square) ])
       } else if (index < 16) {
           // squares 13-16, fourth row
           placements.push([ (((index - 12) * 2 * square) + (square * 0.5)), (3.5 * square)])
       } else if (index < 20) {
           // squares 17-20, fifth row
           placements.push([ (((index - 16) * 2 * square) + (square * 1.5)), (4.5 * square)])
       } else if (index < 24) {
           //squares 21-24, sixth row
           placements.push([ (((index - 20) * 2 * square) + (square * 0.5)), (5.5 * square)])
       } else if (index < 28) {
           // squares 25-28, seventh row
           placements.push([ (((index - 24) * 2 * square) + (square * 1.5)), (6.5 * square)])
       } else {
           // squares 29-32, eigth row
           placements.push([ (((index - 28) * 2 * square) + (square * 0.5)), (7.5 * square)])
       }
    }
    return placements
}

function drawPosition(position, coords, context) {
    // Receive an array of pieces and draw them on the board
    for (let index = 0; index < position.length; index++) {
        console.log('Checking index: ' + index + ' for piece: ' + position[index])
       if (position[index] == 'rp') {
            //Draw Red piece
            console.log('drawing red piece')
            var p = new Piece(coords[index][0], coords[index][1], 20, colors.red, false, ctx).draw()
       } else if (position[index] == 'rk') {
            //Draw Red King
            var p = new Piece(coords[index][0], coords[index][1], 20, colors.red, true, ctx).draw()
       } else if (position[index] == 'wp') {
            //Draw White piece
            console.log('drawing white piece')
            var p = new Piece(coords[index][0], coords[index][1], 20, colors.white, false, ctx).draw()
       } else if (position[index] == 'wk') {
               //Draw White King
           var p = new Piece(coords[index][0], coords[index][1], 20, colors.white, true, ctx).draw()
       } 
    }
}

drawBoard();
console.log(getPiecePlacements(canvas));
let coordinates = getPiecePlacements(canvas);

let startingPosition = [
    "rp", "rp", "rp", "rp",
    "rp", "rp", "rp", "rp",
    "rp", "rp", "rp", "rp",
    "", "", "", "",
    "", "", "", "",
    "wp", "wp", "wp", "wp",
    "wp", "wp", "wp", "wp",
    "wp", "wp", "wp", "wp"
]
drawPosition(startingPosition, coordinates, ctx);

/*
const pos = [
    new Piece(90, 30, 20, '#ff0000', false, ctx).draw(),
    new Piece(210, 30, 20, '#ff0000', false, ctx).draw(),
    new Piece(330, 30, 20, '#ff0000', false, ctx).draw(),
    new Piece(450, 30, 20, '#ff0000', false, ctx).draw(),
    new Piece(30, 90, 20, '#ff0000', false, ctx).draw(),
    new Piece(150, 90, 20, '#ff0000', false, ctx).draw(),
    new Piece(270, 90, 20, '#ff0000', false, ctx).draw(),
    new Piece(390, 90, 20, '#ff0000', false, ctx).draw()
]
*/
//let p = new Piece(90, 30, 20, '#ff0000', false, ctx).draw();
//let p2 = new Piece(210, 30, 20, '#ffffff', false, ctx).draw();
