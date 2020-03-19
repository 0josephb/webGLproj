'use strict'

class Widget {
    constructor(gl, program, tris, rightsideUp) {
        this.tris = tris;
        this.size = tris.length;
        this.orientation = rightsideUp;
        
        this.center = [0,0,0];
        for (let i = 0; i < this.size; i++) {
            this.center[0] += tris[i][0];
            this.center[1] += tris[i][1];
            this.center[2] += tris[i][2];
        }
        
        this.center[0] = this.center[0]/this.size;
        this.center[1] = this.center[1]/this.size;
        this.center[2] = this.center[2]/this.size;
        
        this.bcs = []
        for (var i=0;i<this.size/3;i++) {
            this.bcs.push([0.0,1.0,2.0]); 
        }
        
        this.SetupVBO(gl, program, tris, this.bcs);
        
        this.Reset();
        this.Transform();
    }
    
    Reset() {
        this.visible = true;
        this.rx = 0;
        this.ry = 0;
        this.rz = 0;
        this.sx = 1;
        this.sy = 1;
        this.sz = 1;
        this.tx = 0;
        this.ty = 0;
        this.tz = 0;
        this.Transform();
    }
    
    Transform() {
        
        var tmp = translate(this.tx, this.ty, this.tz);
        tmp = mult(tmp, scalem(this.sx, this.sy, this.sz));
        tmp = mult(tmp, rotate(this.rz, [0,0,1]));
        tmp = mult(tmp, rotate(this.ry, [0,1,0]));
        tmp = mult(tmp, rotate(this.rx, [1,0,0]));
        
        this.transform = tmp;
    }
    
    SetupVBO(gl, program, tris, bcs) {
        
        this.vPos =  gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vPos);
        
        this.aPos =  gl.getAttribLocation(program, "attributePosition");
        gl.vertexAttribPointer(this.aPos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.aPos);
        gl.bufferData(gl.ARRAY_BUFFER,flatten(tris),gl.STATIC_DRAW);
        
        this.vBC = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBC);
        
        this.aBC = gl.getAttribLocation(program, "attributeBC");
        gl.vertexAttribPointer(this.aBC,1,gl.FLOAT, false,0,0);
        gl.enableVertexAttribArray(this.aBC);
        gl.bufferData(gl.ARRAY_BUFFER,flatten(this.bcs),gl.STATIC_DRAW);
        
         // a buffer for the colors
         this.cBuffer = gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffer);
         
         var colorAttribute = gl.getAttribLocation(program, "vColor");
         gl.vertexAttribPointer(colorAttribute,4,gl.FLOAT, false,0,0);
         gl.enableVertexAttribArray(colorAttribute);
        
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
        
        if(this.visible) {
            
            gl.uniformMatrix4fv(transLoc, false, flatten(transform)); 
            
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vPos);
            gl.vertexAttribPointer(this.aPos, 3, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vBC);
            gl.vertexAttribPointer(this.aBC,1,gl.FLOAT, false,0,0);
            
            gl.drawArrays(gl.TRIANGLES, 0, this.size);
        }
    }
}
