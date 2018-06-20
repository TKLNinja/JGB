//=============================================================================

// Ghetto speedhack cause rpgmaker mv is a retarded engine

// Also a ghetto clipboard hook 

// Made by Kura

//=============================================================================



(function(){



var showTill = 0;

var originalTitle = undefined;

var _waiting = false;

var DebugTitle = function(msg){

    if (originalTitle == undefined) originalTitle = document.title;



    showTill = Date.now() + 2000;

    document.title = msg.toString();



    if (_waiting) return;



    _waiting = true;

    RestoreTitle();

};



var RestoreTitle = function() {

    if (Date.now() < showTill) {

        setTimeout(RestoreTitle, 1000);

        return;

    }

    document.title = originalTitle;

    _waiting = false;

};



///////////////

// Speedhack //

///////////////



var fpsmult = 1;



window.addEventListener("keydown", function(event) {

	

    if (!event.altKey){ return;}

    if (event.keyCode < 49 || event.keyCode > 57) return;



    var key = event.keyCode - 48;



   // if (event.altKey){



    fpsmult = key;



    DebugTitle("Speed x" + key);



    if (key == 1){

        SceneManager.requestUpdate = rAF;

        SceneManager.update = __originalUpdate;

        SceneManager.updateMain = __originalUpdateMain;

    }

    else {

        SceneManager.requestUpdate = sTO;

        SceneManager.update = OverrideUpdate;

        SceneManager.updateMain = OverrideUpdateMain;

    }

});



var __originalUpdate = SceneManager.update;

var __originalUpdateMain = SceneManager.updateMain;



var rAF = function() {

    if (!this._stopped) {

        requestAnimationFrame(this.update.bind(this));

    }

}



var sTO = function() {

    if (!this._stopped) {

        setTimeout(this.update.bind(this), 1000 / (60 * fpsmult));

    }

}



var OverrideUpdateMain = function() {

    this.changeScene();

    this.updateScene();

    this.renderScene();

    this.requestUpdate();

};



var OverrideUpdate = function() {

    try {

        this.tickStart();

        this.updateInputData();

        this.updateMain();

        this.tickEnd();

    } catch (e) {

        this.catchException(e);

    }

};



})();


