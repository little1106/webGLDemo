const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main () {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`;

function main() {
    let canvas = document.getElementById('drawPoint3');
    let gl = canvas.getContext('webgl');
    const shaderProgram = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    if(!shaderProgram) {
        console.log('shaderProgram filed');
    }
    gl.useProgram(shaderProgram);
    let a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    let a_PointSize = gl.getAttribLocation(shaderProgram, 'a_PointSize');
    let u_FragColor = gl.getUniformLocation(shaderProgram, 'u_FragColor');

    let g_points = [];
    let g_colors = [];
    canvas.addEventListener('click', (ev) => {drawPoint(ev, gl, canvas, a_Position, a_PointSize, u_FragColor, g_points, g_colors)});
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function drawPoint(ev, gl, canvas, a_Position, a_PointSize, u_FragColor, g_points, g_colors) {
    let x = ev.clientX;
    let y = ev.clientY;
    let rect = ev.target.getBoundingClientRect();
    // debugger;
    x = ((x-rect.left)-(canvas.width/2))/(canvas.width/2);
    y = (canvas.height/2-(y-rect.top))/(canvas.height/2);
    console.log('xy', x, y);
    
    let radR = Math.acos(x/Math.hypot(x,y));
    let radG = (Math.acos(x/Math.hypot(x,y)) - Math.PI*(2/3)) > 0 ?  Math.acos(x/Math.hypot(x,y)) - Math.PI*(2/3) : Math.PI*2 + (Math.acos(x/Math.hypot(x,y)) - Math.PI*(2/3));
    let radB = (Math.acos(x/Math.hypot(x,y)) - Math.PI*(4/3)) > 0 ? (Math.acos(x/Math.hypot(x,y)) - Math.PI*(4/3)) : Math.PI*2 + (Math.acos(x/Math.hypot(x,y)) - Math.PI*(4/3));
    let r = (radR > Math.PI) ? (radR - Math.PI)/Math.PI : (Math.PI - radR)/Math.PI;
    let g = (radG > Math.PI) ? (radG - Math.PI)/Math.PI : (Math.PI - radG)/Math.PI;
    let b = (radB > Math.PI) ? (radB - Math.PI)/Math.PI : (Math.PI - radB)/Math.PI;

    console.log('rgb', r, g, b)
    g_points.push({
        x: x,
        y: y
    });

    g_colors.push({
        r: r,
        g: g,
        b: b
    })

    gl.clear(gl.COLOR_BUFFER_BIT);


    g_points.forEach((element, index) => {
        gl.vertexAttrib3f(a_Position, element.x, element.y, 0.0);
        gl.vertexAttrib1f(a_PointSize, Math.random()*15.0);
        gl.uniform4f(u_FragColor, g_colors[index].r, g_colors[index].g, g_colors[index].b, 1.0)
        gl.drawArrays(gl.POINTS, 0, 1)
    });
}

function initShader(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
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

function loadShader(gl, type, source) {
    // debugger;

    console.log(gl, type, source);
    
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
