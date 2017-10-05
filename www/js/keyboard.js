var translations = {
                    en:{
                        playInst: "Play Inst.",
                        playExample: "Play Example",
                        recordAnswer: "Record answer",
                        stopRecording: "Stop recording",
                        playAnswer: "Play answer",
                        sendAnswer: "Send answer",
                        answerSend: "Answer send"
                    },
                    de:{
                        playInst: "Inst. spielen",
                        playExample: "Beisp. spielen",
                        recordAnswer: "Antwort aufn.",
                        stopRecording: "Aufn. stop",
                        playAnswer: "Antw. spielen",
                        sendAnswer: "Antw. senden",
                        answerSend: "Antw. gesandt"
                    },
                    pt:{
                        playInst: "Tocar inst.",
                        playExample: "Tocar exemplo",
                        recordAnswer: "Gravar resp.",
                        stopRecording: "Parar grava.",
                        playAnswer: "Tocar resp.",
                        sendAnswer: "Enviar resp.",
                        answerSend: "Resp. enviada"
                    }
};

document.addEventListener('deviceready', onDeviceReady, false);
var btnDo3 = createButton(document.getElementById("btnDo3"));
var btnRe3 = createButton(document.getElementById("btnRe3"));
var btnMi3 = createButton(document.getElementById("btnMi3"));
var btnFa3 = createButton(document.getElementById("btnFa3"));
var btnSol3 = createButton(document.getElementById("btnSol3"));
var btnLa3 = createButton(document.getElementById("btnLa3"));
var btnSi3 = createButton(document.getElementById("btnSi3"));
var btnDo4 = createButton(document.getElementById("btnDo4"));
var btnRe4 = createButton(document.getElementById("btnRe4"));
var btnMi4 = createButton(document.getElementById("btnMi4"));
var btnFa4 = createButton(document.getElementById("btnFa4"));
var btnSol4 = createButton(document.getElementById("btnSol4"));
var txtInstrument = document.getElementById("txtInstrument");
var selChannel = document.getElementById("selChannel");
var txtTempo = document.getElementById("txtTempo");
var selDynamic = document.getElementById("selDynamic");
var currentNote = 0;
var btnPlay = document.getElementById("btnPlay");
var btnPlayAnswer = document.getElementById("btnPlayAnswer");
var btnRecord = document.getElementById("btnRecord");
var btnSend = document.getElementById("btnSend");
var btnInstrument = document.getElementById("btnInstrument");
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
btnMap.set(74, btnRe4);
btnMap.set(76, btnMi4);
btnMap.set(77, btnFa4);
btnMap.set(79, btnSol4);

var textsUI;
var notes;
var indexNotes = 0;
var lines;
var locale;

function onDeviceReady() {
    findPreferedLanguage();
    btnPlay.addEventListener("click", playPress, false);
    btnRecord.addEventListener("click", recordStatusProcess, false);
    btnPlayAnswer.addEventListener("click", playAnswerPress, false);
    btnSend.addEventListener("click", sendAnwser, false);
    btnInstrument.addEventListener("click", playInstrument, false);
    storage = window.localStorage;
    loadTaskInfo();
    //document.addEventListener("backbutton", onBackKeyDown, false);
    //var variable = localStorage.getObject('myObject');
    //console.log(variable);
}

function initialRender(){
    // Textos dos botões
    btnPlay.innerHTML = textsUI.playExample;
    btnRecord.innerHTML = textsUI.recordAnswer;
    btnPlayAnswer.innerHTML = textsUI.playAnswer;
    btnSend.innerHTML = textsUI.sendAnswer;
    btnInstrument.innerHTML = textsUI.playInst;
}
function recordStatusProcess(){
    if(recording){
        recording = false;
        btnRecord.innerHTML = textsUI.recordAnswer;
    } else {
        taskAnswer = {};
        taskAnswer.notes = [];
        recording = true;
        btnRecord.innerHTML = textsUI.stopRecording;
    }
}

function sendAnwser(){
    /*http://192.168.0.103:8080/sendAnswer?idCours=1&idClasses=1&idTask=1&idStudent=1&answer=json*/
    var idCours = storage.getItem("idCours");
    var idClasses = storage.getItem("idClasses");
    var idTask = storage.getItem("idTask");
    var idStudent = storage.getItem("UserName");
    
    var address = ip + "sendAnswer";
    var sendAnswer = JSON.stringify(taskAnswer);
    console.log(sendAnswer);
    cordovaHTTP.get(address, {
                    idCours: idCours,
                    idClasses: idClasses,
                    idTask: idTask,
                    idStudent: idStudent,
                    answer: sendAnswer,
                    locale: locale
                    }, {Authorization: "OAuth2: null" } , function(response){
                        var jsonData = JSON.parse(response.data);
                        navigator.notification.alert(jsonData.message, function(){
                                                     
                                                 }, textsUI.answerSend, "OK");
                    }, function(response){
                        console.log(response);
                    }
                    );
}

function loadTaskInfo(){
    var idCours = storage.getItem("idCours");
    var idClasses = storage.getItem("idClasses");
    var idTask = storage.getItem("idTask");
    /*http://192.168.0.103:8080/loadTaskInfo?idCours=1&idClasses=1&idTask=1*/
    var address = ip + "loadTaskInfo";

    cordovaHTTP.get(address, {
                    idCours: idCours,
                    idClasses: idClasses,
                    idTask: idTask
                    }, { Authorization: "OAuth2: null" }, function (response) {
                    responseJson = JSON.parse(response.data);
                    lines = responseJson.lines;
                    for (var i = 0; i < lines.length; i++){
                        var line = lines[i];
                        var instrument = line.inst;
                        txtInstrument.options[i] = new Option(instrument.desc, instrument.desc);
                        txtInstrument.options[i].value = instrument.code;
                    }
                    /*notes = responseJson.notes;
                    var instJson = responseJson.inst;
                    for(var i = 0; i < instJson.length; i++) {
                        var instrument = instJson[i];
                        txtInstrument.options[i] = new Option(instrument.desc, instrument.desc);
                        txtInstrument.options[i].value = instrument.code;
                    }*/
                    }, function (response) {
                    
                    });
}

/*function onBackKeyDown() {
    navigator.app.exitApp();
}*/

function playPress() {
    //http://192.168.0.103:8080/playTask?fileName=taskTest
    var address = ip + "playTask";
    var idCours = storage.getItem("idCours");
    var idClasses = storage.getItem("idClasses");
    var idTask = storage.getItem("idTask");
    var fileName = "task" + idCours + idCours + idTask;
    cordovaHTTP.get(address, {
                        fileName: fileName
                    }, { Authorization: "OAuth2: null" }, function (response) {
                    console.log("Disparou teste");
                    }, function (response) {
                    
                    });
    //playNote(indexNotes, notes);
}

function playAnswerPress(){
    indexNotes = 0;
    playNote(indexNotes, taskAnswer.notes);
}

function playInstrument(){
    indexNotes = 0;
    for(var i = 0; i < lines.length; i++){
        var line = lines[i];
        var instrument = line.inst;
        if(instrument.code == txtInstrument.value){
            notes = line.notes;
            break;
        }
    }
    playNote(indexNotes, notes);
}

function playNote(i, playNotes){
    if(i >= playNotes.length){
        indexNotes = 0;
        return;
    }
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
                        btnPlaying.style.backgroundColor = "#74AD5A";
                        indexNotes++;
                        playNote(indexNotes, playNotes);
                    }, function (response) {
                    
                    });
   
}

function findPreferedLanguage(){
    navigator.globalization.getPreferredLanguage(function(language){
                                                 defineTranslation(language);
                                                 },
                                                 function(){
                                                 
                                                 });
}

function defineTranslation(language){
    locale = language.value;
    switch(language.value){
        case "en-US":
            textsUI = translations.en;
            break;
        case "pt-BR":
            textsUI = translations.pt;
            break;
        case "de-DE":
            textsUI = translations.de;
            break;
        default:
            textsUI = translations.en;
            break;
    }
    initialRender();
}

function createButton(button) {
    var obj = {};
    obj.first = true;
    obj.button = button;
    obj.note = button.value;
    var startTime, endTime;
    obj.touchstart = function () {
        var address = ip + "play";
        console.log(obj.note);
        cordovaHTTP.get(address, {
                        //http://192.168.0.103:8080/play?time=1.0&note=60&inst=20&channel=0&dynamic=120&action=0
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
        var address = ip + "play";
        cordovaHTTP.get(address, {
                        //http://192.168.0.103:8080/play?time=1.0&note=60&inst=20&channel=0&dynamic=120&action=1
                        time: 1.00,
                        note: obj.note,
                        inst: txtInstrument.value,
                        channel: 0,
                        dynamic: selDynamic.value,
                        action: 1
                        }, { Authorization: "OAuth2: null" }, function (response) {
                        obj.button.style.backgroundColor = "#74AD5A";
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
