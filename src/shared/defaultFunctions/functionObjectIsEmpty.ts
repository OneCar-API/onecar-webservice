export default function objectIsEmpty(value: any): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return Object.keys(value).length === 0;
}
