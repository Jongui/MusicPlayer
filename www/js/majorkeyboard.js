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
var btnPlayAnswer = document.getElementById("btnPlayAnswer");
var btnRecord = document.getElementById("btnRecord");
var btnSend = document.getElementById("btnSend");
var ip = "http://192.168.0.103:8080/";
var storage;
var btnMap = new Map();
var taskAnswer = {};
taskAnswer.notes = [];
var notesAnswer = {};
var recording = false;
btnMap.set(60, btnDo3);
btnMap.set(62, btnRe3);
btnMap.set(64, btnMi3);
btnMap.set(65, btnFa3);
btnMap.set(67, btnSol3);
btnMap.set(69, btnLa3);
btnMap.set(71, btnSi3);
btnMap.set(72, btnDo4);

var notes;
var indexNotes = 0;

function onDeviceReady() {
    btnPlay.addEventListener("click", playPress, false);
    btnRecord.addEventListener("click", recordStatusProcess, false);
    btnPlayAnswer.addEventListener("click", playAnswerPress, false);
    btnSend.addEventListener("click", sendAnwser, false);
    storage = window.localStorage;
    loadTaskInfo();
    document.addEventListener("backbutton", onBackKeyDown, false);
    //var variable = localStorage.getObject('myObject');
    //console.log(variable);
}

function recordStatusProcess(){
    if(recording){
        recording = false;
    } else {
        taskAnswer = {};
        taskAnswer.notes = [];
        recording = true;
    }
}

function sendAnwser(){
    /*http://192.168.0.103:8080/sendAnswer?idCours=1&idClasses=1&idTask=1&idStudent=1&answer=json*/
    var idCours = storage.getItem("idCours");
    var idClasses = storage.getItem("idClasses");
    var idTask = storage.getItem("idTask");
    var idStudent = storage.getItem("UserName");
    
    var address = ip + "sendAnswer";
    cordovaHTTP.get(address, {
                    idCours: idCours,
                    idClasses: idClasses,
                    idTask: idTask,
                    idStudent: idStudent,
                    answer: taskAnswer
                    }, {Authorization: "OAuth2: null" } , function(response){
                        console.log(response);
                    }, function(response){
                        console.log(response);
                    }
                    );
}

function loadTaskInfo(){
    var idCours = storage.getItem("idCours");
    var idClasses = storage.getItem("idClasses");
    var idTask = storage.getItem("idTask");
    /*http://192.168.0.104:8080/loadTaskInfo?idCours=1&idClasses=1&idTask=1*/
    var address = ip + "loadTaskInfo";

    cordovaHTTP.get(address, {
                    idCours: idCours,
                    idClasses: idClasses,
                    idTask: idTask
                    }, { Authorization: "OAuth2: null" }, function (response) {
                    responseJson = JSON.parse(response.data);
                    notes = responseJson.notes;
                    var instJson = responseJson.inst;
                    for(var i = 0; i < instJson.length; i++) {
                        var instrument = instJson[i];
                        txtInstrument.options[i] = new Option(instrument.desc, instrument.desc);
                        txtInstrument.options[i].value = instrument.code;
                    }
                    }, function (response) {
                    
                    });
}

/*function onBackKeyDown() {
    navigator.app.exitApp();
}*/

function playPress() {
    playNote(indexNotes, notes);
}

function playAnswerPress(){
    console.log(taskAnswer.notes);
    indexNotes = 0;
    playNote(indexNotes, taskAnswer.notes);
}

function playNote(i, playNotes){
    if(i >= playNotes.length){
        indexNotes = 0;
        return;
    }
    console.log(playNotes[i].note);
    btnPlaying = btnMap.get(playNotes[i].note);
    btnPlaying.style.backgroundColor = "#000000";
    var address = ip + "playScript";
    cordovaHTTP.get(address, {
                    time: playNotes[i].time,
                    note: playNotes[i].note,
                    inst: txtInstrument.value,
                    channel: 0,
                    dynamic: selDynamic.value
                    }, { Authorization: "OAuth2: null" }, function (response) {
                        btnPlaying.style.backgroundColor = "#229954";
                        indexNotes++;
                        playNote(indexNotes, playNotes);
                    }, function (response) {
                    
                    });
   
}

function createButton(button) {
    var obj = {};
    obj.first = true;
    obj.button = button;
    obj.note = button.value;
    var startTime, endTime;
    obj.touchstart = function () {
        var address = ip;
        cordovaHTTP.get(address, {
                        time: 1.00,
                        note: obj.note,
                        inst: txtInstrument.value,
                        channel: 0,
                        dynamic: selDynamic.value,
                        action: 0
                        }, { Authorization: "OAuth2: null" }, function (response) {
                            if(recording){
                                notesAnswer = {};
                                notesAnswer["note"] = parseInt(obj.note);
                            }
                            startTime = new Date().getTime() / 1000;
                            obj.button.style.backgroundColor = "#000000";
                        }, function (response) {
                        console.log("Erro:" + response.error);
                        });
    }
    obj.touchend = function () {
        var address = ip;
        cordovaHTTP.get(address, {
                        time: 1.00,
                        note: obj.note,
                        inst: txtInstrument.value,
                        channel: 0,
                        dynamic: selDynamic.value,
                        action: 1
                        }, { Authorization: "OAuth2: null" }, function (response) {
                        obj.button.style.backgroundColor = "#229954";
                        endTime = new Date().getTime() / 1000;
                        var deltaTime = endTime - startTime;
                        if(recording){
                            notesAnswer["time"] = parseFloat(deltaTime.toFixed(2));
                            taskAnswer.notes.push(notesAnswer);
                        }
                        }, function (response) {
                        console.log("Erro:" + response.error);
                        });
    }
    //obj.button.addEventListener("click", obj.onClick, false);
    obj.button.addEventListener("touchstart", obj.touchstart, false);
    obj.button.addEventListener("touchend", obj.touchend, false);
    return obj.button;
}
