/* sw.js — cache do app para abrir sem internet */
const CACHE = "pdv-v1";
const ARQUIVOS = [
  "./",
  "index.html",
  "manifest.json",
  "assets/icons.svg",
  "css/base.css",
  "css/layout.css",
  "css/components.css",
  "js/core/config.js",
  "js/core/util.js",
  "js/core/state.js",
  "js/core/auth.js",
  "js/core/nav.js",
  "js/core/data.js",
  "js/core/sync.js",
  "js/core/print.js",
  "js/views/vendas.js",
  "js/views/fila.js",
  "js/views/caixa.js",
  "js/views/pix.js",
  "js/views/troco.js",
  "js/views/clientes.js",
  "js/views/produtos.js",
  "js/views/financeiro.js",
  "js/views/despesas.js",
  "js/views/insumos.js",
  "js/views/fornecedores.js",
  "js/views/precificacao.js",
  "js/views/maquininhas.js",
  "js/views/equipe.js",
  "js/views/investimentos.js",
  "js/views/fidelidade.js",
  "js/views/cardapio.js",
  "js/views/promocoes.js",
  "js/views/whatsapp.js",
  "js/views/fiscal.js",
  "js/views/config.js",
  "js/main.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;               // banco e CDN sempre pela rede
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copia = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia));
      return res;
    }).catch(() => caches.match("index.html")))
  );
});
