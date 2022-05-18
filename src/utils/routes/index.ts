export function createCategoryUrl(
  categorySlug: string,
  pageNum?: number
): string {
  return `/category/${categorySlug}${
    pageNum && pageNum > 1 ? `/${pageNum}` : ""
  }`;
}
