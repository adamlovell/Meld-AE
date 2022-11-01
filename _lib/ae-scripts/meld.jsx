#include "../lib/dataFromJSON.jsx";
#include "../lib/run.jsx";

var adsJSONFile = getAdsJSON();
var adsPATH = adsJSONFile.fsName.replace(adsJSONFile.name, '');

var ads = adsFromJSON(loadJSON(adsJSONFile));
var builds = buildsFromJSON(loadJSON(getbuildsJSON(ads, adsPATH)));
var legalise = legaliseFromJSON(loadJSON(getLegaliseJSON(ads)));
run(ads, builds, legalise);