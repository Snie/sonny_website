# TODOs

- [ ] [typescript-eslint](https://typescript-eslint.io/) is yet not compatible with the latest typescript version 6. As soon as it works,
  add it to complement what Biome can't check if any, and compare them to find the best linting+formating setup
- [ ] [wrksz fixes some errors with nextjs 16](https://www.wrksz.dev/blog/wrksz-themes). Keep under control `next-themes` to see when Next.js 16 and React 19
  will be supported
- [ ] **COEP potential breakage in prod:** `Cross-Origin-Embedder-Policy: require-corp` was added in `next.config.ts`.
  If cross-origin resources (images, fonts, media) are blocked in production, either add `crossOrigin="anonymous"` to
  the affected elements or relax the policy to `credentialless` in `next.config.ts`.
