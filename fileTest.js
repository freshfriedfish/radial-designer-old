import {BeatmapDecoder} from 'osu-parsers'
import {Matrix} from 'ml-matrix';
import textfile from "/filetemplate.osu?raw";

const beatmap1 = new BeatmapDecoder().decodeFromString(textfile, true);
const finalObj = beatmap1.hitObjects[beatmap1.hitObjects.length - 1];
const emptyMat = new Matrix([
    [],
    [],
]);
console.log(finalObj.path);
// emptyMat.addColumn(finalObj.startPosition.toString().split(',').map(Number));
// console.log(finalObj.startPosition.toString().split(',').map(Number));
// console.log(beatmap1.hitObjects[0].path._controlPoints[1].position.toString());

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
console.log(finalObj.path.controlPoints);
console.log(newerarr);

newerarr.forEach((ele) => emptyMat.addColumn(ele));
emptyMat.addColumnVector(finalObj.startPosition.toString().split(',').map(Number))
console.log(emptyMat.transpose().to2DArray());

//console.log(beatmap1.hitObjects[1].path.controlPoints);