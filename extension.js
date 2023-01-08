//var wordwherecount = -1;
//var wwcntmns = -1; // based of wordwherecount, it is used to find all the numbers before "ls"
//var numbercount = 0; // how many numbers are there(debug)
//var minuschr; // holds the character that wwcntmns is at
//var isnotnumber = false; // true or false depending on if wwcntmns is at a number
//var SCTime = "error"; // In hours, minutes and seconds
//var SCTimePackaged = "(" + (SCTime) + ")"; // SCTime but with () before and after
var messagetext = "";
var nicktext = "";
var abort = false; // if set to true, the program should abort any current attempt to inject time data into a message
//var elems=document.getElementsByClassName("kiwi-messagelist-body");
//var elems=parentelement.children[0];
//var msgstring = ""; // used to hold the found msg
//var msgstringonlynumber = 0; // same as msgstring but without the distance unit appended to it
//var distanceunit = "ls"; // holds the current distance unit, it is "ls" by default
var destinationGravity = false;
//console.log("start!");

//const finishedelements = []; // used to store whether an element has already had sctime injected.

function FindText() {
    let elems = null;
    let nick = null;
    //let parent = null;
    let words = null, word = "";
    let newMessageText = "";
    //let nicknumber = 0; // the reason this exists here is because I need to access it outside the for loop

    ResetVariables();
    //messagetext = document.documentElement.innerText;
    //elems=document.getElementsByClassName("gb_j"); //testing purposes
    //parent=document.getElementsByClassName("kiwi-messagelist-item");
    //elems=parent.querySelectorAll('.kiwi-messagelist-body');
    //elems=document.getElementsByClassName("kiwi-messagelist-body");

    elems=document.getElementsByClassName("kiwi-messagelist-body");
    nick=document.getElementsByClassName("kiwi-messagelist-nick");
    for (let elementnumber = 0; elementnumber < elems.length; elementnumber++) {
        //console.log("elementnumber:" + elementnumber);
        messagetext = elems[elementnumber].innerHTML;
        /*
        if (finishedelements.includes(elementnumber)) {
            console.log("finishedelements2:" + finishedelements);
            console.log("Abort! Message already has sctime injected, elementnumber: " + elementnumber);
            continue;
        }
        */
        if (messagetext.includes("((", "))")) { // If the message contains "((" and "))"
            //console.log("Abort! Message already has sctime injected, elementnumber: " + elementnumber);
            continue;
        }

        for (let nicknumber = 0; nicknumber < nick.length; nicknumber++) {
            //console.log("indexing nicks..");
            nicktext = nick[elementnumber].innerText;
        }

            //console.log("nick:" + nicktext);
            //console.log("messagetext:" + messagetext);
        if (nicktext.includes("MechaSqueak[BOT]")) { // this is supposed to prevent the extension from showing estimates on messages from mechasqueak
            //console.log("Abort! Message is from MechaSqueak!");
            abort = true;
            //continue;
        }
        if (abort == true) {
            //console.log("aborting..");
            abort = false; // resets abort to it's starting value.
            continue; // this should make it so that it continues searching for messages to inject
        }
        //console.log("msgtext: " + messagetext);
        messagetext = messagetext.replace(",", "."); // replaces comma(',' with a dot '.')

        //console.log("msgtext: " + messagetext);
        words=messagetext.split(" ");
        //console.log(words);
        for(let wordnumber=0; wordnumber < words.length; wordnumber++) {
            word=words[wordnumber];
            if(IsValidWord(word)) {
                // replace distance word with the same word and append time to travel; "1448ls" => "1448ls (26m7s)"
                words[wordnumber] = (word + " (" + TimeToTravel(word) + ")");
                //finishedelements.splice(elementnumber, 0, (elementnumber));
                //console.log("finishedelements1:" + finishedelements);
                if (abort == true) {
                    abort = false;
                    continue;
                }
                newMessageText=words.join(" ",words);
                elems[elementnumber].innerHTML = newMessageText;
                //console.log("msgtext:" + messagetext);
            }
            
        }
        
        //wordwherecount = messagetext.indexOf(distanceunit);
        //console.log("wordwherecount:" + wordwherecount);
        //console.log("messagetext + wordwherecount:" + messagetext[wordwherecount]);
        //wwcntmns = wordwherecount;
        /*
        if (wordwherecount != "-1") {
            do {
                
                wwcntmns -= 1;
                minuschr = (messagetext[wwcntmns]);
                console.log("updated minuschr with:*" + (messagetext[wwcntmns])+"*");
                isnotnumber = ((minuschr.trim() == "") || isNaN(minuschr));
                console.log("isnotnumber:" + isnotnumber);
                if (isnotnumber == false) {
                    numbercount += 1;
                    msgstring = msgstring.concat(minuschr);
                    console.log("minuschr2:" + minuschr);
                    console.log("numbercount:" + numbercount);
                    console.log("isnotnumber2:" + isnotnumber);
                    
                }
                
                else break;
            } while (isnotnumber == false);
            
        }
        */
/*
        if (wordwherecount != "-1" && numbercount >= 1) {
            CharacterInject(elems[elementnumber]);
            console.log("finishedelements3:" + finishedelements);
            finishedelements.splice(elementnumber, 0, (elementnumber));
            console.log("added" + (elementnumber) + "to finishedelements array");
            console.log("injected sctime, elementnumber: " + elementnumber);
            console.log("finishedelements4:" + finishedelements);
        }
*/
    }
}
setInterval(FindText, 3500);

function IsDistanceWord(word) {
        word.toLowerCase();
        if(word.endsWith("kls")) {
            return true;
        }
        if(word.endsWith("mls")) {
            return true;
        }
        if(word.endsWith("kly")) { // intentionally disabled
            return false;
        }
        if(word.endsWith("ls")) {
            return true;
        }
        if(word.endsWith("ly")) {
            return true;
        }
    return false;
}

function IsSupportedMessage() {
    if (messagetext.includes("-g")) {
        //console.log("-g detected!");
        destinationGravity = true;
        return true;
    } else {
        //console.log("did not include -g");
        destinationGravity = false;
        return true;
    }
}

function IsValidWord(word) {
    //console.log("checking if word is valid");
    if (IsSupportedMessage()) { // for now at least, I might add support later for -g
        if (IsNumberWord(word)) {
            if (IsDistanceWord(word)) {
                return true;
            } else return false;
        }
    } return false;
}

function IsNumberWord(word) {
    if(word.startsWith("0") || word.startsWith("1") || word.startsWith("2") || word.startsWith("3") || 
       word.startsWith("4") || word.startsWith("5") || word.startsWith("6") || word.startsWith("7") || 
       word.startsWith("8") || word.startsWith("9")) {
        return true;
    } else return false;
}

// Calculates the time to travel the distance that the word represents
// and returns it as a string in th form "<number of days>d<number of hours>t<number of minutes>m<number of seconds>s" 
// for example "3d17t5m19s" for 3 days, 17 hours, 5 minurtes, and 19 seconds
function TimeToTravel(word) {
    let slicePoint = -1; // used to know where to slice string
    let Word1;
    let Word2;
    let SCTime = 0;
    let successcheck = 0;
    let distnumber = 0;
    successcheck = slicePoint = word.indexOf("kls");
    if (successcheck == "-1") {
        successcheck = slicePoint = word.indexOf("mls");
    }
    if (successcheck == "-1") {
    successcheck = slicePoint = word.indexOf("ls");
    }
    if (successcheck == "-1") {
    slicePoint = word.indexOf("ly");
    }
    Word1 = word.slice(slicePoint);
    Word2 = word.slice(0, slicePoint);
    //console.log("wordthingy");
    //console.log("slicepoint:" + slicePoint);
    //console.log(Word1);
    //console.log(Word2);
    distnumber = Number(Word2);
    if (Word1 == "ly") {
        if (distnumber > 1) {
            console.log("aborting! ly is over 1ly!");
            abort = true;
            return;
        }
        if (abort == true) {
            return;
        }
    }
    SCTime = CalculateSCTime(Word2, Word1);
    return SCTime;
}

/*
// Inject characters
function CharacterInject(element) {
    console.log("messagetext2:" + messagetext);
    console.log("wordwherecount2:" + wordwherecount);
    console.log("running characterinject");
    console.log(element.innerText);
    messagetext = element.innerText;
    console.log("messagetext3:" + messagetext);
    //Recreatemsg();
    CalculateSCTime();
    SCTimePackaged = "(" + (SCTime) + ")";
    console.log("sctimepackaged:" + SCTimePackaged);
    //messagetext.innerText.replaceAt(wordwherecount+2, (SCTimePackaged));
    //element.innerHTML.replace(/(messagetext)/g, messagetext + (SCTimePackaged));
    element.innerText = (messagetext + (SCTimePackaged));
    //msgstringonlynumber = ""; // sets msgstringonlynumber to nothing
    //console.log(document.body.innertext = document.body.innerText);
    //document.body.innerText = document.body.innerText.replaceAt(wordwherecount+2, (SCTimePackaged));
    //console.log(document.body.innertext = document.body.innerText);
}
*/

function ResetVariables() {
    //console.log("reset variables");
    //numbercount = 0;
    //wwcntmns = 0;
    //msgstring = "";
    //wordwherecount = -1;
    //wwcntmns = -1;
    //numbercount = 0;
    //minuschr;
    //isnotnumber = false;
    //SCTimePackaged = "(" + (SCTime) + ")";
    messagetext = "";
    destinationGravity = false;
}
/*
function Recreatemsg() {
    msgstringonlynumber = 0;
    msgstring = [...msgstring].reverse().join("");
    msgstringonlynumber = msgstring;
    msgstring = msgstring.concat(distanceunit);
    console.log(msgstring);
}
*/

function CalculateSCTime(distance, distanceunit) {
    let distancefixed = 0; // distancefixed is always in ls(lightseconds)
    let totalseconds = 0;
    let SCTime = 0;
    distancefixed = ConvertToLS(distance, distanceunit);
    //console.log("dist" + distancefixed);
    totalseconds = CalcTotSeconds(distancefixed);
    //console.log("tots" + totalseconds);
    SCTime = CrTimeString(totalseconds);
    //console.log(SCTime);
    return SCTime;
 }

 function ConvertToLS(dstNum, dstUnit) {
    let unitFactors = {
        'ls': 1,
        'kls': 1000,
        'mls': 1000000,
        'ly': 31557600
    }
    console.log("dstnum" + dstNum);
    console.log("dstunit" + dstUnit);
    // ** Convert to light seconds ** \\
    if (dstUnit == "ls") {
        //console.log("1");
        return dstNum;
    }
    if (dstUnit == "kls") {
        //console.log("2");
        dstNum = dstNum * unitFactors["kls"];
        //console.log("dstnum2:" + dstNum);
        return dstNum;
    }
    if (dstUnit == "mls") {
        //console.log("3");
        dstNum = dstNum * unitFactors["mls"];
        return dstNum;
    }
    if (dstUnit == "ly") {
        //console.log("4");
        dstNum = dstNum * unitFactors["ly"];
        return dstNum;
    }
}

function CalcTotSeconds(lightSeconds) {
    let seconds = 0;
    //console.log("cls" + lightSeconds);
    if (destinationGravity == true) {
        lightSeconds = lightSeconds / 2
        //console.log("ls1: " + lightSeconds);
    }

    if (lightSeconds < 100000) {    
      seconds = (Math.floor(Math.pow(lightSeconds, 0.3292)  * 8.9034));
    } else if (lightSeconds < 1907087) {
      var val1 = -8 * Math.pow(10, -23) * Math.pow(lightSeconds, 4);
      var val2 = 4 * Math.pow(10, -16) * Math.pow(lightSeconds, 3) - 8 * Math.pow(10, -10) * Math.pow(lightSeconds, 2);
      var val3 = 0.0014 * lightSeconds + 264.79;
      seconds = ( val1 + val2 + val3 );
    } else {
      seconds = (Math.floor((lightSeconds - 5265389.609) / 2001 + 3412));
    }

    if (destinationGravity == true) {
        seconds = seconds * 2
        //console.log("s: " + seconds);
    }
    return seconds;
}

function CrTimeString(totalSeconds) {
    //console.log("timestring");
    let formattedTime = "";
    let hours = 0;
    let remainderSec = 0;
    let seconds = 0;
    hours = Math.floor(totalSeconds / 3600);
    console.log("hour" + hours);
    console.log("ts" + totalSeconds);
    remainderSec = Math.floor(totalSeconds % 3600);
    minutes = Math.floor(remainderSec / 60);
    seconds = Math.floor(totalSeconds % 60);

    if(hours > 0) {
        formattedTime = '(' + hours + 'h' + minutes + 'm' + seconds + 's' + ')';
    } else if
    (minutes > 0) {
        formattedTime = '(' + minutes + 'm' + seconds + 's' + ')';
    } else {
        formattedTime = '(' + seconds + 's' + ')';
    }
    //console.log("ft" + formattedTime);
    return formattedTime;
}

