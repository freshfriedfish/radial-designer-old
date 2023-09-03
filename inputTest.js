import {Pane} from 'tweakpane';
import {Matrix} from 'ml-matrix';
import {BeatmapDecoder} from 'osu-parsers'

let pickedObj = '';
const straight = new Matrix([
    [141, 331],
    [233, 216],
]);
const quadCurve = new Matrix([
    [150, 238, 332],
    [122, 38, 125],
]);

const pane = new Pane({
    title: 'test', expanded: true,
});

const IO = {
    importType: '', importObj: '', export: ''
};

pane.addBinding(IO, 'importType', {
    options: {
        line: 'line',
        curve: 'curve',
        choose: 'choose',
    }
}).on('change', (ev) => {
    //list of options
    switch (ev.value) {
        case 'line':
            buttontest.hidden = true;
            pickedObj = straight;
            break;
        case 'curve':
            buttontest.hidden = true;
            pickedObj = quadCurve;
            break;
        case 'choose':
            buttontest.hidden = false;
            pickedObj = textofFile;
            break;
    }
    console.log(ev.value);
    //console.log(pickedObj.toString());
});
let file = null;
let textofFile;
const buttontest = pane.addButton({
    title: 'Upload file',
    hidden: true,
}).on('click', () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.style.opacity = '0';
    input.style.position = 'fixed';
    document.body.appendChild(input);
    input.addEventListener('input', (ev) => {
        file = input.files[0];
        document.body.removeChild(input);
        file.text().then(result => {
            textofFile = result;
        })
    }, {once: true})
    input.click();
});

let fr = new FileReader();

const decoder = new BeatmapDecoder();
// const beatmap1 = await decoder.decodeFromPath(file, true);
// console.log(file);
// console.log(beatmap1);

//230,238,8569,2,0,P|281:167|305:244,1,200

window.setup = () => {

}

window.draw = () => {
    //console.log(textofFile);
    console.log(pickedObj.toString());
}