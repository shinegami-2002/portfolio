// WebGL shader background — flowing aurora that lives behind the projects.
// Lightweight: single full-screen quad, ~80 line fragment shader, no library.
// Falls back gracefully if WebGL is missing.

function ShaderBg({ active = 0, progress = 0, intensity = 1 }) {
  const ref = React.useRef(null);
  const stateRef = React.useRef({ active, progress, intensity });
  // Keep latest values in a ref so the RAF loop reads them without re-running effect
  React.useEffect(() => { stateRef.current = { active, progress, intensity }; });

  React.useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: true });
    if (!gl) { canvas.style.display = 'none'; return; }

    const vs = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    // Aurora-ish shader: domain-warped noise with three layered colour zones,
    // plus a subtle grain pass. Hue shifts with `u_active` so each project
    // has its own colour mood without us swapping shaders.
    const fs = `
      precision highp float;
      varying vec2 v_uv;
      uniform float u_t;
      uniform float u_active;
      uniform float u_prog;
      uniform float u_intensity;
      uniform vec2  u_res;

      // hash & value noise
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float noise(vec2 p){
        vec2 i = floor(p); vec2 f = fract(p);
        float a = hash(i), b = hash(i+vec2(1.,0.)), c = hash(i+vec2(0.,1.)), d = hash(i+vec2(1.,1.));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
      }
      float fbm(vec2 p){
        float v = 0.0; float a = 0.5;
        for(int i=0;i<5;i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }
        return v;
      }

      // Convert active index to a hue offset (warm amber → cooler bronze → rust → green-gold → indigo → pink-amber → ivory)
      vec3 palette(float t){
        // base warm amber
        vec3 a = vec3(0.83, 0.64, 0.45);
        vec3 b = vec3(0.92, 0.45, 0.20);
        vec3 c = vec3(0.45, 0.55, 0.40);
        vec3 d = vec3(0.35, 0.40, 0.65);
        vec3 e = vec3(0.85, 0.40, 0.50);
        // pick two neighbours and interpolate based on t
        float i = mod(t, 5.0);
        vec3 col;
        if(i<1.0) col = mix(a,b,i);
        else if(i<2.0) col = mix(b,c,i-1.0);
        else if(i<3.0) col = mix(c,d,i-2.0);
        else if(i<4.0) col = mix(d,e,i-3.0);
        else col = mix(e,a,i-4.0);
        return col;
      }

      void main(){
        vec2 uv = v_uv;
        float aspect = u_res.x / max(u_res.y, 1.0);
        vec2 p = uv;
        p.x *= aspect;

        // slow flowing domain warp
        float t = u_t * 0.05;
        vec2 q = vec2(fbm(p*2.0 + vec2(t*0.7, t*0.3)), fbm(p*2.0 + vec2(-t*0.4, t*0.6)));
        float n = fbm(p*3.0 + q*1.4 + vec2(t, -t*0.5));

        // soft vignette
        float vig = 1.0 - smoothstep(0.4, 1.1, distance(uv, vec2(0.5, 0.55)));

        // palette colour for this project + subtle drift towards next during transition
        vec3 colA = palette(u_active);
        vec3 colB = palette(u_active + 1.0);
        vec3 col = mix(colA, colB, smoothstep(0.7, 1.0, u_prog));

        // composite — keep it dark/atmospheric, not loud
        float bandMask = smoothstep(0.35, 0.85, n) * vig;
        vec3 outc = col * bandMask * 0.55 * u_intensity;

        // faint horizontal banding (like film light leaks)
        outc += col * 0.06 * smoothstep(0.8, 1.0, sin(uv.y * 30.0 + t*3.0) * 0.5 + 0.5);

        // very subtle grain
        float grain = (hash(uv * u_res + u_t*60.0) - 0.5) * 0.05;
        outc += grain;

        gl_FragColor = vec4(outc, 1.0);
      }
    `;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('shader error', gl.getShaderInfoLog(s));
      }
      return s;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const a_pos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(a_pos);
    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);

    const u_t = gl.getUniformLocation(prog, 'u_t');
    const u_active = gl.getUniformLocation(prog, 'u_active');
    const u_prog = gl.getUniformLocation(prog, 'u_prog');
    const u_intensity = gl.getUniformLocation(prog, 'u_intensity');
    const u_res = gl.getUniformLocation(prog, 'u_res');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth * dpr | 0;
      const h = canvas.clientHeight * dpr | 0;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const start = performance.now();
    let raf;
    const tick = (now) => {
      resize();
      const t = (now - start) / 1000;
      const s = stateRef.current;
      gl.uniform1f(u_t, t);
      gl.uniform1f(u_active, s.active);
      gl.uniform1f(u_prog, s.progress);
      gl.uniform1f(u_intensity, s.intensity);
      gl.uniform2f(u_res, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <canvas ref={ref} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
      mixBlendMode: 'screen', opacity: 0.45,
    }} />
  );
}

Object.assign(window, { ShaderBg });
