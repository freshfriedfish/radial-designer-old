import {Pane} from 'tweakpane';
import {Matrix} from 'ml-matrix';


let pickedObj;
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
        default: 'default',
        line: 'line',
        curve: 'curve',
    }
}).on('change', (ev) => {
    //list of options
    switch (ev.value) {
        case 'default':
            buttontest.hidden = false;
            break;
        case 'line':
            buttontest.hidden = true;
            pickedObj = straight;
            break;
        case 'curve':
            buttontest.hidden = true;
            pickedObj = quadCurve;
            break;

    }
    console.log(ev.value);
    //console.log(pickedObj.toString());
});
let file = null;
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
    }, { once: true })
    input.click();
})


const testText = pane.addBlade({
    view: 'text',
    label: 'name',
    value: 'bruh',
    parse: (v) => String(v),
    hidden: true,

})
