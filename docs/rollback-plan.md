# Plano de rollback — baltz.dev v2

> Preparado para a hospedagem Vercel observada. Não executar sem autorização e
> não reescrever histórico Git.

## Estado capturado antes do launch

| Dado | Valor observado em 15 jul. 2026 |
|---|---|
| Projeto | `rvnn/baltazarparra-github-io` |
| Commit em produção | `491571cc6cf3aa92a00f182379c4233a741b18bb` |
| Deployment conhecido como bom | `dpl_CbxAZtuZCjHXj4kGqZwLUykPpm2D` |
| URL imutável observada | `baltazarparra-github-7hp35vzvn-rvnn.vercel.app` |
| SHA da v2 aprovada | pendente |
| Branch de produção | `main` |
| DNS apex | `A 76.76.21.21` |
| DNS `www` | `CNAME cname.vercel-dns.com` |
| Estado de domínio | apex redireciona 308 para `www`; mudança pendente |
| Responsável pela decisão | Baltz |
| Janela de launch | pendente |

## Estratégia

O rollback preferido é recolocar os aliases de produção no deployment imutável
conhecido como bom, sem reconstruir a versão antiga e sem alterar branches. O
deployment e seu conteúdo precisam ser validados/arquivados antes do launch.

Se a janela também inverter o redirect entre apex e `www`, o rollback deve
restaurar exatamente a configuração de domínio capturada acima. Os registros
DNS não devem mudar para uma simples promoção de deployment; qualquer alteração
DNS adicional exige snapshot de valores e TTL na própria janela.

## Procedimento

1. declarar o critério que disparou o rollback e congelar novos deploys;
2. registrar horário, sintomas, URL e SHA publicado;
3. usar o rollback/promote da Vercel para apontar produção ao deployment
   `dpl_CbxAZtuZCjHXj4kGqZwLUykPpm2D` previamente validado;
4. se o redirect de domínio mudou, restaurar apex → `www` e confirmar ausência
   de loop;
5. verificar home 200, rota inexistente 404, TLS, assets e navegação;
6. confirmar canonical/robots da versão restaurada e registrar a divergência
   conhecida do site legado, se continuar existindo;
7. registrar tempo de recuperação e evidência do smoke;
8. só tentar novo launch após causa identificada, correção validada e nova
   autorização do Baltz.

## Validação do rollback

- [x] ID, URL e SHA do deployment anterior foram capturados em modo leitura.
- [ ] Deployment anterior foi aberto e validado imediatamente antes da janela.
- [ ] Rollback foi ensaiado em Preview ou por dry-run sem mover aliases.
- [ ] Permissão e autoridade para rollback foram confirmadas.
- [ ] Redirect/domínios foram capturados novamente na janela.
- [ ] Smoke de restauração está pronto.
- [x] Não há mudança destrutiva de histórico.

## Limites

O plano não foi executado. A Vercel e os domínios não foram alterados, e o SHA
da v2 ainda depende do commit candidato. O rollback só fica operacionalmente
aprovado depois do ensaio e da autorização da janela.
