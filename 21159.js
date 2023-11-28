const fs = require("fs");

const skipArr = ['cache', '_locals', 'settings'];
const renderEngine = async (filePath, options, callBack) => {
    let content = await fs.promises.readFile(filePath, { encoding: "utf-8" });
    let rendered = content;
    for (const key in options) {
        if (options.hasOwnProperty(key) && skipArr.indexOf(key) === -1) {
            // For
            const reFor = new RegExp(`21159{ *for +([a-zA-Z]+) +in +${key} *}([\\s\\S]*?){ *\/for *}`, 'g');
            let matchesFor = rendered.match(reFor);
            if (matchesFor != null) {
                matchesFor.forEach(match => {
                    let replacement = ""
                    const token = reFor.exec(match);
                    const valName = token[1]
                    const htmlScript = token[2];
                    reFor.lastIndex = 0;
                    options[key].forEach(element => {
                        replacement += htmlScript;
                        var pattern = new RegExp(`{ *${valName} *}`, 'g');
                        replacement = replacement.replace(pattern, element)
                        for (const prop in element) {
                            var changeValue = new RegExp(`{ *${valName}.${prop}} *`, 'g');
                            replacement = replacement.replace(changeValue, `${element[prop]}`)
                        }
                    });
                    rendered = rendered.replace(match, replacement);
                });
            }
            // Value
            var pattern = new RegExp(`21159{ *${key} *}`, 'g');
            rendered = rendered.replace(pattern, options[key]);
            for(const prop in options[key]) {
                var changeValue = new RegExp(`21159{ *${key}.${prop} *}`, 'g');
                rendered = rendered.replace(changeValue, `${options[key][prop]}`)
            }
            // If
            const reIf = new RegExp(`21159{if +${key} *}([\\s\\S]*?){ *\/if *}`, 'g');
            const elseRe = new RegExp(`{ *else *}([\\s\\S]*?){ *\/if *}`, 'g');
            let matchesIF = rendered.match(reIf);
            if (matchesIF != null) {
                matchesIF.forEach(match => {
                    let replacement = ""
                    if (options[key]) {
                        replacement = match.replace(match.match(elseRe)[0], '')
                        const reTemp = new RegExp(`21159{if +${key} *}`, 'g');
                        replacement = replacement.replace(reTemp, '');
                    } else {
                        replacement = match.match(elseRe)[0];
                        replacement = replacement.replace(new RegExp(`{ *else *}`), '');
                        replacement = replacement.replace(new RegExp(`{ */if *}`), '');
                    }
                    rendered = rendered.replace(match, replacement)
                });
            }
        }

    }
    return callBack(null, rendered);
}

module.exports = renderEngine;
