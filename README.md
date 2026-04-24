# promobit-test

Volume Manager — Vue 3 + TypeScript (тестовое задание).

## GitHub Pages

Сайт: [https://adegeminas.github.io/promobit-test/](https://adegeminas.github.io/promobit-test/)

### Если в консоли 404 на `/src/main.ts`

Значит в Pages отдаётся **исходный** `index.html` из корня репозитория, а не результат **`npm run build`** (`dist/`).

1. Откройте репозиторий → **Settings** → **Pages**.
2. В блоке **Build and deployment** поле **Source** должно быть **GitHub Actions**, не «Deploy from a branch».
3. Убедитесь, что workflow **Deploy to GitHub Pages** на вкладке **Actions** завершился успешно (зелёная галочка).
4. Открывайте именно URL с именем репозитория: `https://adegeminas.github.io/promobit-test/` (с завершающим слэшем можно без — редирект настроит GitHub).

После первого включения Actions иногда нужно **Re-run all jobs** у последнего запуска или сделать пустой коммит.

## Локально

```bash
npm ci
npm run dev
```

Сборка (как в CI, с base для Pages):

```bash
npm run build
npx vite preview
# в браузере: http://localhost:4173/promobit-test/
```

## Тесты

```bash
npm test
```
