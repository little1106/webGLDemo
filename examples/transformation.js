const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform vec4 u_Translation;
    uniform vec4 u_Rotate;
    uniform float u_CosB, u_SinB;
    uniform mat4 u_TransformMatrix;
    uniform mat4 u_RotateMatrix;
    void main() {
        // u_Rotate = a_Position + u_Translation;
        // gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
        // gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
        // gl_Position.z = a_Position.z;
        // gl_Position.w = 1.0;
        // gl_Position = gl_Position + u_Translation;
        //gl_PointSize = 10.0;
        //gl_Position = u_TransformMatrix * a_Position;
        gl_Position = u_RotateMatrix * a_Position;
    }
`;
const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;


function main() {
    let canvas = document.getElementById('transformation');
    let gl = canvas.getContext('webgl');
    const shaderProgram = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    if(!shaderProgram) {
        console.log('shader program init failed');
    }
    gl.useProgram(shaderProgram);


    // let a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    let pointNumber = initVertexBuffer(gl, shaderProgram);

    //公式
    let radian = Math.PI * 90 / 180;
    let u_SinB = gl.getUniformLocation(shaderProgram, 'u_SinB');
    let u_CosB = gl.getUniformLocation(shaderProgram, 'u_CosB');
    let u_Translation = gl.getUniformLocation(shaderProgram, 'u_Translation');

    gl.uniform1f(u_CosB, Math.cos(radian));
    gl.uniform1f(u_SinB, Math.sin(radian));
    gl.uniform4f(u_Translation, 0.5, 0.5, 0.0, 0.0)

    // 平移矩阵
    let transformMatrix = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.5, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.5, 0.5, 0.0, 1.0
    ])

    console.log('matrix', transformMatrix)
    let u_TransformMatrix = gl.getUniformLocation(shaderProgram, 'u_TransformMatrix');
    gl.uniformMatrix4fv(u_TransformMatrix, false, transformMatrix);
    
    // 旋转矩阵
    let angle = 90.0;
    let radianA = Math.PI * angle / 180.0;
    let cosA = Math.cos(radianA), sinA = Math.sin(radianA);
    let rotateMatrix = new Float32Array([
        cosA, sinA, 0, 0,
        -sinA, cosA, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);

    let u_RotateMatrix = gl.getUniformLocation(shaderProgram, 'u_RotateMatrix');
    gl.uniformMatrix4fv(u_RotateMatrix, false, rotateMatrix);
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, pointNumber)
}

function initVertexBuffer (gl, shaderProgram) {
    let vertices = new Float32Array([
         0.0, 0.5, 0.5, -0.5, -0.5, -0.5
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
};