# Sistema PDV/ERP — Lanchonete

Sistema de gestão para lanchonete e delivery: PDV, caixa, estoque, financeiro,
fidelidade, campanhas de WhatsApp e controle de acessos.

Roda no navegador, guarda os dados no Supabase (PostgreSQL) e continua vendendo
quando a internet cai.

---

## Como publicar no GitHub Pages

1. Crie um repositório novo (pode ser público — veja *Segurança* abaixo).
2. Envie todos os arquivos desta pasta para a raiz do repositório.
3. No repositório: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
4. Em um ou dois minutos o sistema estará em
   `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

Pelo celular ou pelo notebook, abra esse endereço e use **Instalar como app**
no menu do Chrome. Ele vira ícone na tela e abre sem barra de endereço.

### Rodando sem publicar

Abrir o `index.html` direto do disco **não funciona** porque o navegador bloqueia
o carregamento dos arquivos separados (política de CORS em `file://`).
Para testar localmente, rode um servidor:

```bash
python -m http.server 8000
# depois abra http://localhost:8000
```

---

## Estrutura

```
index.html              Estrutura das telas e carregamento dos arquivos
manifest.json           Dados do app instalável
sw.js                   Service worker: faz o app abrir sem internet
assets/icons.svg        Ícones em SVG
css/
  base.css              Variáveis de cor, reset e tipografia
  layout.css            Login, sidebar, topo e grade das telas
  components.css        Botões, cards, tabelas, modais, responsivo e impressão
js/core/
  config.js             Endereço do banco e chave pública
  util.js               Atalhos, formatação de moeda e armazenamento local
  state.js              Estado compartilhado e mapa de páginas
  auth.js               Login, sessão e troca de senha
  nav.js                Menu lateral, barra inferior e troca de tela
  data.js               Carga de dados e atualização em tempo real
  sync.js               Fila offline e envio quando a internet volta
  print.js              Cupons de 80mm (cozinha e cliente)
js/views/               Uma tela por arquivo
js/main.js              Atalhos de teclado, relógio e inicialização
sql/                    Migrações do banco, para referência
```

Os arquivos JavaScript são carregados em ordem pelo `index.html` e compartilham
o mesmo escopo. É proposital: não exige compilação, empacotador nem Node.js —
você edita um arquivo, salva e recarrega a página.

---

## Contas

| Usuário | Perfil | Acessa |
|---|---|---|
| `SABORIDO` | Administrador | Tudo |
| `LANCHONETE` | Atendente | Vendas, fila, caixa, PIX, troco, estoque, cardápio e fidelidade |

O login é por **usuário**, não por e-mail. A criação de novas contas está
bloqueada por gatilho no banco de dados.

---

## Segurança

O repositório pode ser público. A chave que aparece em `js/core/config.js` é a
chave **publicável** do Supabase — feita para ficar no navegador do usuário.
Quem protege os dados é o RLS (Row Level Security), configurado no banco:

- Faturamento, custos, clientes, despesas e investimentos: só administrador.
- O atendente registra pedidos por função no banco (`registrar_pedido`) e lê a
  fila por uma visão que não expõe valores.
- O custo dos produtos fica em tabela separada, invisível para o atendente.

**Nunca coloque a `service_role key` neste projeto.** Ela ignora todas as regras
de permissão. Ela não está em nenhum arquivo aqui.

---

## Emissão de nota fiscal

A tela de documentos fiscais consulta e baixa XMLs, mas **não emite**. Emitir
NFC-e exige certificado digital A1, credenciamento na SEFAZ do estado e conta
em um integrador (Focus NFe, NFe.io e similares), que cobram mensalidade.
A estrutura no banco já está pronta para receber a integração.

---

## Impressão

Use uma impressora térmica de 80mm instalada como impressora padrão do Windows.
Para o cupom sair sem a janela de confirmação, abra o Chrome por um atalho com
a opção `--kiosk-printing`.

---

## Backup

Os dados ficam no Supabase, que faz backup automático. Ainda assim, exporte os
CSVs de vendas e clientes periodicamente — leva dez segundos e evita dor de
cabeça.
