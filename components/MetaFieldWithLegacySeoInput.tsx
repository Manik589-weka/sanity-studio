import type {ReactElement} from 'react'
import {useEffect, useRef} from 'react'
import {PatchEvent, set, useFormValue} from 'sanity'

type SeoDoc = {metaTitle?: string; metaDescription?: string} | null

type Props = {
  value?: string | null
  onChange: (event: PatchEvent) => void
  renderDefault: (props: Record<string, unknown>) => ReactElement
  schemaType: {name: string}
}

/**
 * Shows Meta Title / Meta Description from the legacy `seo` object when the
 * top-level field is empty, and syncs that value into the field on first load
 * so it persists when the document is saved.
 */
export function MetaFieldWithLegacySeoInput(props: Props) {
  const {value, onChange, renderDefault, schemaType} = props
  const seo = useFormValue(['seo']) as SeoDoc
  const syncedRef = useRef(false)

  const fieldName = schemaType.name
  const legacyValue =
    fieldName === 'metaTitle'
      ? (seo?.metaTitle ?? '')
      : fieldName === 'metaDescription'
        ? (seo?.metaDescription ?? '')
        : ''

  const displayValue = value !== undefined && value !== null && value !== '' ? value : legacyValue

  // One-time sync: write legacy value into the field so it saves and shows in the form
  useEffect(() => {
    if (syncedRef.current) return
    const empty = value === undefined || value === null || value === ''
    if (empty && legacyValue) {
      syncedRef.current = true
      onChange(PatchEvent.from(set(legacyValue)))
    }
  }, [value, legacyValue, onChange])

  return renderDefault({...props, value: displayValue})
}
