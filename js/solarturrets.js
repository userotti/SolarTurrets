Solarturrets = function()
{
  
    this.paused = false;
    this.setupPIXI();
    this.currentscene = new Gamescene(this.stage);


    if (document.location.origin == "file://") {
        wsuri = "ws://127.0.0.1:8080";
    } else {
        wsuri = (window.location.protocol === "http:" ? "ws:" : "wss:") + "//" + document.location.host + ":8080";
    }

    this.connection = new autobahn.Connection({
        url: wsuri,
        realm: 'realm1'
    });


    


};

Solarturrets.prototype.constructor = Solarturrets;

//setup the PIXI renderer and Stage
Solarturrets.prototype.setSession = function(session){

    console.log(session + "session");
    this.currentscene.session = session;

}    
 


Solarturrets.prototype.setupPIXI = function()
{
    
    this.stage = new PIXI.Stage(0x0a1c43, true);
    this.stage.setInteractive(true);

    

    this.renderer = PIXI.autoDetectRenderer(window.innerWidth/*window.devicePixelRatio*/,window.innerHeight/*window.devicePixelRatio*/);//, document.getElementById("main-canvas"), true, true);
    this.renderer.view.id = "main-canvas";
    this.renderer.view.style.display = "block";

    this.renderer.view.screencanvas = true;

    
    
};

//mouse input function

Solarturrets.prototype.handleClickTap = function(data){

    //console.log(data);
    this.currentscene.mouseClick(data);     

   
};

//main game loop

Solarturrets.prototype.gameupdate = function() {

        if (this.paused == false){
            this.currentscene.sceneUpdate();
        }
        this.renderer.render(this.stage);
 
};

//game resize function

Solarturrets.prototype.resize = function(){

        this.currentscene.resizeScene();

        this.renderer.resize(window.innerWidth,window.innerHeight);

};


Solarturrets.prototype.onevent = function(){

    console.log("GOOI");
}

Solarturrets.prototype.setupConnection = function(){

    
}

