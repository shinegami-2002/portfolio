import { useEffect, useRef } from "react";
import { subscribeSignal } from "../lib/scrollBus";
import { reducedMotion } from "../lib/springs";

const FS = `
precision mediump float;
uniform float u_t; uniform float u_amp; uniform vec2 u_res; uniform vec3 u_tint;
float wave(vec2 uv, float phase, float freq, float amp){
  float y = 0.5 + sin(uv.x*freq + phase)*amp*0.18;
  return smoothstep(0.014, 0.0, abs(uv.y - y));
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float a = clamp(u_amp, 0.07, 1.0);
  float s = wave(uv, u_t*1.7, 9.0, a) + wave(uv, -u_t*1.1+2.0, 14.0, a*0.6)*0.5;
  float scan = 0.05*sin(gl_FragCoord.y*3.14159*0.5);
  vec3 c = u_tint*(s + scan*a);
  gl_FragColor = vec4(c, (s*0.85 + 0.03)* a);
}`;

const VS = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

/** The oscilloscope behind everything — measures the visitor, energizes on activity,
 *  and retunes its color to the active channel. */
export function SignalLayer() {
  const ref = useRef<HTMLCanvasElement>(null);
  const tintRef = useRef<[number, number, number]>([0.24, 0.94, 0.69]);
  const targetTint = useRef<[number, number, number]>([0.24, 0.94, 0.69]);

  useEffect(() => {
    const readTint = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--signal").trim();
      if (/^#[0-9a-f]{6}$/i.test(v)) targetTint.current = hexToRgb(v);
    };
    readTint();
    const mo = new MutationObserver(readTint);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-ch", "data-theme"] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion()) return;
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uT = gl.getUniformLocation(prog, "u_t");
    const uAmp = gl.getUniformLocation(prog, "u_amp");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTint = gl.getUniformLocation(prog, "u_tint");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = (canvas.clientWidth * dpr) | 0;
      const h = (canvas.clientHeight * dpr) | 0;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let amp = 0.1;
    const unsub = subscribeSignal(({ velocity, pulse }) => {
      amp = Math.min(1, 0.1 + velocity * 1.6 + pulse);
    });

    // the scope earns its keep in the hero: prominent at the top, ambient below
    const heroBoost = (): number => {
      const heroK = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.9));
      const paper = document.documentElement.dataset.theme === "paper";
      const base = paper ? 0.06 : 0.09;
      const boost = paper ? 0.1 : 0.17;
      canvas.style.opacity = (base + heroK * boost).toFixed(3);
      return heroK;
    };

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (!document.hidden) {
        resize();
        const heroK = heroBoost();
        // lerp the tint toward the active channel color
        const t = tintRef.current;
        const g2 = targetTint.current;
        for (let i = 0; i < 3; i++) t[i] += (g2[i] - t[i]) * 0.06;
        gl.uniform1f(uT, (now - start) / 1000);
        gl.uniform1f(uAmp, Math.min(1, amp + heroK * 0.3));
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform3f(uTint, t[0], t[1], t[2]);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      unsub();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  if (reducedMotion()) return null;
  return <canvas ref={ref} className="signal-layer" aria-hidden="true" />;
}
