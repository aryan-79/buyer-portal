/**
 * @param page  - Page number (1-based). Values less than 1 default to page 1.
 * @param limit - Number of records per page.
 * @returns The 0-based offset to use in a database query.
 */
export function getOffset(page: number, limit: number) {
  if (page < 1) {
    return 0;
  }

  return (page - 1) * limit;
}
