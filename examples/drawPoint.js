const VSHADER_SOURCE = `
    void main() {
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
        gl_PointSize = 10.0;
    }
`;

const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

function main() {
    let canvas = document.getElementById('webGL');
    let gl = canvas.getContext("webgl");
    // debugger;
    const shaderProgram = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    if(!shaderProgram) {
        console.log('shderProgram filed ', shaderProgram)
    }
    gl.useProgram(shaderProgram);
    gl.program = shaderProgram;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1)

    console.log('draw over')
}



function initShader(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShder = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    //创建着色器程序
    if(!vertexShader || !fragmentShder) {
        return null;
    }
    const shaderProgram = gl.createProgram();
    if(!shaderProgram) {
        console.log('program is null')
        return null;
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShder);

    gl.linkProgram(shaderProgram);
    let linked = gl.getProgramParameter( shaderProgram, gl.LINK_STATUS);
    if(!linked) {
        let error = gl.getProgramInfoLog(shaderProgram);
        console.log('filed to link program', error)
        return null;
    }

    return shaderProgram;
} 



//创建指定类型的着色器， 上传source源码并编译

function loadShader(gl, type, source) {
     const shader = gl.createShader(type);
     gl.shaderSource(shader, source);
     gl.compileShader(shader);

     const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

     if(!compiled) {
         let error = gl.getShaderInfoLog(shader);
         console.log('failed to compile shader', error);
         gl.deleteShader(shader);

         return null;
     }

     return shader;
}
