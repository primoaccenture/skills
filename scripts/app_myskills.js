var objFirebase;
var objDatabase;

var appMySkills = {
  lblMessage,
  mdlMessage,
  btnLogoff,
  
  arrLevels: [],
  arrSkills: [],
  arrMySkills: [],

  lstMySkills,
  mdlUserSkill,
  lnkSalvarSkills,
  
  objModalUserSkill: null,
  lblSkillID,
  lblSkillName,
  lblSkillImage,
  txtSkillMyLevel,
  pgbSkillMyLevel,
  lblSkillLevelName,
  lblSkillLevelDescription,
  txtSkillNumberProjects,
  
  initialize: function() {
    objFirebase = firebase.initializeApp(CONFIG_FIREBASE);
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  },

  onAuthStateChanged: function(user) {
    if (!user) {
      window.location.assign("login.html");
    } else {
      appMySkills.bind();
      appMySkills.onLoaded();
    }
  },

  bind: function() {
    //Controlls    
    lblMessage = document.getElementById('lblMessage');
    mdlMessage = document.getElementById('mdlMessage');
    btnLogoff  = document.getElementById('btnLogoff');
        
    //Controlls Skill 
    frmMySkills = document.getElementById('frmMySkills');
    lstMySkills = document.getElementById('lstMySkills');
    mdlUserSkill = document.getElementById('mdlUserSkill');
    lnkSalvarSkills = document.getElementById('lnkSalvarSkills');
  
    //Controlls Skill Modal
    lblSkillID    = document.getElementById('lblSkillID');
    lblSkillName  = document.getElementById('lblSkillName');
    lblSkillImage = document.getElementById('lblSkillImage');
    txtSkillMyLevel = document.getElementById('txtSkillMyLevel');
    pgbSkillMyLevel = document.getElementById('pgbSkillMyLevel');
    lblSkillLevelName = document.getElementById('lblSkillLevelName');
    lblSkillLevelDescription = document.getElementById('lblSkillLevelDescription');
    txtSkillNumberProjects = document.getElementById('txtSkillNumberProjects');
    
    //Events
    btnLogoff.addEventListener('click', this.fnLogoff, false);
    txtSkillNumberProjects.addEventListener("keydown", function(event) {
      if (event.key === "Enter") lnkSalvarSkills.focus();
    });
    lnkSalvarSkills.addEventListener('click', this.fnSalvarSkills, false);
  },
  
  fnShowMessage: function(vMessage) {
    var objModal = M.Modal.init(mdlMessage, null);
    lblMessage.innerHTML = vMessage;
    objModal.open();
  },

  fnLogoff: function() {
    firebase.auth().signOut();
  },

  onLoaded: function() {
    lblMessage.innerHTML = "";
    this.fnLoadLevels();
    this.fnLoadSkills();
  },

  fnLoadLevels: function() {
    var arrDataCache = localStorage['levels'] || '';
    
    if (arrDataCache == '') {
      objDatabase = firebase.database();
      objDatabase.ref("/levels").once('value').then(
        function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            var objLevel = {  
                id: childKey,
                name: childData.name,
                description: childData.description,
                percent: childData.percent,
            };
  
            appMySkills.arrLevels.push(objLevel);
          });
          
          localStorage['levels'] = JSON.stringify(appMySkills.arrLevels);
        }
      );
    } else {
      appMySkills.arrLevels = JSON.parse(arrDataCache);
    }
  },

  fnLoadSkills: function() {
    var arrDataCache = localStorage['skills'] || '';
    
    if (arrDataCache == '') {
      objDatabase = firebase.database();
      objDatabase.ref("/skills").once('value').then(
        function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            var objSkill = {  
                id: childKey,
                name: childData.name,
                description: childData.description,
                categoryid: childData.categoryid,
                color: childData.color,
                image: childData.image,
            };
  
            appMySkills.arrSkills.push(objSkill);
          });
          
          localStorage['skills'] = JSON.stringify(appMySkills.arrSkills);
          appMySkills.fnLoadMySkills();
        }
      );
    } else {
      appMySkills.arrSkills = JSON.parse(arrDataCache);
      appMySkills.fnLoadMySkills();
    }
  },

  fnLoadMySkills: function() {
    var strURL = window.location.href;
    var objURL = new URL(strURL);
    var strCategoryID = objURL.searchParams.get("categoryid");
    var strUserID = firebase.auth().currentUser.uid;
    var blnWithoutReturn = true;
    objDatabase = firebase.database();
    
    for (var i = 0; i < appMySkills.arrSkills.length; i++) {
      if (appMySkills.arrSkills[i].categoryid == strCategoryID) {
        blnWithoutReturn = false;
        objDatabase.ref("/userskills/"+ strUserID + '/skills/' + appMySkills.arrSkills[i].id)
          .once('value')
          .then(function(vUserSkill) {
            vID = vUserSkill.key;
            
            var objUserSkill = vUserSkill.val(); 
            var objSkill = {  
              id: appMySkills.arrSkills[vID].id,
              name: appMySkills.arrSkills[vID].name,
              image: appMySkills.arrSkills[vID].image,
              color: appMySkills.arrSkills[vID].color,
              myLevel: 0,
              numberProjects: 0,
              updateDate: ''
            };
            
            if (objUserSkill != null) {
              objSkill.myLevel = objUserSkill.myLevel;
              objSkill.numberProjects = objUserSkill.numberProjects;
            } 
            
            appMySkills.arrMySkills.push(objSkill);
            appMySkills.onRenderListMySkills();
          });
      }
    }

    if (blnWithoutReturn) 
      document.getElementById('lstMySkills').innerHTML = "Não há Skills para a categoria selecionada.";
  },

  onRenderListMySkills: function() {
    var strListSkills = '';
    appMySkills.arrMySkills.forEach(function(vSkill) {
      strListSkills += '<div class="col s6 m3" onclick="appMySkills.fnShowUserSkill('+ vSkill.id +');">';
        strListSkills += '<div class="card" style="background-color:' + vSkill.color + '">';
          strListSkills += '<div class="card-image">';
            strListSkills += '<img src="../images/'+ vSkill.image +'" alt="" style="width: 50%; height: 50%; padding-top: 15%; display: inline;">';
            //strListSkills += '<span class="card-title black-text">'+ data.val().name +'</span>';
          strListSkills += '</div>';
          strListSkills += '<div class="card-content">';
            strListSkills += '<p>Nível:<br> '+ appMySkills.arrLevels[vSkill.myLevel].name +'</p>';
            strListSkills += '<p>Projetos: '+ vSkill.numberProjects +'</p>';
          strListSkills += '</div>';
        strListSkills += '</div>';
      strListSkills += '</div>';
    });
    document.getElementById('lstMySkills').innerHTML = strListSkills;
  },

  intSelectSkillID: 0,
  checkSkillID: function(vSkill) {
      return (vSkill.id == appMySkills.intSelectSkillID);
  },

  fnSetMySkill: function(vSkillLevel) {
    txtSkillMyLevel.value       = vSkillLevel;
    lblSkillLevelName.innerHTML = appMySkills.arrLevels[vSkillLevel].name;
    pgbSkillMyLevel.style.width = appMySkills.arrLevels[vSkillLevel].percent;
    lblSkillLevelDescription.innerHTML = appMySkills.arrLevels[vSkillLevel].description;
  },

  fnShowUserSkill: function(vSkillID) {
    appMySkills.intSelectSkillID = vSkillID;
    var objSkill = appMySkills.arrMySkills.find(appMySkills.checkSkillID);
    
    lblSkillID.innerHTML    = objSkill.id;
    lblSkillName.innerHTML  = objSkill.name;
    lblSkillImage.innerHTML = objSkill.image;
    appMySkills.fnSetMySkill(objSkill.myLevel);
    txtSkillNumberProjects.value = objSkill.numberProjects;

    appMySkills.objModalUserSkill = M.Modal.init(mdlUserSkill, null);
    appMySkills.objModalUserSkill.open();
  },

  fnSalvarSkills: function() {
    var objSkill = appMySkills.arrMySkills.find(appMySkills.checkSkillID);
    if (Number(txtSkillNumberProjects.value) < 0 || Number(txtSkillNumberProjects.value) > 10000) {
      alert ("Informe a quantidade de projetos entre 0 e 9999.");
      return ;
    }

    var objSkillDate = new Date();
    objSkill.myLevel        = txtSkillMyLevel.value;
    objSkill.numberProjects = txtSkillNumberProjects.value;
    objSkill.updateDate     = objSkillDate.getFullYear() + '/' + (objSkillDate.getMonth() + 1) + "/" + objSkillDate.getDate();

    objDatabase = firebase.database();
    var objRefUser = objDatabase.ref('/userskills/' + firebase.auth().currentUser.uid);
    objRefUser.once('value').then(function(vUserSkill) {
      if (vUserSkill.val() == null) {
        objRefUser.set({
          uid: firebase.auth().currentUser.uid,
          user: firebase.auth().currentUser.email
        });
      }
      
      var objRefUserSkill = objDatabase.ref('/userskills/' + firebase.auth().currentUser.uid + '/skills/'+ objSkill.id);
      objRefUserSkill.set({
        id: objSkill.id,
        name: objSkill.name,
        myLevel: objSkill.myLevel,
        numberProjects: objSkill.numberProjects,
        updateDate: objSkill.updateDate
      });
      
      //TODO: atualizar somente o card alterado
      appMySkills.onRenderListMySkills();
    });

    appMySkills.objModalUserSkill.close();
  }
};

window.onload = function() {
  appMySkills.initialize();
}
