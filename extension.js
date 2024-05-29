var messagetext = "";
var nicktext = "";
var Version = "1.4.8";
var abort = false; // if set to true, the program should abort any current attempt to inject time data into a message
var destinationGravity = false;
var distanceunit = "";
var distanceval = "";
console.log("#### SCTime for Kiwi IRC Version " + Version + " ####");
var distanceunitspaced = false; // if true, the extension will inject sctime after the distance unit if it's not the same word as the number
var distancevalindex = 0;
//InjectScript('kiwi.state.getSetting(window.kiwi.state.getSetting("settings.buffers.messageLayout")')

function CheckForUpdate() {
    console.log("Checking for updates.. ")
    var req = new XMLHttpRequest();  
    req.open('GET', 'https://raw.githubusercontent.com/AlixCozmo/SCTime-for-Kiwi-IRC/main/README.md', false);   
    req.send(null);
    //console.log(req);
    console.log(req.responseText)
    let result = req.responseText.includes(Version); // checks if the version in the readme matches the current version
    let resulthttstatus = req.status; // checks if the version in the readme matches the current version
    //console.log(result)
    if (resulthttstatus == 418) {
        console.error("HTTP status equal to 418")
        console.log("HTTP STATUS 418. I am a teapot.")
        alert("HTTP STATUS 418. I am a teapot.")
        return 0
    }
    if (resulthttstatus == 404) {
        console.error("HTTP STATUS 404")
        alert("Failed to check for update! Received a 404 HTTP response! \nPlease create an issue on github if this persists")
        return 0
    }
    if (resulthttstatus != 200) {
        console.warn("HTTP status code equal to " + toString(resulthttstatus))
        console.log("Update failed!")
        alert("Failed to check for update! Did not receive a " + toString(resulthttstatus) + " HTTP response! \nPlease create an issue on github if this persists")
        return 0
    }

    if (result == "false") {
        console.log("New update available!")
        alert("An update is available for SCTime for Kiwi IRC!\n Visit the Github page to download & install.")
        return 1
    }
    if (result) {
        console.log("You are running the latest version!")
        return 1
    }
    result = String(req.responseText.includes("Version")); // checks if the readme contains the word "Version", this could be any word but i chose this one
    if (result) {
        console.warn("Unable to read version number from github.")
        console.log("Update failed!")
        alert("Failed to check for update due to being unable to read version number! \nPlease create an issue on github if this persists")
        return 0
    }
    else {
        console.error("An unknown error has occurred while performing update check.")
        console.log("Update failed!")
        alert("Failed to check for update due to an unknown error! \nPlease create an issue on github if this persists")
        return 0
    }
}

function InjectScript(path) {
    // this function injects a script onto the page and returns the data that the script returns
    //let datareturn;
    //let fDataReturn = function(e) {
    //    datareturn = ScriptEvent(e.detail)
    //};
    let script = document.createElement('script');
    let string = 'setInterval(function() { var data = TEXTHERE; document.dispatchEvent(new CustomEvent("InjectEvent", {detail: data})) }, 1000);';
    string = string.replace('TEXTHERE', path); // replaces TEXTHERE with the path
    script.textContent = string;
    (document.head || document.documentElement).appendChild(script);
    /*
    document.addEventListener('data'), fDataReturn;
    (document.head || document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
    document.removeEventListener('data', fDataReturn);
    return datareturn;
    */
}

function ScriptEvent() {
    let datareturn;
    let fDataEventLength = function(e) {
        datareturn = LengthScriptEvent(e.detail)
    };
    document.addEventListener('data', fDataEventLength);
    document.removeEventListener('data', fDataEventLength);
    console.log(datareturn)
    return datareturn;
}

function ScriptEventChild(datareturn) {
    return datareturn;
}

function FindText() {
    //console.log("ft");
    let elems = [];
    let nick = null;
    let words = null; let word = "";
    let altword = ""; // similar to word except it's only used for calculations
    let newMessageText = "";
    let altwords = null;
    let altmessagetext = null;

    ResetVariables();
    //messagetext = document.documentElement.innerText;
    //elems=document.getElementsByClassName("gb_A"); //testing purposes
    nick=document.querySelectorAll('.kiwi-messagelist-nick');
    //console.log(typeof nick)
    //console.log(nick)
    //console.log(nick[0].nextSibling.nodeName)
    //ScriptEvent
    for (let loopvar = 0; loopvar < nick.length; loopvar++) {
        if (nick[0].nextSibling.nodeName == "#comment") { // if modern layout is used
            //console.log("modern layout")
            elems.push(nick[loopvar].parentNode.parentNode.children[1]) // this gets the body from the nick, this ensures that no message without a nick
            continue;
        }
        if (nick[0].nextSibling.nextSibling.nodeName == "#comment") { // if modern layout is used + realname
            //console.log("modern layout")
            elems.push(nick[loopvar].parentNode.parentNode.children[1]) // this gets the body from the nick, this ensures that no message without a nick
            continue;
        }
        if (nick[0].nextSibling.nodeName == "#text") { // if old traditional layout is used
            //console.log("old traditional layout")
            elems.push(nick[loopvar].parentNode.lastElementChild) // this gets the body from the nick, this ensures that no message without a nick
            continue;
        } else {
            //console.log("default")
            elems.push(nick[loopvar].nextSibling) // this gets the body from the nick, this ensures that no message without a nick
        }
        // gets through
    }
    //console.log(elems)
    //nick=document.getElementsByClassName("kiwi-messagelist-nick");
    for (let elementnumber = 0; elementnumber < elems.length; elementnumber++) {
        //console.log("elementnumber:" + elementnumber);
        messagetext = elems[elementnumber].innerHTML;
        if (messagetext == null) {
            break;
        }
        if (messagetext.includes("((", "))")) { // If the message contains "((" and "))"
            //console.log("Abort! Message already has sctime injected, elementnumber: " + elementnumber);
            continue;
        }
        

        for (let nicknumber = 0; nicknumber < nick.length; nicknumber++) {
            //console.log("indexing nicks..");
            //console.log(nicktext);
            //console.log(nicknumber);
            //console.log(nick);
            //console.log(elementnumber)
            //console.log(elems)
            //console.log("******")
            //console.log(nick[elementnumber])
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
        //console.log("msgtext: " + messagetext);
        altmessagetext = messagetext; // altmessagetext is used instead of messagetext for calculation
        altmessagetext = altmessagetext.replace(",", "."); // replaces comma(',' with a dot '.')
        words=messagetext.split(" ");
        altwords=altmessagetext.split(" ");
        //console.log(words);
        for(let wordnumber=0; wordnumber < words.length; wordnumber++) {
            altword=altwords[wordnumber];
            word=words[wordnumber];
            altword=altword.toLowerCase();
            //console.log(altword);
            altword = FixComma(altword);
            altword = RemoveChar(altword);
            if (abort == true) {
                abort = false;
                continue;
            }
            if(IsValidWord(altword, wordnumber, words)) {
               // console.log("distval" + distanceval);
                // replace distance word with the same word and append time to travel; "1448ls" => "1448ls (26m7s)"    
                if (distanceunitspaced == false) {
                    if ((IsNumberK(altword)) == true) { 
                        let nmbr = Number(distanceval);
                        nmbr = nmbr * 1000;
                        distanceval = '' + nmbr;
                    }
                words[wordnumber] = (word + " (" + TimeToTravel(distanceval, distanceunit) + ")");
                words[wordnumber] += "|[If Grvty well]:"
                destinationGravity = true
                words[wordnumber] += (" (" + TimeToTravel(distanceval, distanceunit) + ")");
                destinationGravity = false
                } else {
                    if ((IsNumberK(altword)) == true) {
                        let nmbr = Number(distanceval);
                        nmbr = nmbr * 1000;
                        distanceval = '' + nmbr;
                    }
                words[wordnumber] = (word + " (" + TimeToTravel(distanceval, distanceunit) + ")");
                words[wordnumber] += "|[If Grvty well]:"
                destinationGravity = true
                words[wordnumber] += (" (" + TimeToTravel(distanceval, distanceunit) + ")");
                destinationGravity = false
                }
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
    }
}
CheckForUpdate()
setInterval(FindText, 6000);

function IsDistanceWord(word, wordnumber, words) {
    let word2 = "";
    if(word.endsWith("kls")) {
        distanceunit = "kls";
        distanceunitspaced = false;
        return true;
    }
    if(word.endsWith("mls")) {
        distanceunit = "mls";
        distanceunitspaced = false;
        return true;
    }
    if(word.endsWith("kly")) { // intentionally disabled
        distanceunitspaced = false;
        return false;
    }
    if(word.endsWith("mm")) {
        distanceunit = "mm";
        distanceunitspaced = false;
        return true;
    }
    /* if(word.endsWith("km")) {
        distanceunit = "km";
        return true;
    }*/
    if(word.endsWith("ly")) {
        distanceunit = "ly";
        distanceunitspaced = false;
        return true;
    }
     if(word.endsWith("ls")) {
        distanceunit = "ls";
        distanceunitspaced = false;
        return true;
    }
    
    // forgive me, basically.. this is a lazy way of fixing a thing where it apparently refuses to inject sctime properly when capital letters are used.. 

    if(word.endsWith("KLS")) {
        distanceunit = "kls";
        distanceunitspaced = false;
        return true;
    }
    if(word.endsWith("MLS")) {
        distanceunit = "mls";
        distanceunitspaced = false;
        return true;
    }
    if(word.endsWith("KLY")) { // intentionally disabled
        distanceunitspaced = false;
        return false;
    }
    if(word.endsWith("MM")) {
        distanceunit = "mm";
        distanceunitspaced = false;
        return true;
    }
    /* if(word.endsWith("KM")) {
        distanceunit = "KM";
        return true;
    }*/
    if(word.endsWith("LY")) {
        distanceunit = "ly";
        distanceunitspaced = false;
        return true;
    }
     if(word.endsWith("LS")) {
        distanceunit = "ls";
        distanceunitspaced = false;
        return true;
    }
    //console.log("wordnumber:" + wordnumber);
    else {
        //console.log("words:" + words.length);
    if (words.length > 1) {
        // console.log(words);
        word2=words[wordnumber+1];
        //console.log("+1");
        //console.log("wd2:" + word2);
        if (word2 != null) {
        // console.log("aft:" + word2);
            if(word2.startsWith("kls") && word2.endsWith("kls")) {
                distanceunit = "kls";
                distanceunitspaced = true;
                return true;
            }
            if(word2.startsWith("mls") && word2.endsWith("mls")) {
                distanceunit = "mls";
                distanceunitspaced = true;
                return true;
            }
            if(word2.startsWith("kly") && word2.endsWith("kly")) { // intentionally disabled
                distanceunitspaced = true;
                return false;
            }
            if(word2.startsWith("mm") && word2.endsWith("mm")) {
                distanceunit = "mm";
                distanceunitspaced = true;
                return true;
            }
           /* if(word.endsWith("km")) {
                distanceunit = "km";
                return true;
            }*/
            if(word2.startsWith("ly") && word2.endsWith("ly")) {
                distanceunit = "ly";
                distanceunitspaced = true;
                return true;
            }
            if(word2.startsWith("ls") && word2.endsWith("ls")) {
                distanceunit = "ls";
                distanceunitspaced = true;
                return true;
            }

            // forgive me, basically.. this is a lazy way of fixing a thing where it apparently refuses to inject sctime properly when capital letters are used.. 

            if(word2.startsWith("KLS") && word2.endsWith("KLS")) {
                distanceunit = "kls";
                distanceunitspaced = true;
                return true;
            }
            if(word2.startsWith("MLS") && word2.endsWith("MLS")) {
                distanceunit = "mls";
                distanceunitspaced = true;
                return true;
            }
            if(word2.startsWith("KLY") && word2.endsWith("KLY")) { // intentionally disabled
                distanceunitspaced = true;
                return false;
            }
            if(word2.startsWith("MM") && word2.endsWith("MM")) {
                distanceunit = "mm";
                distanceunitspaced = true;
                return true;
            }
           /* if(word.endsWith("KM")) {
                distanceunit = "km";
                return true;
            }*/
            if(word2.startsWith("LY") && word2.endsWith("LY")) {
                distanceunit = "ly";
                distanceunitspaced = true;
                return true;
            }
            if(word2.startsWith("LS") && word2.endsWith("LS")) {
                distanceunit = "ls";
                distanceunitspaced = true;
                return true;
            }
            //console.log("No valid distance unit found");
            return false;
            }
        }
        }
        }

function IsGMessage() { // Checks if message contains -g flag or not (NOT USED)
    if (messagetext.includes("-g")) {
        //console.log("-g detected!");
        //destinationGravity = true; 
        // ^^ the above is now commented out due to a change in how mechasqueak handles gravity well in the sctime command
        return true;
    } else {
        //console.log("did not include -g");
        //destinationGravity = false;
        // ^^ the above is now commented out due to a change in how mechasqueak handles gravity well in the sctime command
        return true;
    }
}

function FixComma(word) { // Removes commas if more than 1
    let dotCount = 0;
    let fixedWord = word;
    for (let x = 0; x < word.length+1; x++) {
        if (word.charAt(x) == ".") {
            dotCount += 1;
            //console.log("dotcount: " + dotCount);
            //console.log("x: " + x);
            //console.log("wordlength: " + word.length);
        }
            if (dotCount > 1 && x == word.length) {
                //console.log("more than 1 comma has been detected, aborting..");
                fixedWord = fixedWord.replace(".", " "); // if more than 1 commas, remove all commas. this should fix it but idk.
                // COMING SOON(maybe idk)

                /*
                 for (let i = 0; i < dotCount; i++) { // The reason I have decided to replace all dots with nothing if the amount of dots
                    // exceed 1 is because if someone types "200000000"ls as "200.000.000" and the extension interpretes it as "200" then
                    // they will get false information which is something i'd like to avoid.
                    // Since 200.000 will otherwise get interpreted as 200 I have decided to remove all dots if they are more than 1 as that
                    // will in my opinion reduce the likelyhood of false information being injected.
                    // Why would someone type "200.000" if they meant "200"?
                        fixedWord = fixedWord.replace(".", ""); // replaces dots with nothing
                        console.log(fixedWord);
                    }
                    */
                   abort = true;
               return fixedWord;
            }
    }
    return word;
}

function RemoveChar(word) { // Removes ~ from word string that is being used for calculations
    let indexpos = 0;
    indexpos = word.indexOf("~");
    if (indexpos != "-1") {
    fixedWord = word.slice(0, indexpos) + word.slice(indexpos+1);
    //console.log(fixedWord);
    return fixedWord;
    }
    return word;
}

function IsValidWord(altword, wordnumber, words) {
    //console.log("checking if word is valid");
    if (IsGMessage()) {
        //console.log("gpass");
        if (IsNumberWord(altword)) {
            //console.log("numberpass");
            if (IsDistanceWord(altword, wordnumber, words)) {
                //console.log("distpass");
                //console.log(distanceunit);
                if (CheckForError(altword)) {
                    distanceval = parseNumber(altword, wordnumber, words); // not necessary to use right now, won't make any difference
                    //if (isNotZero == true) { // Checks if the number only contains zeros.
                        return true;
                    //}
                } else return false;
            }
        }
    } return false;
}

function parseNumber(altword, wordnumber, words) {
    let totalstring = "";
    let totalnum;
    distnum = SliceWord(altword);
    //console.log("wr: " + wordnumber);
    //console.log("word-: " + words[wordnumber-1]);
    if ((wordnumber) > 0) {
        for (let i = wordnumber-1; i < wordnumber; i--) {
            if (i < 0) { break; }
            //console.log("i: " + i);
            if (CheckForError(words[i]) == true) {
                totalstring = totalstring.concat(SliceWord(words[i]));
                //console.log("wi: " + words[i]);
            } else {
                break;
            }
        }
}
    totalstring = totalstring.concat(distnum);
    for (let x = wordnumber; x < wordnumber; x++) {
        if (CheckForError(words[x]) == true) {
            totalstring = totalstring.concat(SliceWord(words[x]));
            //console.log("wx: " + totalstring);
        } else {
            break;
        }
    }
    totalnum = parseFloat(totalstring);
    //distnum = parseFloat(distnum);
    //console.log("totstring " + totalstring);
    //console.log("parsed num: " + totalnum);
    return totalnum;
}

function SliceWord(word) {
    //console.log("word bef: " + word);
    word = word.replace(distanceunit, "");
    //console.log("word aft: " + word);
    distanceval = word;
    return word;
}

function isNotZero(word) {
    if (word == 0) {
        console.warn("Caution! Number is zero! number: " + word);
        return false;
    } else {
        return true;
    }
}

function CheckForError(word) { // Checks for errors
    word = SliceWord(word);
    if (IsNumberWord(word)) {
        if (IsNumberWordEnd(word)) { // Checks if the string is only numbers or not
            //console.log("word in: " + word);
            //dotindex = word.indexOf(".");
            //console.log("dotindex: " + dotindex)
            for(let i=0; i < word.length+1; i++) {
                ///console.log("wordi: " + word[i]);
                //console.log("i: " + i);
                //console.log(word.length);
                if(word[i]=='0' || word[i]=='1' || word[i]=='2' || word[i]=='3' || word[i]=='4' || word[i]=='5' 
                || word[i]=='6' || word[i]=='7' || word[i]=='8' || word[i]=='9' || word[i]=='.' || word[i]=='k' || word[i]=='K') {
                    if (i == word.length-1) {
                    //console.log("return true number");
                    return true;
                    }
                } else {
                    //console.log("Warning! Invalid characters detected in distance!");
                    return false;
                }
                /*
                if (isnotnumber == false && i != dotindex && i == word.length) {
                    console.log("return true number");
                    return true;
                } else if (isnotnumber == true && i == dotindex && i == word.length) {
                    console.log("Warning! Invalid characters detected in distance!");
                    return false;
                }
                */
            }
            
        } else {
            //console.log("Warning! Invalid characters detected in end of distance!");
            return false;
        }
    } else {
        //console.log("Warning! Invalid characters detected in start of distance!");
        return false;
    }
}

function IsNumberWord(word) { // true is for startsWith and false is for endsWith
    //console.log(word);
        if(word.startsWith("0") || word.startsWith("1") || word.startsWith("2") || word.startsWith("3") || 
            word.startsWith("4") || word.startsWith("5") || word.startsWith("6") || word.startsWith("7") || 
            word.startsWith("8") || word.startsWith("9") || word.endsWith("k") || word.endsWith("K")) {
                return true;
        } else return false;
}

function IsNumberWordEnd(word) {
    //console.log("loc false, word: " + word);
    if(word.endsWith("0") || word.endsWith("1") || word.endsWith("2") || word.endsWith("3") || 
        word.endsWith("4") || word.endsWith("5") || word.endsWith("6") || word.endsWith("7") || 
        word.endsWith("8") || word.endsWith("9") || word.endsWith("k") || word.endsWith("K")) {
        //console.log("return true");
               return true;
    } else return false;
}

function IsNumberK(word) {
    //console.log("loc false, word: " + word);
    if(word.endsWith("k") || word.endsWith("K")) {
        //console.log("return true");
               return true;
    } else return false;
}

function IsNumberM(word) { // what??
    //console.log("loc false, word: " + word);
    if(word.endsWith("m") || word.endsWith("M")) {
        //console.log("return true");
               return true;
    } else return false;
}



// Calculates the time to travel the distance that the word represents
// and returns it as a string in th form "<number of days>d<number of hours>t<number of minutes>m<number of seconds>s" 
// for example "3d17t5m19s" for 3 days, 17 hours, 5 minurtes, and 19 seconds
function TimeToTravel(distv, distu) {
    let SCTime = 0;
    let distnumber = 0;
    //console.log("wordthingy");
    //console.log("slicepoint:" + slicePoint);
    //console.log(Word1);
    //console.log(Word2);
    distnumber = Number(distv);
    if (distu == "ly") {
        if (distnumber > 2) {
            //console.log("aborting! ly is over 2ly!");
            abort = true;
            return;
        }
        if (abort == true) {
            return;
        }
    }
    SCTime = CalculateSCTime(distv, distu);
    return SCTime;
}

function ResetVariables() {
    messagetext = "";
    destinationGravity = false;
    distanceunit = "";
    distancevalindex = 0;
    
}

function CalculateSCTime(distance, distanceunit) {
    let distancefixed = 0; // distancefixed is always in ls(lightseconds)
    let totalseconds = 0;
    let SCTime = 0;
    distancefixed = ConvertToLS(distance, distanceunit);
    //console.log(distancefixed);
    //console.log("dist" + distancefixed);
    totalseconds = CalcTotSeconds(distancefixed);
    //console.log("tots" + totalseconds);
    SCTime = CrTimeString(totalseconds);
    //console.log("sctime: " + SCTime);
    if (SCTime == "(NaNs)") {
        return "(an error has occurred)";
    }
   /* if (totalseconds == 0) {
        console.log("totalseconds is 0");
        abort = true;
        return "(error. totalseconds is equal to 0.)"
    }
    */
    return SCTime;
 }

 function ConvertToLS(dstNum, dstUnit) {
    let unitFactors = {
        'ls': 1,
        'kls': 1000,
        'mls': 1000000,
        'ly': 31557600,
    }
    //console.log("dstnum" + dstNum);
    //console.log("dstunit" + dstUnit);
    // ** Convert to light seconds ** \\
    if (dstUnit == "ls") {
        return dstNum;
    }
    if (dstUnit == "kls") {
        dstNum = dstNum * unitFactors["kls"];
        return dstNum;
    }
    if (dstUnit == "mls") {
        dstNum = dstNum * unitFactors["mls"];
        return dstNum;
    }
    if (dstUnit == "ly") {
        dstNum = dstNum * unitFactors["ly"];
        return dstNum;
    }
     // ** Convert to km and then to lightseconds ** \\
    /* if (dstUnit == "km") {
        dstNum = dstNum / 299792;
        console.log(dstNum);
        return dstNum;
    }*/
    if (dstUnit == "mm") {
        dstNum = dstNum * 1000;
        dstNum = dstNum / 299792;
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
    //console.log("hour" + hours);
    //console.log("ts" + totalSeconds);
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