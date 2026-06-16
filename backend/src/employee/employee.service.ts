import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
@Injectable()
export class EmployeeService {
    constructor(
  @InjectRepository(Employee)
  private empRepo: Repository<Employee>,
) {}

async create(data: any, user: any) {
  try {
    console.log("🔥 FINAL USER DEBUG:", user);
  console.log("🔥 FINAL USER ID:", user.userId);

    const userId = user?.userId ?? user?.id;

    const employee = this.empRepo.create({
      ...data,
      created_by: userId,
    });

    return await this.empRepo.save(employee);
  } catch (error) {
    console.log("🔥 CREATE ERROR =>", error);
    throw error;
  }
}
async findAll(user: any) {
  if (!user) {
    throw new Error("Unauthorized");
  }

  console.log("USER DEBUG:", user);

  // 👑 ADMIN → all data
  if (user.role === "admin") {
    return this.empRepo.find();
  }

  // 👤 USER → only own data
  return this.empRepo.find({
    where: {
      created_by: user.userId, // IMPORTANT FIX
    },
  });
}
async remove(id: number, user: any) {
  try{
  if (user.role !== 'admin') {
    throw new Error('Access denied');
  }

  return this.empRepo.delete(id);
}
catch(error){
  throw new Error('Remove not Working')
}
}
async update(id: number, data: any) {
  try{
  await this.empRepo.update(id, data);

  return this.empRepo.findOne({
    where: { id },
  });
}
catch(error){
  throw new Error('Update not Working')
}
}
}
