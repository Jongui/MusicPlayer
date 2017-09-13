document.addEventListener('deviceready', onDeviceReady, false);
var btnDo3 = createButton(document.getElementById("btnDo3"));
var btnRe3 = createButton(document.getElementById("btnRe3"));
var btnMi3 = createButton(document.getElementById("btnMi3"));
var btnFa3 = createButton(document.getElementById("btnFa3"));
var btnSol3 = createButton(document.getElementById("btnSol3"));
var btnLa3 = createButton(document.getElementById("btnLa3"));
var btnSi3 = createButton(document.getElementById("btnSi3"));
var btnDo4 = createButton(document.getElementById("btnDo4"));
var txtInstrument = document.getElementById("txtInstrument");
var selChannel = document.getElementById("selChannel");
var txtTempo = document.getElementById("txtTempo");
var selDynamic = document.getElementById("selDynamic");
var currentNote = 0;
var btnPlay = document.getElementById("btnPlay");
var ip = "http://192.168.0.103:8080/";
var notes = [{note: 60,
              time: 1.0},
             {note: 62,
              time: 1.0},
             {note: 63,
              time: 1.0},
             {note: 65,
              time: 1.0},
             {note: 67,
              time: 1.0},
             {note: 68,
              time: 1.0},
             {note: 70,
              time: 1.0},
             {note: 72,
              time: 1.0},
             {note: 72,
              time: 1.0},
             {note: 70,
              time: 1.0},
             {note: 68,
              time: 1.0},
             {note: 67,
              time: 1.0},
             {note: 65,
              time: 1.0},
             {note: 63,
              time: 1.0},
             {note: 62,
              time: 1.0},
             {note: 60,
              time: 1.0}];
var indexNotes = 0;

function onDeviceReady() {
    btnPlay.addEventListener("click", playPress, false);
    //document.addEventListener("backbutton", onBackKeyDown, false);
    //var variable = localStorage.getObject('myObject');
    //console.log(variable);
}

/*function onBackKeyDown() {
 navigator.app.exitApp();
 }*/

function playPress() {
    console.log("Play");
    /*http://192.168.0.104:8080/playScript?time=1.0&note=60&inst=21&channel=0&dynamic=127
     
     time = float(user_data.time)
     note = int(user_data.note)
     inst = int(user_data.inst)
     channel = int(user_data.channel)
     dynamic = int(user_data.dynamic)*/
    playNote(indexNotes);
}

function playNote(i){
    if(i >= notes.length){
        indexNotes = 0;
        return;
    }
    var address = ip + "playScript";
    cordovaHTTP.get(address, {
                    time: notes[i].time,
                    note: notes[i].note,
                    inst: txtInstrument.value,
                    channel: 0,
                    dynamic: selDynamic.value
                    }, { Authorization: "OAuth2: null" }, function (response) {
                    indexNotes++;
                    playNote(indexNotes);
                    }, function (response) {
                    
                    });
    
}

function createButton(button) {
    var obj = {};
    obj.first = true;
    obj.button = button;
    obj.note = button.value;
    obj.touchstart = function () {
        var address = ip;
        console.log("Click");
        cordovaHTTP.get(address, {
                        time: 1.00,
                        note: obj.note,
                        inst: txtInstrument.value,
                        channel: 0,
                        dynamic: selDynamic.value,
                        action: 0
                        }, { Authorization: "OAuth2: null" }, function (response) {
                        obj.button.style.backgroundColor = "#000000";
                        }, function (response) {
                        console.log("Erro:" + response.error);
                        });
    }
    obj.touchend = function () {
        var address = ip;
        console.log("Click");
        cordovaHTTP.get(address, {
                        time: 1.00,
                        note: obj.note,
                        inst: txtInstrument.value,
                        channel: 0,
                        dynamic: selDynamic.value,
                        action: 1
                        }, { Authorization: "OAuth2: null" }, function (response) {
                        obj.button.style.backgroundColor = "#229954";
                        }, function (response) {
                        console.log("Erro:" + response.error);
                        });
    }
    //obj.button.addEventListener("click", obj.onClick, false);
    obj.button.addEventListener("touchstart", obj.touchstart, false);
    obj.button.addEventListener("touchend", obj.touchend, false);
    return obj.button;
}
