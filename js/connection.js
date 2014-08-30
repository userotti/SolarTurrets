

if (document.location.origin == "file://") {
        wsuri = "ws://127.0.0.1:8080";
    } else {
        wsuri = (window.location.protocol === "http:" ? "ws:" : "wss:") + "//" + document.location.host + ":8080";
    }

    
this.connection = new autobahn.Connection({
        url: wsuri,
        realm: 'realm1'
    });


myscene = solarturrets.currentscene;


external_session = null;
/*********************/
/** OPEN CONNECTION **/
/*********************/



onevent = function(args){

       console.log(args);
    
        if(args[0].type === 'shoot'){
            
            console.log("shoot");

            myscene.makeBullet(args[0].x, args[0].y, args[0].power, args[0].angle, args[0].turretradius, args[0].bulletid, args[0].myid);

        }

        if(args[0].type === 'join'){
            
            console.log("join");

            myscene.makeTurret(args[0].myid, args[0].name, args[0].x, args[0].y, args[0].pause_status, args[0].kills);


            console.log("join" + myscene.player.paused);
          
            publish_details = [{
                    
                    "myid":myscene.player.myid, 
                    "name":myscene.player.name, 
                    "type":"klaarhier", 
                    "x":myscene.player.position.x,
                    "y":myscene.player.position.y,
                    "pause_status" : myscene.player.paused,
                    "kills" : myscene.player.kills
                }];

             
            myscene.session.publish('com.myapp.'+solarturrets.room, publish_details)

            
        }

        if(args[0].type === 'klaarhier'){
            
                console.log("klaarhier: " + args[0].pause_status);   
                myscene.makeTurret(args[0].myid, args[0].name, args[0].x, args[0].y, args[0].pause_status, args[0].kills);
          
            
        }


        if(args[0].type == "watpompmetbullets"){

            console.log("watpompmetbullets: paused? : " +myscene.player.paused);
            if (myscene.player.paused == false){

                
                for (bul = 0; bul < myscene.bullets.length; bul++){

                    publish_details = [{
                    
                    "myid":myscene.player.myid, 
                    "name":myscene.player.name, 
                    "type":"newbullets", 
                    "bulletid" : myscene.bullets[bul].bulletid,
                    "bshooterid" : myscene.bullets[bul].shooterid,
                    "bx" : myscene.bullets[bul].position.x,
                    "by" : myscene.bullets[bul].position.y,
                    "bvelx" : myscene.bullets[bul].velx, 
                    "bvely" : myscene.bullets[bul].vely,
                    "bage" : myscene.bullets[bul].age



                    }];

                    myscene.session.publish('com.myapp.'+solarturrets.room, publish_details);
                
                } 
                

            }

        }

      /*  if (args[0].type == "watpompmetdiescore"){


            for (tur = 0; tur < myscene.turrets.length; tur++){

                    publish_details = [{
                    
                    "myid":myscene.player.myid, 
                    "name":myscene.player.name, 
                    "type":"score", 
                    "turretid" : myscene.turrets[],
                    "bshooterid" : myscene.bullets[bul].shooterid,
                    "bx" : myscene.bullets[bul].position.x,
                    "by" : myscene.bullets[bul].position.y,
                    "bvelx" : myscene.bullets[bul].velx, 
                    "bvely" : myscene.bullets[bul].vely,
                    "bage" : myscene.bullets[bul].age



                    }];

                    myscene.session.publish('com.myapp.'+solarturrets.room, publish_details);
                
            } 



        }*/

        if(args[0].type == "newbullets"){

            console.log("newbullets");
            console.log(args[0].bulletid);

            if (myscene.hasBullet(args[0].bulletid) != -1){
                
                myscene.updateBullet(args[0].bulletid, args[0].shooterid, args[0].bx, args[0].by, args[0].bvelx, args[0].bvely, args[0].bage);
            
            }else{


                myscene.placeNewBullet(args[0].bulletid, args[0].shooterid, args[0].bx, args[0].by, args[0].bvelx, args[0].bvely, args[0].bage);
            
            }



        }    


        if(args[0].type === 'kill'){
            
            cbulletkillcheck = myscene.hasBullet(args[0].bulletid);

            if (cbulletkillcheck != -1){

                myscene.bullets[cbulletkillcheck].alive = false;
                
            }

            shooter_pos = myscene.hasTurret(args[0].shooterid);
            if (shooter_pos != -1){


                if (myscene.turrets[shooter_pos].kills != args[0].shooterkills){

                    myscene.turrets[shooter_pos].kills =  args[0].shooterkills;                   

                }

            }



            turretkilled_pos = myscene.hasTurret(args[0].turrethitid);
            
            if (turretkilled_pos != -1){
                console.log((args[0].turretdeaths - myscene.turrets[turretkilled_pos].deaths));

                if (myscene.turrets[turretkilled_pos])
                myscene.turrets[turretkilled_pos].deaths++;
                
                if (args[0].turrethitid == myscene.player.myid){
                    

                    mx =  (Math.random() - Math.random())*2000+800;
                    my =  (Math.random() - Math.random())*2000;


                    publish_details = [{
                    
                    "myid":myscene.player.myid, 
                    "name":myscene.player.name, 
                    "type":"move", 
                    "movex":mx,
                    "movey":my,
                    "movingturretid":args[0].turrethitid,
                    "deadbulletid":args[0].bulletid
                
                    }];

                     
                    solarturrets.currentscene.session.publish('com.myapp.'+solarturrets.room, publish_details);

                    console.log("MOVE ME");
                    myscene.moveTurret(turretkilled_pos, mx, my);

                }
            }
        }

        if(args[0].type === 'move'){

            turretmoved_pos = myscene.hasTurret(args[0].movingturretid); 

            if (turretmoved_pos != -1){
                myscene.moveTurret(turretmoved_pos, args[0].movex, args[0].movey);
            }    
            
        }    
        

        if(args[0].type === 'closewindow'){
            
            console.log("closewindow");

            myscene.removeTurret(args[0].myid, args[0].name);
            //myscene.removeBullets();

        }

        if (args[0].type === "pausing"){

            console.log("pausing : " + args[0].myid);
            myscene.pauseTurret(args[0].myid);


        }

        if (args[0].type === "unpausing"){

            console.log("unpausing : " + args[0].myid);
            myscene.unPauseTurret(args[0].myid);


        }
        

}


connection.onopen = function (session) {

    sessionod = session.id;
    external_session = session;
    solarturrets.setSession(session);

    $('#myid').html(session.id);


    // Random Name
    $('input#name').val(chance.name());


    // Random Message
    $('#chat-message').val(chance.sentence({ length: 1}));


    // ****** CLICK JOIN / SUBSCRIBE
    $('button#join').click(function(){
        

    $('#hud').hide();


    
        session.subscribe('com.myapp.'+$('#room').val(), onevent).then(
            function(subscription){
                
                console.log(sessionod);
                console.log(session.id);


                solarturrets.sub = subscription;
                solarturrets.sub_id = subscription.id;
                solarturrets.room = $('#room').val();
                
                //myscene.name = $('#name').val();
                myscene.addMyTurret(session.id, $('#name').val());
                // Push to Adress bar
                //history.pushState(null,null,'#' + room); // URL Update. not 100% implemented.

            }).then(function(){



                publish_details = [{
                    
                    "myid":myscene.player.myid, 
                    "name":myscene.player.name, 
                    "type":"join", 
                    "x":myscene.player.position.x,
                    "y":myscene.player.position.y,
                    "pause_status":myscene.player.paused,
                    "kills":myscene.player.kills
                
                }];

                session.publish('com.myapp.'+solarturrets.room, publish_details)


                


            

            }).then(function(){
                
                publish_details = [{
                        
                        "myid":myscene.player.myid, 
                        "name":myscene.player.name, 
                        "type":"watpompmetbullets", 
                        
                    }];

                myscene.session.publish('com.myapp.'+$('#room').val(), publish_details);

                publish_details = [{
                        
                        "myid":myscene.player.myid, 
                        "name":myscene.player.name, 
                        "type":"watpompmetdiescore", 
                        
                    }];

                myscene.session.publish('com.myapp.'+$('#room').val(), publish_details)
                  
               
            }).then(function(){

                kickoff();      

            });

    });

   
    // JUST BEFORE YOU REFRESH
    window.onbeforeunload = function(event) {

        room = $('#room').val();


        publish_details = [{
                    
                    "myid":myscene.player.myid, 
                    "name":myscene.player.name, 
                    "type":"closewindow", 
                    "x":myscene.player.position.x,
                    "y":myscene.player.position.y
                
                }];

        session.publish('com.myapp.'+room, publish_details);
        connection.close();

    };


    window.onkeydown = function(event){

        /*if (myscene.player.paused == false){
                
                publish_details = [{
                    
                    "myid":myscene.player.myid, 
                    "name":myscene.player.name, 
                    "type":"pausing", 
                    
                }];

                myscene.session.publish('com.myapp.'+$('#room').val(), publish_details);
                myscene.player.paused = true;

            }else{

                publish_details = [{
                    
                    "myid":myscene.player.myid, 
                    "name":myscene.player.name, 
                    "type":"unpausing", 
                    
                }];

                myscene.session.publish('com.myapp.'+$('#room').val(), publish_details);
                myscene.player.paused = false;


        }*/


    }

    /*

        HIER WERK DINK EK!!!!

    */



    $(window).focus(function() {
    
              
                //un pause

                if (myscene.player != null){
                    //myscene.pausedBroadCast();
                    

                    publish_details = [{
                        
                        "myid":myscene.player.myid, 
                        "name":myscene.player.name, 
                        "type":"watpompmetbullets", 
                        
                    }];

                    myscene.session.publish('com.myapp.'+$('#room').val(), publish_details)

                 }      

        

    });

    $(window).blur(function() {
                
                if (myscene.player != null){

                    //myscene.pausedBroadCast();
                }    
           
    });

   


};

onclose = function (reason, details) {
    console.log('closed');
    console.log(details);

    // connection closed, lost or unable to connect
};



