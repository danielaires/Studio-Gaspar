# Publicação do Studio Gaspar

O projeto está preparado para publicar o frontend no Vercel e a API no Railway, usando um banco MySQL provisionado no Railway.

## Variáveis de ambiente

### API (serviço criado a partir da pasta `studio-gaspar`)

- `DB_URL`: URL JDBC do MySQL, por exemplo `jdbc:mysql://host:3306/studio_gaspar?useSSL=true&allowPublicKeyRetrieval=true`
- `DB_USERNAME`: usuário do banco
- `DB_PASSWORD`: senha do banco
- `JWT_SECRET`: segredo aleatório com no mínimo 32 caracteres
- `FRONTEND_URL`: URL pública do Vercel, por exemplo `https://studio-gaspar.vercel.app`
- `EVOLUTION_URL`, `EVOLUTION_APIKEY` e `EVOLUTION_INSTANCE`: necessários somente para o envio por WhatsApp

O `PORT` é configurado automaticamente pela plataforma.

### Frontend (Vercel)

- `VITE_API_URL`: URL pública da API no Railway, sem barra final, por exemplo `https://studio-gaspar-api.up.railway.app`

## Ordem de publicação

1. No Railway, crie um projeto, adicione um banco MySQL e crie um serviço a partir deste repositório, usando `studio-gaspar` como diretório raiz. O `Dockerfile` já está incluído.
2. Cadastre as variáveis da API e faça o deploy. Copie a URL pública gerada.
3. No Vercel, importe este repositório com a raiz do projeto. Defina `VITE_API_URL` com a URL da API e publique.
4. Atualize `FRONTEND_URL` na API com a URL do Vercel e faça novo deploy da API.

Após isso, acesse a URL do Vercel. O CORS e as URLs da API deixam de depender de `localhost`.
