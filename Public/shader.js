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
};

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
};