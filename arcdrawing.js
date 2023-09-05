import {Matrix} from 'ml-matrix';

const quadCurve = new Matrix([
    [150, 238, 332],
    [122, 38, 125],
]);

window.setup = () => {
    createCanvas(windowWidth, windowHeight);
    fill("rgba(0, 0, 0, 0)")
    rectMode(CENTER);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    strokeWeight(10);
};

window.draw = () => {
    translate(width / 2, height / 2);
    scale(2);
    //background('#0a538f');
    background(100);

    //drawPoints
    for (let i = 0; i < quadCurve.columns; i++) {
        const col = quadCurve.getColumn(i);
        point(col[0], col[1]);
    }



};