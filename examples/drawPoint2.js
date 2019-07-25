const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    }
`;

const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    }
`;

function main() {
    let canvas = document.getElementById('drawPoint2');
    let gl = canvas.getContext('webgl');
    const shaderPrograme = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    if(!shaderPrograme) {
        console.log('shderProgram init filed', shaderPrograme)
    }
    gl.useProgram(shaderPrograme);

    //获取attribute变量存储位置
    let a_Position = gl.getAttribLocation(shaderPrograme, 'a_Position');
    let a_PointSize = gl.getAttribLocation(shaderPrograme, 'a_PointSize');


    //验证a_Position是否获取成功，为-1则attribute变量不存在或命名不规范，>=0则获取成功
    if(a_Position < 0) {
        console.log('failed to get ths storage of a_Position');
    }

    //向attribute变量赋值
    gl.vertexAttrib3f(a_Position, 0.5, 0.0, 0.0);
    gl.vertexAttrib1f(a_PointSize, 15.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.points, 0, 1);
}

function initShader(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if(!vertexShader || !fragmentShader){
        console.log('load shader error');
    }

    const shaderPrograme = gl.createProgram();
    gl.attachShader(shaderPrograme, vertexShader);
    gl.attachShader(shaderPrograme, fragmentShader);

    gl.linkProgram(shaderPrograme);
    return shaderPrograme;
}

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