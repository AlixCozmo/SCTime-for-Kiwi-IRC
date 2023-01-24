var lasttimefuel = 0;
var lasttimechat = 0;
var messagestringchat;
var messagestringfuel;
var messagetimechat = 0;
var messagetimefuel = 0;
var messagelengthchat;
var messagelengthfuel;
const activechannels = [];
const messagelength = [];
const messagetime = [];
console.log("waiting for 10s");
setInterval(10000);
console.log("done");
function MessageHandler() {
    let returnvalue = 0;
    let lengthfuel;
    let lengthchat;
    //console.log("GrabMessage Started!");
    GrabChannels();
    returnvalue = GrabMessage(false, 0, 0);
    if (returnvalue == 1) {
        //console.log("waiting 5 seconds..");
        setTimeout(10000);
        messagestringchat = messagestringchat.toLowerCase();
        messagestringfuel = messagestringfuel.toLowerCase();
        lengthchat = messagelengthchat;
        lengthfuel = messagelengthfuel;
        for (let x = 0; x < 5; x++) {
                lengthchat = lengthchat--;
                lengthfuel = lengthfuel--;
                GrabMessage(true, lengthchat, lengthfuel);
                setTimeout(1000);
                CheckMessage();
            }
    } else {
        console.error("Caution! One or more values are null!");
        if (messagestringchat == null) {
            console.error("messagestringchat is null");
        }
        if (messagestringfuel == null) {
            console.error("messagestringfuel is null");
        }
        if (messagetimechat == 0) {
            console.error("messagetimechat is 0");
        }
        if (messagetimefuel == 0) {
            console.error("messagestimefuel is 0");
        }
        if (messagelengthchat == null) {
            console.error("messagelengthchat is null");
        }
        if (messagelengthfuel == null) {
            console.error("messagelengthfuel is null");
        }
    }
}

function GrabMessage(lengthbool, lengthsecondarychat, lengthsecondaryfuel) { // if lengthbool is true, this function will use the provided number from the parameter instead of length.
    if (lengthbool == false) {
        console.log("grabmessage");
        setTimeout(2000);
        if (activechannels.includes("#ratchat")) {
            console.log("ratchat");
            messagelengthchat = InjectLengthScript("#ratchat");
            console.log("waiting for 1 second before continuing..");
            setTimeout(1000);
            messagestringchat = InjectScript("#ratchat", messagelengthchat, "message");
            messagetimechat = InjectScript("#ratchat", messagelengthchat, "time");
        }
        if (activechannels.includes("#fuelrats")) {
            console.log("fuelrats");
            messagelengthfuel = InjectLengthScript("#fuelrats");
            console.log("waiting for 1 second before continuing..");
            setTimeout(1000);
            messagestringfuel = InjectScript("#fuelrats", messagelengthfuel, "message");
            messagetimefuel = InjectScript("#fuelrats", messagelengthfuel, "time");
        }
        if (((messagelengthchat || messagestringchat || messagelengthfuel || messagestringfuel) == null) || ((messagetimechat || messagetimefuel) == 0)) {
            return 0;
        }
        return 1;
    }
    if (lengthbool == true) {
        if (activechannels.includes("#ratchat")) {
            console.log("ratchat, lb");
            messagelengthchat = InjectLengthScript("#ratchat");
            messagestringchat = InjectScript("#ratchat", lengthsecondarychat, "message");
            messagetimechat = InjectScript("#ratchat", lengthsecondarychat, "time");
        }
        if (activechannels.includes("#fuelrats")) {
            console.log("fuelrats, lb");
            messagelengthfuel = InjectLengthScript("#fuelrats");
            messagestringfuel = InjectScript("#fuelrats", lengthsecondaryfuel, "message");
            messagetimefuel = InjectScript("#fuelrats", lengthsecondaryfuel, "time");
        }
        if (messagelengthchat || messagestringchat || messagetimechat || messagelengthfuel || messagestringfuel || messagetimefuel == null) {
            return 0;
        }
        return 1;
    }
}

function AddVariables() {
    for (let x = 0; x < activechannels.length; x++) {
        messagelength.length = messagelength.length++;
        messagelength.push(words[wordnumber]);
    }
    return;
}

function GrabChannels() { // Gets the currently active channels and places them into the activechannels array
    console.log("grabchannels");
    let element=document.getElementsByClassName("kiwi-statebrowser-channel-name");
    let text = "";
    let words = "";
    for (let elementnumber = 0; elementnumber < element.length; elementnumber++) {
        text = element[elementnumber].innerText;
        words=text.split(" ");
        for(let wordnumber=0; wordnumber < words.length; wordnumber++) {
            if (words[wordnumber].startsWith("#")) {
                if (words[wordnumber].endsWith("a") || words[wordnumber].endsWith("b") || words[wordnumber].endsWith("c") 
                || words[wordnumber].endsWith("d") || words[wordnumber].endsWith("e") || words[wordnumber].endsWith("f") 
                || words[wordnumber].endsWith("g") || words[wordnumber].endsWith("h") || words[wordnumber].endsWith("i") 
                || words[wordnumber].endsWith("j") || words[wordnumber].endsWith("k") || words[wordnumber].endsWith("l")
                || words[wordnumber].endsWith("m") || words[wordnumber].endsWith("n") || words[wordnumber].endsWith("o") 
                || words[wordnumber].endsWith("p") || words[wordnumber].endsWith("q") || words[wordnumber].endsWith("r")
                || words[wordnumber].endsWith("s") || words[wordnumber].endsWith("t") || words[wordnumber].endsWith("u")
                || words[wordnumber].endsWith("v") || words[wordnumber].endsWith("w") || words[wordnumber].endsWith("x")
                || words[wordnumber].endsWith("y") || words[wordnumber].endsWith("z")) 
                {
                    activechannels = [];
                    activechannels.length = activechannels.length++;
                    activechannels.push(words[wordnumber]);
                    console.log("active channels: " + activechannels);
                    return;
                    
                } else {
                    console.log("no channels found");
                }
            } else {
                console.log("no channels found");
            }
        }

    }
    console.log("no channels found");
}

function InjectLengthScript(Channel) { // Same as InjectScript except this one is intended to obtain how many messages there are.
    let datareturn;
    let script = document.createElement('script');
    let string = 'var length = window.kiwi.state.getBufferByName(1, "CHANNEL").messagesObj.messages.length; document.dispatchEvent(new CustomEvent("dataevent", {detail: data}));';
    string = string.replace('CHANNEL', Channel);
    script.textContent = string;
    (document.head||document.documentElement).appendChild(script);
        document.addEventListener('dataevent', function (event) {
            datareturn = event.detail;
            //console.log("RECEIVED!!, LENGTH");
            datareturn = parseInt(datareturn);
        });
    script.parentNode.removeChild(script);
    document.removeEventListener('dataevent', function (event) {
    });
    return datareturn;
}

function InjectScript(Channel, length, type) { // Injects a script onto the site
    let datareturn;
    let script = document.createElement('script');
    let string = 'var data = window.kiwi.state.getBufferByName(1, "CHANNEL").messagesObj.messages[LENGTH].TYPE; document.dispatchEvent(new CustomEvent("dataevent", {detail: data}));';
    string = string.replace('CHANNEL', Channel);
    string = string.replace('LENGTH', length);
    string = string.replace('TYPE', type);
    script.textContent = string;
    (document.head||document.documentElement).appendChild(script);
        document.addEventListener('dataevent', function (event) {
            datareturn = event.detail;
            //console.log("RECEIVED!!, REG");
            if (type == "time") {
                datareturn = parseInt(datareturn);
            }
        });
    script.parentNode.removeChild(script);   
    document.removeEventListener('dataevent', function (event) {
    });
    return datareturn;
}

function CheckMessage() { // Returns 1 if successful, 0 if not.
        console.log("checking if string matches..");
        if (messagestringchat.includes("ratsignal") && (messagetimechat > lasttimechat)) {
            lasttimechat = messagetimechat;
            console.log("RAT!");
            PlaySound(1);
            return 1;
        }
        if (messagestringchat.includes("code red") && messagestringchat.includes("ratsignal") && (messagetimechat > lasttimechat)) {
            lasttimechat = messagetimechat;
            console.log("CODE RED!");
            PlaySound(3);
            return 1;
        }
        if (messagestringchat.includes("hatsignal") && (messagetimechat > lasttimechat)) {
            lasttimechat = messagetimechat;
            console.log("HAT!");
            PlaySound(2);
            return 1;
        }
        if (messagestringchat.includes("test") && (messagetimechat > lasttimechat)) {
            lasttimechat = messagetimechat;
            console.log("test!");
            PlaySound(4);
            return 1;
        }
        if (messagestringchat.includes("joined") && (messagetimechat > lasttimechat)) {
            lasttimechat = messagetimechat;
            console.log("joined!");
            PlaySound(4);
            return 1;
        }

        if (messagestringfuel.includes("code red") && messagestringfuel.includes("ratsignal") && (messagetimefuel > lasttimefuel)) {
            lasttimefuel = messagetimefuel;
            console.log("CODE RED!");
            PlaySound(3);
            return 1;
        }
        if (messagestringfuel.includes("ratsignal") && (messagetimefuel > lasttimefuel)) {
            lasttimefuel = messagetimefuel;
            console.log("RAT!");
            PlaySound(1);
            return 1;
        }
        /*
        
        // FUELRAT
        if (messagestringfuel.includes("ratsignal" && lasttimefuel != messagetimefuel)) {
            lasttimefuel = messagetimechat;
            console.log("RAT!");
            PlaySound(1);
        }
        if (messagestringfuel.includes("hatsignal" && lasttimefuel != messagetimefuel)) {
            lasttimefuel = messagetimechat;
            console.log("HAT!");
            PlaySound(2);
        }
        if (messagestringfuel.includes("code red" && lasttimefuel != messagetimefuel)) {
            lasttimefuel = messagetimechat;
            console.log("CODE RED!");
            PlaySound(3);
        }
        */
        
        return 0;
    }

/*function MessageHandler() {
    GrabMessage();
    CheckMessage();
    //ResetVar();
}
*/

    

function ResetVar() {
    window.messagestringfuel = null;
    window.messagestringchat = null;
    window.messagetimechat = null;
    window.messagetimefuel = null;
}

function PlayAudio(){
    var files = this.files;
    var file = URL.createObjectURL(files[0]); 
                audio_player.src = file; 
    audio_player.play();
  };

function PlaySound(snumber) {
    if (snumber == 1) { // ratsignal
        var audio1 = new Audio('https://confluence.fuelrats.com/download/attachments/7635267/ratsounds_ratsignal.wav?version=1&modificationDate=1488766734831&api=v2');
        audio1.play();
        console.log("played sound 1");
    }
    if (snumber == 2) { // hatsignal
        var audio2 = new Audio('https://confluence.fuelrats.com/download/attachments/7635267/ratsounds_hatsignal.wav?version=1&modificationDate=1488767044207&api=v2');
        audio2.play();
        console.log("played sound 2");
    }
    if (snumber == 3) { // code red
        var audio3 = new Audio('https://confluence.fuelrats.com/download/attachments/7635267/ratsounds_codered.wav?version=1&modificationDate=1488766987707&api=v2');
        audio3.play();
        console.log("played sound 3");
    }
    if (snumber4 == 4) { // snickers
        var audio = new Audio('https://confluence.fuelrats.com/download/attachments/7635267/ratsounds_snickers.wav?version=1&modificationDate=1488767074177&api=v2');
        audio4.play();
        console.log("played sound 4");
    }
}
setInterval(MessageHandler, 1000);