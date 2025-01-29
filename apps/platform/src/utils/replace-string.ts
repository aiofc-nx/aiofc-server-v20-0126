/**
 * 字符串替换操作的配置选项接口
 */
interface ReplaceOptions {
  /** 开始搜索的位置索引 */
  fromIndex?: number;
  /** 是否大小写不敏感 */
  caseInsensitive?: boolean;
}

/**
 * 替换函数的类型定义
 * @param match 匹配到的文本
 * @param matchCount 当前是第几次匹配
 * @param fullString 完整的原始字符串
 * @param matchIndex 匹配位置的索引
 * @returns 返回用于替换的字符串
 */
type ReplacementFunction = (
  match: string,
  matchCount: number,
  fullString: string,
  matchIndex: number,
) => string;

/**
 * 高级字符串替换函数,支持多种替换模式
 * @param string 要处理的原始字符串
 * @param needle 要查找的子字符串
 * @param replacement 替换内容(可以是字符串或函数)
 * @param options 配置选项
 * @returns 替换后的新字符串
 *
 * @example
 * // 基本字符串替换
 * replaceString('Hello world', 'world', 'everyone')
 * // 返回: 'Hello everyone'
 *
 * // 使用替换函数
 * replaceString('hello HELLO', 'hello', (match) => match.toUpperCase(), {
 *   caseInsensitive: true
 * })
 * // 返回: 'HELLO HELLO'
 *
 * // 从指定位置开始替换
 * replaceString('test test test', 'test', 'xyz', { fromIndex: 5 })
 * // 返回: 'test xyz xyz'
 */
export default function replaceString(
  string: string,
  needle: string,
  replacement: string | ReplacementFunction,
  options: ReplaceOptions = {},
): string {
  // 验证输入是否为字符串
  if (typeof string !== 'string') {
    throw new TypeError(`Expected input to be a string, got ${typeof string}`);
  }

  // 验证查找字符串和替换内容的有效性
  if (
    !(typeof needle === 'string' && needle.length > 0) ||
    !(typeof replacement === 'string' || typeof replacement === 'function')
  ) {
    return string;
  }

  // 初始化结果字符串和匹配计数
  let result = '';
  let matchCount = 0;
  // 设置起始搜索位置
  let previousIndex =
    options.fromIndex && options.fromIndex > 0 ? options.fromIndex : 0;

  // 如果起始位置超出字符串长度，直接返回原字符串
  if (previousIndex > string.length) {
    return string;
  }

  // 主循环：查找并替换所有匹配项
  while (true) {
    // 根据大小写敏感设置查找匹配位置
    const index = options.caseInsensitive
      ? string.toLowerCase().indexOf(needle.toLowerCase(), previousIndex)
      : string.indexOf(needle, previousIndex);

    // 没有找到更多匹配，退出循环
    if (index === -1) {
      break;
    }

    matchCount++;

    // 获取替换内容：使用字符串或调用替换函数
    const replaceString_ =
      typeof replacement === 'string'
        ? replacement
        : replacement(
            string.slice(index, index + needle.length),
            matchCount,
            string,
            index,
          );

    // 对第一次匹配特殊处理，确保包含开头部分
    const beginSlice = matchCount === 1 ? 0 : previousIndex;

    // 构建结果字符串：添加未匹配部分和替换内容
    result += string.slice(beginSlice, index) + replaceString_;

    // 更新下一次搜索的起始位置
    previousIndex = index + needle.length;
  }

  // 如果没有找到任何匹配，返回原始字符串
  if (matchCount === 0) {
    return string;
  }

  // 返回最终结果，包括最后一个匹配后的剩余部分
  return result + string.slice(previousIndex);
}
