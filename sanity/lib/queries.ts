import { defineQuery } from 'next-sanity'

const IMAGE = /* groq */ `{
  alt,
  caption,
  hotspot,
  asset->{ _id, url, metadata { lqip, dimensions } }
}`

/**
 * A work's exhibition is derived from the exhibition that lists it, so the
 * artist only ever maintains that relationship in one place.
 */
const WORK = /* groq */ `{
  _id,
  title,
  "displayDate": coalesce(displayDate, string::split(coalesce(date, ""), "-")[0], ""),
  "year": string::split(coalesce(date, ""), "-")[0],
  materials,
  text,
  coverImage ${IMAGE},
  "images": images[] ${IMAGE},
  "exhibition": *[_type == "exhibition" && references(^._id)] | order(date desc)[0] {
    _id,
    title,
    "slug": slug.current,
    dateText
  }
}`

export const settingsQuery = defineQuery(`*[_id == "settings"][0] {
  artistName,
  role,
  siteDescription,
  email,
  instagram,
  socialImage ${IMAGE},
  landingImage ${IMAGE}
}`)

export const aboutQuery = defineQuery(`*[_id == "about"][0] {
  heading,
  image ${IMAGE},
  text,
  seoDescription
}`)

export const cvQuery = defineQuery(`*[_id == "cv"][0] {
  heading,
  text,
  "file": file.asset->{ url, originalFilename },
  seoDescription
}`)

export const worksQuery = defineQuery(`*[_type == "work"]
  | order(date desc, _createdAt desc) ${WORK}`)

export const exhibitionsQuery = defineQuery(`*[_type == "exhibition" && defined(slug.current)]
  | order(date desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    dateText,
    venue,
    "workCount": count(works)
  }`)

export const exhibitionQuery = defineQuery(`*[_type == "exhibition" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  dateText,
  venue,
  curatorialText,
  coverImage ${IMAGE},
  seoDescription,
  "works": works[]-> ${WORK}
}`)

export const exhibitionSlugsQuery = defineQuery(`*[_type == "exhibition" && defined(slug.current)] {
  "slug": slug.current
}`)
