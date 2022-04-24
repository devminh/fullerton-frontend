export function omit(obj: any, ...props: any) {
  const result = { ...obj };
  props.forEach(function (prop: any) {
    delete result[prop];
  });
  return result;
}
