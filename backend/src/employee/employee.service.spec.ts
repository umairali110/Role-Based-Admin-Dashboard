import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repo: { find: jest.Mock; create: jest.Mock; save: jest.Mock };

  beforeEach(async () => {
    repo = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        { provide: getRepositoryToken(Employee), useValue: repo },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns only the logged in user employees for a regular user', async () => {
    repo.find.mockResolvedValue([{ id: 1, created_by: 7 }]);

    await service.findAll({ userId: 7, role: 'user' });

    expect(repo.find).toHaveBeenCalledWith({
      where: { created_by: 7 },
    });
  });

  it('returns all employees for an admin user', async () => {
    repo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    await service.findAll({ id: 1, role: 'admin' });

    expect(repo.find).toHaveBeenCalledWith();
  });
});
