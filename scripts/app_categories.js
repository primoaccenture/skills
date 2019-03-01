var objFirebase;
var objDatabase;

var appCategories = {
  btnLogoff,
  arrCategories: [],
  lstCategories,
  
  initialize: function() {
    objFirebase = firebase.initializeApp(CONFIG_FIREBASE);
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  },

  onAuthStateChanged: function(user) {
    if (!user) {
      window.location.assign("login.html");
    } else {
      appCategories.bind();
      appCategories.onLoaded();
    }
  },

  bind: function() {
    //Controlls
    btnLogoff  = document.getElementById('btnLogoff');
    lstCategories = document.getElementById('lstCategories');
    //Events
    btnLogoff.addEventListener('click', this.fnLogoff, false);
  },
  
  onLoaded: function() {
    this.fnLoadCategories();
  },

  fnLogoff: function() {
    firebase.auth().signOut();
    window.location.assign("login.html");
  },

  fnLoadCategories: function() {
    var arrDataCache = localStorage['categories'] || '';
    
    if (arrDataCache == '') {
      objDatabase = firebase.database();
      objDatabase.ref("/categories").once('value').then(
        function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            var objCategory = {  
                id: childKey,
                name: childData.name,
                description: childData.description
            };
  
            appCategories.arrCategories.push(objCategory);
          });
          
          localStorage['categories'] = JSON.stringify(appCategories.arrCategories);
          appCategories.onRenderCategories();
        }
      );
    } else {
      appCategories.arrCategories = JSON.parse(arrDataCache);
      appCategories.onRenderCategories();
    }
  },

  onRenderCategories: function() {
    var strHTML = '<ul class="list">';
    for (var i = 0; i < this.arrCategories.length; i++) {
      strHTML += '<li class="waves-effect">';
        strHTML += '<a href="myskills.html?categoryid='+ this.arrCategories[i].id +'">';
          strHTML += '<div class="list-text">'+ this.arrCategories[i].name +'<br>';
          strHTML += '<span>'+ this.arrCategories[i].description +'</span></div>';
        strHTML += '</a>';
      strHTML += '</li>';
    }
    strHTML += '</ul>';
    
    document.getElementById('lstCategories').innerHTML = strHTML;
  }
};

window.onload = function() {
  appCategories.initialize();
}
