import {Pane} from 'tweakpane';
import {Matrix} from 'ml-matrix';

//example shapes
const straight = new Matrix([
    [141, 331],
    [233, 216],
]);
const quadCurve = new Matrix([
    [150, 238, 332],
    [122, 38, 125],
]);
const bezCurve = new Matrix([
    [150, 189, 378, 420],
    [122, 52, 53, 130],
]);

const multistraight = new Matrix([
    [192, 232, 232, 264, 264, 332],
    [152, 152, 152, 208, 208, 208],
]);
/*
TODO:
    - add .osu parsing
 */

const pane = new Pane({
    title: 'radial-designer', expanded: true,
});
const PARAMS = {
    welcome:'Welcome to radial-designer! Import your .osu slider code,\nor choose from a preset to get started',
    size: 50, copies: 3, rotate_single: 0, rotate_all: 0, dist: 50, center: true,
    importType: '', importObj: '', export: ''
};

pane.addBinding(PARAMS, 'welcome', {
    readonly: true, multiline: true, rows: 2, label: null,
});



((folder) => {
    //folder.addBinding(PARAMS, 'size', {step: 1, min: 1, max: 50,});
    folder.addBinding(PARAMS, 'copies', {step: 1, min: 1, max: 11,});
    folder.addBinding(PARAMS, 'dist', {step: 5, min: -200, max: 200, label: 'distance'});
    folder.addBinding(PARAMS, 'rotate_all', {step: 5, min: -180, max: 180, label: 'main rotate'});
    folder.addBinding(PARAMS, 'rotate_single', {step: 5, min: -180, max: 180, label: 'sub rotate'});
    folder.addBinding(PARAMS, 'size', {step: 5, min: 25, max: 75,});
    folder.addBinding(PARAMS, 'center', {label: 'center object'})
})(pane.addFolder({
    title: 'parameters',
}));
((folder) => {
    folder.addBinding(PARAMS, 'importType', {
        options: {
            choose: 'CHOOSE',
            straight: 'STRAIGHT',
            curve: 'CURVE',
        }, label: 'import presets',
    })
    folder.addBinding(PARAMS, 'importObj', {
        label: 'import paste'
    })
    folder.addBlade({
        view: 'separator',
    });
    folder.addBinding(PARAMS, 'export', {
        readonly: true, multiline: true, rows: 8, label: null
    });

})(pane.addFolder({
    title: 'import/export',
}));
//----------------------------------------------------------------------------------------------------------------------
window.setup = () => {
    createCanvas(windowWidth, windowHeight);
    fill("rgba(0, 0, 0, 0)")
    rectMode(CENTER);
};
window.draw = () => {
    translate(width / 2, height / 2);
    //background('#0a538f');
    background(100);
    scale(2.2);
    stroke(255, 255, 255);
    rect(0, 0, 512, 384);
    //translate(256, 192);
    const rotateAll = new Matrix([[Math.cos(degToRad(PARAMS.rotate_all)), -Math.sin(degToRad(PARAMS.rotate_all))], [Math.sin(degToRad(PARAMS.rotate_all)), Math.cos(degToRad(PARAMS.rotate_all))],]);
    const rotateSingle = new Matrix([[Math.cos(degToRad(PARAMS.rotate_single)), -Math.sin(degToRad(PARAMS.rotate_single))], [Math.sin(degToRad(PARAMS.rotate_single)), Math.cos(degToRad(PARAMS.rotate_single))],]);

    let newmatrix = multistraight.clone(); //what is newmatrix??
    const tempcol = multistraight.getColumn(0);
    const tempmat = new Matrix([[0 - tempcol[0]], [0 - tempcol[1]]]);
    for (let i = 0; i < multistraight.columns - 1; i++) {
        tempmat.addColumn(0, [0 - tempcol[0], 0 - tempcol[1]]);
    }
    if (PARAMS.center === true) newmatrix.add(tempmat); //centerize

    newmatrix = rotateSingle.mmul(newmatrix);
    newmatrix.add(PARAMS.dist); //dist
    newmatrix = rotateAll.mmul(newmatrix);
    newmatrix.round();
    let otherMatrices = newmatrix.clone(); //??

    const allMatArr = [];
    const centralAngle = 360 / PARAMS.copies;
    const copyRotate = new Matrix([[Math.cos(degToRad(centralAngle)), -Math.sin(degToRad(centralAngle))], [Math.sin(degToRad(centralAngle)), Math.cos(degToRad(centralAngle))],]);

    for (let i = 0; i < PARAMS.copies; i++) {
        otherMatrices = copyRotate.mmul(otherMatrices)
        otherMatrices.round();
        allMatArr.push(otherMatrices)
        //slider drawing
        const headparams = otherMatrices.getColumn(0);
        push();
        stroke(255, );
        strokeWeight(PARAMS.size);
        drawCurveSingleMatrixHelper(otherMatrices);
        stroke(10, 83, 143, );
        strokeWeight(PARAMS.size-5);
        drawCurveSingleMatrixHelper(otherMatrices);
        stroke(255, );
        strokeWeight(PARAMS.size);
        circle(headparams[0], headparams[1], 1)
        stroke(10, 83, 143, );
        strokeWeight(PARAMS.size-5);
        circle(headparams[0], headparams[1], 1)

        pop();


        //PARAMS.export = PARAMS.export +'\n'+ JSON.stringify(otherMatrices.to1DArray());
        //console.log(JSON.stringify(otherMatrices.to1DArray()));
    }
    //PARAMS.export = newmatrix.to1DArray() + '\n' + 'hello';
    allMatArr.forEach((element)=> element.sub(tempmat))
    const arraymap = allMatArr.map((x) => x.to1DArray());
    const stringtest = arraymap.join('\n');
    PARAMS.export = stringtest;

};
//----------------------------------------------------------------------------------------------------------------------
function drawCurveSingleMatrixHelper(matrix) {
    const matCopy = matrix.clone();
    const grouped = []
    let curr = matCopy.getColumnVector(0);
    let prev = null
    let temp = new Matrix(2, 1);

    for (let i = 1; i < matCopy.columns; i++) {
        if (JSON.stringify(curr) !== JSON.stringify(prev)) {
            temp.addColumn(temp.columns - 1, curr)
            prev = curr.clone();
            curr = matCopy.getColumnVector(i);
        } else {
            grouped.push(temp);
            temp = new Matrix(2, 1);
            temp.addColumn(temp.columns - 1, curr)
            curr = matCopy.getColumnVector(i);
        }
    }
    temp.addColumn(temp.columns - 1, matCopy.getColumnVector(matCopy.columns - 1))
    grouped.push(temp);

    grouped.forEach((element) => {
        element.flipRows();
        element.removeColumn(0);
        element.flipRows();
        drawCurveSingleMatrixHelper2(element);
    });
}

function drawCurveSingleMatrixHelper2(matrix){
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
    //rect(marr[0][0], marr[1][0], 10);
}


function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}