PIXI.SmaatObjectContainer = function()
{
    PIXI.DisplayObjectContainer.call( this );

    this.renderable = true;

     this.parentTransform = 0;


    this.utila0_0 = 0;
    this.utila0_1 = 0;
    this.utila1_0 = 0;
    this.utila1_1 = 0;
    this.utila0_2 = 0;
    this.utila1_2 = 0;
    this.utilb0_0 = 0;
    this.utilb0_1 = 0;
    this.utilb1_0 = 0;
    this.utilb1_1 = 0;


 

};

// constructor

PIXI.SmaatObjectContainer.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.SmaatObjectContainer.prototype.constructor = PIXI.SmaatObjectContainer;

PIXI.SmaatObjectContainer.prototype.updateTransform = function()
{
    
    if(this.rotation !== this.rotationCache)
    {

        this.rotationCache = this.rotation;
        this._sr =  Math.sin(this.rotation);
        this._cr =  Math.cos(this.rotation);
    }

   
    this.parentTransform = this.parent.worldTransform;//.toArray();
   //.toArray();
 

        this.utila0_0 = this._cr * this.scale.x,
        this.utila0_1 = -this._sr * this.scale.y,
        this.utila1_0 = this._sr * this.scale.x,
        this.utila1_1 = this._cr * this.scale.y,
        this.utila0_2 = this.position.x - this.utila0_0 * this.pivot.x - this.pivot.y * this.utila0_1,
        this.utila1_2 = this.position.y - this.utila1_1 * this.pivot.y - this.pivot.x * this.utila1_0,
        this.utilb0_0 = this.parentTransform.a, this.utilb0_1 = this.parentTransform.b,
        this.utilb1_0 = this.parentTransform.c, this.utilb1_1 = this.parentTransform.d;

    this.worldTransform.a = this.utilb0_0 * this.utila0_0 + this.utilb0_1 * this.utila1_0;
    this.worldTransform.b = this.utilb0_0 * this.utila0_1 + this.utilb0_1 * this.utila1_1;
    this.worldTransform.tx = this.utilb0_0 * this.utila0_2 + this.utilb0_1 * this.utila1_2 + this.parentTransform.tx;

    this.worldTransform.c = this.utilb1_0 * this.utila0_0 + this.utilb1_1 * this.utila1_0;
    this.worldTransform.d = this.utilb1_0 * this.utila0_1 + this.utilb1_1 * this.utila1_1;
    this.worldTransform.ty = this.utilb1_0 * this.utila0_2 + this.utilb1_1 * this.utila1_2 + this.parentTransform.ty;

    this.worldAlpha = this.alpha * this.parent.worldAlpha;

     for(var i=0,j=this.children.length; i<j; i++)
    {
        this.children[i].updateTransform();
    }
};

//SMAATGRAPHICS


PIXI.SmaatGraphics = function()
{
    PIXI.Graphics.call( this );

    this.renderable = true;

     this.parentTransform = 0;


    this.utila0_0 = 0;
    this.utila0_1 = 0;
    this.utila1_0 = 0;
    this.utila1_1 = 0;
    this.utila0_2 = 0;
    this.utila1_2 = 0;
    this.utilb0_0 = 0;
    this.utilb0_1 = 0;
    this.utilb1_0 = 0;
    this.utilb1_1 = 0;


 

};

// constructor

PIXI.SmaatGraphics.prototype = Object.create( PIXI.Graphics.prototype );
PIXI.SmaatGraphics.prototype.constructor = PIXI.SmaatGraphics;

PIXI.SmaatGraphics.prototype.updateTransform = function()
{
    
    if(this.rotation !== this.rotationCache)
    {

        this.rotationCache = this.rotation;
        this._sr =  Math.sin(this.rotation);
        this._cr =  Math.cos(this.rotation);
    }

   
    this.parentTransform = this.parent.worldTransform;//.toArray();
   //.toArray();
 

        this.utila0_0 = this._cr * this.scale.x,
        this.utila0_1 = -this._sr * this.scale.y,
        this.utila1_0 = this._sr * this.scale.x,
        this.utila1_1 = this._cr * this.scale.y,
        this.utila0_2 = this.position.x - this.utila0_0 * this.pivot.x - this.pivot.y * this.utila0_1,
        this.utila1_2 = this.position.y - this.utila1_1 * this.pivot.y - this.pivot.x * this.utila1_0,
        this.utilb0_0 = this.parentTransform.a, this.utilb0_1 = this.parentTransform.b,
        this.utilb1_0 = this.parentTransform.c, this.utilb1_1 = this.parentTransform.d;

    this.worldTransform.a = this.utilb0_0 * this.utila0_0 + this.utilb0_1 * this.utila1_0;
    this.worldTransform.b = this.utilb0_0 * this.utila0_1 + this.utilb0_1 * this.utila1_1;
    this.worldTransform.tx = this.utilb0_0 * this.utila0_2 + this.utilb0_1 * this.utila1_2 + this.parentTransform.tx;

    this.worldTransform.c = this.utilb1_0 * this.utila0_0 + this.utilb1_1 * this.utila1_0;
    this.worldTransform.d = this.utilb1_0 * this.utila0_1 + this.utilb1_1 * this.utila1_1;
    this.worldTransform.ty = this.utilb1_0 * this.utila0_2 + this.utilb1_1 * this.utila1_2 + this.parentTransform.ty;

    this.worldAlpha = this.alpha * this.parent.worldAlpha;

     for(var i=0,j=this.children.length; i<j; i++)
    {
        this.children[i].updateTransform();
    }
};





