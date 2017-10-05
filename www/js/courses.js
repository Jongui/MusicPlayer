
document.addEventListener('deviceready', onDeviceReady, false);

var translations = {
                    en:{
                        lblCourses: "Courses"
                    },
                    de:{
                        lblCourses: "Fäche"
                    },
                    pt:{
                        lblCourses: "Disciplinas"
                    }
};

var coursesClassDiv = document.getElementById("coursesClassDiv");
var lblCourses = document.getElementById("lblCourses");
var coursesHeaderDiv = document.getElementById("coursesHeaderDiv");
var classTaskDiv = document.getElementById("classTaskDiv");

var storage;
var coursesJson;
var ip = "http://192.168.0.103:8080/";
var textsUI;

function onDeviceReady() {
    storage = window.localStorage;
    findPreferedLanguage();
    document.addEventListener("backbutton", onBackKeyDown, false);
}

// Funções para processamento da tela
function onBackKeyDown() {
    navigator.app.exitApp();
}

function findPreferedLanguage(){
    navigator.globalization.getPreferredLanguage(function(language){
                                                    defineTranslation(language);
                                                    lblCourses.innerHTML = textsUI.lblCourses;
                                                    studentCourses();
                                                 },
                                                 function(){
                                                 
                                                 });
}

function defineTranslation(language){
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
}

// Funções para Web-Services
function studentCourses(){
    var idStudent = storage.getItem("UserName");
    var address = ip + "studentCourses";
    //http://192.168.0.103:8080/studentCourses?idStudent=Android
    cordovaHTTP.get(address, {
                    idStudent: idStudent
                    }, { Authorization: "OAuth2: null" }, function(response){
                        handleStudentCoursesResponse(response)
                    },
                    function (response) {
                        console.log("Erro:" + response.error);
                    });

}

function coursClasses(idCours, coursName){
    //http://192.168.0.103:8080/coursClasses?idCours=1
    var address = ip + "coursClasses";
    cordovaHTTP.get(address, {
                    idCours: event.target.id
                    }, { Authorization: "OAuth2: null" }, function(response){
                        handleClassesCoursResponse(response, coursName);
                    },
                    function (response) {
                        console.log("Erro:" + response.error);
                    });
}

function classesTasks(idClasses, idCours){
    //http://192.168.0.103:8080/classesTasks?idClasses=1&idCours=1
    var address = ip + "classesTasks";
    cordovaHTTP.get(address, {
                    idClasses: event.target.id,
                    idCours: idCours
                    }, { Authorization: "OAuth2: null" }, function(response){
                        handleClassesTasksResponse(response);
                    },
                    function (response) {
                    console.log("Erro:" + response.error);
                    });
}

function handleStudentCoursesResponse(response){
    coursesJson = JSON.parse(response.data);
    coursesHeaderDiv.innerHTML = "<ul id='listCourses' class='coursesUl' data-role='listview' >";
    var ul = document.getElementById("listCourses");
    for(var i = 0; i < coursesJson.Courses.length; i++){
        json = coursesJson.Courses[i];
        var node=document.createElement("li");
        var textnode=document.createTextNode(json.coursName);
        node.id = json.idCourses;
        node.appendChild(textnode);
        ul.appendChild(node);
    }
    coursClickHandler();
}


function handleClassesCoursResponse(response, coursName){
    var classesJsonArray = JSON.parse(response.data);
    coursesClassDiv.style.display = "inline-block";
    classTaskDiv.style.display = "none";
    
    coursesClassDiv.innerHTML = "<ul id='listClasses' data-role='listview' style='border-top: 1px solid purple;'>";
    var ul = document.getElementById("listClasses");
    for(var i = 0; i < classesJsonArray.Classes.length; i++){
        json = classesJsonArray.Classes[i];
        var node=document.createElement("li");
        var textnode=document.createTextNode("Class at: " + json.date);
        node.id = json.idClasses;
        node.appendChild(textnode);
        ul.appendChild(node);
    }
    classesClickHandler(json.idCourses);
}

function handleClassesTasksResponse(response){
    tasksJson = JSON.parse(response.data);
    classTaskDiv.style.display = "inline-block";
    classTaskDiv.innerHTML = "<ul id='listTasks' data-role='listview' style='border-top: 1px solid purple;'>";
    var ul = document.getElementById("listTasks");
    ul.innerHTML = "";
    for(var i = 0; i < tasksJson.Tasks.length; i++){
        json = tasksJson.Tasks[i];
        var node=document.createElement("li");
        var textnode=document.createTextNode(json.description);
        node.id = json.idTasks;
        node.title = json.keyboard;
        node.appendChild(textnode);
        ul.appendChild(node);
    }
    tasksClickHandler();
}

// Funções internas da página
function coursClickHandler(){
    var ul = document.getElementById('listCourses');
    ul.onclick = function(event) {
        storage.setItem("idCours", event.target.id);
        coursClasses(event.target.id, event.target.text);
    };
}

function classesClickHandler(idCourses){
    var ul = document.getElementById('listClasses');
    ul.onclick = function(event) {
        storage.setItem("idClasses", event.target.id);
        classesTasks(event.target.id, idCourses);
    };
}

function tasksClickHandler(){
    var ul = document.getElementById('listTasks');
    ul.onclick = function(event) {
        storage.setItem("idTask", event.target.id);
        window.location = event.target.title + ".html";
    };
}
