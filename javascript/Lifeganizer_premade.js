/**
 * Created by martin on 2017-05-19.
 */
var fontFamilies=["Alex Brush","Diplomata","Diplomata"];
var objectLeftPositions=["412.0057002939405px","469px","23px","23px","23px","115.984px","118px","117px","117px","414px","398px","7px","23px"];
var objectFont=["Alex Brush","Diplomata","noFont","noFont","noFont","noFont","noFont","noFont","noFont","Diplomata","noFont","noFont","noFont"];
var objectHeight=["87px","61px","40px","40px","40px","64.4375px","62.8125px","61.9844px","62.7969px","74.6094px","77px","272.391px","40px"];
var objectId=["1","2","3","4","5","7","8","9","10","11","12","13","14"];
var textMessages=[null,null,null,null,null,null,null,null,null,null,null,null,null];
var objectStyles=["clock","date","weather","weather","weather","temperature","temperature","temperature","temperature","temperature","weather","temp-graph","weather"];
var objectWidth=["174px","122px","69px","69px","69px","65.9062px","77.0938px","76.0938px","77.0938px","137.969px","154px","454px","69px"];
var seconds=["true",null,null,null,null,null,null,null,null,null,null,null,null];
var objectTopPositions=["210.6150752939405px","433.1875px","306.662px","224.234px","55.266px","63.2188px","152.297px","237.188px","321.188px","180.188px","63.1875px","432.515625px","141.188px"];
var weatherTime=[null,null,"evening","afternoon","morning","morning","midday","afternoon","evening","current-time","current-time","whole-day","midday"];

function callfunction() {
    $('.icon-middle').each(function() {
        $(this).remove();
    });
}

/*
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
*/

function createPremadeMirror() {
    callfunction();

    for (var i = 0; i < objectId.length; i++) { //go through the whole local storage
        var id = i;
        if (objectStyles[i] == "weather" || objectStyles[i] == "temperature") { //if there is an object-style named weather, create a weather icon.
            var dropCallsString = id.toString();
            SMHICall(objectTopPositions[i], objectLeftPositions[i], dropCallsString, weatherTime[i], objectWidth[i], objectHeight[i], objectStyles[i], objectFont[i]);
            //await sleep(200);
        }
        else if (objectStyles[i] == "text-message") {
            var dropCallsString = id.toString();

            createTextMessage(objectTopPositions[i], objectLeftPositions[i], dropCallsString, weatherTime[i], objectWidth[i], objectHeight[i], objectStyles[i], objectFont[i], textMessages[i]);
        }
        else if (objectStyles[i] == "clock") {
            var dropCallsString = id.toString();
            createTimeObject(objectTopPositions[i], objectLeftPositions[i], dropCallsString, objectStyles[i], weatherTime[i], objectWidth[i], objectHeight[i], objectFont[i], 'true');
        }
        else if (objectStyles[i] == "date") {
            var dropCallsString = id.toString();
            createDateObject(objectTopPositions[i], objectLeftPositions[i], dropCallsString, objectStyles[i], weatherTime[i], objectWidth[i], objectHeight[i], objectFont[i]);
        }
        else if (objectStyles[i] == "temp-graph") {
            var dropCallsString = id.toString();
            SMHICall(objectTopPositions[i], objectLeftPositions[i], dropCallsString, weatherTime[i], objectWidth[i], objectHeight[i], objectStyles[i], objectFont[i]);
        }
    }
}