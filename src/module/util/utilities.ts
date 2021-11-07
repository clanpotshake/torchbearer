export const utilities = {
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

  isVowel: (x: string | null): boolean => {
    if (typeof x != 'undefined' && x?.trim()) {
      return 'aeiouAEIOU'.indexOf(x[0]) != -1;
    } else {
      return false;
    }
  },
};
