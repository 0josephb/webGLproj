'use strict'

class Canvas {
    constructor (width, height, Keypress) {
        this.height = height;
        this.width = width;
        
        this.MakeCanvas();
        this.canvas.addEventListener("keypress", Keypress);
        
        this.SetupGL();
        this.MakeShaders();
        
        this.Init();
        
        this.eye = lookAt([0,0,-1],[0,0,0],[0,1,0]);
        var proj =  this.Frustum(-0.5,0.5,-0.5,0.5,1,20);
        proj = mult(proj,this.eye);
        this.gl.uniformMatrix4fv(this.projLoc, false,flatten(proj));
    }
    
    Frustum(l,r,b,t,n,f) {
        var m =  mat4(1);
        m[0][0] = 2 * n / (r - l);
        m[0][1] = 0;
        m[0][2] = (r + l) / (r - l);
        m[0][3] = 0;
        
        m[1][0] = 0;
        m[1][1] = 2 * n / (t - b);
        m[1][2] = (t + b) / (t - b);
        m[1][3] = 0;
        
        m[2][0] = 0;
        m[2][1] = 0;
        m[2][2] = -(f + n) / (f - n);
        m[2][3] = -2 * f * n / (f - n);
        
        m[3][0] = 0;
        m[3][1] = 0;
        m[3][2] = -1;
        m[3][3] = 0;
        
        return m;
    }
    
    ModifyFrustum() {
        
        let left,right,top,bottom;
        
        let width = document.getElementById("form").Width.value;
        let height = document.getElementById("form").Height.value;
        let near = parseInt(document.getElementById("form").Near.value, 10);
        let far = parseInt(document.getElementById("form").Far.value,10);
        
        left = -width/2;
        right = width/2;
        top = height/2;
        bottom = -height/2;
        
        var proj =  this.Frustum(left,right,bottom,top,near,far);
        proj = mult(proj,this.eye);
        this.gl.uniformMatrix4fv(this.projLoc, false,flatten(proj));
    }
    
    ModifyCamera() {
        let n = parseInt(document.getElementById("form").Eye.value, 10);
        this.eye = lookAt([0,0,n],[0,0,0],[0,1,0]);
    }
    
    MakeCanvas() {
        if (this.width == undefined || this.width < 0) {
            this.width = 300;
        }
        
        if (this.height == undefined || this.height < 0) {
            this.height = 300;
        }
        
        this.canvas = document.createElement('canvas')
        this.canvas.tabIndex=0;
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.canvas.style.border = '1px solid #000';
        document.body.appendChild(this.canvas);
    }
    
    SetupGL() {
        this.gl = WebGLUtils.setupWebGL(this.canvas);
        if (!this.gl) {
            alert ("WebGL isn't available");
            return;
        }
        this.gl.getExtension('OES_standard_derivatives');
    }
    
    MakeShaders() {
        var gl = this.gl;
        this.program = initShaders(gl, "vertex-shader","fragment-shader");
        gl.useProgram(this.program);
        
        this.projLoc = gl.getUniformLocation(this.program, "uniformProject");
        this.transLoc = gl.getUniformLocation(this.program, "uniformTransform");
        this.colorLoc = gl.getUniformLocation(this.program, "uniformEdgeColor");
        this.surfaceColorLoc = gl.getUniformLocation(this.program, "uniformSurfaceColor");
        
    }
    
    Init() {
        var gl = this.gl;
        
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.viewport(0,0, this.width, this.height);
        
        gl.enable(gl.BLEND);
        //suggested here https://limnu.com/webgl-blending-youre-probably-wrong/
        gl.blendFuncSeparate(gl.SRC_ALPHA,
                             gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        
        gl.enable(gl.DEPTH_TEST);
        // not needed, LESS is the default
        // gl.depthFunc(gl.LESS);
        // From https://learnopengl.com/Advanced-OpenGL/Depth-testing
        // gl.TRUE is not a value of true apparently	
        // but this is not needed, it is true by default.
        // gl.depthMask(true);
        // console.log(gl.getParameter(gl.DEPTH_WRITEMASK));
        
        //gl.enable(gl.CULL_FACE);
        //gl.cullFace(gl.BACK);
        
        gl.frontFace(gl.CW);
        
        // set the default edge color for everything
        this.NewEdgeColor([1.0, 0.0, 0.0, 1.0]);
    }
    
    
    NewEdgeColor(c) {
        this.gl.uniform4fv(this.colorLoc, c);
    }
    
    NewSurfaceColor(c) {
        this.gl.uniform4fv(this.surfaceColorLoc, c);
    }
    
    Program() {
        return this.program;
    }
    
    GL() {
        return this.gl;
    }
    
    Translate() {
        return this.transLoc;
    }
    
    Clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
};
