import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from './tenant.service';
import { ConflictException } from '@nestjs/common';
import { CreateTenantDto } from './dto/tenant.dto';
import { DatabaseService } from '../../database/database.service';

describe('TenantService', () => {
  let service: TenantService;
  let mockDb: any;

  const mockTenant = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Tenant',
    schema: 't_test_tenant',
    description: 'Test tenant description',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const mockMethods = {
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      from: jest.fn(),
      where: jest.fn(),
      values: jest.fn(),
      set: jest.fn(),
      returning: jest.fn().mockResolvedValue([mockTenant]),
    };

    // 为每个方法设置返回值
    Object.values(mockMethods).forEach((method) => {
      if (method !== mockMethods.returning) {
        // 不覆盖 returning 的 mock
        method.mockReturnValue({
          ...mockMethods,
        });
      }
    });

    mockDb = mockMethods;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: DatabaseService,
          useValue: {
            getTenantDB: jest.fn().mockResolvedValue(mockDb),
          },
        },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new tenant', async () => {
      const createDto: CreateTenantDto = {
        name: 'Test Tenant',
        schema: 't_test_tenant',
        description: 'Test tenant description',
      };

      mockDb.where.mockResolvedValueOnce([]);
      mockDb.returning.mockResolvedValueOnce([mockTenant]);

      const result = await service.create(createDto);

      expect(result).toEqual(mockTenant);
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should throw ConflictException if schema already exists', async () => {
      const createDto: CreateTenantDto = {
        name: 'Test Tenant',
        schema: 't_test_tenant',
      };

      mockDb.where.mockResolvedValueOnce([mockTenant]);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe('findById', () => {
    it('should return a tenant by id', async () => {
      mockDb.where.mockResolvedValueOnce([mockTenant]);

      const result = await service.findById(mockTenant.id);

      expect(result).toEqual(mockTenant);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it('should return null if tenant not found', async () => {
      mockDb.where.mockResolvedValueOnce([]);

      const result = await service.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a tenant', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedTenant = { ...mockTenant, ...updateData };

      mockDb.where.mockReturnValueOnce({
        returning: jest.fn().mockResolvedValueOnce([updatedTenant]),
      });

      const result = await service.update(mockTenant.id, updateData);

      expect(result).toEqual(updatedTenant);
      expect(mockDb.update).toHaveBeenCalled();
    });

    it('should throw ConflictException if updating to existing schema', async () => {
      const updateData = { schema: 't_existing' };
      mockDb.where.mockResolvedValueOnce([
        { id: 'other-id', schema: 't_existing' },
      ]);

      await expect(service.update(mockTenant.id, updateData)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe('delete', () => {
    it('should soft delete a tenant', async () => {
      const deletedTenant = { ...mockTenant, deletedAt: new Date() };
      mockDb.returning.mockResolvedValueOnce([deletedTenant]);

      const result = await service.delete(mockTenant.id);

      expect(result).toBe(true);
      expect(mockDb.update).toHaveBeenCalled();
    });

    it('should return false if tenant not found', async () => {
      mockDb.where.mockReturnValueOnce({
        returning: jest.fn().mockResolvedValueOnce([]),
      });

      const result = await service.delete('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('restore', () => {
    it('should restore a deleted tenant', async () => {
      mockDb.returning.mockResolvedValueOnce([
        { ...mockTenant, deletedAt: null },
      ]);

      const result = await service.restore(mockTenant.id);

      expect(result).toEqual(expect.objectContaining({ deletedAt: null }));
      expect(mockDb.update).toHaveBeenCalled();
    });

    it('should return null if tenant not found', async () => {
      mockDb.where.mockReturnValueOnce({
        returning: jest.fn().mockResolvedValueOnce([]),
      });

      const result = await service.restore('non-existent-id');
      expect(result).toBeNull();
    });
  });
});
