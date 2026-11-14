# Security

## Reporting vulnerabilities

If you find a security issue in this repository, please report it privately rather than opening a public issue:

- Email: **mrizkyhaksono@gmail.com**
- Include steps to reproduce, impact, and any suggested fix if you have one.

We aim to acknowledge reports within a few business days and will coordinate disclosure once a fix is available.

## Secrets and environment variables

- Never commit `.env`, `.env.local`, or other files that contain real credentials.
- Server-only values (for example `SUPABASE_SERVICE_ROLE_KEY`, `INTERNAL_PROXY_SECRET`, `UMAMI_PASSWORD`) must not use the `NEXT_PUBLIC_` prefix.
- Copy `.env.example` to `.env.local` for local development and set placeholders only in the example file.

## Supported versions

Security fixes are applied on the `main` branch and released with the next site deployment. Older tagged releases are not maintained separately.
