var objFirebase;

var appRegister = {
  lblMessage,
  mdlMessage,
  
  txtEnterpriseID,
  txtPassword,
  txtPasswordConfirm,
  btnRegister,
  
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
    txtPasswordConfirm = document.getElementById('txtPasswordConfirm');
    btnRegister = document.getElementById('btnRegister');
        
    //Events
    txtEnterpriseID.addEventListener("keydown", function(event) {
      if (event.key === "Enter") txtPassword.focus();
    });
    txtPassword.addEventListener("keydown", function(event) {
      if (event.key === "Enter") txtPasswordConfirm.focus();
    });
    txtPasswordConfirm.addEventListener("keydown", function(event) {
      if (event.key === "Enter") btnRegister.focus();
    });
    btnRegister.addEventListener('click', this.fnRegisterNewUser, false);
  },

  onLoaded: function() {
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
    var strPasswordConfirm = txtPasswordConfirm.value;
    
    if (strEMail.length == 0) {
      appRegister.fnShowMessage("Informe o Enterprise ID!");
      return false;
    }
    if (appRegister.fnCheckEMail(strEMail)) {
      appRegister.fnShowMessage("Enterprise ID não é o e-mail!");
      return false;
    }
    if (strPassword.length < 8) {
      appRegister.fnShowMessage("Senha deve conter 8 ou mais caracteres.");
      return false;
    }
    if (strPassword != strPasswordConfirm) {
      appRegister.fnShowMessage("Confirmação de Senha não confere com a Senha.");
      return false;
    }
    return true;
  },

  fnRegisterNewUser: function() {
    if (!appRegister.fnCheckFormIsValid()) return;

    var strEMail    = txtEnterpriseID.value.toLowerCase() + "@accenture.com";
    var strPassword = txtPassword.value;
    
    firebase.auth().createUserWithEmailAndPassword(strEMail, strPassword)
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        
        if (errorCode == 'auth/weak-password') {
            appRegister.fnShowMessage("Senha informada não atende aos padrões de segurança!");
        } else if (errorCode == 'auth/email-already-in-use') {
            appRegister.fnShowMessage("Enterprise ID já está cadastrado no sistema, utilize a opção Esqueci minha senha!");
        } else {
            appRegister.fnShowMessage("Falha ao registrar o usuário!");
        }
      });
  }
};

window.onload = function() {
  appRegister.initialize();
}
