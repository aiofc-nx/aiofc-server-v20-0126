/**
 * 从更新数据中移除基础字段（用于更新场景）
 * @param data 原始更新数据
 * @returns 清理后的更新数据
 */
export function cleanUpdateData<T extends Record<string, any>>(
  data: Partial<T>,
) {
  const { id, tenantId, createdAt, deletedAt, ...cleanData } = data;
  return cleanData;
}

/**
 * 从创建数据中移除所有基础字段（用于创建场景）
 * @param data 原始创建数据
 * @returns 清理后的创建数据
 */
export function cleanCreateData<T extends Record<string, any>>(
  data: Partial<T>,
) {
  const { id, tenantId, createdAt, updatedAt, deletedAt, ...cleanData } = data;
  return cleanData;
}
