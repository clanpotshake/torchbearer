export const utilities = {
  interpolate: (
    baseString: string | null | undefined,
    value: string | number | null | undefined,
    maybeN: string,
  ): string => {
    function format(source: string, params: string[]) {
      $.each(params, function (i, n) {
        source = source.replace(new RegExp('\\{' + i + '\\}', 'g'), n);
      });
      return source;
    }
    const target = baseString ? baseString : '';
    const insert = String(value ? value : '');
    return format(target, [maybeN, insert]);
  },
};
