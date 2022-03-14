export const utilities = {
  /**
   * returns a string containing one or more zero-indexed replacement values, formatted as "{0}"
   * @param baseString string to replace values in
   * @param nString special handler for replacing {maybeN} in baseString, for when
   *                "a" or "an" is needed
   * @param values an array of strings to be used to replace the formatting values, in order.
   *               {0} is replaced with values[0], and so on
   */
  interpolate: (baseString: string, nString: string, values: string[]): string => {
    function format(source: string, params: string[]) {
      $.each(params, function (i, n) {
        source = source.replace(new RegExp('\\{' + i + '\\}', 'g'), n);
      });
      return source;
    }
    const target = baseString ? baseString : '';
    const cleanValues = values.map((x) => (x ? String(x) : ''));
    return format(target, cleanValues).replace('{maybeN}', nString);
  },

  startsWithVowel: (x: string | undefined | null): boolean => {
    const vowels: (string | undefined)[] = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
    return vowels.includes(x?.trim()[0]);
  },
};
export function handyParse(
  input: number | string | undefined | null,
  radix: number,
  defaultValue?: number,
): number {
  if (!input) return defaultValue ?? 0;
  if (typeof input === 'number') return input;
  return parseInt(input, radix);
}
