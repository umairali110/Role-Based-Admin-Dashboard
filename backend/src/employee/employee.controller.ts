import { Controller, Get, Param, Post, Body, UseGuards, Request, Delete,Patch } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { EmployeeService } from './employee.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('employee')
export class EmployeeController {
  constructor(private empService: EmployeeService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body, @Request() req) {
    return this.empService.create(body, req.user);
  }

 @UseGuards(JwtAuthGuard)
@Get()
findAll(@Request() req) {
  console.log("REQ USER:", req.user);
  return this.empService.findAll(req.user);
}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: number, @Request() req) {
    return this.empService.remove(id, req.user);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Patch(':id')
update(@Param('id') id: number, @Body() body) {
  return this.empService.update(id, body);
}
}
