import {Pane} from 'tweakpane';
import {Matrix} from 'ml-matrix';

//example shapes

const straight = new Matrix([[141, 331], [233, 216],]);
const quadCurve = new Matrix([[150, 238, 332], [122, 38, 125],]);
const bezCurve = new Matrix([[150, 189, 378, 420], [122, 52, 53, 130],]);

const pane = new Pane({
    title: 'Parameters', expanded: true,
});
const PARAMS = {copies: 3, rotate_single: 0, rotate_all: 0, dist: 0, center: false, export: ""};

pane.addBinding(PARAMS, 'copies', {step: 1, min: 3, max: 10,});
pane.addBinding(PARAMS, 'rotate_single', {step: 1, min: -180, max: 180,});
pane.addBinding(PARAMS, 'rotate_all', {step: .1, min: -180, max: 180,});
pane.addBinding(PARAMS, 'dist', {step: 1, min: 0, max: 300,});
pane.addBinding(PARAMS, 'center')
pane.addBinding(PARAMS, 'export', {
    readonly: true, multiline: true, rows: 10,
});


//[[141, 233, 331, 216]]
console.log(straight.to2DArray(), straight.to1DArray());
console.log(quadCurve.to2DArray(), quadCurve.to1DArray());
console.log("150, 122, 238, 38, 332, 125");
console.log(bezCurve.to2DArray(), bezCurve.to1DArray());
console.log("150, 122, 189, 52, 378, 53, 420, 130");
//PARAMS.export = straight.to2DArray();
//
// let emptymat = new Matrix([[0], [0],]);
// console.log(emptymat.to2DArray());
// emptymat.addColumn(0, [10, 10]);
// console.log(emptymat.to2DArray());
// let colcount = straight.columns;
// let tempcol = bezCurve.getColumn(0);
// let tempmat = new Matrix([
//     [256-tempcol[0]],
//     [192-tempcol[1]]
// ]);
// for (let i = 0; i < 5; i++) {
//     tempmat.addColumn(0, [
//         [256-tempcol[0]],
//         [192-tempcol[1]]
//     ]);
// }
// console.log(tempmat.to2DArray());


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
            quadraticVertex(marr[0][1], marr[1][1], marr[0][2], marr[1][2],)
            break;
        case 4:
            vertex(marr[0][0], marr[1][0]);
            bezierVertex(marr[0][1], marr[1][1], marr[0][2], marr[1][2], marr[0][3], marr[1][3],)
    }
    endShape();
    rect(marr[0][0], marr[1][0], 10);
}

//---------------------------------------------------------------------------------------------------

window.setup = () => {
    createCanvas(windowWidth-100, windowHeight-100);
    strokeWeight(20);
    rectMode(CENTER);
    noFill();
};
window.draw = () => {
    translate(200, 200);
    background(100);
    rect(256, 192, 512, 384);
    let newmatrix = bezCurve.clone();
    let tempcol = bezCurve.getColumn(0);
    let tempmat = new Matrix([[256 - tempcol[0]], [192 - tempcol[1]]]);
    for (let i = 0; i < bezCurve.columns - 1; i++) {
        tempmat.addColumn(0, [256 - tempcol[0], 192 - tempcol[1]]);
    }
    if (PARAMS.center === true) newmatrix.add(tempmat); //center
    newmatrix.add(PARAMS.dist); //dist

    const rotationMat = new Matrix([
        [Math.cos(PARAMS.rotate_all), -Math.sin(PARAMS.rotate_all)],
        [Math.sin(PARAMS.rotate_all), Math.cos(PARAMS.rotate_all)],
    ]);
    // newmatrix.add(252)
    newmatrix = rotationMat.mmul(newmatrix);
    // newmatrix.sub(252)
    drawCurveSingleMatrix(newmatrix);
    push(); //text of head
    fill(0);
    textSize(32)
    text(newmatrix.getColumn(0), 50, 500);
    pop();

    PARAMS.export = JSON.stringify(newmatrix.to1DArray());

};
