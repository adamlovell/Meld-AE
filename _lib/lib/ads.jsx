
#include "adData.js";
#include "aeBuild.jsx";
#include "aeUtils.jsx";

var titleRefName = 'titleRef';
var endFrameRefName = 'efCompRef';
var mortisRefName = 'mortisRef';

// can only be run when only a REF comp exists
function createAd(adData, parentFolder, layersFolder) {
    var ds = adData.build.dimensions;
    var name = adName(adData);
    var fr = 29.97; // this should not be hard-coded
    var newComp = app.project.items.addComp(name, width(ds), height(ds), 1, 100, fr);    
    newComp.parentFolder = parentFolder;
    var subFolder = app.project.items.addFolder(name);
    subFolder.parentFolder = layersFolder;
    newComp.subFolder = subFolder;
    newComp.width = width(ds);
    newComp.height = height(ds);
    return newComp;
}

function populateAd(itemByName, ad, adData, vidSrcFolder) {
    var nextStart = 0;
    var mnumonicDelay = 0;
    var introMn;
    var sections = adData.build.sections;
    var efSection;
    var ef;

    for (var i in sections) {
        var section = sections[i];
        if (section.name in itemByName) {
        
        } else {
            switch (section.type) {
                case 'video':
                    nextStart = addVideo(ad, adData, section, nextStart, mnumonicDelay, vidSrcFolder);
                    break;
                case 'title':
                    nextStart = addTitle(itemByName, ad, adData, section, mnumonicDelay, nextStart);
                    break;
                case 'endFrame':
                    efSection = section;
                    ef = addEndframe(itemByName, ad, adData, section, mnumonicDelay, nextStart);
                    nextStart = ef.outPoint;
                    break;
            }
        }
        ad.duration = nextStart;
    }

    ad.duration = addMixdown(ad, adData, mnumonicDelay, vidSrcFolder);
    ef.outPoint = ad.duration;

    //hax ---->  
    if (adData.portrait) {
        ad.name = ad.name.replace(' 2', '').replace('2160x2160', '2160x3840').replace('1080x1080', '1080x1920');
        if (ad.width == 2160) {
            ad.width = 2160;
            ad.height = 3840;
        }

        if (ad.width == 1080) {
            ad.width = 1080;
            ad.height = 1920;
        }

        for (var i=1; i<=ad.layers.length; i++) {
            ad.layer(i).property("Position").setValue([ ad.width/2, ad.height/2]);
        }
        
        addMortis(itemByName, ad, adData, efSection, ad.subFolder);   
    }
    var adWidth = ad.width;
    var adHeight = ad.height;
    ad.name = ad.name.replace(adWidth + 'x' + adHeight, getDimentionsToRatio(ad));
    ad.layer('endframe').moveToBeginning();    
}
 