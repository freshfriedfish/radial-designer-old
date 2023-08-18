import {Pane} from 'tweakpane';
import {Matrix} from 'ml-matrix';

//example shapes

const straight = new Matrix([
    [141, 331],
    [233, 216],
]);
const straight3d = new Matrix([
    [141, 331,0],
    [233, 216,0],
    [0,0,1]
]);
const quadCurve = new Matrix([
    [150, 238, 332],
    [122, 38, 125],
]);
const bezCurve = new Matrix([
    [150, 189, 378, 420],
    [122, 52, 53, 130],
]);

const pane = new Pane({
    title: 'Parameters',
    expanded: true,
});
const PARAMS = {copies: 3, rotate_single: 0, rotate_all: 0, dist: 0, export: ""};

pane.addBinding(PARAMS, 'copies', {step: 1, min: 3, max: 10,});
pane.addBinding(PARAMS, 'rotate_single', {step: 1, min: -180, max: 180,});
pane.addBinding(PARAMS, 'rotate_all', {step: 1, min: -180, max: 180,});
pane.addBinding(PARAMS, 'dist', {step: 1, min: 0, max: 300,});
pane.addBinding(PARAMS, 'export', {
    readonly: true,
    multiline: true,
    rows: 10,
});
//[[141, 233, 331, 216]]
console.log(straight.to2DArray(), straight.to1DArray());
console.log(quadCurve.to2DArray(), quadCurve.to1DArray());
console.log("150, 122, 238, 38, 332, 125");
console.log(bezCurve.to2DArray(), bezCurve.to1DArray());
console.log("150, 122, 189, 52, 378, 53, 420, 130");
//PARAMS.export = straight.to2DArray();

function drawLine(arr) {
    beginShape();
    vertex(arr[0][0], arr[1][0]);
    vertex(arr[0][1], arr[1][1]);
    endShape();
    rect(arr[0][0], arr[1][0], 10);
}

function drawCurveSingleMatrix(matrix) {
    const marr = matrix.to2DArray();
    beginShape();
    switch (marr[0].length) {
        case 2:
            vertex(marr[0][0], marr[1][0]);
            vertex(marr[0][1], marr[1][1]);
            break;
        case 3:
            vertex(marr[0][0], marr[1][0]);
            quadraticVertex(marr[0][1],marr[1][1],marr[0][2],marr[1][2],)
            break;
        case 4:
            vertex(marr[0][0], marr[1][0]);
            bezierVertex(marr[0][1],marr[1][1],marr[0][2],marr[1][2],marr[0][3],marr[1][3],)
    }
    endShape();
    rect(marr[0][0], marr[1][0], 10);
}

//---------------------------------------------------------------------------------------------------

window.setup = () => {
    createCanvas(windowWidth, windowHeight);
    strokeWeight(20);
    rectMode(CENTER);
    noFill();
};
window.draw = () => {
    background(100);
    rect(256, 192, 512, 384);

    let move2 = new Matrix([
        [PARAMS.dist, PARAMS.dist,],
        [0, 1]
    ]);

    // let newmatrix = Matrix.add(straight, move2);


    let x,y;
    const centerM = new Matrix([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ]);

    //translate via mul
    const distM = new Matrix([
        [1,0,PARAMS.dist],
        [0,1,PARAMS.dist],
        [0,0,1],
    ]);

    let newmatrix = Matrix.add(straight, move2);

    drawCurveSingleMatrix(newmatrix);

    push();
    fill(0);
    textSize(32)
    text(newmatrix.getColumn(0), 50, 500);
    pop();

    PARAMS.export = JSON.stringify(bezCurve.to1DArray());

};
