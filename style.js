document.querySelector("#rand").addEventListener("click",function(){
	createWord(String.fromCharCode(1040+getRand(0,33)));
},false);
createWord("У");

function createWord(word){
	[...document.body.children].forEach(e=>{
  if(e.id != "rand")
  		document.body.removeChild(e);
  });
  var canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  var ctxW = 500;
  var ctxH = 300;
  canvas.width = ctxW;
  canvas.height = ctxH
  var text = word;
  ctx.font = "200px Impact";
  var textHeight = 160;
  var textWidth = ctx.measureText(text).width;
  var x = 150,y = 200;
  ctx.fillText(text,x,y);
  var imageParts = [];
  var countCropY =3
  var countCropX =1;
  var heightCrop = textHeight/countCropY;
  var widthCrop = textWidth/countCropX;
  for(var i = 0; i < countCropY;i++){	
    for(var j = 0; j < countCropX;j++){	
      imageParts.push(new imagePart(x+widthCrop*j,y-textHeight+heightCrop*i,getRand(0,ctxW-textWidth),getRand(0,ctxH-textHeight),widthCrop,heightCrop,
      ctx.getImageData(x+widthCrop*j,y-textHeight+heightCrop*i,widthCrop,heightCrop)))
    	}
  }
  function draw(){
    ctx.clearRect(0,0,ctxW,ctxH);
    ctx.strokeText(text,x,y);
    imageParts.forEach(e=>e.draw())
  }
  draw();
  var drag = null,offX = 0,offY = 0;
  canvas.addEventListener("mousedown",function(e){
    imageParts.forEach(el=>{
     if(el.collision({x:e.offsetX,y:e.offsetY})){
       drag = el;
       offX = el.x- e.offsetX;
       offY = el.y - e.offsetY;
     return false;
     }
    });
  },false);
  document.addEventListener("mouseup",function(e){
    if(drag != null){
      drag.positionHelper();
      draw();
      if(imageParts.every(e=>e.x == e.startX && e.y == e.startY)){    	
        ctx.fillText(text,x,y);
        alert("Done!");
      }
    }
    drag = null;
  });
  canvas.addEventListener("mousemove",function(e){
  if(drag != null){
    canvas.style.cursor = "move";
    drag.x = e.offsetX+offX;
    drag.y = e.offsetY+offY;
    draw();
  }
  else{
    canvas.style.cursor = "default";
      imageParts.forEach(el=>{
       if(el.collision({x:e.offsetX,y:e.offsetY})){
          canvas.style.cursor = "pointer";
         return false;
       }
      });
    }
  },false);
  function imagePart(sx,sy,x,y,w,h,data){
    let _this = this;
    this.x = x;
    this.y = y;
    this.startX = sx;
    this.startY = sy;
    this.h = h;
    this.w = w;
    this.data = data;
    this.distToHelp = 15;
    this.draw = function(){
      ctx.putImageData(_this.data,_this.x,_this.y);
    }
    this.collision = function(point){
    return  point.x   >= _this.x && point.x <= _this.x+_this.w &&  point.y   >= _this.y && point.y <= _this.y+_this.h; 
    }
    this.positionHelper = function(){
      if(getDist(_this.x,_this.y,_this.startX,_this.startY) <= _this.distToHelp ){

      _this.x = _this.startX;
      _this.y = _this.startY;
      }
    }
  }
}

function getRand(min,max){
return Math.round(Math.random() * (max-min) + min);
}

function getDist(x, y, x1, y1) {
  return Math.hypot(x - x1, y - y1);
}