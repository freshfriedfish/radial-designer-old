import {Pane} from 'tweakpane';
import {Matrix} from 'ml-matrix';

//example shapes

const straight = new Matrix([[141, 331], [233, 216],]);
const quadCurve = new Matrix([[150, 238, 332], [122, 38, 125],]);
const bezCurve = new Matrix([[150, 189, 378, 420], [122, 52, 53, 130],]);

const pane = new Pane({
    title: 'Parameters', expanded: true,
});
const PARAMS = {copies: 3, rotate_single: 0, rotate_all: 0, dist: 0, center: true, export: ""};

pane.addBinding(PARAMS, 'copies', {step: 1, min: 1, max: 20,});
pane.addBinding(PARAMS, 'rotate_single', {step: 1, min: -180, max: 180,});
pane.addBinding(PARAMS, 'rotate_all', {step: 1, min: -180, max: 180,});
pane.addBinding(PARAMS, 'dist', {step: 1, min: 0, max: 300,});
pane.addBinding(PARAMS, 'center')
pane.addBinding(PARAMS, 'export', {
    readonly: true, multiline: true, rows: 10,
});

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

function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

//---------------------------------------------------------------------------------------------------

window.setup = () => {
    createCanvas(windowWidth - 100, windowHeight - 100);
    strokeWeight(20);
    rectMode(CENTER);
    noFill();
};
window.draw = () => {
    background(100);
    rect(256, 192, 512, 384);
    translate(256, 192);
    let newmatrix = bezCurve.clone();
    let tempcol = bezCurve.getColumn(0);
    let tempmat = new Matrix([[0 - tempcol[0]], [0 - tempcol[1]]]);
    for (let i = 0; i < bezCurve.columns - 1; i++) {
        tempmat.addColumn(0, [0 - tempcol[0], 0 - tempcol[1]]);
    }
    if (PARAMS.center === true) newmatrix.add(tempmat); //center
    newmatrix.add(PARAMS.dist); //dist

    const rotateAllMat = new Matrix([
        [Math.cos(degToRad(PARAMS.rotate_all)), -Math.sin(degToRad(PARAMS.rotate_all))],
        [Math.sin(degToRad(PARAMS.rotate_all)), Math.cos(degToRad(PARAMS.rotate_all))],
    ]);
    const rotateSingMat = new Matrix([
        [Math.cos(degToRad(PARAMS.rotate_single)), -Math.sin(degToRad(PARAMS.rotate_single))],
        [Math.sin(degToRad(PARAMS.rotate_single)), Math.cos(degToRad(PARAMS.rotate_single))],
    ]);

    newmatrix = rotateAllMat.mmul(newmatrix);

    let otherMatrices = newmatrix.clone();
    for (let i = 0; i < PARAMS.copies; i++) {

        const copyRotate = new Matrix([
            [Math.cos(2*Math.PI / PARAMS.copies * i), -Math.sin(2*Math.PI / PARAMS.copies * i)],
            [Math.sin(2*Math.PI / PARAMS.copies * i), Math.cos(2*Math.PI / PARAMS.copies * i)],
        ]);
        otherMatrices = copyRotate.mmul(otherMatrices);
        drawCurveSingleMatrix(otherMatrices);

        //PARAMS.export = PARAMS.export +'\n'+ JSON.stringify(otherMatrices.to1DArray());
        console.log(JSON.stringify(otherMatrices.to1DArray()));
    }
/*
dont rotate and draw othermatrices same time
 */


    push(); //text of head
    fill(0);
    textSize(32)
    text(newmatrix.getColumn(0), 50, 500);
    pop();


};
