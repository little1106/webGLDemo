const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_Transform;
    void main() {
        gl_Position = u_Transform * a_Position;
    }
`;
const FSHEDER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

function main () {
    let canvas = document.getElementById("animation");
    let gl = canvas.getContext('webgl');
    const shaderProgram = initShader(gl, VSHADER_SOURCE, FSHEDER_SOURCE);
    if(!shaderProgram) {
        console.log("shader progrem init failed!!!")
    }
    gl.useProgram(shaderProgram);

    let pointNumber = initVertexBuffer(gl, shaderProgram);
    let u_Transform = gl.getUniformLocation(shaderProgram, 'u_Transform');
    let angle = 0.1;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    let transformMatrix = new Matrix4();

    let startTime;
    function tick(timestamp) {
        if (!startTime) {
            startTime = timestamp;
        }
        window.currentTime = Number((timestamp - startTime).toFixed(2));
        // console.log('timestamp', timestamp, startTime, currentTime, Math.PI * currentTime / 180);
        startTime = timestamp;
        if(currentTime) {
            transformMatrix.rotate(angle*currentTime, 0.0, 0.0, 1.0);
        }
        console.log("trans", transformMatrix)
        draw(gl, u_Transform, transformMatrix, pointNumber);
        requestAnimationFrame(tick);
    }
    tick();
}

function draw(gl, u_Transform, transformMatrix, pointNumber) {
    // console.log("gl", gl.uniformMatrix4fv);
    gl.uniformMatrix4fv(u_Transform, false, transformMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, pointNumber);
}

function initVertexBuffer (gl, shaderProgram) {
    let vertices = new Float32Array([
        0.0, 0.5, 0.5, -0.5, -0.5, -0.5
    ]);
    let n=3;
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log("create vertex buffer failed!!!");
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    return n;
}