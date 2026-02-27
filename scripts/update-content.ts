/**
 * Script to update content using a GROQ query and Sanity client patches.
 * Run with: npx sanity exec scripts/update-content.ts
 *
 * Uses projectId and dataset from sanity.cli.ts.
 */

import {getCliClient} from 'sanity/cli'

const client = getCliClient().withConfig({apiVersion: '2024-01-01'})

// GROQ query: fetch the documents you want to update
const QUERY = `*[_type == "blogPost"]{ _id, _rev, title, "slug": slug.current }`

async function main() {
  const dataset = client.config().dataset
  console.log(`Dataset: ${dataset}`)
  console.log('Fetching documents...\n')

  const docs = await client.fetch(QUERY)

  if (!docs?.length) {
    console.log('No documents found.')
    return
  }

  console.log(`Found ${docs.length} document(s).\n`)

  for (const doc of docs) {
    const id = doc._id

    // Example: patch each document. Customize the set operations for your needs.
    await client
      .patch(id)
      .set({lastUpdatedAt: new Date().toISOString()})
      .commit()

    console.log(`Updated: ${id} – ${doc.title || '(no title)'}`)
  }

  console.log(`\nDone. Updated ${docs.length} document(s).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
