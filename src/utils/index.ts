const numbers: string = '0123456789',
  letters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  specials: string = '!$%^&*()_+|~-=`{}[]:;<>?,./';

type OptionsType = {
  length: number;
  numeric?: boolean;
  letters?: boolean;
  special?: boolean;
};

function _defaults(opts: OptionsType) {
  return {
    length: opts.length || 8,
    numeric: typeof opts.numeric === 'boolean' ? opts.numeric : true,
    letters: typeof opts.letters === 'boolean' ? opts.letters : true,
    special: typeof opts.special === 'boolean' ? opts.special : false,
  };
}

function _buildChars(opts: OptionsType) {
  let chars = '';

  if (opts.numeric) {
    chars += numbers;
  }

  if (opts.letters) {
    chars += letters;
  }

  if (opts.special) {
    chars += specials;
  }

  return chars;
}

export const randomString = (_opts: OptionsType) => {
  let opts = _defaults(_opts);
  let i,
    rn,
    rnd = '',
    len = opts.length,
    randomChars = _buildChars(opts);
  //
  for (i = 1; i <= len; i++) {
    rnd += randomChars.substring(
      (rn = Math.floor(Math.random() * randomChars.length)),
      rn + 1
    );
  }
  //
  return rnd;
};

export const createStaticHandler = <T>(): T => {
  return {} as T;
};
