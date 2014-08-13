/* Random Seed */
/* https://github.com/davidbau/seedrandom Copyright 2013 David Bau. */
(function(a,b,c,d,e,f){function k(a){var b,c=a.length,e=this,f=0,g=e.i=e.j=0,h=e.S=[];for(c||(a=[c++]);d>f;)h[f]=f++;for(f=0;d>f;f++)h[f]=h[g=j&g+a[f%c]+(b=h[f])],h[g]=b;(e.g=function(a){for(var b,c=0,f=e.i,g=e.j,h=e.S;a--;)b=h[f=j&f+1],c=c*d+h[j&(h[f]=h[g=j&g+b])+(h[g]=b)];return e.i=f,e.j=g,c})(d)}function l(a,b){var e,c=[],d=(typeof a)[0];if(b&&"o"==d)for(e in a)try{c.push(l(a[e],b-1))}catch(f){}return c.length?c:"s"==d?a:a+"\0"}function m(a,b){for(var d,c=a+"",e=0;c.length>e;)b[j&e]=j&(d^=19*b[j&e])+c.charCodeAt(e++);return o(b)}function n(c){try{return a.crypto.getRandomValues(c=new Uint8Array(d)),o(c)}catch(e){return[+new Date,a,a.navigator.plugins,a.screen,o(b)]}}function o(a){return String.fromCharCode.apply(0,a)}var g=c.pow(d,e),h=c.pow(2,f),i=2*h,j=d-1;c.seedrandom=function(a,f){var j=[],p=m(l(f?[a,o(b)]:0 in arguments?a:n(),3),j),q=new k(j);return m(o(q.S),b),c.random=function(){for(var a=q.g(e),b=g,c=0;h>a;)a=(a+c)*d,b*=d,c=q.g(1);for(;a>=i;)a/=2,b/=2,c>>>=1;return(a+c)/b},p},m(c.random(),b)})(this,[],Math,256,6,52);



var room = null;
var sub = null;
var id = null;
var name = null;
var pulse;
var myid;
var mycolor = chance.color({ format: 'rgb' });
var counter = 0;
var players = [];

/*
if (document.location.origin == "file://") {
    wsuri = "ws://127.0.0.1:8080";
} else {
    wsuri = (window.location.protocol === "http:" ? "ws:" : "wss:") + "//" + document.location.host + ":8080";
}

var connection = new autobahn.Connection({
    url: wsuri,
    realm: 'realm1'
});
*/
/*********************/
/** OPEN CONNECTION **/
/*********************/
solarturrets.onevent = function(args){

        console.log("shoot");
        console.log(this);

        var name = args[1];
        var type = args[2];
        var data = args[3];
        var data2 = args[4];

        counter++;

        // Do some basic log output into the dom.
        $('#log').prepend(counter + " : " + name + " : " + room + "<br/><br/>");

        //Chat Output
        if(type === 'chat'){
            $('#chat-log').prepend(name + ": " + data+"<br/>");
            console.log("BOEM");

        }
        if(type === 'join'){
            //if(args[0] !== myid){
                

                if($('.room-wrap ul').find('.user-'+args[0]).length > 0){
                    $('.room-wrap ul').find('.user-'+args[0]).text(args[1]); // Name Update
                } else {
                    $('<li style="color: ' + data2 + '; display: none" class="user-'+args[0]+'">'+args[1]+'</li>').hide().appendTo('.room-wrap ul').fadeIn();

                }
            //}
        }
        if(type === 'ping'){
           // if(args[0] !== myid){
                if($('.room-wrap ul').find('.user-'+args[0]).length > 0){
                    $('.room-wrap ul').find('.user-'+args[0]).text(args[1]); // Name Update
                } else {
                    $('<li style="color: ' + data2 + '; display: none; " class="user-'+args[0]+'">'+args[1]+'</li>').hide().appendTo('.room-wrap ul').fadeIn();

                }

            //}

        }

}


solarturrets.connection.onopen = function (session) {

    myid = session.id;

    solarturrets.setSession(session);

    /* Examples (See: http://autobahn.ws/js/ )

    // 1) subscribe to an event
    //session.subscribe('com.myapp.hello', onevent);

    // 2) publish an event
    //session.publish('com.myapp.'+$('#room').val(), [$('#name').val(),'sex','age']);

    // 3) register a procedure for remoting
    //function add2(args) {
    //    return args[0] * args[1];
    // }
    //session.register('com.myapp.add2', add2);

    // 4) call a remote procedure
    //session.call('com.myapp.add2', [4, 4]).then(
    //   function (res) {
    //      console.log("Result:", res);
    //   }
    //);
    */

    //console.log(this);
    /***********

    STANDARD JQUERY / Initial DOM setup

    ********* */

    $('#myid').html(myid);


    // Random Name
    $('input#name').val(chance.name());


    // Random Message
    $('#chat-message').val(chance.sentence({ length: 1}));


    // ****** CLICK JOIN / SUBSCRIBE
    $('button#join').click(function(){
        

        if(sub != null){
            sub.unsubscribe();
            $('.room-wrap ul li').remove();
            session.publish('com.myapp.'+room, [myid,name,'leave',$('#room').val()]);
        }

        $('#loginscreen').hide();



        kickoff();

        session.subscribe('com.myapp.'+$('#room').val(), solarturrets.onevent).then(
            function(subscription){
                sub = subscription;
                id = subscription.id;
                room = $('#room').val();
                name = $('#name').val();

                console.log("Subscribed with subscription ID " + subscription.id);

                $('#session').html(id);

                $('.room-wrap h4').html("Room: <strong>" + room + "</strong>");

                var somehtml = '<li class="me" style="color: ' + mycolor + '"><strong>' + name +'</strong> (Me)</li>';

                $('.room-wrap ul li').remove();
                $('.room-wrap ul').prepend(somehtml);

                session.publish('com.myapp.'+room, [myid,name,'join',$('#room').val(), mycolor]);



                $('.room-wrap').fadeIn();
                $('.chat-wrap').fadeIn();

                // START TIMEOUT
                clearInterval(pulse);
                pulse = setInterval(function(){
                    var name = $('#name').val();
                    $('.room-wrap ul li.me').html('<strong>' + name +'</strong> (Me)');
                    session.publish('com.myapp.'+room, [myid,name,'ping',room, mycolor]);

                },2000)

                // Push to Adress bar
                history.pushState(null,null,'#' + room); // URL Update. not 100% implemented.

            });

        //session.publish('com.myapp.'+room, [myid,name,'join',$('#room').val(), mycolor]);

    });


    /* ****** CHAT CLICK ***/
    /* Publish: #chat-message->val */

    $('button#chat').click(function(){

        console.log("gooi");
        room = $('#room').val();
        data = $('#chat-message').val();
        name = $('#name').val();

        session.publish('com.myapp.'+$('#room').val(), [myid,name,'chat',data]);

        $('#chat-message').val('').val(chance.sentence({ length: 1}));

        // Do this locally
        $('#chat-log').prepend(name + ": " + data+"<br/>");

    });

    
    // JUST BEFORE YOU REFRESH
    window.onbeforeunload = function(event) {

        room = $('#room').val();

        session.publish('com.myapp.'+room, [myid,name,'leave','']);
        connection.close();

    };


};

solarturrets.connection.onclose = function (reason, details) {
    console.log('closed');
    console.log(details);

    // connection closed, lost or unable to connect
};





/*$(window).unload(function () {
 console.log('Killed');
 console.log("Handler for .unload() was called.");
 connection.close();
 });*/



