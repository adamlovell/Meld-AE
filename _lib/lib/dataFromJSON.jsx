function getAdsJSON() {
    var j = File.openDialog();
    var j = new File([j]);
    return j;
}

function getbuildsJSON(ads, adsPATH) {
    var j = adsPATH + ads[0]['builds'] + '.json';
    var j = new File([j]);
    return j;
}

function getLegaliseJSON(ads) {
    var j = getJSONPath() + "/" + ads[0]['legalise'] + '.json';
    var j = new File([j]);
    return j;
}

function getProjectJSON() {
    var j = getJSONPath() + "/project.json";
    var j = new File([j]);
    return j;
}

function getVideoPath() {
    var projectName = app.project.file.name.replace(".aep", "");
    var p = app.project.file.toString().replace('AE/' + projectName + '.aep', '') + "/mp4";
    return p
}

function getAudioPath() {
    var projectName = app.project.file.name.replace(".aep", "");
    var p = app.project.file.toString().replace('AE/' + projectName + '.aep', '') + "/acc";
    return p
}

function getMnumonicsPath() {
    var projectName = app.project.file.name.replace(".aep", "");
    var p = app.project.file.toString().replace('AE/' + projectName + '.aep', '') + "/AE/(Footage)/Mnumonics/";
    return p
}

function getJSONPath() {
    var projectName = app.project.file.name.replace(".aep", "");
    var p = app.project.file.toString().replace('AE/' + projectName + '.aep', '') + "JSON";
    return p;
}

function loadJSON(jsonFile) {
    jsonFile.open('r');
    var json = JSON.parse(jsonFile.read());
    jsonFile.close();
    return json;
}

function transformEndFrame(ad) {
    return {
        type: 'endFrame',
        name: 'endFrame',
        value: {
            startTime: ad["EF-Start-Time"],
            header: ad['EF-LargeText'],
            headerFontSize: ad['EF-LargeText-Font-Size'],
            headerPortraitFontSize: ad['EF-Portrait-LargeText-Font-Size'],
            headerInvert: ad['EF-LargeText-Invert-Weight'],
            subheader: ad['EF-SmallText'],
            subheaderFontSize: ad['EF-SmallText-Font-Size'],
        }
    };
}
function transformLegalise(ad) {
    return {
        legalPlaystation: ad['Legal-Playstation'],
        legalXbox: ad['Legal-Xbox'],
        legalSwitch: ad['Legal-Switch'],
        legalMulti: ad['Legal-Multi']
    };
}

function transformVideoOut(ad) {
    var key = 'Video-Out';
    if (!(key in ad)) {
        return null;
    } else {
        return { type: 'video', value: ad['Video-Out'], }
    }
}

var sectionColumns = [
    {type: 'video', key: 'Video-1'},
    {type: 'title', key: 'Title-1', fontSize: "Title-1-Font-Size", invert: "Title-1-Invert-Weight", startTime: "Title-1-Start-Time"},
    {type: 'video', key: 'Video-2'},
    {type: 'title', key: 'Title-2', fontSize: "Title-2-Font-Size", invert: "Title-2-Invert-Weight", startTime: "Title-2-Start-Time"},
    {type: 'video', key: 'Video-3'},
    {type: 'title', key: 'Title-3', fontSize: "Title-3-Font-Size", invert: "Title-3-Invert-Weight", startTime: "Title-3-Start-Time"},
    {type: 'video', key: 'Video-4'},
    {type: 'title', key: 'Title-4', fontSize: "Title-4-Font-Size", invert: "Title-4-Invert-Weight", startTime: "Title-4-Start-Time"},
    {type: 'video', key: 'Video-5'},
    //{type: 'title', key: 'Title-5', fontSize: "Title-4-Font-Size", invert: "Title-4-Invert-Weight"},
];

function transformBuilds(ad) {
    var sections = [];
    for (var i=0; i<sectionColumns.length; i++) {
        var column = sectionColumns[i];
        if (column.key in ad) {
            switch (column.type) {
                case 'video':
                    if (ad[column.key].length > 0) {
                        sections.push({
                            type: 'video', 
                            value: ad[column.key], 
                            name: column.key
                        });
                    }
                    break;
                case 'title':
                    if (ad[column.key].length > 0) {
                        sections.push({
                            type: 'title', 
                            value: ad[column.key], 
                            name: column.key, 
                            fontSize: ad[column.fontSize], 
                            invert: ad[column.invert],
                            startTime: ad[column.startTime]
                        });
                    }
                    break;
            }
        }
    }
    var endFrame = transformEndFrame(ad);
    sections.push(endFrame);

    var videoOut = transformVideoOut(ad);
    if (videoOut !== null) sections.push(videoOut);

    return {
        dimensions: parseDimensions(ad['Dimensions']),
        region: ad["Region"],
        rating: ad['Rating'],
        duration: ad['Duration-In-Sec'],
        mnemonics: ad["Mnemonics"],
        sections: sections,
        mixdown: ad['Mixdown'],
        postFix: ad["Name-Postfix"],
        preFix: ad["Name-Prefix"],
        videoMixdown: ad['Video-Mixdown']
        //ctas: ad['CTAs'],
    };
}

function transformAds(ad) {
    return {
        clientName: ad['Client-Name'],
        productName: ad['Product-Name'],
        directionName: ad['Direction'],
        builds: ad['Builds'],
        postFix: ad["Name-Postfix"],
        //dimensions: parseDimensions(ad['Dimensions']),
        //sections: sections,
        rating: ad['Rating'],
        legalise: ad["Legalise"],
        //mnemonics: ad["Mnemonics"],
        region: ad["Region"],
        mixdown: ad['Mixdown'],
        mixdownMulti: ad['Mixdown-Multi'],
        mixdownPlaystation: ad['Mixdown-Playstation'],
        mixdownXbox: ad['Mixdown-Xbox'],
        mixdownSwitch: ad['Mixdown-Switch'],
        videoMixdown: ad['Video-Mixdown'],
        legalPlaystation: ad['Legal-Playstation'],
        legalXbox: ad['Legal-Xbox'],
        legalSwitch: ad['Legal-Switch'],
        legalMulti: ad['Legal-Multi'],
        mixdownOverride: ad['Mixdown-Override'],
        noRatingVersion: ad["Include-Rating-Agnostic"]
    };
}

function parseDimensions(dimensions) {
    var wh = dimensions.split('x');
    return [parseInt(wh[0]), parseInt(wh[1])];
}

// - move JSON items to array
function adsFromJSON(ads) {
    var transformed = [];
    for (var i=0; i<ads.length; i++) {
        var ad = ads[i];
        transformed.push(transformAds(ad));
    }
    return transformed;
}

function buildsFromJSON(builds) {
    var transformed = [];
    for (var i=0; i<builds.length; i++) {
        var region = builds[i];
        transformed.push(transformBuilds(region));
    }
    return transformed;
}

function legaliseFromJSON(legalise) {
    return transformLegalise(legalise[0]);
}

// - return array of AE project library items
function getItemsByName() {
    var itemsByName = {};
    for (var i=1; i<=app.project.items.length; i++) {
        var item = app.project.item(i);
        itemsByName[item.name] = item;
    }
    return itemsByName;
}