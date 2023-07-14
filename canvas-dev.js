const canvas  = document.getElementById('board');
const ctx = canvas.getContext("2d");
const colors = {
    red: "#CC0000",
    white: "#FDEEC6",
    light: "#FFFFCC",
    dark: "#669966"
}
var numberFont = "12px Arial"

var showNumbers = true;
var reverseBoard = true;

var startingPosition = [
    "rp", "rp", "rp", "rp",
    "rp", "rp", "rp", "rp",
    "rp", "rp", "rp", "rp",
    "", "", "", "",
    "", "", "", "",
    "wp", "wp", "wp", "wp",
    "wp", "wp", "wp", "wp",
    "wp", "wp", "wp", "wp"
]

class FENComponent extends HTMLElement {
    connectedCallback() {
        let pos = this.innerHTML;
       console.log('Position: ' + pos); 
        let attr = this.getAttribute('data-fen');
        console.log('Attribute: ' + attr);
        let newelement = document.createElement('canvas');
        newelement.width = 480;
        newelement.height = 480;
        this.appendChild(newelement);
        let context = newelement.getContext("2d");
        drawBoard(newelement.width, newelement.height, context);
        let coordinates = getPiecePlacements(newelement);
        let position = setPosition(attr)
        console.log('NEW POSITION RETURNED: ' + position);
        drawPosition(position, coordinates, context);
        //context.fillStyle = '#CC0000';
        //context.fillRect(0, 0, 10, 10);
        //let newSquare = new Square(0, 0, 60, 60, colors.dark, context).draw();
        //let newsquare = new Square(0, 0, 10, 10, colors.red, context);
        //this.innerHTML = `<canvas id="testing" width=480 height=480 \></canvas>`
        //let c = document.getElementById('testing');
        //let context = c.getContext('2d')
        //drawPosition(pos, coordinates, ctx);

        //this.innerHTML = 'Testing FEN insertion'
    }
}

customElements.define('pdn-fen', FENComponent);


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

function drawBoard(width, height, context) {
    // Color the background
    context.beginPath()
    context.fillStyle = colors.light
    context.rect(0, 0, width, height)
    context.fill()
    context.stroke()
    let size = width / 8
    let boardNumber = (reverseBoard) ? 33 : 0
    for (let index = 0; index < 8; index++) {
        if (index % 2 == 1) {
            // This is an odd row
            let start = 0
            for (let col = 1; col < 5; col++) {
                let s = new Square(start, index*size, size, size, colors.dark, context).draw()
                if (showNumbers == true) {
                    boardNumber += (reverseBoard) ? -1 : 1
                    drawSquareNumber(boardNumber, start + 3, (index*size)+12, null, context)
                }
                start += (size * 2)
            }
        } else {
            // This is an even row
            let start = size
            for (let col = 1; col < 5; col++) {
                let s = new Square(start, index*size, size, size, colors.dark, context).draw()
                if (showNumbers == true) {
                    boardNumber += (reverseBoard) ? -1 : 1
                    console.log(context)
                    drawSquareNumber(boardNumber, start + 3, (index*size)+12, null, context)
                }
                start += (size * 2)
            }
        }     
    }
}

function drawSquareNumber(number, x, y, color, context) {
    context.font = numberFont
    context.fillStyle = colors.light
    context.fillText(number, x, y)
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
    if (reverseBoard == true) {
        position = position.reverse()
    }
    let radius = canvas.width / 8 * .33
    for (let index = 0; index < position.length; index++) {
        console.log('Checking index: ' + index + ' for piece: ' + position[index])
       if (position[index] == 'rp') {
            //Draw Red piece
            console.log('drawing red piece')
            var p = new Piece(coords[index][0], coords[index][1], radius, colors.red, false, context).draw()
       } else if (position[index] == 'rk') {
            //Draw Red King
            var p = new Piece(coords[index][0], coords[index][1], radius, colors.red, true, context).draw()
       } else if (position[index] == 'wp') {
            //Draw White piece
            console.log('drawing white piece')
            var p = new Piece(coords[index][0], coords[index][1], radius, colors.white, false, context).draw()
       } else if (position[index] == 'wk') {
               //Draw White King
           var p = new Piece(coords[index][0], coords[index][1], radius, colors.white, true, context).draw()
       } 
    }
}

function setPosition(fen) {
    // Interprets a FEN string to return the desired position
    // Example FEN 
    // [FEN "B:W18,24,27,28,K10,K15:B12,16,20,K22,K25,K29"]
    let turn = fen.split(':')[0].replace("FEN", "").replace("[","").replace(" ","").replace('"',"")
    console.log('current Turn: ' + turn)
    let redString = fen.split(":")[2].replace("B","").replace('"',"").replace("]","").split(",")
    let whiteString = fen.split(":")[1].replace("W","").replace('"',"").replace("]","").split(",")
    console.log('Red squares: ' + redString)
    console.log('White squares: ' + whiteString)
    let position = []
    for (let index = 0; index < 32; index++) {
       position.push("") 
    }
    redString.forEach(element => {
        if (element.indexOf("K") > -1) {
            let p = element.replace("K","")
            position[p-1] = "rk"
        } else {
            position[element-1] = "rp"
        }
    });
    whiteString.forEach(element => { 
        if (element.search("K") > -1) {
            let p = element.replace("K", "")
            position[p-1] = "wk"
        } else {
            position[element-1] = "wp"
        }
    });
    console.log('New Position:')
    console.log(position)
    return position
}

drawBoard(canvas.width, canvas.height, ctx);
console.log(getPiecePlacements(canvas));
let coordinates = getPiecePlacements(canvas);

//drawPosition(startingPosition, coordinates, ctx);
let pos = setPosition('[FEN "W:W18,24,27,28,K10,K15:B12,16,20,K22,K25,K29"]')
drawPosition(pos, coordinates, ctx);
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
