
  solarturrets = new Solarturrets(); 
  stats = new Stats();
  
  document.body.appendChild( stats.domElement );
  stats.domElement.style.position = "fixed";
  stats.domElement.style.zIndex = "999";
  stats.domElement.style.bottom = "0px";
  stats.domElement.style.right = "0px"; 


  solarturrets.stage.click = function(mouseData){

    solarturrets.handleClickTap(mouseData.originalEvent);

  }
  
  
  //the main resize function
  window.onresize = function resize() {
    
    if (solarturrets != null){
      solarturrets.resize();
    }

  }

  // THIS FUNCTION CALL KICKS OFF THE WHOLE RENDER LOOP PARTY 

  function kickoff(){

    document.body.appendChild(solarturrets.renderer.view);
    requestAnimFrame(update);
  
  }  

  //the main loop function
  function update() {
    
    stats.begin();  
    solarturrets.gameupdate();
    requestAnimFrame( update );
    stats.end();
  
  }