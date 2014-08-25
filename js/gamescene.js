Gamescene = function(stage)
{
    /* Basic setup */
    
    this.stage = stage;
    this.session;
    this.camera = new PIXI.Camera();
    this.hud = new PIXI.SmaatObjectContainer();
  
    this.world = new PIXI.SmaatObjectContainer();

    this.background_layer = new PIXI.SmaatObjectContainer();
    this.colidables_layer = new PIXI.SmaatObjectContainer();
    this.effects_layer = new PIXI.SmaatObjectContainer();
    


    this.world.addChild(this.background_layer);
    this.world.addChild(this.colidables_layer);
    this.world.addChild(this.effects_layer);

    /* game groups */

    this.planets = [];
    this.bullets = [];
    this.turrets = [];

    /* Camera setup */
    this.lookat = new PIXI.Point(0,0);
    this.worldclick = new PIXI.Point(0,0);
    this.camera.following =  this.lookat;
    this.camera.addChild(this.world);  
     
    

    /* Hud items */

    this.aim = new PIXI.Graphics();
    this.aimangle = 0;
    this.aimdist = 0;
    this.aiming = false;
    this.aiming_mode = 0;

    this.aimangle_hud_item = new PIXI.Text("angle: ", { font: "24px Podkova", fill: "#ffffff", align: "left"});
    this.aimpower_hud_item = new PIXI.Text("power: ", { font: "24px Podkova", fill: "#ffffff", align: "left"});
    
    this.hud.addChild(this.aimangle_hud_item);    
    this.hud.addChild(this.aimpower_hud_item);  

    this.prev_aimangle_hud_item = new PIXI.Text("prev angle: ", { font: "15px Podkova", fill: "#ffffff", align: "left"});
    this.prev_aimpower_hud_item = new PIXI.Text("prev power: ", { font: "15px Podkova", fill: "#ffffff", align: "left"});
    
    this.hud.addChild(this.prev_aimangle_hud_item);    
    this.hud.addChild(this.prev_aimpower_hud_item);  

    this.hud.addChild(this.aim);
   
    /* control vars */

    this.readyforlaunch = false;
    this.button_just_clicked = false;

    this.setupHud();
    
    // add the camera and the hud to the stage
    
    stage.addChild(this.camera);
    stage.addChild(this.hud);
    
    // quick resize;

    this.resizeScene();

    /* Build level */

    this.makePlanet(1000,500,5,100,0xeecb0B);
    this.makePlanet(850,380,1,30,0x34b5a3);
    this.makePlanet(1200,310,1,30,0x22cdbb);
    
    
    this.makePlanet(200,-500,10,130,0xdedb0B);
    this.makePlanet(450,-380,2,55,0x34ba57);
    this.makePlanet(170,-190,1,45,0x55EE83);
  

    //this.makeTurret(-500,-30,1,"smaati", true);


    this.name = null;
    this.myid = null;
    
    this.player=null;

};

// constructor

Gamescene.prototype.constructor = Gamescene;


/* utility funcs ----------------



*/

Gamescene.prototype.checkBoundingboxCollision = function(a,b, dist){

    return  !(
        (a.position.y+dist < b.position.y) ||
        (a.position.y-dist > b.position.y) ||
        (a.position.x-dist > b.position.x) ||
        (a.position.x+dist < b.position.x) )

};

Gamescene.prototype.checkBoundingboxCollisionPIXIPoint = function(a,b, dist){

    return  !(
        (a.y+dist < b.y) ||
        (a.y-dist > b.y) ||
        (a.x-dist > b.x) ||
        (a.x+dist < b.x) )

};


Gamescene.prototype.checkBoundingboxCollisionPIXIObject = function(a,b, dist){

    return  !(
        (a.position.y+dist < b.position.y) ||
        (a.position.y-dist > b.position.y) ||
        (a.position.x-dist > b.position.x) ||
        (a.position.x+dist < b.position.x) )

};
Gamescene.prototype.checkDistCollision = function(a,b,dist){

    
    //console.log(Math.sqrt(Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2)));


    if (Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2) < Math.pow(dist, 2)){

        return true;

    } else{

        return false;
    }

};

Gamescene.prototype.worldToHud = function(point){

    posdist = Math.sqrt(Math.pow((this.lookat.x - point.x),2) + Math.pow((this.lookat.y - point.y),2));
    poshoek = Math.atan2((this.lookat.y - point.y), (this.lookat.x - point.x)) - this.camera.rotation;

    return_point = new PIXI.Point(-((Math.cos(poshoek)*posdist)*this.camera.zoom - this.camera.screen_midx)
                            ,-((Math.sin(poshoek)*posdist)*this.camera.zoom - this.camera.screen_midy));
    
    return return_point;

};

Gamescene.prototype.hudToWorld = function(point){

    
    posdist = Math.sqrt(Math.pow(((this.camera.screen_midx) - point.x),2) + Math.pow(((this.camera.screen_midy) - point.y),2));
    poshoek = Math.atan2(((this.camera.screen_midy) - point.y), ((this.camera.screen_midx) - point.x) ) - this.camera.rotation;
    
    return_point = new PIXI.Point(this.lookat.x-(Math.cos(poshoek)*posdist)/this.camera.zoom,this.lookat.y-(Math.sin(poshoek)*posdist)/this.camera.zoom);

    return return_point;
};


/* Game loop methods -------------------




*/

Gamescene.prototype.sceneUpdate = function()
{
        this.updateEffects();
        this.drawAimingHud(this.stage.getMousePosition());
        this.updateWorld();
        //this.colisionDetection();
        
       /* Update Hud */
        
        if (this.aiming_mode == 3){
            this.fire_button.visible = true;
        }else{
            this.fire_button.visible = false;    
        }        

};

Gamescene.prototype.updateWorld = function(){

    
    for (i = 0; i < this.bullets.length; i++){

        accx = 0;
        accy = 0;

        for (j = 0; j < this.planets.length; j++){

            distsqr = (Math.pow(this.bullets[i].position.x - this.planets[j].position.x,2) +
                             Math.pow(this.bullets[i].position.y - this.planets[j].position.y,2));

            diehoek =  Math.atan2(this.bullets[i].position.y - this.planets[j].position.y, this.bullets[i].position.x - this.planets[j].position.x);

            accx += Math.cos(diehoek+Math.PI) * (((this.planets[j].mass * this.bullets[i].mass)*100)/(distsqr)); 
            accy += Math.sin(diehoek+Math.PI) * (((this.planets[j].mass * this.bullets[i].mass)*100)/(distsqr)); 

            this.bullets[i].velx += accx;
            this.bullets[i].vely += accy;            
        
            if (this.checkDistCollision(this.bullets[i],this.planets[j],this.planets[j].radius)){

                this.bullets[i].alive = false;
                console.log(this.bullets[i].position.x +": BX - " + this.bullets[i].position.y +": BY - " );
                console.log(this.planets[j].position.x +": PX - " + this.planets[j].position.y +": PY - " );


            }
        }

        this.bullets[i].position.x += this.bullets[i].velx; 
        this.bullets[i].position.y += this.bullets[i].vely;

    }

    for (i = 0; i < this.bullets.length; i++){

        if (this.bullets[i].alive == false){

            this.colidables_layer.removeChild(this.bullets[i]);
            this.bullets.splice(i,1);


        }

    }    


}


Gamescene.prototype.colisionDetection = function(){


    for (j = 0; j < this.planets.length; j++){

        for (i = 0; i < this.bullets.length; i++){

        }

     }    

}


Gamescene.prototype.drawAimingHud = function(mousepos){

    if (this.player != null){
        this.player_hud = this.worldToHud(this.player);
    
    }    
    
    
    switch(this.aiming_mode){

    case 0:
        
        this.aim.clear();
        break;

    case 1:

        this.aim.clear();
        this.aim.lineStyle(2, 0xffffff);
        this.aim.moveTo(this.player_hud.x, this.player_hud.y);
        this.aim.lineTo(mousepos.x, mousepos.y);

        this.player_hud.x = this.worldToHud(this.player).x;
        this.player_hud.y = this.worldToHud(this.player).y;

        this.aim.clear();
        this.aim.lineStyle(2, 0xffffff);
        this.aim.moveTo(this.player_hud.x, this.player_hud.y);
        this.aim.lineTo(mousepos.x, mousepos.y);
              

        this.aimangle = Math.PI + Math.atan2(-this.player_hud.y + mousepos.y, -this.player_hud.x + mousepos.x);
        this.aimangle_hud_item.setText("angle: " + Math.round(((this.aimangle/Math.PI)*180) * 1000) / 1000);
        
        break;
        
    case 2:
        
        
        this.aimdist = Math.sqrt(Math.pow(mousepos.y-this.player_hud.y, 2) + Math.pow(mousepos.x-this.player_hud.x, 2));

        this.aim.clear();
        this.aim.lineStyle(2, 0xffffff);
        this.aim.moveTo(this.player_hud.x, this.player_hud.y);
        this.aim.lineTo(this.player_hud.x+Math.cos(this.aimangle-Math.PI)*this.aimdist, this.player_hud.y+Math.sin(this.aimangle-Math.PI)*this.aimdist);

        this.aim.lineStyle(2, 0xffffff);
        this.aim.beginFill(0xFFFFFF, 0.05);
        this.aim.drawCircle(this.player_hud.x,this.player_hud.y,this.aimdist);
        this.aim.endFill();
        
         this.aimpower_hud_item.setText("power: " + Math.round(((this.aimdist/Math.PI)*180)) / 1000);
     
        break;    

    case 3:
        
        this.aim.clear();
        this.aim.lineStyle(2, 0xffffff);
        this.aim.moveTo(this.player_hud.x, this.player_hud.y);
        this.aim.lineTo(this.player_hud.x+Math.cos(this.aimangle-Math.PI)*this.aimdist, this.player_hud.y+Math.sin(this.aimangle-Math.PI)*this.aimdist);

        this.aim.lineStyle(2, 0xffffff);
        this.aim.beginFill(0xFFFFFF, 0.05);
        this.aim.drawCircle(this.player_hud.x,this.player_hud.y,this.aimdist);
        this.aim.endFill();
   
        break;    
    
    }
    
}

Gamescene.prototype.updateEffects = function(){

  

}


/* Input Events ------------------


*/



Gamescene.prototype.camButtonClickHandler = function(){

    if (!(this.aiming_mode == 3)){
        this.aiming_mode = 0; 
    }
    this.button_just_clicked = true;

}

Gamescene.prototype.setAimingModeOnClick = function(mousepos){

    if (!this.button_just_clicked){
      
        this.worldclick = this.hudToWorld(mousepos);
        revertmouseclick = this.worldToHud(this.worldclick);

        this.player_hud = this.worldToHud(this.player);
  
        switch(this.aiming_mode){

        case 0:
            
            if (this.checkBoundingboxCollisionPIXIPoint(this.player, this.worldclick, 50)) {
                this.aiming_mode = 1;    
            }
            break;

        case 1:

            if (this.checkBoundingboxCollisionPIXIPoint(this.player, this.worldclick, 50)) {
                this.aiming_mode = 0;    
            }else{
                this.aimangle = Math.PI + Math.atan2(-this.player_hud.y + this.stage.getMousePosition().y, -this.player_hud.x +this.stage.getMousePosition().x);
                this.aimangle_hud_item.setText("angle: " + Math.round(((this.aimangle/Math.PI)*180) * 1000) / 1000);
                this.aiming_mode = 2;    
            }
            break;
            
        case 2:
            
            if (this.checkBoundingboxCollisionPIXIPoint(this.player, this.worldclick, 50)) {
                this.aiming_mode = 0;    
            }else{
                this.aiming_mode = 3;
            }
            break;    

        case 3:
            
            if (this.checkBoundingboxCollisionPIXIPoint(this.player, this.worldclick, 50)) {
                this.aiming_mode = 1;    
            }else{

                this.aiming_mode = 0;    
            
            }
            break;    
        }
    } 
    this.button_just_clicked = false;   
}

Gamescene.prototype.mouseClick = function(mousepos)
{
    console.log(" x: " +mousepos.x + "| y:"+mousepos.y);
    
    console.log("w x: " +this.hudToWorld(mousepos).x + "| w y:"+this.hudToWorld(mousepos).y);



    this.setAimingModeOnClick(mousepos);
    
};   


Gamescene.prototype.resizeHud = function(){

    this.top_pan_button.position.x = window.innerWidth/2;
    this.top_pan_button.position.y = 25;

    this.bottom_pan_button.position.x = window.innerWidth/2;
    this.bottom_pan_button.position.y = window.innerHeight-(25);

    this.left_pan_button.position.x = 25;
    this.left_pan_button.position.y = window.innerHeight/2;

    this.right_pan_button.position.x = window.innerWidth-25;
    this.right_pan_button.position.y = window.innerHeight/2;

    this.aimangle_hud_item.position.x = 30;
    this.aimangle_hud_item.position.y = window.innerHeight - 50;

    this.aimpower_hud_item.position.x = 215;
    this.aimpower_hud_item.position.y = window.innerHeight - 50;

    this.fire_button.position.x = 100;
    this.fire_button.position.y = window.innerHeight-150;

    this.prev_aimangle_hud_item.position.x = window.innerWidth-320;
    this.prev_aimangle_hud_item.position.y = 20;

    this.prev_aimpower_hud_item.position.x = window.innerWidth-160;
    this.prev_aimpower_hud_item.position.y = 20

}

Gamescene.prototype.resizeScene = function(){


    if (this.hud != null){
        this.resizeHud();    
    }
    
    this.camera.screenCenterView(window.innerWidth/2,window.innerHeight/2);




} 

/* Hud setup ----------------


*/


Gamescene.prototype.setupHud = function(){

        cam = this.camera;
        lootat = this.lookat;
        //zoom in button

        var button = new PIXI.Sprite.fromImage("images/zoomin.png");
        button.buttonMode = true;

        button.anchor.x = 0.5;
        button.anchor.y = 0.5;

        button.position.x = 30;
        button.position.y = 30;

        button.interactive = true;

        that = this;

        button.mousedown = function(data) {
            
            that.camButtonClickHandler();  
            cam.zoom = cam.zoom*1.5;

        };

 
        this.hud.addChild(button);

        var button = new PIXI.Sprite.fromImage("images/zoomout.png");
        button.buttonMode = true;

        button.anchor.x = 0.5;
        button.anchor.y = 0.5;

        button.position.x = 30;
        button.position.y = 70;

        button.interactive = true;



        button.mousedown = function(data) {

            that.camButtonClickHandler();  
            cam.zoom = cam.zoom/1.5;
        };

        this.hud.addChild(button);




        this.top_pan_button = new PIXI.Sprite.fromImage("images/horizontalpan.png");
        this.top_pan_button.buttonMode = true;
        this.top_pan_button.anchor.x = 0.5;
        this.top_pan_button.anchor.y = 0.5;
        this.top_pan_button.position.x = window.innerWidth/2;
        this.top_pan_button.position.y = 25;
        this.top_pan_button.interactive = true;
        this.top_pan_button.mousedown = function(data) {
            
            that.camButtonClickHandler();  
            lootat.y = lootat.y - (100/cam.zoom);
            
        };
        this.hud.addChild(this.top_pan_button);


        this.bottom_pan_button = new PIXI.Sprite.fromImage("images/horizontalpan.png");
        this.bottom_pan_button.buttonMode = true;
        this.bottom_pan_button.anchor.x = 0.5;
        this.bottom_pan_button.anchor.y = 0.5;
        this.bottom_pan_button.position.x = window.innerWidth/2;
        this.bottom_pan_button.position.y = window.innerHeight-(25);
        this.bottom_pan_button.interactive = true;
        this.bottom_pan_button.mousedown = function(data) {
            
            that.camButtonClickHandler();
            lootat.y = lootat.y + (100/cam.zoom);
            
        };
        this.hud.addChild(this.bottom_pan_button);


        this.left_pan_button = new PIXI.Sprite.fromImage("images/verticalpan.png");
        this.left_pan_button.buttonMode = true;
        this.left_pan_button.anchor.x = 0.5;
        this.left_pan_button.anchor.y = 0.5;
        this.left_pan_button.position.x = 25;
        this.left_pan_button.position.y = window.innerHeight/2;
        this.left_pan_button.interactive = true;
        this.left_pan_button.mousedown = function(data) {

            that.camButtonClickHandler();            
            lootat.x = lootat.x - (100/cam.zoom);
            
        };
        this.hud.addChild(this.left_pan_button);


        this.right_pan_button = new PIXI.Sprite.fromImage("images/verticalpan.png");
        this.right_pan_button.buttonMode = true;
        this.right_pan_button.anchor.x = 0.5;
        this.right_pan_button.anchor.y = 0.5;
        this.right_pan_button.position.x = window.innerWidth-25;
        this.right_pan_button.position.y = window.innerHeight/2;
        this.right_pan_button.interactive = true;
        this.right_pan_button.mousedown = function(data) {

            that.camButtonClickHandler();            
            lootat.x = lootat.x + (100/cam.zoom);

        };
        this.hud.addChild(this.right_pan_button);


        this.fire_button = new PIXI.Sprite.fromImage("images/firebutton.png");
        this.fire_button.buttonMode = true;
        this.fire_button.anchor.x = 0.5;
        this.fire_button.y = 0.5;
        this.fire_button.position.x = 100;
        this.fire_button.position.y = window.innerHeight-150;
        this.fire_button.interactive = true;
        this.fire_button.mousedown = function(data) {

           /* console.log($('#room').val());
            console.log(that.session);*/

            publish_details = [{
                    
                    "myid":that.player.myid, 
                    "name":that.player.name, 
                    "type":"shoot", 
                    "x":that.player.position.x,
                    "y":that.player.position.y,
                    "power":that.aimdist/50,
                    "angle":that.aimangle
                        
                
                }];


            that.session.publish('com.myapp.'+$('#room').val(), publish_details);
            that.makeBullet(that.player.position.x,that.player.position.y,that.aimdist/80, that.aimangle, that.player.myid);



            that.prev_aimpower_hud_item.setText("prev power: " + Math.round(((that.aimdist/Math.PI)*180)) / 1000);
            that.prev_aimangle_hud_item.setText("prev angle: " + Math.round(((that.aimangle/Math.PI)*180) * 1000) / 1000);


            that.button_just_clicked = true;
            that.aiming_mode = 0; 

        };
        this.hud.addChild(this.fire_button);

        


}


/* Creatation methods ------------------------





*/

Gamescene.prototype.makeBullet = function(posx,posy,power,angle,shooterid){

    bullet = new PIXI.SmaatGraphics();
    bullet.alive = true;

    bullet.shooterid = shooterid;

    bullet.radius = 8;
    bullet.mass = 1;

    bullet.position.x = posx;
    bullet.position.y = posy;

    bullet.velx = (Math.cos(angle+Math.PI)*power);
    bullet.vely = (Math.sin(angle+Math.PI)*power);

    bullet.beginFill(0xFFFFFF, 1);
    bullet.drawCircle(0, 0, bullet.radius);

    this.colidables_layer.addChild(bullet);
    this.bullets.push(bullet);

    console.log("shooterid" + shooterid);


}


Gamescene.prototype.makePlanet = function(x,y,mass,radius,color){

    planet = new PIXI.SmaatGraphics();

    planet.position.x = x;
    planet.position.y = y;
    planet.mass = mass;
    planet.radius = radius;

    planet.lineStyle(0);
    planet.beginFill(color, 1);
    planet.drawCircle(0, 0, radius);

    this.planets.push(planet);

    //console.log("x : " + x + "y : " + y);
    this.colidables_layer.addChild(planet);

}


Gamescene.prototype.hasTurret = function(id){

   
    for (i = 0; i < this.turrets.length; i++){
            
        if (this.turrets[i].myid == id){

            return i;

        } 

    }

    return -1;

}


Gamescene.prototype.makeTurret = function(myid,name, x,y){


    if (myscene.hasTurret(myid) == -1){
        turret = new PIXI.SmaatGraphics();

        turret.position.x = x;
        turret.position.y = y;
        
        turret.myid = myid;
        turret.name = name;
        
        turret.lineStyle(0);
        turret.beginFill(0xffcc00, 1);
        turret.drawRect(-25, -25, 50, 50);
       
        
        this.turrets.push(turret);


        
        this.colidables_layer.addChild(turret);
    }    
    console.log(this.turrets.length + "length");
}

Gamescene.prototype.removeTurret = function(myid,name, x,y){


    if (myscene.hasTurret(myid) != -1){
        
        this.colidables_layer.removeChild(this.turrets[this.hasTurret(myid)]);
        this.turrets.splice(this.hasTurret(myid),1);
    }    
    console.log(this.turrets.length + "length");
}


Gamescene.prototype.addMyTurret = function(myid, name){

    

        turret = new PIXI.SmaatGraphics();

        turret.position.x = (Math.random() - Math.random())*2000+800;
        turret.position.y = (Math.random() - Math.random())*2000;
        
        
        turret.myid = myid;
        turret.name = name;
        
            
        turret.lineStyle(0);
        turret.beginFill(0x5566ee, 1);
        turret.drawRect(-25, -25, 50, 50);
       

        this.player = turret;
        
        this.turrets.push(turret);
        this.colidables_layer.addChild(turret);


}



