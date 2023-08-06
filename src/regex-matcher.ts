import vm from 'vm';

export function matchAll(regex: RegExp, str: string): RegExpExecArray[] {
  const res: RegExpExecArray[] = [];
  let startIndex = 0;
  while (true) {
    const result = regex.exec(str.substring(startIndex));
    if (result) {
      res.push(result);
      startIndex += result.index + result[0].length;
    }
    if (!result || result?.index + result?.[0].length >= str.length) {
      break;
    }
  }
  return res;
}
