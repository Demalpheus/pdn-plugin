const colors = {
    red: "#CC0000",
    white: "#FDEEC6",
    light: "#FFFFCC",
    dark: "#669966"
}
var numberFont = "12px Arial"

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
        let fen = this.getAttribute('data-fen');
        // Check to see if the data-reverse-board value is set, else use a default value of true
        let reversed = ((null == this.getAttribute('data-reverse-board')) ? true : this.getAttribute('data-reverse-board'))
        let showNumbers = ((null == this.getAttribute('data-show-numbers')) ? true : this.getAttribute('data-show-numbers'))

        //console.log('Position Reversed?: ' + reversed);
        //console.log('Attribute: ' + fen);
        let newBoard = document.createElement('canvas');
        let size = getBoardSize();
        newBoard.width = size;
        newBoard.height = size;
        this.appendChild(newBoard);
        let context = newBoard.getContext("2d");
        drawBoard(newBoard.width, newBoard.height, reversed, showNumbers, context);
        let coordinates = getPiecePlacements(newBoard);
        let position = setPosition(fen)
        //console.log('NEW POSITION RETURNED: ' + position);
        drawPosition(position, coordinates, newBoard.width, reversed, context);
    }
}

customElements.define('pdn-fen', FENComponent);

function getBoardSize() {
    let w = window.innerWidth
    let h = window.innerHeight
    let s = 0
    if (h > w) {
        // This is probably a mobile device
        s = Math.ceil(w * .90)
    } else if (w > 800) {
        // Desktop mode
        s = Math.ceil(w * .30)
    } else {
        s = Math.ceil(w * .75)
    }
    return s
}

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

function drawBoard(width, height, isReversed, showNumbers, context) {
    // Color the background
    context.beginPath()
    context.fillStyle = colors.light
    context.rect(0, 0, width, height)
    context.fill()
    context.stroke()
    let size = width / 8
    let boardNumber = (isReversed) ? 33 : 0
    for (let index = 0; index < 8; index++) {
        if (index % 2 == 1) {
            // This is an odd row
            let start = 0
            for (let col = 1; col < 5; col++) {
                let s = new Square(start, index*size, size, size, colors.dark, context).draw()
                if (showNumbers == true) {
                    boardNumber += (isReversed) ? -1 : 1
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
                    boardNumber += (isReversed) ? -1 : 1
                    //console.log(context)
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

function drawPosition(position, coords, width, reverseBoard, context) {
    // Receive an array of pieces and draw them on the board
    if (reverseBoard == true) {
        position = position.reverse()
    }
    let radius = width / 8 * .33
    for (let index = 0; index < position.length; index++) {
        //console.log('Checking index: ' + index + ' for piece: ' + position[index])
       if (position[index] == 'rp') {
            //Draw Red piece
            //console.log('drawing red piece')
            var p = new Piece(coords[index][0], coords[index][1], radius, colors.red, false, context).draw()
       } else if (position[index] == 'rk') {
            //Draw Red King
            var p = new Piece(coords[index][0], coords[index][1], radius, colors.red, true, context).draw()
       } else if (position[index] == 'wp') {
            //Draw White piece
            //console.log('drawing white piece')
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
    //console.log('current Turn: ' + turn)
    let redString = fen.split(":")[2].replace("B","").replace('"',"").replace("]","").split(",")
    let whiteString = fen.split(":")[1].replace("W","").replace('"',"").replace("]","").split(",")
    //console.log('Red squares: ' + redString)
    //console.log('White squares: ' + whiteString)
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
    //console.log('New Position:')
    //console.log(position)
    return position
}

/* Initial Example Calls
drawBoard(canvas.width, canvas.height, false, ctx);
console.log(getPiecePlacements(canvas));
let coordinates = getPiecePlacements(canvas);

//drawPosition(startingPosition, coordinates, ctx);
let pos = setPosition('[FEN "W:W18,24,27,28,K10,K15:B12,16,20,K22,K25,K29"]')
drawPosition(pos, coordinates, ctx);
*/

