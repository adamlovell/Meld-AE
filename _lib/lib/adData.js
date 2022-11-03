
function adName(a) {
    var newRating =  rating(a).length > 0 ? '-' + rating(a) : '';
    var platform = a.mnemonics.length > 0 ? '-' + platformName(a) : '-' + platformName(a); 
    var portrait = a.portrait;
    var size = portrait ? 'Portrait' : dimensions(a.build);

    return clientName(a) + 
    '-' + productName(a) + 
    '-' + directionName(a) +
    preFix(a) +    
    platform + 
    '-' + region(a).replace('-', '_') +
    newRating +
    '-' + duration(a) + 's' +
    '-' + size +
    postFix(a.build) +
    postFix(a)
}

function debug() {
    return false;
}

function platformName(a) {
    return a.mnemonics.length > 0 ? a.mnemonics : 'Multi'; 
}

function platforms() {
    return ['Playstation', 'Xbox', "Switch"];
}

function accentCharsArray() {
    return ['È', 'É', 'ü', 'Ü', 'ú', 'Ú', 'ü', 'í', 'Í'];
}

function mnumanicsIntroPath(adData) {
    return getMnumonicsPath() + adData.mnemonics.toLowerCase() + '/' + 'bing' + '/';
}
function mnumanicsOutroPath(adData) {
    return getMnumonicsPath() + adData.mnemonics.toLowerCase() + '/' + 'bong' + '/';
}

function itemsByName() {
    var itemsByName = {};
    for (var i=1; i<=app.project.items.length; i++) {
        var item = app.project.item(i);
        itemsByName[item.name] = item;
    }
    return itemsByName;
}

function postFix(a) {
    return a.postFix.length > 0 ? '-' + a.postFix : '';
}

function preFix(a) {
    return a.build.preFix.length > 0 ? '-' + a.build.preFix : '';
}

function dimensions(a) {
    return a.dimensions[0] + 'x' + a.dimensions[1];
}

function duration(a) {
    return a.build.duration;
}

function width(dimensions) {
    return dimensions[0];
}

function CTAs(a) {
    return a.CTAs;
}

function height(dimensions) {
    return dimensions[1];
}

function mixdown(a) {
    var portraitString = a.portrait ? '-Portrait' : '';
    var newMD = a.mixdownOverride.length > 0 ? a.mixdownOverride : 'Mixdown' + '-' + directionName(a) + '-' + duration(a) + 's' +  portraitString;
    return newMD;
}

function audioMixdown(a) {
    var newMD = a.mixdownOverride.length > 0 ? a.mixdownOverride : 'Audio-Mixdown' + '-' + directionName(a) + '-' + duration(a) + 's';
    return newMD;
}

function clientName(a) {
    return a.clientName;
}

function productName(a) {
    return a.productName;
}

function directionName(a) {
    return a.directionName;
}

function region(a) {
    return a.region;
}
function footerRef(a) {
    return 'footerRef-' + rating(a);
}

function efRef(a) {

    if (a.portrait) {
        return 'efRef-' + dimensions(a.build) + '-portrait';
    } else {
        return 'efRef-' + dimensions(a.build);
    }        
}

function rating(a) {
    return a.rating;
}

function packShotRating(a) {
    return a.packShotRating;
}

function introRating(adData) {
    return 'rating-' + dimensions(adData);
}

function dimentionsToRatio(ad) {
    var ratio = getDimentionsToRatio(ad);
    ad.name = ad.name.replace(adWidth + 'x' + adHeight, ratio);
}

function getDimentionsToRatio(ad) {
    var adWidth = ad.width;
    var adHeight = ad.height;

    var ratio = '';
    switch (true) {
        case adWidth == adHeight :
            ratio = '1x1';
            break;
        case adWidth / adHeight == 0.5625 : 
            ratio = '9x16';
            break;
        case adHeight / adWidth == 0.5625 :
            ratio = '16x9'
            break;
        default :
            ratio = '';
    }
    return ratio;
}

function titleRefExists(i) {
    return titleRefName in i;
}

function adExists(a, i) {
    return adName(a) in i;
}

function parentFolder(a) {
    itemByName = getItemsByName()
    var folderName = a.directionName + '-' + a.region;
    if (itemByName[folderName] && itemByName[folderName].typeName == 'Folder') {
        return itemByName[folderName];
    } else {
        return app.project.items.addFolder(folderName);
    }
}

function layersFolder(a, parentFolder) {
    itemByName = getItemsByName()
    var folderName = '_layers-' + a.directionName + '-' + a.region;
    if (itemByName[folderName] && itemByName[folderName].typeName == 'Folder') {
        return itemByName[folderName];
    } else {
        var folder = app.project.items.addFolder(folderName);
        folder.parentFolder = parentFolder;
        return folder;
    }
}

function convertTimeCodeToSeconds(timeString, framerate) {
  var timeArray = timeString.split(":");
  var hours   = parseInt(timeArray[0]) * 60 * 60;
  var minutes = parseInt(timeArray[1]) * 60;
  var seconds = parseInt(timeArray[2]);
  var frames  = parseInt(timeArray[3])*(1/framerate);
  var str = "h:" + hours + "\nm:" + minutes + "\ns:" + seconds + "\nf:" + frames;
  var totalTime = hours + minutes + seconds + frames;
  return totalTime;
}

function convertTimeToFrames(timeString, framerate) {
  var secs = convertTimeCodeToSeconds(timeString, framerate);
  return secs * framerate;
}


function fileType(footageObject) { 
    if (footageObject.hasVideo) {
        var filePath = File.decode(footageObject.mainSource.file);
        var extension = filePath.substr(filePath.lastIndexOf(".")+1,filePath.length).toLowerCase();
        if (footageObject.mainSource.isStill) {
            return "Image";
        } else if (extension.match( new RegExp ("(ai|bmp|bw|cin|cr2|crw|dcr|dng|dib|dpx|eps|erf|exr|gif|hdr|icb|iff|jpe|jpeg|jpg|mos|mrw|nef|orf|pbm|pef|pct|pcx|pdf|pic|pict|png|ps|psd|pxr|raf|raw|rgb|rgbe|rla|rle|rpf|sgi|srf|tdi|tga|tif|tiff|vda|vst|x3f|xyze)", "i"))) {
            return "Sequence";
        } else {
            if (footageObject.hasAudio) { 
                return "Video w/ Audio"; 
            } else { 
                return "Video";      
            }
        }
    } else if (footageObject.hasAudio && !footageObject.hasVideo) {
        return "Audio";
    }
}

function layerType(layer) {
    switch (layer.matchName) {
      case "ADBE Vector Layer":
        return layer.matchName;
      case "ADBE Text Layer":
        return layer.matchName;
      case "ADBE Camera Layer":
        return layer.matchName;
      case "ADBE Light Layer":
        return layer.matchName;
      case "ADBE AV Layer":
        if (layer.nullLayer === true) {
          return "Null";
        } else if (layer.adjustmentLayer === true) {
          return "Adjustment";
        } else if (layer.guideLayer === true) {
          return "Guide";
        } else if (layer.source instanceof CompItem) {
          return "Precomp";
        } else if (layer.source.mainSource instanceof SolidSource) {
          return "Solid";
        } else if (layer.source.mainSource instanceof PlaceholderSource) {
          return "Placeholder";
        } else if (layer.source.mainSource instanceof FileSource) {
          if (layer.source.footageMissing == true) {
            return "Missing Footage";
          }
          var priorLayerState = layer.enabled;
          layer.enabled = true;
          var importIsData = layer.enabled == false;
          layer.enabled = priorLayerState;

          if (importIsData) {
            return "Data";
          }
          if (!layer.source.hasVideo && layer.source.hasAudio) {
            return "Audio";
          }
          return "Image";
        }
        return "Invalid";
    }
  }