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
    //获取webGL上下文
    let gl = canvas.getContext("webgl");
    //创建着色器对象
    const shaderProgram = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    //验证着色器对象
    if(!shaderProgram) {
        console.log('shderProgram filed ', shaderProgram)
    }
    //使用着色器对象渲染
    gl.useProgram(shaderProgram);
    //指定背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //清空绘图区域
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制图形
    gl.drawArrays(gl.POINTS, 0, 1)
}



function initShader(gl, vsSource, fsSource) {
    //加载着色器对象
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShder = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    //验证是否加载成功
    if(!vertexShader || !fragmentShder) {
        return null;
    }
    //创建着色器程序
    const shaderProgram = gl.createProgram();
    if(!shaderProgram) {
        console.log('program is null')
        return null;
    }
    //为着色器程序附加着色器对象
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShder);
    //连接一个着色程序与着色器
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
    //创建着色器对象
     const shader = gl.createShader(type);
     //将源代码传给着色器对象
     gl.shaderSource(shader, source);
     //编译着色器对象
     gl.compileShader(shader);
    //验证着色器对象是否编译成功
     const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
     if(!compiled) {
         let error = gl.getShaderInfoLog(shader);
         console.log('failed to compile shader', error);
         gl.deleteShader(shader);
         return null;
     }
     return shader;
}
