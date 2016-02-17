function shape(canvas,canvas1,cobj){
    this.canvas=canvas;
    this.canvas1=canvas1;
    this.cobj=cobj;
    this.bgcolor="#000";
    this.borderColor="#000";
    this.lineWidth=1;
    this.type="stroke";
    this.shapes="line";
    this.history=[];
    this.width=this.canvas1.width;
    this.height=this.canvas1.height;
    console.log(this.width);
}
shape.prototype={
    init:function(){
        this.cobj.fillStyle=this.bgcolor;
        this.cobj.strokeStyle=this.borderColor;
        this.cobj.lineWidth=this.lineWidth;
    },
    line:function(x,y,x1,y1){
        var that=this;
        that.init();
        that.cobj.beginPath();
        that.cobj.moveTo(x,y);
        that.cobj.lineTo(x1,y1);
        that.cobj.stroke();
        that.cobj.closePath();
    },
    rect:function(x,y,x1,y1){
        var that=this;
        that.init();
        that.cobj.beginPath();
        that.cobj.rect(x,y,x1-x,y1-y);
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    arc:function(x,y,x1,y1){
        var that=this;
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        that.init();
        that.cobj.beginPath();
        that.cobj.arc(x,y,r,0,Math.PI*2);
        that.cobj.closePath();
        that.cobj[that.type]();
    },


    draw:function(){
        var that=this;
        that.canvas.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.canvas.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length!=0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endx= e.offsetX;
                var endy= e.offsetY;
                that[that.shapes](startx,starty,endx,endy);
            }
            that.canvas.onmouseup=function(){
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.canvas.onmousemove=null;
                that.canvas.onmouseup=null;
            }
        }
    },
    five:function(x,y,x1,y1){
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var r1=r/2;
        this.cobj.beginPath();
        this.cobj.moveTo(x+r,y);
        for(var i=1;i<10;i++){
            if(i%2==0){
                this.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r,y+Math.sin(i*36*Math.PI/180)*r)

            }else{
                this.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r1,y+Math.sin(i*36*Math.PI/180)*r1)
            }
        }
        this.cobj.closePath();
        this.cobj[this.type]();
    },
    pen:function(){
        var that=this;
        that.canvas.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.init();
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.canvas.onmousemove=function(e){
                var endx= e.offsetX;
                var endy= e.offsetY;
                that.cobj.lineTo(endx,endy);
                that.cobj.stroke();
            }
            that.canvas.onmouseup=function(){
                that.cobj.closePath();
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.canvas.onmousemove=null;
                that.canvas.onmouseup=null;
            }
        }
    },


    xp:function(xpobj,w,h){
        var that=this;
        that.canvas.onmousedown=function(){
            xpobj.css({
                        display:"block",
                        width:w+"px",
                        height:h+"px",
                 background:"red"
                    });
            that.canvas.onmousemove=function(e){
                var ox= e.offsetX;
                var oy= e.offsetY;
                var lefts=ox-w/2;
                var tops=oy-h/2;
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.width-w){
                    lefts>that.width-w;
                }
                if(tops<0){
                    tops=0;
                }
                if(tops>that.height-h){
                    tops>that.height-h;
                }
                xpobj.css({
                    left:lefts,
                    top:tops
                })
                that.cobj.clearRect(lefts,tops,w,h);

            }
        
            that.canvas.onmouseup=function(e){
                xpobj.css("display","none");
                console.log(1);
                that.history.push(that.cobj.getImageData(0, 0, that.width, that.height));
                that.canvas.onmousemove = null;
                that.canvas.onmouseup = null;
            }

        }

    },
    ss:function(textArea){
        var that=this;
        that.canvas.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY,minx,miny, w,h;
            that.canvas.onmousemove=function(e){
                var endx= e.offsetX;
                var endy= e.offsetY;
                 minx=(startx<endx)?startx:endx;
                 miny=(starty<endy)?starty:endy;
                 w=Math.abs(startx-endx);
                 h=Math.abs(starty-endy);
                textArea.css({width:w,height:h,left:minx,top:miny});
            }
            that.canvas.onmouseup=function(e){
                that.canvas.onmousemove = null;
                that.canvas.onmouseup = null;
                that.temp=that.cobj.getImageData(minx,miny,w,h);
                that.cobj.clearRect(minx,miny,w,h);
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.cobj.putImageData(that.temp,minx,miny);
                that.drag(minx,miny,w,h,textArea);
            }
        }

    },
    drag:function(minx,miny,w,h,textArea){
        var that=this;
        that.canvas.onmousemove=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            if(startx>minx&&startx<minx+w&&starty>miny&&starty<miny+h){
                console.log(1);
                that.canvas.style.cursor="move";
            }else{
                that.canvas.style.cursor="default";
            }
        }

        that.canvas.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            var cx=startx-w;
            var cy=starty-h;
            if(startx>minx&&startx<minx+w&&starty>miny&&starty<miny+h){
                that.canvas.style.cursor="move";
            }else{
               return;
            }
            that.canvas.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length!=0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endx= e.offsetX;
                var endy= e.offsetY;
                var lefts=endx-cx;
                var tops=endy-cy;
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.width-w){
                    lefts=that.width-w
                }

                if(tops<0){
                    tops=0;
                }
                if(tops>that.height-h){
                    tops=that.height-h
                }
                textArea.css({
                    left:lefts,
                    top:tops
                });
                x=lefts;
                y=tops;
                that.cobj.putImageData(that.temp,lefts,tops);
            }
            that.canvas.onmouseup=function(e){
                that.canvas.onmousemove = null;
                that.canvas.onmouseup = null;
            }
        }
    }
}