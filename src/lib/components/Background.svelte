<script lang="ts">
import { onDestroy, onMount } from "svelte";
    import { uiState } from "../state/uiState.svelte";

const {
    width,
    height,
}: {
    width: number,
    height: number,
} = $props();

let canvasEl = $state<HTMLCanvasElement | null>(null);
let gl = <WebGL2RenderingContext | null>null;
let animationFrame = <number | null>null;
let resolutionUnif = <WebGLUniformLocation | null>null;

onMount(() => {
    const TIMESCALE = 0.25;

    const vertexShaderSource = `#version 300 es
in vec4 a_pos;

out vec2 v_texcoord;
out vec2 v_texcoordCtr;

void main() {
    gl_Position = a_pos;

    // Map [-1, 1] to [0, 1]
    v_texcoord = (a_pos.xy + 1.0) / 2.0;
    v_texcoordCtr = a_pos.xy;
}`;

    const fragmentShaderSource = `#version 300 es

precision mediump float;

#define PI 3.1415926535

uniform float time;
uniform vec2 resolution;

in vec2 v_texcoord;
in vec2 v_texcoordCtr;

out vec4 fragColor;

const float N_GRID_REPEATS_LG = 6.;
// const float N_GRID_REPEATS_SM = 64.;

const float HSQRT2 = sqrt(2.) / 2.;

float polyInOut(float t, float power) {
    return t < 0.5
        ? pow(2. * t, power) / 2.
        : 1. - pow(2. * (1. - t), power) / 2.;
}

vec2 rot(vec2 uv, float angle) {
    return vec2(
        cos(angle) * uv.x + sin(angle) * uv.y,
        -sin(angle) * uv.x + cos(angle) * uv.y
    );
}

int getPhase(float adjustedTime) {
    return int(mod(adjustedTime, 8.));
}


vec3 frontColor(vec2 uvTile, bool isEven, vec2 uvCtr) {
    float threshold;
    int direction;
    bool isFront;

    float adjustedTime = time - pow(dot(uvCtr, uvCtr), 1.25) * 0.5;
    int phase = getPhase(adjustedTime);


    if (phase % 2 == 0) {
        float angle = polyInOut(mod(adjustedTime, 1.), 2.25) * PI / 2. * (isEven ? 1. : -1.) - PI / 2. * float(phase / 2);
        uvTile = rot(uvTile - vec2(0.5, 0.5), angle) + vec2(0.5, 0.5);
        threshold = 0.5;
        direction = 0;
    } else {
        threshold = polyInOut(mod(adjustedTime, 1.), 2.25);
        threshold -= 0.5;
        threshold = mod(threshold, 1.);
        direction = 3 - phase / 2;
    }

    if (direction == 0) {
        uvTile.x = 1. - uvTile.x;
    } else if (direction == 1) {
        uvTile.x = 1. - uvTile.x;
        uvTile.y = 1. - uvTile.y;
    } else if (direction == 2) {
        uvTile.x = 1. - uvTile.x;
        threshold = 1. - threshold;
    } else if (direction == 3) {
        uvTile.x = 1. - uvTile.x;
        uvTile.y = 1. - uvTile.y;
        threshold = 1. - threshold;
    }


    isFront = (uvTile.x < threshold && uvTile.y >= threshold)
        || (uvTile.x >= threshold && uvTile.y < threshold);

    if (!isFront) {
        return isEven
            ? mix(vec3(0.85, 0.9, 0.82), vec3(0.93, 0.93, 0.82), sin(length(uvCtr) + time))
            : vec3(0.9375, 0.9375, 0.9375);
    }

    return vec3(1., 1., 1.);
}

// bool isBackTile(vec2 uvTile, bool isEven) {
//     return isEven;
// }

void main(void)
{
    vec2 uv = v_texcoord;
    vec2 uvCtr = v_texcoordCtr;
    
    // scale by aspect ratio
    if (resolution.x > resolution.y) {
        uv.y *= resolution.y / resolution.x;
        uvCtr.y *= resolution.y / resolution.x;
    } else {
        uv.x *= resolution.x / resolution.y;
        uvCtr.x *= resolution.x / resolution.y;
    }


    vec2 uvWarped = uv;

    // radial scale
    uvWarped += uvCtr / (pow(length(uvCtr), 1.25) + 0.5) * (cos(atan(uvCtr.y, uvCtr.x) * 6. + time * 0.125) * 0.125 + 1.);

    // rotation
    uvWarped = rot(uvWarped, time * 0.0625);

    // waviness
    uvWarped += vec2(
        sin(time * 2. + uvWarped.y * 4.),
        cos(time * 2. + uvWarped.x * 4.)
    ) * 0.0625;


    // quantize into squares
    vec2 largeGrid = floor(uvWarped * N_GRID_REPEATS_LG / 2.);
    float largeGridEvenOdd = mod(largeGrid.x + largeGrid.y, 2.);
    vec2 uvLargeTile = vec2(
        mod(uvWarped.x * N_GRID_REPEATS_LG / 2., 1.),
        mod(uvWarped.y * N_GRID_REPEATS_LG / 2., 1.)
    );

    // vec2 smallGrid = floor(uv * N_GRID_REPEATS_SM / 2.);
    // float smallGridEvenOdd = mod(smallGrid.x + smallGrid.y, 2.);
    // vec2 uvSmallTile = vec2(
    //     mod(uvWarped.x * N_GRID_REPEATS_SM / 2., 1.),
    //     mod(uvWarped.y * N_GRID_REPEATS_SM / 2., 1.)
    // );


    vec3 color = frontColor(uvLargeTile, largeGridEvenOdd == 0., uvCtr);
    // bool back = isBackTile(uvSmallTile, smallGridEvenOdd == 0.);




    fragColor = vec4(color, 1.);
    return;
}`;


    gl = canvasEl!.getContext("webgl2")!;


    //#region Shader setup

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const glProgram = gl.createProgram();
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);

    gl.useProgram(glProgram);

    //#endregion


    //#region Setting attributes

    const vertCoords = new Float32Array([
        // Coordinates of the triangles that cover the canvas
        -1, -1,
        -1, 1,
        1, -1,

        -1, 1,
        1, -1,
        1, 1,
    ]);

    const COORD_DIMENSION = 2;
    const nVerts = vertCoords.length / COORD_DIMENSION;

    const vertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertCoords, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(glProgram, "a_pos");
    gl.vertexAttribPointer(posAttr, COORD_DIMENSION, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttr);

    //#endregion


    //#region Setting uniforms

    resolutionUnif = gl.getUniformLocation(glProgram, "resolution");
    gl.uniform2fv(resolutionUnif, [canvasEl!.width, canvasEl!.height]);


    const timeUnif = gl.getUniformLocation(glProgram, "time");
    gl.uniform1f(timeUnif, 0);


    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    // const textureImg = new Image();
    // textureImg.addEventListener("load", () => {
    //     if (gl === null) return;

    //     gl.bindTexture(gl.TEXTURE_2D, texture);
    //     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImg);
    // }, {once: true});
    // textureImg.src = textureUrl;

    // const textureUnif = gl.getUniformLocation(glProgram, "texture");
    // gl.uniform1i(textureUnif, 0);

    //#endregion

    resizeCanvasAndViewport();


    const draw = (now: number) => {
        gl!.uniform1f(timeUnif, now / 1000 * TIMESCALE);

        gl!.drawArrays(gl!.TRIANGLES, 0, nVerts);
        animationFrame = requestAnimationFrame(draw);
    };
    animationFrame = requestAnimationFrame(draw);
});


const resizeCanvasAndViewport = () => {
    // Scale up here (by `devicePixelRatio`) and scale down in CSS to appear sharp on high-DPI displays
    // Canvas is downsized to 100vw and 100vh in CSS
    const scaledWidth = width * devicePixelRatio;
    const scaledHeight = height * devicePixelRatio;

    canvasEl!.width = scaledWidth;
    canvasEl!.height = scaledHeight;

    gl!.uniform2fv(resolutionUnif, [scaledWidth, scaledHeight]);
    gl!.viewport(0, 0, scaledWidth, scaledHeight);
};

$effect(resizeCanvasAndViewport);

onDestroy(() => {
    if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
    }
});
</script>


<canvas-container>
    <canvas
        bind:this={canvasEl}
        class:paused={uiState().paused}
    ></canvas>
</canvas-container>


<style lang="scss">
canvas-container {
    display: grid;
    place-items: stretch;
    overflow: hidden;
}

canvas {
    width: 100%;
    height: 100%;
    mask: radial-gradient(circle, #0000000f, #0000007f 80%, #000);
    animation: shrink-in 7s cubic-bezier(0.075, 0.82, 0.165, 1);
    pointer-events: none;

    transition: opacity 0.25s ease-in-out;

    @keyframes shrink-in {
        0% {
            transform: scale(1.5);
            opacity: 0;
        }
    }

    &.paused {
        opacity: 0.5;
    }
}
</style>