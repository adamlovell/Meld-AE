#include "adData.js";
#include "ads.jsx";
#include "dataFromJSON.jsx";

function run(data, builds, legalise) {
    //alert("run");
    app.beginUndoGroup('Undo Meld');

    // var tObj1 = {
    //     "dataBit1" : "oldData1",
    //     "dataBit2" : "oldData2"
    // }; 
    // var tObj2 = {
    //     "dataBit1" : "newData1",
    //     "dataBit2" : "newData2"
    // };     

    // var tObjMerged = MergeRecursive(tObj1, tObj2);

    // for(key in tObjMerged) {
    //     if(tObjMerged.hasOwnProperty(key)) {
    //         alert(tObjMerged[key]);
    //     }
    // }    

    //alert(JSON.stringify(legalise));

    var buildData = []
    for (var i=0; i < data.length; i++) {
        var adData = data[i];
        for (var j = 0; j < builds.length; j++) {
            var newAdData = JSON.parse(JSON.stringify(adData));
            newAdData.build = builds[j];
            buildData.push(newAdData);
        }
    }

    var mnData = []
    for (var i=0; i < buildData.length; i++) {
        var adData = buildData[i];
        adData.packShotRating = adData.build.rating;
        adData.packShotRating = adData.rating;
        if (adData.build.mnemonics) {
            var platformsArry = platforms();
            for (var j = 0; j < platformsArry.length; j++) {
                var newAdData = JSON.parse(JSON.stringify(adData));
                newAdData.mnemonics = platformsArry[j];
                newAdData.build.mnemonics = platformsArry[j];
                mnData.push(newAdData);
            }
        }
        adData.mnemonics = '';
        adData.build.mnemonics = '';
        mnData.push(adData);
    }

    var nrData = []
    for (var i=0; i < mnData.length; i++) {
        var adData = mnData[i];
        nrData.push(adData);

        if (!rating(adData)) {
            newAdData.build.rating = ''
            newAdData.rating = ''
        }

        if (rating(adData) && adData.noRatingVersion != false) {
            var newAdData = JSON.parse(JSON.stringify(adData));
            newAdData.build.rating = ''
            newAdData.rating = ''

            nrData.push(newAdData);
        }           
    }

    var portData = []
    for (var i=0; i < nrData.length; i++) {
        var adData = nrData[i];
        portData.push(adData);

        var adWidth =  width(adData.build.dimensions);
        var adHeight = height(adData.build.dimensions);

        if (adWidth == adHeight) {
            var newAdData = JSON.parse(JSON.stringify(adData));
            newAdData.portrait = true;
            portData.push(newAdData);
        }           
    }
    
    var itemByName = getItemsByName();
    for (var i=0; i<portData.length; i++) {
        var adData = portData[i];    
        var pF = parentFolder(adData);
        var lF = layersFolder(adData, pF);
        var ad = adExists(adData, itemByName) ? itemByName[adName(adData)] : createAd(adData, pF, lF);
        adData.legalise = legalise;
        populateAd(itemByName, ad, adData, getVideoPath());
    }
    app.endUndoGroup();
}