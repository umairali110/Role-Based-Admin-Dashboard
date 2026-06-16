import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {

  @UseGuards(JwtAuthGuard)
  @Get()
  getDashboard(@Request() req) {
    return {
      message: 'Dashboard access granted ',
      user: req.user,
    };
  }
}
