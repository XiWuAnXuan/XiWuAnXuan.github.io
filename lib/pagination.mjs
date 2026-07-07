export const POSTS_PER_PAGE = 5;

export function getTotalPages(totalItems, pageSize = POSTS_PER_PAGE) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function getPaginatedItems(items, page, pageSize = POSTS_PER_PAGE) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getPageNumbers(totalItems, pageSize = POSTS_PER_PAGE) {
  return Array.from(
    { length: getTotalPages(totalItems, pageSize) },
    (_, index) => index + 1,
  );
}
