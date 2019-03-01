var objFirebase;

var appForgotPassword = {
  lblMessage,
  mdlMessage,
  
  txtEnterpriseID,
  btnRedeem,
  
  initialize: function() {
    objFirebase = firebase.initializeApp(CONFIG_FIREBASE);
    this.bind();
    this.onLoaded();
  },

  bind: function() {
    //Controlls    
    lblMessage = document.getElementById('lblMessage');
    mdlMessage = document.getElementById('mdlMessage');
    
    txtEnterpriseID = document.getElementById('txtEnterpriseID');
    btnRedeem = document.getElementById('btnRedeem');
        
    //Events
    txtEnterpriseID.addEventListener("keydown", function(event) {
      if (event.key === "Enter") txtPassword.focus();
    });
    btnRedeem.addEventListener('click', this.fnForgotPassword, false);
  },

  onLoaded: function() {
    lblMessage.innerHTML = "";
  },

  fnShowMessage: function(vMessage) {
    var objModal = M.Modal.init(mdlMessage, null);
    lblMessage.innerHTML = vMessage;
    objModal.open();
  },

  fnForgotPassword: function() {
    var strEMail = txtEnterpriseID.value.toLowerCase() + "@accenture.com";
    
    firebase.auth().sendPasswordResetEmail(strEMail).then(function() {
      appForgotPassword.fnShowMessage("Um link para resetar a senha foi enviado em seu e-mail!");
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      appForgotPassword.fnShowMessage("Enterprise ID não está cadastrado no Skills!");
    });
  }
};

window.onload = function() {
  appForgotPassword.initialize();
}
