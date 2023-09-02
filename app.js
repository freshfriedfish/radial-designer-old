import {Pane} from 'tweakpane';
import {Matrix} from 'ml-matrix';
import textfile from "/filetemplate.osu?raw";
import {BeatmapDecoder} from "osu-parsers";

//test shapes
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

const arcTest = new Matrix([
    [109,89 ,72 ,60 ,49 ,43 ,45 ,47 ,57,71,86,105,126,146,167,184,201,214,220,226,225,217,209,195,177],
    [216,210,198,180,163,142,122,101,82,67,53,43 ,41 ,39 ,45 ,56 ,67 ,85 ,104,124,146,165,184,200,209],
])

/*
TODO:
    - add .osu parsing
 */
//file decoding
const beatmap1 = new BeatmapDecoder().decodeFromString(textfile, true);
const finalObj = beatmap1.hitObjects[beatmap1.hitObjects.length - 1];
const emptyMat = new Matrix([
    [],
    [],
]);

const newerarr = [];
finalObj.path.controlPoints.forEach(pathpoint => {
    const ifdupe = pathpoint.type;
    if (ifdupe != null) {
        newerarr.push(pathpoint.position.toString().split(','), pathpoint.position.toString().split(','));
    } else {
        newerarr.push(pathpoint.position.toString().split(','));
    }
});
newerarr.shift();
// console.log(finalObj.path.controlPoints);
// console.log(newerarr);

newerarr.forEach((ele) => emptyMat.addColumn(ele));
emptyMat.addColumnVector(finalObj.startPosition.toString().split(',').map(Number))

//pane
const pane = new Pane({
    title: 'radial-designer', expanded: false,
});

const PARAMS = {
    welcome:'Welcome to radial-designer! Import your .osu slider code,\nor choose from a preset to get started',
    size: 50, copies: 3, rotate_single: 0, rotate_all: 0, dist: -50, center: true,
    importType: '', importObj: '', export: ''
};

pane.addBinding(PARAMS, 'welcome', {
    readonly: true, multiline: true, rows: 2, label: null,
});

((folder) => {
    //folder.addBinding(PARAMS, 'size', {step: 1, min: 1, max: 50,});
    folder.addBinding(PARAMS, 'copies', {step: 1, min: 1, max: 12,});
    folder.addBinding(PARAMS, 'dist', {step: 1, min: -300, max: 300, label: 'distance'});
    folder.addBinding(PARAMS, 'rotate_single', {step: 1, min: -180, max: 180, label: 'fine rotation'});
    folder.addBinding(PARAMS, 'rotate_all', {step: 1, min: -180, max: 180, label: 'full rotation'});
    folder.addBinding(PARAMS, 'size', {step: 1, min: 25, max: 75,});
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
    folder.addBinding(PARAMS, 'export', {
        readonly: true, multiline: true, rows: 8, label: null
    });
    folder.addButton({
        title: 'capture image',
    })

})(pane.addFolder({
    title: 'import/export',
}));
//----------------------------------------------------------------------------------------------------------------------
window.setup = () => {
    createCanvas(windowWidth, windowHeight);
    fill("rgba(0, 0, 0, 0)")
    rectMode(CENTER);
    strokeCap(ROUND);
    strokeJoin(ROUND);
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

    let newmatrix = emptyMat.clone(); //what is newmatrix??
    const tempcol = newmatrix.getColumn(0);
    const tempmat = new Matrix([[0 - tempcol[0]], [0 - tempcol[1]]]);
    for (let i = 0; i < newmatrix.columns - 1; i++) {
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
        stroke(255, 100);
        strokeWeight(PARAMS.size);
        drawCurveSingleMatrix(otherMatrices);
        stroke(10, 83, 143, 100);
        strokeWeight(PARAMS.size-5);
        drawCurveSingleMatrix(otherMatrices);
        //head drawing
        stroke(255, 100);
        strokeWeight(PARAMS.size);
        circle(headparams[0], headparams[1], 1)
        stroke(10, 83, 143, 100);
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
function drawCurveSingleMatrix(matrix) {
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
    });
    beginShape();
    for (let i = 0;i<grouped.length;i++) {
        const marr = grouped[i].to2DArray();
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
        //rect(marr[0][0], marr[1][0], 10);
    }
    endShape();
}
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}