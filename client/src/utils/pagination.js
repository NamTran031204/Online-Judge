export function paginate(array, page, pageSize) {
  const totalItems = array.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    pageItems: array.slice(start, end),
    totalPages,
  };
}
