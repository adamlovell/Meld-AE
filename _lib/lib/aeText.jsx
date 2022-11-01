#include "adData.js";
#include "aeUtils.jsx";

function setStackedText(ad, tf, area, text, comp, fontSize, invert) {
    var lines = getLines(text);
    var tfs = [];
    for (var i = 0; i < lines.length; i++) {
        var newTF = lines.length > 1 ? tf.duplicate() : tf;

        var textProp = 	newTF.property("Source Text");
		var textDocument = textProp.value;
        var fontSizes = [fontSize, fontSize * 0.5];
        if (invert) {
            fontSizes.reverse();
        }
        textDocument.fontSize = fontSizes[i];
        textProp.setValue(textDocument);

        var string = lines[i];
        //string = string.toUpperCase();
        newTF.property("Source Text").setValue(string);
        tfs.push(newTF)
    }
    if (tfs.length > 1) {
        //centerStackedTFs(ad, area, tfs);
    } else {
        centerTF(newTF, area, 0);
    }
    return tfs;
}

function setText(tf, text, fontSize) {
    tf.property("Source Text").setValue(text);
    if (fontSize) {
        var textProp = tf.property("Source Text");
        var textDocument = textProp.value;
        textDocument.fontSize = fontSize;
        textProp.setValue(textDocument);
    }
}

function nudgeText(tf, offset) {
    tfPos = tf.position.value;
    tf.position.setValue([tfPos[0] + offset[0], tfPos[1] + offset[1], tfPos[2] + offset[2]]);;
}

function removeChars(chars, text) {
    // todo: make regular expression 
    return text.replace(chars, '');
}

function getLines(text) {
    var lines = [];
    var textSplit = text.split('\r');
    for (var i = 0; i < textSplit.length; i++) {
        textSplit[i] = removeChars('\r', textSplit[i]);
        if(textSplit[i].length >= 1) {
            lines.push(textSplit[i]);
        }
    }
    return lines;
}

function formatText(text) {
    return text;
}

function centerStackedTFs(ad, area, tfs) {
    // var tf1Ht = tfs[0].sourceRectAtTime(0, true).height;
    // var tf2Ht = tfs[1].sourceRectAtTime(0, true).height;
    // var pdiff = Math.max(tf1Ht, tf2Ht) / Math.min(tf1Ht, tf2Ht);
    // var tf1Lrg = tf1Ht > tf2Ht;
    // var lrgTf = tf1Lrg ? tfs[0] : tfs[1];

    // setlLeading(tfs[0]);
    // setlLeading(tfs[1]);

    // var pilotTf = lrgTf.duplicate();
    // pilotTf.property("Source Text").setValue('A');
    // // var l1s = pilotTf.sourceRectAtTime(0, true).height;
    // var l1s = getFontSize(pilotTf);
    // var tfSource = pilotTf.sourceText;
    // var txtDoc = tfSource.value;
    // var fontSize = txtDoc.fontSize;

    // pilotTf.property("Source Text").setValue('A\rA');
    // //var l2s = pilotTf.sourceRectAtTime(0, true).height;
    // var l2s = getFontSize(pilotTf);
    // var leading = l2s * 0.05;

    // pilotTf.property("Source Text").setValue('A,');
    // var l1sp = pilotTf.sourceRectAtTime(0, true).height;

    // var lrgTfHt = Math.max(tf1Ht, tf2Ht);
    // var tf1Off = -((tf1Ht / 2));
    // var tf2Off = ((tf2Ht / 2));
    // var totOff = (tf1Off + tf2Off);

    // pilotTf.remove();
    // centerTF(tfs[0], area, tf1Off - totOff - (leading / 2));
    // centerTF(tfs[1], area, tf2Off - totOff + (leading / 2));

    setlLeading(tfs[0]);
    setlLeading(tfs[1]);

    var leading = (Math.max(getLeading(tfs[0]), getLeading(tfs[1])) * 0.15);

    var areaPos = area.position.value;
    var areaHeight = area.sourceRectAtTime(0, true).height;    

    var tfH = tfs[0].sourceRectAtTime(0, true).height;
    var tfPos = tfs[0].position.value;
    var mvTot1 = (areaHeight/2) - (tfH/2) - tfH/2 - leading/2;
    
    tfH = tfs[1].sourceRectAtTime(0, true).height;
    tfPos = tfs[1].position.value;
    var mvTot2 = (areaHeight/2) - (tfH/2) + tfH/2 + leading/2;

    tfs[0].position.setValue([tfPos[0], areaPos[1] + mvTot1, tfPos[2]]);;
    tfs[1].position.setValue([tfPos[0], areaPos[1] + mvTot2, tfPos[2]]);
}

function centerTF(tf, area, offset) {
    var tfPos = tf.position.value;
    var tfHeight = tf.sourceRectAtTime(0, true).height;
    var areaPos = area.position.value;
    var areaHeight = area.sourceRectAtTime(0, true).height;
    if (tfHeight > plainTxtHeight(tf)*2) {
        //ASSUMES TWO LINES
        var plainH = plainTxtHeight(tf)*2;
        tf.position.setValue([tfPos[0], areaPos[1] + (areaHeight / 2) - (tfHeight / 2 ) + (offset) - (txtAccentOffset(tf)/4), tfPos[2]]);
    } else {
        //tf.position.setValue([tfPos[0], areaPos[1] + (areaHeight / 2) - (tfHeight / 2 ) + (offset) - (txtAccentOffset(tf)/2), tfPos[2]]);
        tf.position.setValue([tfPos[0], areaPos[1] + (areaHeight / 2) - (tfHeight / 2 ) + (offset), tfPos[2]]);
    }
}

function setlLeading(tf) { 
    var tfs = tf.sourceText;
    var txtd = tfs.value;

    if (hasAccentChars(tf)) {
        txtd.leading = getFontSize(tf) * 1.1;  
    } else {
         txtd.leading = getFontSize(tf) * 0.9;  
    }

    tfs.setValue(txtd);
}

function hasAccentChars(tf) {
    var newAccentChars = accentCharsArray();
    var tfs = tf.sourceText;
    var txtd = tfs.value;


    var accentChars = false;
    for (var i = 0; i < newAccentChars.length; i++) {
        if (txtd.text.toUpperCase().match(newAccentChars[i])) {
            accentChars = true;
        }
    }
    return accentChars;
}

function getFontSize(tf) {
    var tfs = tf.sourceText;
    var txtd = tfs.value;
    return txtd.fontSize;
}

function getLeading(tf) {
    var tfs = tf.sourceText;
    var txtd = tfs.value;
    return txtd.leading;
}

function txtAccentOffset(tf) {
    var orgH = tf.sourceRectAtTime(0, true).height;
    var ntf = tf.duplicate();
    ntf.property("Source Text").setValue('O');
    var plainH = ntf.sourceRectAtTime(0, true).height;

    ntf.property("Source Text").setValue('Ó');    
    var accentH = ntf.sourceRectAtTime(0, true).height;

    var diff = (accentH - plainH);
    ntf.remove();
    return Math.abs(diff);
}

function plainTxtHeight(tf) {
    var ntf = tf.duplicate();
    ntf.property("Source Text").setValue('A');
    var nH = ntf.sourceRectAtTime(0, true).height;
    ntf.remove();
    return nH;
}
