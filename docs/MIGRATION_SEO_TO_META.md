# Restore Meta Title & Meta Description from legacy `seo` object

After the schema change to top-level **Meta Title** and **Meta Description**, existing content stayed in the old `seo` object. To make that content visible again in the Studio:

1. **Preview (optional)**  
   From the project root:
   ```bash
   npm run migrate:seo-to-meta:dry
   ```
   This only logs what would be updated.

2. **Run the migration**  
   From the project root:
   ```bash
   npm run migrate:seo-to-meta
   ```
   You may be prompted to log in to Sanity. The script copies `seo.metaTitle` → `metaTitle` and `seo.metaDescription` → `metaDescription` for every blog post that has `seo` data and empty top-level fields.

3. **Dataset**  
   The script uses the dataset in `sanity.cli.ts` (default: **production**). To run on **dev**, temporarily set `dataset: 'dev'` in `sanity.cli.ts`, run the migration, then change it back if needed.

After the migration, refresh the document in the Studio; Meta Title and Meta Description should show the previous values.
