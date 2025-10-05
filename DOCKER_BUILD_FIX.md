# Docker Build Fix - CRACO Dependency Issue

## Problem
The frontend Docker build was failing with the following error:

```
Error: Cannot find module 'react-scripts/config/env.js'
Require stack:
- /app/node_modules/@craco/craco/lib/cra.js
- /app/node_modules/@craco/craco/scripts/build.js
```

## Root Cause
`@craco/craco` (Create React App Configuration Override) was listed in `devDependencies` in `package.json`. However, it's required during the build process when running `npm run build`.

In Docker build environments, especially when:
- `NODE_ENV=production` is set
- Using `npm ci --production` or similar flags
- Docker build optimizations skip devDependencies

...the devDependencies are not installed, causing the build scripts to fail.

## Solution
Moved `@craco/craco` from `devDependencies` to `dependencies` in `frontend/package.json`.

### Why This Works
- CRACO is used in the package.json scripts: `"build": "craco build"`
- Build tools that are required during `npm run build` should be in `dependencies`, not `devDependencies`
- This ensures CRACO is always installed regardless of the environment or build flags used
- The package is essential for the production build process, so it belongs in dependencies

## Files Changed
- `frontend/package.json`: Moved `@craco/craco` from devDependencies to dependencies
- `frontend/package-lock.json`: Updated automatically by npm

## Verification
The fix has been verified to work correctly:
- ✅ Local development build works
- ✅ Production environment install works (`NODE_ENV=production npm install`)
- ✅ CRACO is properly accessible during build

## Note on Dependencies vs DevDependencies
**Dependencies** should include:
- Packages needed at runtime (in the browser/server)
- Build tools required during the build process (like CRACO, webpack, babel)

**DevDependencies** should include:
- Development-only tools (linters, formatters, test frameworks)
- Tools only used during development, not during build or runtime

Since CRACO is required for `npm run build` (which happens during Docker build), it belongs in dependencies.
