const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
        v_Color = a_Color;
    }
`;
const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    uniform float u_Width;
    uniform float u_Height;
    void main() {
        // gl_FragColor = v_Color;
        gl_FragColor = vec4(0.0, 0.0, gl_FragCoord.y/u_Height, 1.0);
    }
`;

function main() {
    let canvas = document.getElementById("multiColor");
    let gl = canvas.getContext("webgl");
    const shaderProgram = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    if(!shaderProgram) {
        console.log("shader program init failed!!!");
    }
    gl.useProgram(shaderProgram);

    const u_Height = gl.getUniformLocation(shaderProgram, 'u_Height');
    gl.uniform1f(u_Height, gl.drawingBufferHeight);

    let pointNumber = initVertexBuffer(gl, shaderProgram);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, pointNumber);
}

function initVertexBuffer(gl, shaderProgram) {
    let vertices = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 0.0,
        0.5, -0.5, 0.0, 1.0, 0.0,
        -0.5, -0.5, 0.0, 0.0, 1.0
    ]);
    let n=3;
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log("create vertex buffer failed!!!");
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    let a_Color = gl.getAttribLocation(shaderProgram, 'a_Color');
    const FSIZE = vertices.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*5, 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE*5, FSIZE*2);

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);

    return n;
}        