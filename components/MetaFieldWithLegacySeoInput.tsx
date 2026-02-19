import {useEffect, useRef} from 'react'
import {Box, TextArea, TextInput} from '@sanity/ui'
import {PatchEvent, set, useFormValue, useEditState} from 'sanity'
import {useDocumentPane} from 'sanity/structure'

type SeoDoc = {metaTitle?: string; metaDescription?: string} | null

function getPublishedId(id: string): string {
  return id.startsWith('drafts.') ? id.slice(7) : id
}

type Props = {
  value?: string | null
  onChange: (event: PatchEvent) => void
  renderDefault: (props: Record<string, unknown>) => React.ReactElement
  schemaType: {name: string}
  path?: unknown[]
}

/**
 * Shows Meta Title / Meta Description from the legacy `seo` object when the
 * top-level field is empty, and syncs that value into the field on first load.
 */
export function MetaFieldWithLegacySeoInput(props: Props) {
  const {value, onChange, schemaType, path} = props
  const syncedRef = useRef(false)

  // Form context
  const seoFromSibling = useFormValue(['seo']) as SeoDoc
  const docFromRoot = useFormValue([])
  const seoPath =
    Array.isArray(path) && path.length > 0 ? ([...path.slice(0, -1), 'seo'] as string[]) : ['seo']
  const seoFromParentPath = useFormValue(seoPath) as SeoDoc

  const docAsObject =
    docFromRoot && typeof docFromRoot === 'object' && !Array.isArray(docFromRoot) && 'seo' in docFromRoot
      ? (docFromRoot as Record<string, unknown>)
      : null

  // Document pane (displayed / draft)
  const pane = useDocumentPane()
  const displayed = pane?.displayed as Record<string, unknown> | null | undefined
  const draftFromPane = pane?.editState?.draft as Record<string, unknown> | null | undefined
  const docFromPane = displayed ?? draftFromPane

  // useEditState(publishedId) gives the draft from the document store (includes hidden seo)
  const documentId = pane?.documentId ?? ''
  const publishedId = documentId ? getPublishedId(documentId) : ''
  const editState = useEditState(publishedId || '_no_doc_', 'blogPost')
  const draftFromStore =
    publishedId && editState?.draft
      ? (editState.draft as Record<string, unknown>)
      : undefined

  const seoFromPane: SeoDoc =
    docFromPane && typeof docFromPane === 'object' && docFromPane.seo != null
      ? (docFromPane.seo as SeoDoc)
      : null
  const seoFromStore: SeoDoc =
    draftFromStore && typeof draftFromStore === 'object' && draftFromStore.seo != null
      ? (draftFromStore.seo as SeoDoc)
      : null

  const seo: SeoDoc =
    seoFromSibling ??
    (docAsObject?.seo as SeoDoc) ??
    seoFromParentPath ??
    seoFromPane ??
    seoFromStore ??
    null

  const fieldName = schemaType.name
  const legacyValue =
    fieldName === 'metaTitle'
      ? (seo?.metaTitle ?? '')
      : fieldName === 'metaDescription'
        ? (seo?.metaDescription ?? '')
        : ''

  const displayValue =
    value !== undefined && value !== null && value !== '' ? String(value) : legacyValue

  // Sync legacy value into the field once so it saves and form state is correct
  useEffect(() => {
    if (syncedRef.current) return
    const empty = value === undefined || value === null || value === ''
    if (empty && legacyValue) {
      syncedRef.current = true
      onChange(PatchEvent.from(set(legacyValue)))
    }
  }, [value, legacyValue, onChange])

  const isTextArea = fieldName === 'metaDescription'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(PatchEvent.from(set(e.target.value)))
  }

  // Render a controlled input so we always show displayValue (including legacy)
  if (isTextArea) {
    return (
      <Box>
        <TextArea
          value={displayValue}
          onChange={handleChange}
          rows={3}
          placeholder="Brief description for search engines (120–160 characters)"
        />
      </Box>
    )
  }

  return (
    <Box>
      <TextInput
        value={displayValue}
        onChange={handleChange}
        placeholder="Override the document title for search engines (50–60 characters)"
      />
    </Box>
  )
}
