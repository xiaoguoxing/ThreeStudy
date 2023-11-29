
export function findChildren (object3D, callback){
  const children= [];
  object3D.traverse(obj => children.push(obj));
  const result = children.find(callback);
  if (result !== undefined) {
    return result;
  } else {
    return null;
  }
}

export function findParent (object3d, callback)  {
  let parent = object3d;
  while (!callback(parent)) {
    parent = parent.parent;
    if (parent === null) {
      return null;
    }
  }
  return parent;
}
export function checkNameIncludes (obj, str) {
  return !!obj.name.includes(str);
}
