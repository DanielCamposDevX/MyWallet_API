# Project Patterns

## 1) Controller request typing
- Controllers must use typed `Request` generics (or `AuthenticatedRequest`) for `params`, `body`, and `query`.
- Protected routes must use `AuthenticatedRequest` and access `request.user.id` directly.
- Validation remains centralized in `*Request` classes with Yup.

## 2) Service dependencies
- Each service should inject at most one repository.
- Cross-aggregate reads/writes needed by that service should be exposed by the injected repository interface.
- Non-repository dependencies (e.g. providers) are allowed.

## 3) Pagination response contract
- Paginated endpoints return:
```json
{
  "data": [],
  "page": 1,
  "limit": 10,
  "total": 0,
  "totalPages": 1
}
```
- Supported query params: `page`, `limit`.

## 4) TypeORM schema management
- `TYPEORM_SYNCHRONIZE=false` by default.
- Schema is versioned via migrations in `src/shared/infra/typeorm/migrations`.
- Useful scripts:
  - `npm run migration:run`
  - `npm run migration:revert`
  - `npm run migration:show`
