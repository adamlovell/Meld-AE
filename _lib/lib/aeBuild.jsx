#include "adData.js";
#include "aeText.jsx";
#include "aeUtils.jsx";

function addVideo(ad, adData, section, nextStart, mnumonicDelay, vidSrcFolder){
    var footage = buildFootage(ad.subFolder, vidSrcFolder, section.value);
    var layer = buildLayer(footage, ad, 10, nextStart);
    
    var layerOP = layer.outPoint
    if (adData.build.videoMixdown) {
        layer.remove();
    }
    return checkHalfFrame(layerOP);
}

function addTitle(itemByName, ad, adData, section, mnumonicDelay, nextStart) {
    var comp, outPoint;
    if (section.name in itemByName) {
        comp = itemByName[section.name];
    } else {
        var ds = width(adData.build.dimensions) + 'x' + height(adData.build.dimensions);
        var titleName = itemByName[titleRefName + '-' + ds]

        if (!titleName) { 
            //REF comp does not exist. Doing nothing
        }     

        var frameRat = 29.97 // fps
        var animTime = section.startTime;
        var a = convertTimeCodeToSeconds(animTime, frameRat) + mnumonicDelay;
        var comp = buildComp(itemByName[titleRefName + '-' + ds], ad.subFolder, section.name);
        var layer = buildLayer(comp, ad, 13, a);

        setText(comp.layer("textRefStyle"), section.value, 100);
        setlLeading(comp.layer("textRefStyle"));

        outPoint = layer.outPoint
    }
    return outPoint;
}

function addEndframe(itemByName, ad, adData, section, mnumonicDelay, nextStart) {
    var frameRat = 29.97 // fps
    var animTime = section.value.startTime//"00:00:04:12" // time code
    var a = convertTimeCodeToSeconds(animTime, frameRat) + mnumonicDelay;
    var nextStartTime = animTime.length > 0 ? parseInt(animTime) : nextStart;

    var comp = buildComp(itemByName[efRef(adData)], ad.subFolder, section.name);
    var layer = buildLayer(comp, ad, 14, a);

    setText(comp.layer("textRefStyle"), section.value.header, 100);
    setlLeading(comp.layer("textRefStyle"));    

    return layer;
}

function addMixdown(ad, adData, mnumonicDelay, vidSrcFolder, audiodSrcFolder){
    var footage = buildFootage(ad.subFolder, vidSrcFolder, mixdown(adData) + '-' +  width(adData.build.dimensions) + 'x' + height(adData.build.dimensions));
    var layer = buildLayer(footage, ad, 8, mnumonicDelay);
    layer.moveToEnd();

    if (adData.audioMixdown) {
        var audioFootage = buildAudioFootage(ad.subFolder, audiodSrcFolder, audioMixdown(adData));
        var audioLayer = buildLayer(audioFootage, ad, 8, mnumonicDelay);
        audioLayer.moveToEnd();
        layer.property("Audio").property("Audio Levels").setValue([-999,-999]);
    }

    return layer.outPoint;
}

function addIntroRating(ad, adData, mnumonicDelay, folder, offsetX, offsetY) {
    var comp = buildComp(itemsByName()[introRating(adData.build)], folder, 'introRating');
    var layer = buildLayer(comp, ad, 13, mnumonicDelay);
    if (!adData.portrait) {
        layer.outPoint = convertTimeCodeToSeconds("0:00:06:04", 29.97);
    }
    var lPos = layer.position.value; 
    layer.position.setValue([lPos[0] + offsetX, lPos[1] + offsetY, lPos[2]]);
    setRating(comp, adData);
}

function hideLayer(layer) {
    if ((layer instanceof TextLayer))
        layer.opacity.setValue(0);
}

function makePortrait(itemByName, ad) {
    var newAd = ad.duplicate();
    newAd.name = newAd.name.replace(' 2', '').replace('1080x1080', '1080x1920');
    return newAd;
}

function addMortis(itemByName, ad, adData, section, subFolder) {
    var comp = buildComp(itemByName[mortisRefName], ad.subFolder, mortisRefName);
    var layer = buildLayer(comp, ad, 13, 0);

    setText(comp.layer("textRefStyle"), section.value.header, 100);
    setlLeading(comp.layer("textRefStyle"));     
}

function setRating(comp, adData) {
    comp.layer(rating(adData)).enabled = true;
}



