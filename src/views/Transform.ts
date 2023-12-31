import { cloneDeep, pullAt } from 'lodash';

/**
 * PSTransformer define a transformer. A Transformer is a operation applied to
 * a string or an array that modifies it's content and return a new value.
 */
export interface PSTransformer {
  /**
   * ID define the unique ID of this transformer.
   */
  ID: string;

  /**
   * Target define the value type that this transformer should receive.
   */
  Target: 'string' | 'array';

  /**
   * Return define the value type that this transformer return.
   */
  Return: 'string' | 'array';

  /**
   * Name define a friendly name for this transformer.
   */
  Name: string;

  /**
   * Description define a friendly description of what this transformer does.
   */
  Description: string;

  /**
   * Icon define a material-symbol icon for this transformer.
   */
  Icon: string;

  /**
   * Func define the transformation function of this transformer. This function
   * will be called on transformations using this transformer.
   */
  Func: (value: string | string[], ...args: string[]) => string | string[];

  /**
   * Args define the arguments demanded by this transformer. The args values will
   * be passed to the transforme at the order they are in this array.
   */
  Args: {
    /**
     * Name define the friendly name of this argument.
     */
    Name: string;

    /**
     * Placeholder define a placeholder for the argument, instructing the user
     * to use it.
     */
    Placeholder: string;
  }[]
}

/**
 * PSTransformers implement the available transformers.
 */
export const PSTransformers = [
  {
    ID: 'split',
    Target: 'string',
    Return: 'array',
    Name: 'Split',
    Description: 'Split the string at the ocurrencies of the given <b>Separator</b>.',
    Icon: 'cut',
    Func: (v: string, sep: string) => {
      if (sep.includes('%w%')) {
        let sepEscaped = sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex chars
        // Should the below regex have a capturing group?
        //
        // According to MDN, if there are capturing groups in the separator regex
        // of the split, those capturing groups values are spliced on the outputed
        // array.
        //
        // To follow the same behaviour of the split without regex, I will not use
        // capturing groups on this transformer.
        //
        // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split#description
        let sepRegex = sepEscaped.replaceAll('%w%', '[^]*?');
        return v.split(new RegExp(sepRegex));
      }
      return v.split(sep);
    },
    Args: [
      {
        Name: 'Separator',
        Placeholder: 'Use %w% as wildcard',
      },
    ],
  },
  {
    ID: 'replace',
    Target: 'string',
    Return: 'string',
    Name: 'Replace',
    Description: 'Replace all ocurrencies of <b>Pattern</b> with the <b>Replacement</b> content',
    Icon: 'find_replace',
    Func: (v: string, pattern: string, replacement: string) => {
      if (pattern.includes('%w%')) {
        let patEscaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex chars
        // The below quantifier, should be lazy or greedy?
        //
        // As the user can previously refine the applying range with split, I will
        // let it greedy. Discussions on this are welcome!
        let patRegex = patEscaped.replaceAll('%w%', '([^]*)');
        return v.replace(new RegExp(patRegex, 'g'), replacement);
      }
      return v.replaceAll(pattern, replacement);
    },
    Args: [
      {
        Name: 'Pattern',
        Placeholder: 'Use %w% as wildcard',
      },
      {
        Name: 'Replacement',
        Placeholder: 'Use $& for matched and $n (n = %w% index, starting from 1) for wildcarded substrings',
      },
    ],
  },
  {
    ID: 'trim',
    Target: 'string',
    Return: 'string',
    Name: 'Trim',
    Description: 'Remove leading and trailing spaces',
    Icon: 'space_bar',
    Func: (v: string) => (v.trim()),
    Args: [],
  },
  {
    ID: 'lower_case',
    Target: 'string',
    Return: 'string',
    Name: 'Lower Case',
    Description: 'Convert the string to lower case',
    Icon: 'arrow_downward',
    Func: (v: string) => (v.toLowerCase()),
    Args: [],
  },
  {
    ID: 'upper_case',
    Target: 'string',
    Return: 'string',
    Name: 'Upper Case',
    Description: 'Convert the string to upper case',
    Icon: 'arrow_upward',
    Func: (v: string) => (v.toUpperCase()),
    Args: [],
  },
  {
    ID: 'slice',
    Target: 'string',
    Return: 'string',
    Name: 'Slice',
    Description: 'Slice a section of the string, between <b>Start</b> and <b>End</b> indexes.',
    Icon: 'carpenter',
    Func: ((v: string, start: string, end: string) => {
      let s = parseInt(start, 10);
      let e = parseInt(end, 10);
      return v.slice(s, e);
    }),
    Args: [
      {
        Name: 'Start',
        Placeholder: '',
      },
      {
        Name: 'End (exclusive)',
        Placeholder: '',
      },
    ],
  },
  {
    ID: 'slice_array',
    Target: 'array',
    Return: 'array',
    Name: 'Slice Array',
    Description: 'Slice a section of the array, at the given <b>Indexes</b>.',
    Icon: 'carpenter',
    Func: ((v: Array<any>, indexes: string) => {
      let normalized = indexes.replaceAll(' ', '').replaceAll(/\r\n|\n/g, '');

      if (normalized.includes('-')) {
        let commaSpt = normalized.split('-');
        if (commaSpt.length !== 2) return v; // do nothing
        let s = parseInt(commaSpt[0], 10);
        let e = parseInt(commaSpt[1], 10);
        return v.slice(s, e);
      }

      if (normalized.includes(',')) {
        let commaSpt = normalized.split(',');
        let indexes = commaSpt.map((idx) => (parseInt(idx, 10)));
        let ret = cloneDeep(v);
        return pullAt(ret, indexes);
      }

      let idx = parseInt(normalized, 10);
      if (Number.isNaN(idx)) return v; // do nothing
      let ret = cloneDeep(v);
      return pullAt(ret, idx);
    }),
    Args: [
      {
        Name: 'Indexes to slice (use , for lists and - for intervals)',
        Placeholder: 'List e.g.: 0,3,5\nInterval e.g.: 0-5',
      },
    ],
  },
  {
    ID: 'reverse',
    Target: 'array',
    Return: 'array',
    Name: 'Reverse',
    Description: 'Reverse the array.',
    Icon: 'restart_alt',
    Func: ((v: Array<any>) => {
      let ret = cloneDeep(v);
      ret.reverse();
      return ret;
    }),
    Args: [],
  },
  {
    ID: 'sort',
    Target: 'array',
    Return: 'array',
    Name: 'Sort',
    Description: 'Sort the array.',
    Icon: 'sort',
    Func: ((v: Array<any>) => {
      let ret = cloneDeep(v);

      let isAllInt = ret.every((v) => (!Number.isNaN(parseInt(v, 10))));
      if (!isAllInt) {
        ret.sort();
        return ret;
      }

      // If all elements are numbers, sort by numeric order.
      ret.sort((a, b) => {
        if (parseInt(a, 10) < parseInt(b, 10)) return -1;
        if (parseInt(a, 10) > parseInt(b, 10)) return 1;
        return 0;
      });
      return ret;
    }),
    Args: [],
  },
  {
    ID: 'join',
    Target: 'array',
    Return: 'string',
    Name: 'Join',
    Description: 'Adds all the elements of the array into a string, separated by the specified <b>Separator</b>.',
    Icon: 'join',
    Func: ((v: Array<any>, sep: string) => (v.join(sep))),
    Args: [
      {
        Name: 'Separator',
        Placeholder: '',
      },
    ],
  },
] as PSTransformer[];

/**
 * PSTransformerWithArguments define a PSTransformer along with a list of
 * arguments. Usually this is used to store the applied transformers and their
 * arguments.
 */
export interface PSTransformerWithArguments {
  Transformer: PSTransformer;
  Arguments: string[];
}

/**
 * applyTransformer applies the given transformer on the given value and then
 * return the value.
 *
 * If the value is an array and the transformer target strings, it will be applied
 * recursively.
 * If the value is an array and the transformer target arrays, it will be applied
 * to the inner most array.
 */
export function applyTransformer(v: string | string[], t: PSTransformerWithArguments): any {
  if (typeof v !== 'string' && !(v instanceof Array)) {
    throw new Error('applyTransformer: v is not a string nor array');
  }
  if (typeof v === 'string' && t.Transformer.Target === 'array') {
    throw new Error('applyTransformer: a targeted array transformer cannot be applied on string');
  }
  if (v instanceof Array) {
    if (t.Transformer.Target === 'string') {
      return v.map((vm) => (applyTransformer(vm, t)));
    }

    // If the transformer target is array, apply the transform to the most inner
    // array.
    if (t.Transformer.Target === 'array') {
      if (v.length > 0 && typeof v[0] === 'string') {
        // if at least one child of this array is a string, this array should not
        // have nested arrays, so, apply the transform on it.
        return t.Transformer.Func(v, ...t.Arguments);
      }
      return v.map((vm) => (applyTransformer(vm, t)));
    }
  }
  return t.Transformer.Func(v, ...t.Arguments);
}

/**
 * encodeATL encode a list of PSTransformerWithArguments into a transportable
 * string. ATL stands for 'Applied Transformer List'.
 */
export function encodeATL(ts: PSTransformerWithArguments[]): string {
  let ret = [] as {
    i: string, // transformer ID
    a: string[], // transformer supplied arguments
  }[];
  ts.forEach((t) => {
    ret.push({
      i: t.Transformer.ID,
      a: t.Arguments,
    });
  });
  return JSON.stringify(ret);
}

/**
 * decodeATL decode a ATL string previously encoded with encodeATL.
 */
export function decodeATL(t: string): PSTransformerWithArguments[] {
  let p = JSON.parse(t);
  if (!(p instanceof Array)) {
    throw new Error('decodeAppliedTransformerList: parsed value is not array');
  }

  let ret = [] as PSTransformerWithArguments[];
  p.forEach((t) => {
    if (t?.i === undefined || !(t?.a instanceof Array)) {
      throw new Error('decodeAppliedTransformerList: transformer id or args malformed');
    }
    if (!t.a.every((ta: any) => (typeof ta === 'string'))) {
      throw new Error(`decodeAppliedTransformerList: transformer ${t.i} has non-string argument`);
    }
    let tf = PSTransformers.find((pst) => (pst.ID === t.i));
    if (tf === undefined) {
      throw new Error(`decodeAppliedTransformerList: transformer ${t.i} not found`);
    }
    ret.push({
      Transformer: tf,
      Arguments: t.a,
    });
  });
  return ret;
}
