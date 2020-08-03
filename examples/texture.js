const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
`;
const FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;
    void main() {
        gl_FragColor = texture2D(u_Sampler, v_TexCoord);
    }
`;

function main() {
    let canvas = document.getElementById("texture");
    let gl = canvas.getContext("webgl");
    const shaderProgram = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    if(!shaderProgram) {
        console.log("shader program init failed!!!");
    }
    gl.useProgram(shaderProgram);
    
    let pointNumber = initVertexBuffer(gl, shaderProgram);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    if(initTextures(gl, shaderProgram, pointNumber)) {
        console.log("load texture sucess!!!");
    }
}

function initVertexBuffer(gl, shaderProgram) {
    let vertics = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ]);
    let n = 4;
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log("create vertex buffer failed!!!");
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertics, gl.STATIC_DRAW);
    
    let a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    let a_TexCoord = gl.getAttribLocation(shaderProgram, `a_TexCoord`);

    const FSIZE = vertics.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}
function initTextures(gl, shaderProgram, n) {
    let texture = gl.createTexture();
    let u_Sampler = gl.getUniformLocation(shaderProgram, 'u_Sampler');
    let image = new Image();
    image.onload = function() {
        console.log("load image sucess!!!")
        loadTexture(gl, n, texture, u_Sampler, image);
    };
    image.crossOrigin = "";
    image.src = 'https://c1.staticflickr.com/9/8873/18598400202_3af67ef38f_q.jpg';
    return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        // new Uint8Array([0, 0, 255, 255]));
    gl.uniform1i(u_Sampler, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}