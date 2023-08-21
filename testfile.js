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

window.setup = () => {
    createCanvas(windowWidth, windowHeight);
    fill("rgba(0, 0, 0, 0)")
    rectMode(CENTER);

};
window.draw = () => {
    scale(2);
    //translate(width/8,height/16);
    background(100);
    rect(256, 192, 512, 384);
    translate(256, 192);
    const rotateAll = new Matrix([[Math.cos(degToRad(PARAMS.rotate_all)), -Math.sin(degToRad(PARAMS.rotate_all))], [Math.sin(degToRad(PARAMS.rotate_all)), Math.cos(degToRad(PARAMS.rotate_all))],]);
    const rotateSingle = new Matrix([[Math.cos(degToRad(PARAMS.rotate_single)), -Math.sin(degToRad(PARAMS.rotate_single))], [Math.sin(degToRad(PARAMS.rotate_single)), Math.cos(degToRad(PARAMS.rotate_single))],]);

    let newmatrix = bezCurve.clone(); //what is newmatrix??
    const tempcol = bezCurve.getColumn(0);
    const tempmat = new Matrix([[0 - tempcol[0]], [0 - tempcol[1]]]);
    for (let i = 0; i < bezCurve.columns - 1; i++) {
        tempmat.addColumn(0, [0 - tempcol[0], 0 - tempcol[1]]);
    }
    if (PARAMS.center === true) newmatrix.add(tempmat); //centerize

    newmatrix = rotateSingle.mmul(newmatrix);
    newmatrix.add(PARAMS.dist); //dist
    newmatrix = rotateAll.mmul(newmatrix);

    let otherMatrices = newmatrix.clone(); //??

    const allMatArr = [newmatrix.clone()];
    const centralAngle = 360 / PARAMS.copies;
    const copyRotate = new Matrix([[Math.cos(degToRad(centralAngle)), -Math.sin(degToRad(centralAngle))], [Math.sin(degToRad(centralAngle)), Math.cos(degToRad(centralAngle))],]);

    for (let i = 0; i < PARAMS.copies; i++) {
        otherMatrices = copyRotate.mmul(otherMatrices)


        allMatArr.push(otherMatrices)
        drawCurveSingleMatrixHelper(otherMatrices);

        //PARAMS.export = PARAMS.export +'\n'+ JSON.stringify(otherMatrices.to1DArray());
        //console.log(JSON.stringify(otherMatrices.to1DArray()));
    }
    newmatrix.round();

    PARAMS.export = newmatrix.to1DArray() + '\n' + 'hello';

};
//----------------------------------------------------------------------------------------------------------------------

function drawCurveSingleMatrix(matrix){


}

function drawCurveSingleMatrixHelper(matrix) {
    const marr = matrix.to2DArray();
    beginShape();
    vertex(marr[0][0], marr[1][0]);
    switch (marr[0].length) {
        case 2:
            vertex(marr[0][1], marr[1][1]);
            break;
        case 3:
            quadraticVertex(marr[0][1], marr[1][1], marr[0][2], marr[1][2],)
            break;
        case 4:
            bezierVertex(marr[0][1], marr[1][1], marr[0][2], marr[1][2], marr[0][3], marr[1][3],)
    }
    endShape();
    rect(marr[0][0], marr[1][0], 10);
}

function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}