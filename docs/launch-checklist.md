# Checklist de launch — baltz.dev v2

> Executar somente no P9, após aceite do gate e autorização explícita do Baltz.
> Nenhum item deste documento autoriza deploy ou mudança de domínio.

## Candidato local

- [x] Riscos P8 aceitos explicitamente.
- [x] Hosting real e produção atual identificados em modo leitura.
- [x] `gh-pages` legado removido; audit de produção zerado.
- [x] `vercel.json` constrói `@baltz/site-v2` e publica só `v2/dist`.
- [x] Build local Vercel, artifact check, seis Lighthouse e smoke passaram.
- [x] Saída Vercel local idêntica a `v2/dist`.
- [x] Nenhuma alteração remota de produção, domínio ou DNS realizada.

## Antes da janela

- [ ] Registrar data, horário, responsável e canal de decisão.
- [ ] Registrar commit SHA da produção atual e da v2 aprovada.
- [x] Capturar projeto Vercel, deployment atual, domínios e DNS.
- [ ] Arquivar URL/ID e evidência do deployment atualmente publicado.
- [ ] Criar e validar Preview a partir do SHA candidato autorizado.
- [ ] Ensaiar rollback para o deployment atual sem alterar produção.
- [ ] Resolver o conflito entre canonical apex e redirect atual para `www`.
- [ ] Repetir audit, quality checks e smoke no Preview exato.
- [ ] Congelar mudanças criativas até o fim da janela.

## Autorização

- [x] Gate P8 verde ou riscos aceitos por escrito.
- [ ] Baltz aprovou SHA, Preview, domínio, janela e publicação.
- [ ] Baltz aprovou qualquer mudança de redirect/domínio.
- [ ] Critérios de abortar/rollback foram lidos antes do deploy.

## Deploy e smoke imediato

- [ ] Promover/mesclar uma única vez o SHA aprovado pelo mecanismo autorizado.
- [ ] Confirmar que os aliases apontam para o deployment aprovado.
- [ ] Confirmar DNS e certificado TLS válidos.
- [ ] Confirmar `www` → apex sem loop e canonical `https://baltz.dev/`.
- [ ] Confirmar HTTP 200 na home e HTTP 404 em rota inexistente.
- [ ] Confirmar assets locais, fontes, portrait, Caipora, smile e shader.
- [ ] Confirmar navegação, âncoras e 17 links em desktop/mobile.
- [ ] Confirmar keyboard focus e reduced motion.
- [ ] Confirmar canonical, robots, sitemap, JSON-LD e OG/Twitter no HTML final.
- [ ] Validar `og.png` pelo crawler/social debugger disponível.
- [ ] Confirmar zero erro inesperado de console e request.
- [ ] Confirmar fallback de Clouds quando a capa remota é bloqueada.

## Observação inicial

- [ ] Repetir smoke após 15 e 60 minutos.
- [ ] Registrar Lighthouse de produção sem confundir laboratório com campo.
- [ ] Registrar qualquer erro, impacto, decisão e correção.
- [ ] Iniciar P10 somente depois de produção estável.

## Critérios de abortar ou reverter

- home indisponível, vazia ou sem navegação;
- DNS/TLS ou alias apontando para deployment diferente do SHA aprovado;
- redirect em loop ou canonical divergente do domínio primário;
- regressão crítica de teclado, reduced motion ou leitura;
- assets essenciais ausentes sem fallback;
- erro persistente que impeça hero → conteúdo → links.
