export const utilities = {
  interpolate: (baseString: string, value: string): string => {
    function format(source: string, params: string[]) {
      $.each(params, function (i, n) {
        source = source.replace(new RegExp('\\{' + i + '\\}', 'g'), n);
      });
      return source;
    }
    function isVowel(x: string) {
      return 'aeiouAEIOU'.indexOf(x) != -1;
    }
    const maybeN = isVowel(value[0]) ? 'n' : '';
    const target = baseString ? baseString : '';
    const insert = String(value ? value : '');
    return format(target, [maybeN, insert]);
  },
};
