'use strict'

class Wrapper {
    constructor (gl, program, widget, num=0) {
        this.num = num;
        this.widget = widget;
        this.orientation = this.widget.orientation.slice(0);
        this.SetColor(num);
        this.Reset();
        this.Transform();
        
        this.shaderLoc = gl.getUniformLocation(program, "vShader");
        
    }
    
    SetColor(n) {
        if (n == 0) {
            this.color = this.ColorSet0();
        } else if (n == 1) {
            this.color = this.ColorSet1();
        } else if (n == 2) {
            this.color = this.ColorSet2();
        } else if (n == 3) {
            this.color = this.ColorSet3();
        } else if (n == 4) {
            this.color = this.ColorSet4();
        } else {
            this.color = this.ColorSet0();
        }
    }
    
    ColorSet0() {
        let temp = [];
       
        for (let i = 0; i < this.widget.size; i++) {
            temp.push([0.0,0.0,0.0,1.0]);
        }
        
        return temp;
    }
    
    ColorSet1() {
        let temp = [];
        for (let i = 0; i < this.widget.size; i++) {
            temp.push([Math.random(),Math.random(),Math.random(),1.0]);
        }
        
        return temp;
    }
    
    ColorSet2() {
        let temp = [];
        for (let i = 0; i < this.widget.size; i++) {
            temp.push([1.0,1.0,0.0,1.0]);
        }
        
        return temp;
    }
    
    ColorSet3() {
        let temp = [];
        let x,y,z;
        
        for (let i = 0; i < this.widget.size; i++) {
            
            if (this.widget.tris[i][0] > 0){
                x = 1.0
            } else {
                x = 0.0;
            }
            
            if (this.widget.tris[i][1] > 0){
                y = 1.0
            } else {
                y = 0.0;
            }
            
            if (this.widget.tris[i][2] > 0){
                z = 1.0
            } else {
                z = 0.0;
            }
            
            temp.push([x,y,z,1.0]);
        }
        
        return temp;
    }
    
    ColorSet4() {
        let temp = [];
        for (let i = 0; i < this.widget.size; i++) {
            temp.push([0.0,0.0,1.0,1.0]);
        }
        
        return temp;
    }
    
    Transform() {
        var tmp = translate(this.tx + this.widget.center[0], this.ty + this.widget.center[1], this.tz + this.widget.center[2]);
        tmp = mult(tmp, scalem(this.sx, this.sy, this.sz));
        tmp = mult(tmp, rotate(this.rz, [0,0,1]));
        tmp = mult(tmp, rotate(this.ry, [0,1,0]));
        tmp = mult(tmp, rotate(this.rx, [1,0,0]));
        tmp = mult(tmp, translate(-this.widget.center[0],-this.widget.center[1],-this.widget.center[2]));
        
        this.transform = tmp;
    }
    
    Translate(x,y,z) {
        this.tx = x;
        this.ty = y;
        this.tz = z;
        
        this.Transform();
    }
    
    Rotate(x,y,z) {
        this.rx += x;
        this.ry += y;
        this.rz += z;
        
        this.Transform();
    }
    
    Scale(x,y,z) {
        this.sx *= x;
        this.sy *= y;
        this.sz *= z;
        
        this.Transform();
    }
    
    GetSX(){
        return this.sx;
    }
    
    Modify(change) {
        this.orientation[0] += change[0];
        this.orientation[1] += change[1]; 
        this.orientation[2] += change[2]; 
        this.orientation[3] += change[3]; 
        this.orientation[4] += change[4]; 
        this.orientation[5] += change[5]; 
        this.orientation[6] += change[6]; 
        this.orientation[7] += change[7]; 
        this.orientation[8] += change[8]; 
    }
    
    Reset() {
        
        this.temp = this.orientation;
        
        this.visible = true;
        this.rx = this.temp[6];
        this.ry = this.temp[7];
        this.rz = this.temp[8];
        this.sx = this.temp[3];
        this.sy = this.temp[4];
        this.sz = this.temp[5];
        this.tx = this.temp[0];
        this.ty = this.temp[1];
        this.tz = this.temp[2];
        this.Transform();
    }
    
    Show() {
        this.visible = true;
    }
    
    Hide() {
        this.visible = false;
    }
    
    Visible() {
        return this.visible;
    }
    
    Display(gl, transform, transLoc) {
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.widget.cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,flatten(this.color),gl.STATIC_DRAW);
        gl.uniform1i(this.shaderLoc,this.num);
        
        if (this.visible){
            this.Transform();
            this.widget.Display(gl, this.transform, transLoc);
        }
        
    }
}
