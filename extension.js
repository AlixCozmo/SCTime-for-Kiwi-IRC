var messagetext = "";
var nicktext = "";
var abort = false; // if set to true, the program should abort any current attempt to inject time data into a message
var destinationGravity = false;
var distanceunit = "";
var distanceval = "";
//console.log("start!");
var distanceunitspaced = false; // if true, the extension will inject sctime after the distance unit if it's not the same word as the number
var distancevalindex = 0;


// TODO

// Add support for numbers with spaces in between the numbers
// add support for more than 1 commas
// add support for .10ly(example)
// add support for detecting if number is only zeros, (it's supposed to ignore those)


// DONE
// add support for messages that has the units in a different word(eg. 20 ls)

function FindText() {
    console.log("ft");
    let elems = null;
    let nick = null;
    let words = null; let word = "";
    let altword = ""; // similar to word except it's only used for calculations
    let newMessageText = "";

    ResetVariables();
    //messagetext = document.documentElement.innerText;
    //elems=document.getElementsByClassName("gb_n"); //testing purposes

    elems=document.getElementsByClassName("kiwi-messagelist-body");
    nick=document.getElementsByClassName("kiwi-messagelist-nick");
    for (let elementnumber = 0; elementnumber < elems.length; elementnumber++) {
        //console.log("elementnumber:" + elementnumber);
        messagetext = elems[elementnumber].innerHTML;
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
            altword=word.toLowerCase();
            //console.log(altword);
            altword = FixComma(altword);
            altword = RemoveChar(altword);
            if (abort == true) {
                abort = false;
                continue;
            }
            if(IsValidWord(altword, wordnumber, words)) {
                // replace distance word with the same word and append time to travel; "1448ls" => "1448ls (26m7s)"
                if (distanceunitspaced == false) {
                words[wordnumber] = (word + " (" + TimeToTravel(distanceval, distanceunit) + ")");
                } else {
                words[wordnumber+1] = (distanceunit + " (" + TimeToTravel(distanceval, distanceunit) + ")");
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
setInterval(FindText, 3500);

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
        //console.log("wordnumber:" + wordnumber);
        else {
            console.log("words:" + words.length);
        if (words.length > 1) {
           // console.log(words);
            word2=words[wordnumber+1];
            //console.log("+1");
        
            console.log("wd2:" + word2);
        
       // console.log("aft:" + word2);
            if(word2.endsWith("kls")) {
                distanceunit = "kls";
                distanceunitspaced = true;
                return true;
            }
            if(word2.endsWith("mls")) {
                distanceunit = "mls";
                distanceunitspaced = true;
                return true;
            }
            if(word2.endsWith("kly")) { // intentionally disabled
                distanceunitspaced = true;
                return false;
            }
            if(word2.endsWith("mm")) {
                distanceunit = "mm";
                distanceunitspaced = true;
                return true;
            }
           /* if(word.endsWith("km")) {
                distanceunit = "km";
                return true;
            }*/
            if(word2.endsWith("ly")) {
                distanceunit = "ly";
                distanceunitspaced = true;
                return true;
            }
            if(word2.endsWith("ls")) {
                distanceunit = "ls";
                distanceunitspaced = true;
                return true;
            }
            console.log("No valid distance unit found");
            return false;
            }
        }
        }

function IsGMessage() {
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

function FixComma(word) {
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
                console.log("more than 1 comma has been detected, aborting..");

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
    console.log("checking if word is valid");
    if (IsGMessage()) {
        //console.log("gpass");
        if (IsNumberWord(altword)) {
            //console.log("numberpass");
            if (IsDistanceWord(altword, wordnumber, words)) {
                //console.log("distpass");
                //console.log(distanceunit);
                if (CheckForError(altword)) { 
                return true;
            } else return false;
        }
        }
    } return false;
}

function SliceWord(word) {
    //console.log("word bef: " + word);
    word = word.replace(distanceunit, "");
    //console.log("word aft: " + word);
    distanceval = word;
    return word;
}

function CheckForError(word) { // Checks for errors
    word = SliceWord(word);
    if (IsNumberWord(word)) {
        if (IsNumberWordEnd(word)) {
            //console.log("word in: " + word);
            //dotindex = word.indexOf(".");
            //console.log("dotindex: " + dotindex)
            for(let i=0; i < word.length+1; i++) {
                ///console.log("wordi: " + word[i]);
                //console.log("i: " + i);
                console.log(word.length);
                if(word[i]=='0' || word[i]=='1' || word[i]=='2' || word[i]=='3' || word[i]=='4' || word[i]=='5' 
                || word[i]=='6' || word[i]=='7' || word[i]=='8' || word[i]=='9' || word[i]=='.') {
                    if (i == word.length-1) {
                    //console.log("return true number");
                    return true;
                    }
                } else {
                    console.log("Warning! Invalid characters detected in distance!");
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
            console.log("Warning! Invalid characters detected in end of distance!");
            return false;
        }
    } else {
        console.log("Warning! Invalid characters detected in start of distance!");
        return false;
    }
}

function IsNumberWord(word) { // true is for startsWith and false is for endsWith
    console.log(word);
        if(word.startsWith("0") || word.startsWith("1") || word.startsWith("2") || word.startsWith("3") || 
            word.startsWith("4") || word.startsWith("5") || word.startsWith("6") || word.startsWith("7") || 
            word.startsWith("8") || word.startsWith("9")) {
                return true;
        } else return false;
}

function IsNumberWordEnd(word) {
    console.log("loc false, word: " + word);
    if(word.endsWith("0") || word.endsWith("1") || word.endsWith("2") || word.endsWith("3") || 
        word.endsWith("4") || word.endsWith("5") || word.endsWith("6") || word.endsWith("7") || 
        word.endsWith("8") || word.endsWith("9")) {
        console.log("return true");
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
        if (distnumber > 1) {
            console.log("aborting! ly is over 1ly!");
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
    console.log(distancefixed);
    //console.log("dist" + distancefixed);
    totalseconds = CalcTotSeconds(distancefixed);
    //console.log("tots" + totalseconds);
    SCTime = CrTimeString(totalseconds);
    console.log("sctime: " + SCTime);
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
    console.log("dstnum" + dstNum);
    console.log("dstunit" + dstUnit);
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