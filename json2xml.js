const loadJsonFile = require('load-json-file');
const fs = require('fs');
 
loadJsonFile('json2xml.json').then(json => {
    const type = Object.prototype.toString.call(json).slice(8, -1);
    const xmlString = type === 'Array' ? exportXmlString(json, 0, 'item') : exportXmlString(json, 0);
    
    fs.readFile('./template.xml', {encoding: 'utf-8'}, (err, file) => {
        if (!err) {
            console.log(file);
            fs.writeFile('./content.xml', file.replace('/*content*/', xmlString), {encoding: 'utf-8'}, err => {
                if (!err) {
                    console.log('finish!')
                }
            })
        }  
    })
});

function exportXmlString(data, depth, tagName) {
    let xmlString = '';
    for (const i of Object.keys(data)) {
        const type = Object.prototype.toString.call(data[i]).slice(8, -1);
        const tString = (new Array(depth)).fill(1).reduce(sum => sum + '\t', '');
        if (['Array', 'Object'].indexOf(type) > -1) {
            xmlString = xmlString + `${tString}<${tagName || i}>\n${(type === 'Array' ? exportXmlString(data[i], depth + 1, `${tagName || i}Item`) : exportXmlString(data[i], depth + 1))}${tString}</${tagName || i}>\n`
        } else {
            xmlString = xmlString + `${tString}<${tagName || i}>${data[i]}</${tagName || i}>\n`
        }
    }
    return xmlString;
}