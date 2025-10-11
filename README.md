# room-organizer

Item management application for rooms

![GitHub top language](https://img.shields.io/github/languages/top/cccaaannn/room-organizer?color=blue&style=flat-square) ![GitHub repo size](https://img.shields.io/github/repo-size/cccaaannn/room-organizer?color=orange&style=flat-square) [![GitHub](https://img.shields.io/github/license/cccaaannn/room-organizer?color=green&style=flat-square)](https://github.com/cccaaannn/room-organizer/blob/master/LICENSE) [![Netlify Status](https://api.netlify.com/api/v1/badges/d0437d5a-1f00-4c00-8e68-3d22fba39d11/deploy-status)](https://app.netlify.com/projects/room-organizer/deploys)
---


### Running for Development
```shell
npm run dev
```

### Building
```shell
npm run build
```

### Migrations
<details>
<summary><strong>Auth</strong></summary>

```shell
npx @better-auth/cli generate --y --output src/db/auth-schema.ts
npx @better-auth/cli migrate
```
</details>

<details>
<summary><strong>Drizzle</strong></summary>

```shell
npx drizzle-kit generate
npx drizzle-kit migrate
```
</details>

---

### Used tools

<details>
<summary><strong>Tanstack</strong></summary>

1. [Create tsrouter app](https://github.com/TanStack/create-tsrouter-app)
2. [Tanstack start](https://tanstack.com/start)
3. [Tanstack form](https://tanstack.com/form)
4. [Tanstack router](https://tanstack.com/router)
5. [Tanstack query](https://tanstack.com/query)
6. [Tanstack store](https://tanstack.com/store)
</details>

<details>
<summary><strong>Styling</strong></summary>

1. [Tailwind](https://tailwindcss.com/)
2. [ShadCN](https://ui.shadcn.com/)
</details>

<details>
<summary><strong>Backend</strong></summary>

1. [Drizzle](https://orm.drizzle.team/)
2. [Trpc](https://trpc.io/)
3. [Server functions](https://tanstack.com/start/latest/docs/framework/react/server-functions)
</details>

<details>
<summary><strong>Auth</strong></summary>

1. [Better auth](https://www.better-auth.com/)
	1. Protected routes and server functions with tanstack start middlewares
	2. Protected trpc routes with trpc context
</details>

<details>
<summary><strong>Util</strong></summary>

1. [Zod](https://zod.dev/)
2. [T3Env](https://env.t3.gg/)
</details>

<details>
<summary><strong>Dev</strong></summary>

1. [Husky](https://typicode.github.io/husky)
</details>
