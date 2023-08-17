import {Pane} from 'tweakpane';
import {Matrix} from 'ml-matrix';

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
let straight = new Matrix([
    [141, 331],
    [233, 216],
    [1,1],
]);

let straight2 = new Matrix([
    [141, 331],
    [233, 216],
]);


console.log(straight.to2DArray());
console.log(straight.to1DArray());

//PARAMS.export = straight.to2DArray();

window.setup = () => {
    createCanvas(512, 384);
    strokeWeight(20);
    rectMode(CENTER);
};

window.draw = () => {
    background(100);

    // let move = new Matrix([
    //     [1, 0, PARAMS.dist],
    //     [0, 1, 0],
    // ]);

    let move2 = new Matrix([
        [PARAMS.dist, PARAMS.dist,],
        [0, 1]
    ]);

    let newmatrix = Matrix.add(straight2, move2);
    //let newmatrix = move.mmul(straight);

    let newmatrixarr = newmatrix.to2DArray();

    console.log(newmatrix.to2DArray());

    drawLine(newmatrixarr);

    PARAMS.export = newmatrix.to1DArray();


};

function drawLine(arr) {
    beginShape();
    vertex(arr[0][0], arr[1][0]);
    vertex(arr[0][1], arr[1][1]);
    endShape();
    rect(arr[0][0], arr[1][0], 10);
}