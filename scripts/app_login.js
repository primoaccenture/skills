var objFirebase;

var appLogin = {
  lblMessage,
  mdlMessage,
  
  txtEnterpriseID,
  txtPassword,
  btnLogin,
  
  initialize: function() {
    objFirebase = firebase.initializeApp(CONFIG_FIREBASE);
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
    this.bind();
    this.onLoaded();
  },

  onAuthStateChanged: function(user) {
    if (user) {
      window.location.assign("categories.html");
    } 
  },

  bind: function() {
    //Controlls    
    lblMessage = document.getElementById('lblMessage');
    mdlMessage = document.getElementById('mdlMessage');
    
    txtEnterpriseID = document.getElementById('txtEnterpriseID');
    txtPassword = document.getElementById('txtPassword');
    btnLogin    = document.getElementById('btnLogin');
    
    //Events
    txtEnterpriseID.addEventListener("keydown", function(event) {
      if (event.key === "Enter") txtPassword.focus();
    });
    txtPassword.addEventListener("keydown", function(event) {
      if (event.key === "Enter") btnLogin.focus();
    });
    btnLogin.addEventListener('click', this.fnLogin, false);
  },

  onLoaded: function() {
    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker.register('../service-worker.js').then(function() { 
        
    //   });
    // }
    lblMessage.innerHTML = "";
  },

  fnShowMessage: function(vMessage) {
    var objModal = M.Modal.init(mdlMessage, null);
    lblMessage.innerHTML = vMessage;
    objModal.open();
  },

  fnCheckEMail: function (vEMail) {
    var objRegExp = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
    
    if (objRegExp.test(vEMail)) {
      return true; 
    } else {
      return false;		
    }
  },

  fnCheckFormIsValid: function() {
    var strEMail    = txtEnterpriseID.value.toLowerCase();
    var strPassword = txtPassword.value;
    
    if (strEMail.length == 0) {
      appLogin.fnShowMessage("Informe o Enterprise ID!");
      return false;
    }
    if (appLogin.fnCheckEMail(strEMail)) {
      appLogin.fnShowMessage("Enterprise ID não é o e-mail!");
      return false;
    }
    if (strPassword.length < 8) {
      appLogin.fnShowMessage("Senha deve conter 8 ou mais caracteres.");
      return false;
    }
    return true;
  },

  fnLogin: function() {
    if (!appLogin.fnCheckFormIsValid()) return;
    
    var strEMail    = txtEnterpriseID.value.toLowerCase() + "@accenture.com";
    var strPassword = txtPassword.value;
    
    firebase.auth().signInWithEmailAndPassword(strEMail, strPassword)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        appLogin.fnShowMessage("Usuário ou senha inválido!");
      });
  }
};

window.onload = function() {
  appLogin.initialize();
}
