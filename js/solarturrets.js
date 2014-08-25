Solarturrets = function()
{
  
    this.paused = false;
    this.setupPIXI();
    this.currentscene = new Gamescene(this.stage);


    this.room = null;
    this.sub_id = null;
    this.id = null;
  //  this.name = null;
   // this.pulse;
  //  this.myid;
    this.counter = 0;
    this.players = [];

    


};

Solarturrets.prototype.constructor = Solarturrets;


Solarturrets.prototype.setSession = function(session){

    console.log(session + "session");
    this.currentscene.session = session;

}    
 

//setup the PIXI renderer and Stage
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





Solarturrets.prototype.onevent = function(args){

    console.log("GOOI");
};

Solarturrets.prototype.setupConnection = function(){

    
};

