const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
    }
`;
const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

function main() {
    let canvas = document.getElementById('multiPoints');
    let gl = canvas.getContext('webgl');
    const shaderProgram = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    if(!shaderProgram) {
        console.log('shader program init failed');
    }
    gl.useProgram(shaderProgram);

    // let a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    let pointNumber = initVertexBuffer(gl, shaderProgram);
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, pointNumber)
}

function initVertexBuffer (gl, shaderProgram) {
    let vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ])
    let n = 3;
    console.log('program', gl.program)
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log('create vertex buffer error');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n;
}

function initShader (gl, vSource, fSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fSource);

    if(!vertexShader || !fragmentShader) {
        console.log('load shader error');
        return null
    }

    const shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);

    return shaderProgram;
}

function loadShader (gl, type, source) {
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