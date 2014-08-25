PIXI.Camera = function()
{
    PIXI.DisplayObjectContainer.call( this );

    this.renderable = true;
    this.following = 0;
    this.screen_midx = 0;
    this.screen_midy = 0;

    
    this.zoom = 0.15;

    this.maxzoom = 2.5;

    this.minzoom = 0.7;

    this.rotation = 0;

    


    this.alpha_matrix = [1,0,0,
                         0,1,0,
                         0,0,1];
    
    this.beta_matrix = [1,0,0,
                        0,1,0,
                        0,0,1];

    this.t1_matrix = [1,0,0,
                      0,1,0,
                      0,0,1];

    this.r1_matrix = [1,0,0,
                      0,1,0,
                      0,0,1];
    
    this.s1_matrix = [2,3,4,
                      50,1,3,
                      2,-4,1];

    this.t2_matrix = [1,0,-1,
                      6,9,1,
                      -2,4,1];


 

};

// constructor

PIXI.Camera.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Camera.prototype.constructor = PIXI.Camera;


PIXI.Camera.prototype.screenCenterView = function(mx,my){

  this.screen_midx = mx;
  this.screen_midy = my;

}

PIXI.Camera.prototype.printmymatrix = function()
{

    console.log(this.worldTransform);
    console.log("X: " + this.following.x + "Y: " + this.following.y );

} 


PIXI.Camera.prototype.deepSetMatrix = function(m1,m2)
{

  m1[0] = m2[0];
  m1[1] = m2[1];
  m1[2] = m2[2];
  m1[3] = m2[3];
  m1[4] = m2[4];
  m1[5] = m2[5];
  m1[6] = m2[6];
  m1[7] = m2[7];
  m1[8] = m2[8];

}

PIXI.Camera.prototype.multiplyMatrix = function(m1,m2,m3)
{

  m1[0] = (m2[0] * m3[0]) + (m2[1] * m3[3]) + (m2[2] * m3[6]);
  m1[1] = (m2[0] * m3[1]) + (m2[1] * m3[4]) + (m2[2] * m3[7]);
  m1[2] = (m2[0] * m3[2]) + (m2[1] * m3[5]) + (m2[2] * m3[8]);
  m1[3] = (m2[3] * m3[0]) + (m2[4] * m3[3]) + (m2[5] * m3[6]);
  m1[4] = (m2[3] * m3[1]) + (m2[4] * m3[4]) + (m2[5] * m3[7]);
  m1[5] = (m2[3] * m3[2]) + (m2[4] * m3[5]) + (m2[5] * m3[8]);
  m1[6] = (m2[6] * m3[0]) + (m2[7] * m3[3]) + (m2[8] * m3[6]);
  m1[7] = (m2[6] * m3[1]) + (m2[7] * m3[4]) + (m2[8] * m3[7]);
  m1[8] = (m2[6] * m3[2]) + (m2[7] * m3[5]) + (m2[8] * m3[8]);

}


PIXI.Camera.prototype.updateTransform = function()
{
  
    if(!this.visible)return;

 
    
    
    if(this.rotation !== this.rotationCache)
    {

        this.rotationCache = this.rotation;
        this._sr =  Math.sin(this.rotation);
        this._cr =  Math.cos(this.rotation);
    }

    this.t1_matrix[0] = 1;
    this.t1_matrix[1] = 0;
    this.t1_matrix[2] = -this.following.x;
    this.t1_matrix[3] = 0;
    this.t1_matrix[4] = 1;
    this.t1_matrix[5] = -this.following.y;
    this.t1_matrix[6] = 0;
    this.t1_matrix[7] = 0;
    this.t1_matrix[8] = 1;
        
    this.r1_matrix[0] = this._cr;
    this.r1_matrix[1] = -this._sr;
    this.r1_matrix[2] = 0;
    this.r1_matrix[3] = this._sr;
    this.r1_matrix[4] = this._cr;
    this.r1_matrix[5] = 0;
    this.r1_matrix[6] = 0;
    this.r1_matrix[7] = 0;
    this.r1_matrix[8] = 1;  

    this.s1_matrix[0] = this.zoom;
    this.s1_matrix[1] = 0;
    this.s1_matrix[2] = 0;
    this.s1_matrix[3] = 0;
    this.s1_matrix[4] = this.zoom;
    this.s1_matrix[5] = 0;
    this.s1_matrix[6] = 0;
    this.s1_matrix[7] = 0;
    this.s1_matrix[8] = 1; 

    this.t2_matrix[0] = 1;
    this.t2_matrix[1] = 0;
    this.t2_matrix[2] = this.screen_midx;
    this.t2_matrix[3] = 0;
    this.t2_matrix[4] = 1;
    this.t2_matrix[5] = this.screen_midy;
    this.t2_matrix[6] = 0;
    this.t2_matrix[7] = 0;
    this.t2_matrix[8] = 1; 



   this.multiplyMatrix(this.alpha_matrix,this.t2_matrix,this.r1_matrix);
   this.multiplyMatrix(this.beta_matrix,this.alpha_matrix,this.s1_matrix);
   this.multiplyMatrix(this.alpha_matrix,this.beta_matrix,this.t1_matrix);



/*
    var parentTransform = this.parent.worldTransform;//.toArray();
    var worldTransform = this.worldTransform;//.toArray();
    var px = this.pivot.x;
    var py = this.pivot.y;

    var a00 = this._cr * this.scale.x,
        a01 = -this._sr * this.scale.y,
        a10 = this._sr * this.scale.x,
        a11 = this._cr * this.scale.y,
        a02 = (this.screen_midx - this.following.x) - a00 * px - py * a01,
        a12 = (this.screen_midy - this.following.y) - a11 * py - px * a10,
        b00 = parentTransform.a, b01 = parentTransform.b,
        b10 = parentTransform.c, b11 = parentTransform.d;*/

 

    this.worldAlpha = this.alpha * this.parent.worldAlpha;



    this.worldTransform.a = this.alpha_matrix[0];//this.RM.e(1,1);
    this.worldTransform.b = this.alpha_matrix[1];
    this.worldTransform.tx = this.alpha_matrix[2];
    

    this.worldTransform.c = this.alpha_matrix[3];
    this.worldTransform.d = this.alpha_matrix[4];
    this.worldTransform.ty = this.alpha_matrix[5];




    for(var i=0,j=this.children.length; i<j; i++)
    {
        this.children[i].updateTransform();
    }
};


/*
PIXI.DisplayObject.prototype.updateTransform = function()
{
    
    if(this.rotation !== this.rotationCache)
    {

        this.rotationCache = this.rotation;
        this._sr =  Math.sin(this.rotation);
        this._cr =  Math.cos(this.rotation);
    }

   
    var parentTransform = this.parent.worldTransform;//.toArray();
    var worldTransform = this.worldTransform;//.toArray();
    var px = this.pivot.x;
    var py = this.pivot.y;

    var a00 = this._cr * this.scale.x,
        a01 = -this._sr * this.scale.y,
        a10 = this._sr * this.scale.x,
        a11 = this._cr * this.scale.y,
        a02 = this.position.x - a00 * px - py * a01,
        a12 = this.position.y - a11 * py - px * a10,
        b00 = parentTransform.a, b01 = parentTransform.b,
        b10 = parentTransform.c, b11 = parentTransform.d;

    worldTransform.a = b00 * a00 + b01 * a10;
    worldTransform.b = b00 * a01 + b01 * a11;
    worldTransform.tx = b00 * a02 + b01 * a12 + parentTransform.tx;

    worldTransform.c = b10 * a00 + b11 * a10;
    worldTransform.d = b10 * a01 + b11 * a11;
    worldTransform.ty = b10 * a02 + b11 * a12 + parentTransform.ty;

    this.worldAlpha = this.alpha * this.parent.worldAlpha;
};*/