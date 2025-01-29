import replaceString from '../replace-string';

describe('replaceString', () => {
  // 基本替换功能测试
  test('基本字符串替换', () => {
    expect(replaceString('Hello world', 'world', 'everyone')).toBe(
      'Hello everyone',
    );
  });

  test('替换多个匹配项', () => {
    expect(replaceString('test test test', 'test', 'xyz')).toBe('xyz xyz xyz');
  });

  // 特殊情况处理测试
  test('空字符串输入', () => {
    expect(replaceString('', 'test', 'xyz')).toBe('');
  });

  test('无匹配项时返回原字符串', () => {
    expect(replaceString('Hello world', 'xyz', 'test')).toBe('Hello world');
  });

  // 参数验证测试
  test('非字符串输入时抛出TypeError', () => {
    // @ts-expect-error - 故意传入错误类型以测试错误处理
    expect(() => replaceString(123, 'test', 'xyz')).toThrow(TypeError);
  });

  test('needle为空字符串时返回原字符串', () => {
    expect(replaceString('Hello world', '', 'xyz')).toBe('Hello world');
  });

  // 选项参数测试
  test('fromIndex选项 - 从指定位置开始替换', () => {
    expect(
      replaceString('test test test', 'test', 'xyz', { fromIndex: 5 }),
    ).toBe('test xyz xyz');
  });

  test('fromIndex超出字符串长度时返回原字符串', () => {
    expect(replaceString('test test', 'test', 'xyz', { fromIndex: 100 })).toBe(
      'test test',
    );
  });

  test('caseInsensitive选项 - 大小写不敏感替换', () => {
    expect(
      replaceString('hello HELLO Hello', 'hello', 'hi', {
        caseInsensitive: true,
      }),
    ).toBe('hi hi hi');
  });

  // 替换函数测试
  test('使用替换函数', () => {
    const replaceFn = (match: string) => match.toUpperCase();
    expect(replaceString('hello world', 'hello', replaceFn)).toBe(
      'HELLO world',
    );
  });

  test('替换函数接收正确的参数', () => {
    const replaceFn = jest.fn((_match, _count, _fullString, _index) => 'test');
    replaceString('hello hello', 'hello', replaceFn);

    expect(replaceFn).toHaveBeenCalledTimes(2);
    expect(replaceFn).toHaveBeenNthCalledWith(1, 'hello', 1, 'hello hello', 0);
    expect(replaceFn).toHaveBeenNthCalledWith(2, 'hello', 2, 'hello hello', 6);
  });

  // 复杂场景测试
  test('混合使用多个选项', () => {
    const replaceFn = (match: string) => match.toUpperCase();
    expect(
      replaceString('test Test TEST', 'test', replaceFn, {
        caseInsensitive: true,
        fromIndex: 5,
      }),
    ).toBe('test TEST TEST');
  });
});
