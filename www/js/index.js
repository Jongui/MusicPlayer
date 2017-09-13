/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.

 */

var translations = {
                    en:{
                        userName: "User name",
                        name: "Name",
                        password: "Password",
                        confirmPassword: "Confirm Password",
                        createUser: "Create User",
                        confirm: "Confirm",
                        cancel: "Cancel",
                        emailMandatory: "E-mail mandatory",
                        userNameMandatory: "User name is mandatory",
                        nameMandatory: "Name is mandatory",
                        passwordMandatory: "Password is mandatory",
                        passwordNotMetch: "Passwords don`t mecth",
                        loginFail: "Wrong user name or password",
                        loginTitle: "Login"
                    },
                    de:{
                        userName: "Benutzername",
                        name: "Name",
                        password: "Kennwort",
                        confirmPassword: "Kenwort bestätigen",
                        createUser: "Neuer Benutzer",
                        confirm: "Bestätigen",
                        cancel: "Abbrechen",
                        emailMandatory: "E-mail erfordelich",
                        nameMandatory: "Name erfordelich",
                        userNameMandatory: "Benutzername erfordelich",
                        passwordMandatory: "Kennwort erfordelich",
                        passwordNotMetch: "Kennwörter stimmen nicht",
                        loginFail: "Falscher Benutzername oder Kennwort",
                        loginTitle: "Login"
                    },
                    pt:{
                        userName: "Nome do usuário",
                        name: "Nome",
                        password: "Senha",
                        confirmPassword: "Confirmar Senha",
                        createUser: "Criar usuário",
                        confirm: "Confirmar",
                        cancel: "Cancelar",
                        emailMandatory: "E-mail obrigatório",
                        nameMandatory: "Nome é obrigatório",
                        userNameMandatory: "Nome do usuário é obrigatório",
                        passwordMandatory: "Informar senha",
                        passwordNotMetch: "Senhas não conferem",
                        loginFail: "Usuário ou senha inválido",
                        loginTitle: "Login"
                    }
};

var textsUI;
document.addEventListener('deviceready', onDeviceReady, false);
var btnLogin = document.getElementById("btnLogin");
var btnCreateStudent = document.getElementById("btnCreateStudent");
var txtUserName = document.getElementById("txtUserName");
var txtName = document.getElementById("txtName");
var txtConfirmPassword = document.getElementById("txtConfirmPassword");
var txtEmail = document.getElementById("txtEmail");
var txtPassword = document.getElementById("txtPassword");
var lblName = document.getElementById("lblName");
var lblUserName = document.getElementById("lblUserName");
var lblConfirmPassword = document.getElementById("lblConfirmPassword");
var lblPassword = document.getElementById("lblPassword");
var btnCreateStudent = document.getElementById("btnCreateStudent");
var btnCancel = document.getElementById("btnCancel");
var btnConfirm = document.getElementById("btnConfirm");
var divUserName = document.getElementById("divUserName");
var divName = document.getElementById("divName");
var divPassword = document.getElementById("divPassword");
var divConfirmPassword = document.getElementById("divConfirmPassword");
var storage;
var ip = "http://192.168.0.103:8080/";
//var db;

function onDeviceReady() {
    storage = window.localStorage;
    findPreferedLanguage();
    //createDatabase();
    btnLogin.addEventListener("click", loginUserClick, false);
    btnCreateStudent.addEventListener("click", createStudentRender, false);
    btnCancel.addEventListener("click", cancelCreation, false);
    btnConfirm.addEventListener("click", confirmCreation, false);
    var userName = findUserName();
    var password = findUserPassword();
    console.log("UserName: " + userName + ", Password: ", password);
    if(userName != null && password != null){
        loginUser(userName, password);
    }
}

/*
 Funções para rendereização de telas
*/

function initialRender(){
    
    // Textos dos labels
    lblUserName.innerHTML = textsUI.userName;
    lblName.innerHTML = textsUI.name;
    lblConfirmPassword.innerHTML = textsUI.confirmPassword;
    lblPassword.innerHTML = textsUI.password;
    
    // Textos dos botões
    btnCreateStudent.innerHTML = textsUI.createUser;
    btnConfirm.innerHTML = textsUI.confirm;
    btnCancel.innerHTML = textsUI.cancel;
    
    // Textos das dicas
    txtUserName.placeholder = "";
    txtName.placeholder = ""
    txtEmail.placeholder = "";
    txtConfirmPassword.placeholder = "";
    
    // Cores dos campos
    txtUserName.style.backgroundColor = "rgba(232,233,242,1)";
    txtName.style.backgroundColor = "rgba(232,233,242,1)";
    txtConfirmPassword.style.backgroundColor = "rgba(232,233,242,1)";
    txtEmail.style.backgroundColor = "rgba(232,233,242,1)";
    
    // Visibilidade das DIV
    divUserName.style.display = "inline-block";
    divName.style.display = "none";
    divEmail.style.display = "none";
    divPassword.style.display = "inline-block";
    divConfirmPassword.style.display = "none";
    
    // Visibilidade dos botões
    btnLogin.style.display = "inline-block";
    btnCreateStudent.style.display = "inline-block";
    btnConfirm.style.display = "none";
    btnCancel.style.display = "none";
    
    // Valores iniciais campos
    txtUserName.value = "";
    txtConfirmPassword.value = "";
    txtEmail.value = "";
    txtPassword.value = "";
}

function createStudentRender(){
    divUserName.style.display = "inline-block";
    divName.style.display = "inline-block";
    divEmail.style.display = "inline-block";
    divPassword.style.display = "inline-block";
    divConfirmPassword.style.display = "inline-block";
    
    // Visibilidade dos botões
    btnLogin.style.display = "none";
    btnCreateStudent.style.display = "none";
    btnConfirm.style.display = "inline-block";
    btnCancel.style.display = "inline-block";
    
}

/* 
 Funções para acesso ao SQLite
*/
/*
function createDatabase(){
    db = window.sqlitePlugin.openDatabase({name: 'musicclasses.db', location: 'default'});
    db.transaction(function(tx) {
                   tx.executeSql('CREATE TABLE IF NOT EXISTS Students (idStudent, name, email, password)');
    }, function(error) {
                   console.log('Transaction ERROR: ' + error.message);
    }, function() {
                   console.log('Table created');
    });
    
}
 */

/*
 Funções para acesso ao LocalStorage
 */
function findUserName(){
    return storage.getItem("UserName");
    /*db.transaction(function (tx){
                   var query = "SELECT idStudent, name FROM Students";
                   tx.executeSql(query, [],
                                 function (tx, resultSet) {
                                    for(var x = 0; x < resultSet.rows.length; x++) {
                                        console.log("UserName: " + resultSet.rows.item(x).name);
                                        return resultSet.rows.item(x).name;
                                    }
                                 },
                                 function (tx, error) {
                                    console.log('SELECT error: ' + error.message);
                                 });
                   },
                   function (error) {
                    console.log('transaction error: ' + error.message);
                   },
                   function () {
                    console.log('transaction ok');
                   });*/
}

function findUserPassword(){
    return storage.getItem("Password");
}

/*
 Eventos da tela
*/
function cancelCreation(){
    initialRender();
}

function confirmCreation(){
    console.log("ConfirmCreation clicked");
    var validationOk = validateFields();
    if(validationOk){
        createStudent();
    }
}

function createStudent(){
    //http://192.168.0.103:8080/createUser?idStudent=joaogd53&name=Nome%20do%20aluno
    var idStudent = txtUserName.value;
    var name = txtName.value;
    var email = txtEmail.value;
    var password = txtPassword.value;
    var address = ip + "createUser";
    console.log("UserName: " + idStudent + ", Password: " + password);
    storage.setItem("UserName", idStudent);
    storage.setItem("Password", password);
    cordovaHTTP.get(address, {
                    idStudent: idStudent,
                    name: name,
                    email: email,
                    password: password
                    }, { Authorization: "OAuth2: null" }, createStudentSucessResponse(response), function (response) {
                        console.log("Erro:" + response.error);
                    });

}

function createStudentSucessResponse(response){
    console.log(response.status);
    console.log(response.data);
    var jsonData = JSON.parse(response.data);
    if (jsonData.status == 0){
        loginUser(txtUserName.value, txtPassword.value);
    } else {
        navigator.notification.alert(jsonData.message, function(){
                                     initialRender()
                                     }, textsUI.loginTitle, "OK");
    }
}

function loginUserClick(){
    var validateOK = validateLoginFields();
    if(validateOK){
        loginUser(txtUserName.value, txtPassword.value);
    }
}

/*
 Funções internas da página
 */
function loginUser(idStudent, password){
    //window.location = "courses.html";
    //http://192.168.0.103:8080/login?idStudent=Android&password=aaa
    var address = ip + "login";
    cordovaHTTP.get(address, {
                    idStudent: idStudent,
                    password: password
                    }, { Authorization: "OAuth2: null" }, function (response) {
                        console.log(response.data);
                    processReturnLogin(response.data);
                    }, function (response) {
                    console.log("Erro:" + response.error);
                    });

}

function processReturnLogin(data){
    var jsonData = JSON.parse(data);
    console.log(jsonData);
    if(jsonData.status == '0'){
        var jsonObject = jsonData.Student;
        console.log(jsonObject);
        storage.setItem("UserName", jsonObject.idStudent);
        storage.setItem("Password", jsonObject.password);
        
        navigator.notification.alert(jsonData.message, function(){
                                        window.location = "courses.html";
                                     }, textsUI.loginTitle, "Done");
    } else {
        navigator.notification.alert(jsonData.message, function(){
                                     initialRender();
                                     }, textsUI.loginTitle, "Done");
    }
}

function findPreferedLanguage(){
    navigator.globalization.getPreferredLanguage(function(language){
                                                    defineTranslation(language);
                                                 },
                                                 function(){
        
                                                 });
}

function defineTranslation(language){
    console.log(language.value);
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

function validateLoginFields(){
    var ret = true;
    if(txtUserName.value == ""){
        txtUserName.style.backgroundColor = "#cf866c";
        txtUserName.placeholder = textsUI.userNameMandatory;
        ret = false;
    }
    if(txtPassword.value == ""){
        txtPassword.style.backgroundColor = "#cf866c";
        txtPassword.placeholder = textsUI.passwordMandatory;
        ret = false;
    }
    return ret;
}

function validateFields(){
    var ret = true;
    if(txtUserName.value == ""){
        txtUserName.style.backgroundColor = "#cf866c";
        txtUserName.placeholder = textsUI.userNameMandatory;
        ret = false;
    }
    if(txtName.value == ""){
        txtName.style.backgroundColor = "#cf866c";
        txtName.placeholder = textsUI.nameMandatory;
        ret = false;
    }
    if(txtEmail.value == ""){
        txtEmail.style.backgroundColor = "#cf866c";
        txtEmail.placeholder = textsUI.emailMandatory;
        ret = false;
    }
    if(txtPassword.value != txtConfirmPassword.value){
        txtConfirmPassword.style.backgroundColor = "#cf866c";
        txtConfirmPassword.placeholder = textsUI.passwordNotMetch;
        ret = false;
    }
    return ret;
}

/*
document.addEventListener('deviceready', onDeviceReady, false);
var btnDo3 = createButton(document.getElementById("btnDo3"), 60);
var btnRe3 = createButton(document.getElementById("btnRe3"), 62);
var btnMi3 = createButton(document.getElementById("btnMi3"), 64);
var btnFa3 = createButton(document.getElementById("btnFa3"), 65);
var btnSol3 = createButton(document.getElementById("btnSol3"), 67);
var btnLa3 = createButton(document.getElementById("btnLa3"), 69);
var btnSi3 = createButton(document.getElementById("btnSi3"), 71);
var btnDo4 = createButton(document.getElementById("btnDo4"), 72);
var txtInstrument = document.getElementById("txtInstrument");
var selChannel = document.getElementById("selChannel");
var txtTempo = document.getElementById("txtTempo");
var selDynamic = document.getElementById("selDynamic");
var currentNote = 0;
var btnPlay = document.getElementById("btnPlay");
function onDeviceReady() {
    btnPlay.addEventListener("click", playPress, false);
}

function playPress() {
    console.log("Play");
    http://192.168.0.103:8080/majorscale?note=60&inst=01&dynamic=120
    var address = "http://192.168.0.103:8080/majorscale";
    cordovaHTTP.get(address, {
                    note: 60,
                    inst: txtInstrument.value,
                    dynamic: selDynamic.value,
                    }, { Authorization: "OAuth2: null" }, function (response) {
                    
                    }, function (response) {
                    
                    });
    
}

function createButton(button, note) {
    var obj = {};
    obj.first = true;
    obj.button = button;
    obj.note = note;
    obj.touchstart = function () {
        var address = "http://192.168.0.103:8080/";
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
        var address = "http://192.168.0.103:8080/";
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
*/
