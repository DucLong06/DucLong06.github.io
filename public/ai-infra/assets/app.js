/* AI Infra M1 course site. No framework, no build step.
   Loaded synchronously in <head> so the language is set before first paint. */
(function () {
  'use strict';

  var GiB = 1073741824, MiB = 1048576, KiB = 1024;

  /* ---------- model shapes, copied from course/m1/calc.py (Hugging Face config.json, 2026-11-27) ---------- */
  var MODELS = {
    'Qwen3-8B': {
      kind: 'gqa', layers: 36, kvHeads: 8, headDim: 128, qHeads: 32,
      params: 8190735360, embedParams: 622329856, window: 40960
    },
    'Qwen3-30B-A3B': {
      kind: 'gqa', layers: 48, kvHeads: 4, headDim: 128, qHeads: 32,
      params: 30532122624, embedParams: 311164928, window: 40960
    },
    'DeepSeek-R1-Distill-Llama-70B': {
      kind: 'gqa', layers: 80, kvHeads: 8, headDim: 128, qHeads: 64,
      params: 70553706496, embedParams: 1050673152, window: 131072
    },
    'DeepSeek-V3': {
      kind: 'mla', layers: 61, kvLoraRank: 512, qkRopeHeadDim: 64, qHeads: 128,
      params: 671026419200, embedParams: 926679040, window: 163840
    }
  };

  /* Devices. Bandwidth is only listed where the lessons cite a source for it. */
  var DEVICES = {
    'spark-128': { label: 'DGX Spark 128 GB', bytes: 128e9, bandwidth: 273e9, budget: 0.85 },
    'spark-64': { label: 'DGX Spark 64 GB', bytes: 64e9, bandwidth: 273e9, budget: 0.85 },
    'rtx-4090': { label: 'RTX 4090 24 GB', bytes: 24 * GiB, bandwidth: 0, budget: 1 }
  };

  var WORKSPACE = 2 * GiB;          // lesson 04 assumption
  var DTYPE_BYTES = { BF16: 2, FP8: 1 };

  /* c_KV = 2 * L * n_KV * d_h * b for GQA/MHA; MLA stores the latent plus the shared RoPE key. */
  function kvBytesPerToken(m, b) {
    if (m.kind === 'mla') return m.layers * (m.kvLoraRank + m.qkRopeHeadDim) * b;
    return 2 * m.layers * m.kvHeads * m.headDim * b;
  }
  function kvBytes(m, b, tokens, batch) { return kvBytesPerToken(m, b) * tokens * batch; }
  function weightBytes(m, b) { return m.params * b; }
  /* Bytes a decode step re-reads: every weight except the embedding table (a row lookup). */
  function stepWeightBytes(m, b) { return (m.params - m.embedParams) * b; }
  /* Smallest batch whose KV read per step exceeds the weight read. */
  function kvOvertakesWeightsAt(m, b, tokens) {
    if (!tokens) return Infinity;
    return Math.ceil(stepWeightBytes(m, b) / (kvBytesPerToken(m, b) * tokens));
  }
  /* Weights and the KV cache can use different dtypes, as lesson 04 does. */
  function maxRequests(m, weightB, kvB, tokens, device) {
    var free = device.bytes * device.budget - weightBytes(m, weightB) - WORKSPACE;
    var per = kvBytesPerToken(m, kvB) * tokens;
    if (free <= 0 || per <= 0) return 0;
    return Math.floor(free / per);
  }
  function freeForKv(m, weightB, device) {
    return device.bytes * device.budget - weightBytes(m, weightB) - WORKSPACE;
  }

  /* ---------- formatting ---------- */
  /* Round half to even, so printed values match Python's format() in course/m1/calc.py
     (JS toFixed rounds 0.28125 up to 0.2813, Python prints 0.2812). */
  function fixed(x, digits) {
    var f = Math.pow(10, digits);
    var scaled = x * f;
    var r = Math.round(scaled);
    if (Math.abs(scaled % 1) === 0.5 && r % 2 !== 0) r -= 1;
    return (r / f).toFixed(digits);
  }
  function group(n) { return Math.round(n).toLocaleString('en-US'); }
  function human(n) {
    if (n >= GiB) return fixed(n / GiB, 4) + ' GiB';
    if (n >= MiB) return fixed(n / MiB, 2) + ' MiB';
    if (n >= KiB) return fixed(n / KiB, 2) + ' KiB';
    return group(n) + ' B';
  }
  function gb(n) { return fixed(n / 1e9, 2) + ' GB'; }

  var API = {
    GiB: GiB, MiB: MiB, MODELS: MODELS, DEVICES: DEVICES, DTYPE_BYTES: DTYPE_BYTES,
    WORKSPACE: WORKSPACE, kvBytesPerToken: kvBytesPerToken, kvBytes: kvBytes,
    weightBytes: weightBytes, stepWeightBytes: stepWeightBytes,
    kvOvertakesWeightsAt: kvOvertakesWeightsAt, maxRequests: maxRequests,
    freeForKv: freeForKv, fixed: fixed, human: human
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (typeof window !== 'undefined') window.M1 = API;

  if (typeof document === 'undefined') return;   // running under node for the self-check

  /* ---------- language, set before first paint ---------- */
  var LANG_KEY = 'm1-lang';
  function readLang() {
    try { var v = localStorage.getItem(LANG_KEY); if (v === 'vi' || v === 'en') return v; } catch (e) {}
    return 'vi';
  }
  function applyLang(lang) {
    var root = document.documentElement;
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-set-lang') === lang));
    }
    var title = document.querySelector('title[data-title-vi]');
    if (title) title.textContent = title.getAttribute(lang === 'en' ? 'data-title-en' : 'data-title-vi');
  }
  applyLang(readLang());

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(function () {
    applyLang(readLang());

    document.addEventListener('click', function (ev) {
      var btn = ev.target.closest ? ev.target.closest('[data-set-lang]') : null;
      if (!btn) return;
      var lang = btn.getAttribute('data-set-lang');
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
      applyLang(lang);
    });

    /* ---------- copy buttons ---------- */
    var blocks = document.querySelectorAll('.codeblock');
    for (var i = 0; i < blocks.length; i++) {
      (function (block) {
        var pre = block.querySelector('pre');
        var btn = block.querySelector('.copy');
        if (!pre || !btn) return;
        btn.addEventListener('click', function () {
          var text = pre.innerText;
          var done = function () {
            var old = btn.textContent;
            btn.textContent = 'OK';
            setTimeout(function () { btn.textContent = old; }, 1200);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, fallback);
          } else { fallback(); }
          function fallback() {
            var ta = document.createElement('textarea');
            ta.value = text; ta.setAttribute('readonly', '');
            ta.style.position = 'fixed'; ta.style.left = '-9999px';
            document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); done(); } catch (e) {}
            document.body.removeChild(ta);
          }
        });
      })(blocks[i]);
    }

    /* ---------- table of contents ---------- */
    var toc = document.getElementById('toc');
    var tocToggle = document.getElementById('toc-toggle');
    if (toc && tocToggle) {
      var narrow = function () { return window.matchMedia('(max-width: 949px)').matches; };
      var sync = function () {
        if (narrow()) { toc.hidden = tocToggle.getAttribute('aria-expanded') !== 'true'; }
        else { toc.hidden = false; }
      };
      tocToggle.setAttribute('aria-expanded', 'false');
      tocToggle.addEventListener('click', function () {
        tocToggle.setAttribute('aria-expanded', tocToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        sync();
      });
      window.addEventListener('resize', sync);
      sync();
      toc.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'A' && narrow()) { tocToggle.setAttribute('aria-expanded', 'false'); sync(); }
      });
    }
    var links = document.querySelectorAll('#toc a[href^="#"]');
    if (links.length && 'IntersectionObserver' in window) {
      var byId = {};
      for (var j = 0; j < links.length; j++) byId[links[j].getAttribute('href').slice(1)] = links[j];
      var seen = {};
      var obs = new IntersectionObserver(function (entries) {
        for (var k = 0; k < entries.length; k++) seen[entries[k].target.id] = entries[k].isIntersecting;
        var current = null;
        for (var id in byId) if (seen[id] && !current) current = id;
        var order = Object.keys(byId);
        current = null;
        for (var o = 0; o < order.length; o++) if (seen[order[o]]) { current = order[o]; break; }
        for (var id2 in byId) byId[id2].classList.toggle('active', id2 === current);
      }, { rootMargin: '-80px 0px -60% 0px' });
      for (var id3 in byId) { var el = document.getElementById(id3); if (el) obs.observe(el); }
    }

    initKvDemo();
    initAttentionDemo();
  });

  /* ---------- demo 1: KV cache grows with tokens ---------- */
  function initKvDemo() {
    var root = document.getElementById('kv-demo');
    if (!root) return;
    var $ = function (sel) { return root.querySelector(sel); };

    var modelSel = $('[data-k="model"]');
    var dtypeSel = $('[data-k="dtype"]');
    var kvDtypeSel = $('[data-k="kvdtype"]');
    var deviceSel = $('[data-k="device"]');
    var tokenIn = $('[data-k="tokens"]');
    var batchIn = $('[data-k="batch"]');
    var playBtn = $('[data-k="play"]');
    var timer = null;

    /* Slider is log-spaced so small contexts stay usable up to 131,072 tokens. */
    var STOPS = [0, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 40960, 65536, 98304, 131072];
    tokenIn.min = 0; tokenIn.max = String(STOPS.length - 1); tokenIn.step = 1;

    function render() {
      var m = MODELS[modelSel.value];
      var wb = DTYPE_BYTES[dtypeSel.value];
      var b = DTYPE_BYTES[kvDtypeSel.value];
      var dev = DEVICES[deviceSel.value];
      var tokens = STOPS[Number(tokenIn.value)];
      var batch = Number(batchIn.value);

      var per = kvBytesPerToken(m, b);
      var kv = per * tokens * batch;
      var w = weightBytes(m, wb);
      var rw = stepWeightBytes(m, wb);
      var budget = dev.bytes * dev.budget;

      $('[data-v="tokens"]').textContent = group(tokens);
      $('[data-v="batch"]').textContent = group(batch);
      $('[data-v="per"]').textContent = group(per) + ' B';
      $('[data-v="perh"]').textContent = human(per) + '/token';
      $('[data-v="kv"]').textContent = human(kv);
      $('[data-v="kvbytes"]').textContent = group(kv) + ' B';
      $('[data-v="weights"]').textContent = gb(w);
      $('[data-v="formula"]').textContent =
        (m.kind === 'mla'
          ? m.layers + ' x (' + m.kvLoraRank + ' + ' + m.qkRopeHeadDim + ') x ' + b
          : '2 x ' + m.layers + ' x ' + m.kvHeads + ' x ' + m.headDim + ' x ' + b)
        + ' x ' + group(tokens) + ' x ' + group(batch) + ' = ' + group(kv) + ' B';

      /* memory bar against the device */
      var total = dev.bytes;
      var wPct = Math.min(100, w / total * 100);
      var kPct = Math.min(100 - wPct, kv / total * 100);
      var overflow = w + kv > total;
      $('[data-v="bar-w"]').style.width = wPct + '%';
      $('[data-v="bar-k"]').style.width = kPct + '%';
      $('[data-v="bar-k"]').className = overflow ? 'over' : 'k';
      $('[data-v="device"]').textContent = dev.label;
      $('[data-v="used"]').textContent = gb(w + kv) + ' / ' + gb(total);
      $('[data-v="budget"]').textContent = dev.budget < 1
        ? gb(budget) + ' (' + dev.budget + ' x ' + gb(total) + ')'
        : gb(budget);

      var bmax = maxRequests(m, wb, b, tokens, dev);
      $('[data-v="bmax"]').textContent = tokens ? group(bmax) : '-';
      $('[data-v="free"]').textContent = gb(Math.max(0, freeForKv(m, wb, dev)));

      var bstar = tokens ? Math.ceil(rw / (per * tokens)) : Infinity;
      $('[data-v="bstar"]').textContent = isFinite(bstar) ? group(bstar) : '-';
      var crossed = isFinite(bstar) && batch >= bstar;
      $('[data-v="cross"]').setAttribute('data-state', crossed ? 'yes' : 'no');

      /* decode step floor, only where the lesson cites a bandwidth */
      var floorRow = $('[data-v="floor-row"]');
      if (dev.bandwidth) {
        var t = (rw + kv) / dev.bandwidth;
        floorRow.hidden = false;
        $('[data-v="floor"]').textContent = (t * 1000).toFixed(1) + ' ms';
        $('[data-v="tps"]').textContent = (batch / t).toFixed(1) + ' tok/s';
      } else {
        floorRow.hidden = true;
      }

      /* stacked cells: one cell per 4,096 tokens of the whole batch, capped */
      var stack = $('[data-v="stack"]');
      var CELL = 4096, MAXCELLS = 192;
      var cells = Math.min(MAXCELLS, Math.ceil(tokens * batch / CELL));
      var html = '';
      for (var i = 0; i < cells; i++) html += '<i></i>';
      for (var p = cells; p < 48; p++) html += '<i class="pad"></i>';
      stack.innerHTML = html;
      stack.setAttribute('aria-label', group(tokens * batch) + ' tokens, ' + human(kv));

      var warn = $('[data-v="window"]');
      warn.hidden = tokens <= m.window;
      var wv = root.querySelectorAll('[data-v="windowval"]');
      for (var w = 0; w < wv.length; w++) wv[w].textContent = group(m.window);
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      playBtn.setAttribute('aria-pressed', 'false');
      playBtn.setAttribute('data-playing', 'false');
    }
    playBtn.addEventListener('click', function () {
      if (timer) { stop(); return; }
      playBtn.setAttribute('aria-pressed', 'true');
      playBtn.setAttribute('data-playing', 'true');
      timer = setInterval(function () {
        var v = Number(tokenIn.value);
        if (v >= STOPS.length - 1) { stop(); return; }
        tokenIn.value = String(v + 1);
        render();
      }, 700);
    });

    [modelSel, dtypeSel, kvDtypeSel, deviceSel, tokenIn, batchIn].forEach(function (el) {
      el.addEventListener('input', function () { if (el !== tokenIn) stop(); render(); });
    });
    render();
  }

  /* ---------- demo 2: GQA vs MHA vs MQA vs MLA ---------- */
  function initAttentionDemo() {
    var root = document.getElementById('attn-demo');
    if (!root) return;

    var q8 = MODELS['Qwen3-8B'], dsv3 = MODELS['DeepSeek-V3'];
    var VARIANTS = {
      MHA: { kvSets: q8.qHeads, qHeads: q8.qHeads, bytes: 2 * q8.layers * q8.qHeads * q8.headDim * 2, basis: 'Qwen3-8B' },
      GQA: { kvSets: q8.kvHeads, qHeads: q8.qHeads, bytes: 2 * q8.layers * q8.kvHeads * q8.headDim * 2, basis: 'Qwen3-8B' },
      MQA: { kvSets: 1, qHeads: q8.qHeads, bytes: 2 * q8.layers * 1 * q8.headDim * 2, basis: 'Qwen3-8B' },
      MLA: { kvSets: 0, qHeads: dsv3.qHeads, bytes: kvBytesPerToken(dsv3, 2), basis: 'DeepSeek-V3',
             expanded: dsv3.layers * dsv3.qHeads * (128 + 64 + 128) * 2 }
    };
    var CONTEXT = 8192;
    var order = ['MHA', 'GQA', 'MQA', 'MLA'];
    var current = 'GQA';

    var cols = root.querySelector('[data-v="cols"]');
    var tabs = root.querySelectorAll('[data-variant]');
    var maxBytes = VARIANTS.MHA.bytes;

    function render() {
      var html = '';
      order.forEach(function (name) {
        var v = VARIANTS[name];
        var heads = '';
        for (var i = 0; i < v.qHeads; i++) heads += '<i></i>';
        var sets = '';
        if (name === 'MLA') {
          sets = '<i class="latent"></i>';
        } else {
          for (var j = 0; j < v.kvSets; j++) sets += '<i></i>';
        }
        var share = name === 'MLA'
          ? 'latent 512 + RoPE 64'
          : (v.qHeads / v.kvSets) + ' Q / 1 KV';
        html += '<div class="col' + (name === current ? ' on' : '') + '">'
          + '<h4>' + name + '</h4>'
          + '<div class="heads" aria-hidden="true">' + heads + '</div>'
          + '<p class="sub">' + v.qHeads + ' query heads</p>'
          + '<div class="kvsets" aria-hidden="true">' + sets + '</div>'
          + '<p class="sub">' + share + '</p>'
          + '<p class="bytes">' + group(v.bytes) + ' B/token</p>'
          + '<p class="sub">' + human(v.bytes) + '/token · ' + CONTEXT.toLocaleString('en-US') + ' tokens: ' + human(v.bytes * CONTEXT) + '</p>'
          + '<p class="sub">' + v.basis + '</p>'
          + '<div class="meter"><div class="track"><span class="k" style="width:'
          + (v.bytes / maxBytes * 100).toFixed(2) + '%"></span></div></div>'
          + '</div>';
      });
      cols.innerHTML = html;
      for (var t = 0; t < tabs.length; t++) {
        tabs[t].setAttribute('aria-pressed', String(tabs[t].getAttribute('data-variant') === current));
      }
      var v2 = VARIANTS[current];
      root.querySelector('[data-v="detail-name"]').textContent = current;
      root.querySelector('[data-v="detail-bytes"]').textContent = group(v2.bytes) + ' B/token (' + human(v2.bytes) + ')';
      root.querySelector('[data-v="detail-ctx"]').textContent = human(v2.bytes * CONTEXT);
      var exp = root.querySelector('[data-v="detail-expanded"]');
      exp.hidden = current !== 'MLA';
      if (current === 'MLA') {
        root.querySelector('[data-v="expanded-bytes"]').textContent = group(v2.expanded) + ' B/token';
        root.querySelector('[data-v="expanded-ratio"]').textContent = 'x' + (v2.expanded / v2.bytes).toFixed(1);
        root.querySelector('[data-v="expanded-ctx"]').textContent = human(v2.expanded * CONTEXT);
      }
      var vsg = root.querySelector('[data-v="vs-gqa"]');
      vsg.textContent = current === 'GQA' ? '1.0' : (VARIANTS.GQA.bytes / v2.bytes).toFixed(2);
    }

    for (var t = 0; t < tabs.length; t++) {
      tabs[t].addEventListener('click', function (ev) {
        current = ev.currentTarget.getAttribute('data-variant');
        render();
      });
    }
    render();
  }
})();
