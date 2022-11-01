function centerInArea(comp, contentHeight, area) {
    var areaRect = area.sourceRectAtTime(0, true);
    var aPV = area.position.value;
    var aH = areaRect.height;
    var aY = aPV[1];

    var cRect = comp.sourceRectAtTime(0, true);
    comp.anchorPoint.setValue([cRect.left + cRect.width/2, cRect.top]);

    var cPV = comp.position.value;
    comp.position.setValue([cPV[0], aPV[1] + aH/2 - contentHeight/2, cPV[2]]);
}

function centerInAreaXY(comp, contentWidth, contentHeight, area) {
    var areaRect = area.sourceRectAtTime(0, true);
    var aPV = area.position.value;
    var aW = areaRect.width;
    var aH = areaRect.height;
    var aX = aPV[0];
    var aY = aPV[1];

    var cRect = comp.sourceRectAtTime(0, true);
    comp.anchorPoint.setValue([cRect.left - contentWidth / 2, cRect.top]);

    var cPV = comp.position.value;
    comp.position.setValue([0, aPV[1] + aH/2 - contentHeight/2, cPV[2]]);
}

function centerLayer(layer, comp) {
    var layerPos = layer.position.value;
    var layerHt = layer.height;
    layer.position.setValue([layerPos[0], layerPos[1] + (comp.height - layerHt) / 2, layerPos[2]]);    
}

function centerLayers(layers, area, comp) {
    for (var i = 0; i < layers.length; i++) {
        var l = layers[i];
        var lPos = l.position.value;
        var lRect = l.sourceRectAtTime(0, true);

        var gShape = comp.layers.addShape();
        var gsSize = [0,0,200,200];
        gShape.property("ADBE Vector Rectangle - Size").setValue(gsSize);
    }
}

function topAlignLayer(layer, comp) {
    var layerPos = layer.position.value;
    var layerHt = layer.height;
    layer.position.setValue([layerPos[0], layerHt / 2, layerPos[2]]);    
}

function buildComp(refComp, folder, name) {
    var newComp = refComp.duplicate();
    newComp.name = name.toLowerCase();
    newComp.parentFolder = folder;
    return newComp;
}

function buildFootage(parentFolder, destFolder, name) {
    var file = destFolder + '/' + name + '.mp4';
    var importOpts = new ImportOptions(File(file));
    var importFootage = app.project.importFile(importOpts);
    importFootage.name = name;
    importFootage.parentFolder = parentFolder; 
    return importFootage;
}

function buildMOVFootage(parentFolder, destFolder, name) {
    var file = destFolder + '/' + name + '.mov';
    var importOpts = new ImportOptions(File(file));
    var importFootage = app.project.importFile(importOpts);
    importFootage.name = name;
    importFootage.parentFolder = parentFolder; 
    return importFootage;
}

function buildLayer(comp, ad, label, nextStart) {
    var layer = ad.layers.add(comp);
    layer.label = label;
    layer.startTime = nextStart;//Math.round(nextStart * 100) / 100
    return layer;
}

function checkHalfFrame(checkTime) {
    var n = Math.floor(checkTime);
    var d = checkTime % 1;
    d = d < .29 ? d : .29
    //return d == 1 ? n + d : n + d - 0.01;
    return(checkTime)
}

function MergeRecursive(obj1, obj2) {

  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if ( obj2[p].constructor==Object ) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);

      } else {
        obj1[p] = obj2[p];

      }

    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];

    }
  }

  return obj1;
}


