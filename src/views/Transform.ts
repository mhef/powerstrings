import { cloneDeep } from 'lodash';

/**
 * PSTransformer define a transformer. A Transformer is a operation applied to
 * a string or an array that modifies it's content and return a new value.
 */
export interface PSTransformer {
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
  }[]
}

/**
 * PSTransformers hold the list of implemented transformers.
 */
export const PSTransformers = [
  {
    Target: 'string',
    Return: 'array',
    Name: 'Split',
    Description: 'Split the string at the ocurrencies of the given <b>Separator</b>.',
    Icon: 'cut',
    Func: (v: string, sep: string) => (v.split(sep)),
    Args: [
      {
        Name: 'Separator',
      },
    ],
  },
  {
    Target: 'string',
    Return: 'string',
    Name: 'Trim',
    Description: 'Remove leading and trailing spaces',
    Icon: 'space_bar',
    Func: (v: string) => (v.trim()),
    Args: [],
  },
  {
    Target: 'string',
    Return: 'string',
    Name: 'Lower Case',
    Description: 'Convert the string to lower case',
    Icon: 'arrow_downward',
    Func: (v: string) => (v.toLowerCase()),
    Args: [],
  },
  {
    Target: 'string',
    Return: 'string',
    Name: 'Upper Case',
    Description: 'Convert the string to upper case',
    Icon: 'arrow_upward',
    Func: (v: string) => (v.toUpperCase()),
    Args: [],
  },
  {
    Target: 'string',
    Return: 'string',
    Name: 'Replace',
    Description: 'Replace all ocurrencies of <b>Pattern</b> with the <b>Replacement</b> content',
    Icon: 'find_replace',
    Func: (v: string, pattern: string, replacement: string) => (v.replaceAll(pattern, replacement)),
    Args: [
      {
        Name: 'Pattern',
      },
      {
        Name: 'Replacement',
      },
    ],
  },
  {
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
      },
      {
        Name: 'End (exclusive)',
      },
    ],
  },
  {
    Target: 'array',
    Return: 'array',
    Name: 'Slice Array',
    Description: 'Slice a section of the array, between <b>Start</b> and <b>End</b> indexes.',
    Icon: 'carpenter',
    Func: ((v: Array<any>, start: string, end: string) => {
      let s = parseInt(start, 10);
      let e = parseInt(end, 10);
      return v.slice(s, e);
    }),
    Args: [
      {
        Name: 'Start',
      },
      {
        Name: 'End (exclusive)',
      },
    ],
  },
  {
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
    Target: 'array',
    Return: 'string',
    Name: 'Join',
    Description: 'Adds all the elements of the array into a string, separated by the specified <b>Separator</b>.',
    Icon: 'join',
    Func: ((v: Array<any>, sep: string) => (v.join(sep))),
    Args: [
      {
        Name: 'Separator',
      },
    ],
  },
] as PSTransformer[];
