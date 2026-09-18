import type { StructureResolver } from 'sanity/structure'

/**
 * A deliberately flat Studio: the two one-off pages first, then the two
 * collections, then settings.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website')
    .items([
      S.listItem()
        .title('About')
        .id('about')
        .child(S.document().schemaType('about').documentId('about').title('About')),
      S.listItem()
        .title('CV')
        .id('cv')
        .child(S.document().schemaType('cv').documentId('cv').title('CV')),
      S.divider(),
      S.documentTypeListItem('work').title('Works'),
      S.documentTypeListItem('exhibition').title('Selected Exhibitions'),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .id('settings')
        .child(S.document().schemaType('settings').documentId('settings').title('Site settings')),
    ])
