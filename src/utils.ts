export function pathJoin(...parts: string[]) {
  const separator = '/';
  const replace = new RegExp(`${separator}{1,}`, 'g');
  let result = parts.join(separator).replace(replace, separator);

  const tester = new RegExp('^https?:/');
  result = result.replace(tester, '$&/');

  return result;
}

export function addLeadingSlash(path: string) {
  return path.charAt(0) === '/' ? path : '/' + path;
}

export function stripLeadingSlash(path: string) {
  return path.charAt(0) === '/' ? path.substr(1) : path;
}

export function hasBasename(path: string, prefix: string) {
  return (
    path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 &&
    '/?#'.indexOf(path.charAt(prefix.length)) !== -1
  );
}

export function stripBasename(path: string, prefix: string) {
  if (!prefix) return path;
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}