

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
/*********************/
/** OPEN CONNECTION **/
/*********************/



onevent = function(args){

       console.log(args);
    
        if(args[0].type === 'shoot'){
            
            console.log("shoot");

            myscene.makeBullet(args[0].x, args[0].y, args[0].power, args[0].angle, args[0].myid);

        }

        if(args[0].type === 'join'){
            
            console.log("join");

            myscene.makeTurret(args[0].myid, args[0].name, args[0].x, args[0].y);



          
            publish_details = [{
                    
                    "myid":myscene.player.myid, 
                    "name":myscene.player.name, 
                    "type":"klaarhier", 
                    "x":myscene.player.position.x,
                    "y":myscene.player.position.y
                
                }];

            
            //console.log("solarturrets.session")
            //console.log(solarturrets);    
            solarturrets.currentscene.session.publish('com.myapp.'+solarturrets.room, publish_details)

            
        }

        if(args[0].type === 'klaarhier'){
            
                //console.log(myscene.hasTurret(args[0].id));
                console.log(args[0].name + "klaarhier");   

               // if (myscene.hasTurret(args[0].myid) == -1)
                myscene.makeTurret(args[0].myid, args[0].name, args[0].x, args[0].y);
          
            
        }

        if(args[0].type === 'hit'){
            
            console.log("hit");

        }

        if(args[0].type === 'closewindow'){
            
            console.log("closewindow");

            myscene.removeTurret(args[0].myid, args[0].name);
            //myscene.removeBullets();

        }

        

}


connection.onopen = function (session) {

    sessionod = session.id;

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
                    "y":myscene.player.position.y
                
                }];

                session.publish('com.myapp.'+solarturrets.room, publish_details)


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


};

onclose = function (reason, details) {
    console.log('closed');
    console.log(details);

    // connection closed, lost or unable to connect
};






