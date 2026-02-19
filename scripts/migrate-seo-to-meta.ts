/**
 * Migrate blogPost documents: copy seo.metaTitle → metaTitle, seo.metaDescription → metaDescription.
 * Patches both published and draft documents so content appears in Studio immediately.
 * Run from project root:
 *   npx sanity exec scripts/migrate-seo-to-meta.ts --with-user-token
 * Optional: -- --dry-run to only log what would be patched.
 */

import {getCliClient} from 'sanity/cli'

const dryRun = process.argv.includes('--dry-run')

const QUERY = `*[_type == "blogPost" && defined(seo)]{ _id, _rev, metaTitle, metaDescription, "seoTitle": seo.metaTitle, "seoDescription": seo.metaDescription }`

async function main() {
  const client = getCliClient()
  const dataset = client.config().dataset || 'production'

  console.log(`[migrate-seo-to-meta] dataset: ${dataset}, dryRun: ${dryRun}`)

  // Fetch both published and drafts (raw perspective returns all)
  const docs = await client.fetch(QUERY, {}, {perspective: 'raw'})

  if (docs.length === 0) {
    console.log('[migrate-seo-to-meta] No blogPost documents with seo object found.')
    return
  }

  console.log(`[migrate-seo-to-meta] Found ${docs.length} document(s) with seo.`)

  for (const doc of docs) {
    const patches: Record<string, unknown> = {}
    if (doc.seoTitle && !doc.metaTitle) patches.metaTitle = doc.seoTitle
    if (doc.seoDescription && !doc.metaDescription) patches.metaDescription = doc.seoDescription

    if (Object.keys(patches).length === 0) {
      console.log(`[migrate-seo-to-meta] Skip ${doc._id}: nothing to copy`)
      continue
    }

    if (dryRun) {
      console.log(`[migrate-seo-to-meta] Would patch ${doc._id}:`, patches)
      continue
    }

    await client.patch(doc._id).set(patches).commit()
    console.log(`[migrate-seo-to-meta] Patched ${doc._id}:`, Object.keys(patches))
  }

  console.log('[migrate-seo-to-meta] Done.')
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
