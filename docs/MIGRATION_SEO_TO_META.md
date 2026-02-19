# Restore Meta Title & Meta Description from legacy `seo` object

Existing blog content is still in the old `seo` object. To show it in the **Meta Title** and **Meta Description** fields, do these two steps once.

## 1. Deploy the schema

From the project root:

```bash
npx sanity schema deploy
```

Select the project/dataset you use (e.g. **production**). This makes the API accept the new `metaTitle` and `metaDescription` fields.

## 2. Run the migration

From the project root:

```bash
npm run migrate:seo-to-meta
```

You may be prompted to log in. The script copies `seo.metaTitle` → `metaTitle` and `seo.metaDescription` → `metaDescription` for every blog post that has that data. It updates both published and draft documents.

## After that

Refresh any open blog post in Studio. Meta Title and Meta Description will show the previous values.

**Optional:** To see what would be updated without changing anything, run:

```bash
npm run migrate:seo-to-meta:dry
```

**Different dataset (e.g. dev):** Set `dataset: 'dev'` in `sanity.cli.ts`, run the migration, then change it back if needed.
