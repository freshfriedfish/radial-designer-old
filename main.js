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
    readonly:true,
    multiline:true,
    rows:10,
});

const matrix = Matrix.ones(5, 5);

console.log(matrix.to2DArray());