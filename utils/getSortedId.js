export default function getSortedId({
  collection,
  primaryKey = 'id',
  key = 'time',
  isDecr = true,
  returnId = true,
}) {
  const isTime = ['updatedAt', 'createdAt', 'time'].includes(key);
  collection = collection.sort((a, b) => {
    let indexA = a[key];
    let indexB = b[key];
    if (isTime) {
      indexA = new Date(indexA).getTime();
      indexB = new Date(indexB).getTime();
    }
    if (isDecr) {
      return indexB - indexA;
    } else {
      return indexA - indexB;
    }
  });

  if (returnId) {
    const idList = [];
    for (const item of collection) {
      idList.push(item[primaryKey]);
    }
    return idList;
  } else {
    return collection;
  }
}
