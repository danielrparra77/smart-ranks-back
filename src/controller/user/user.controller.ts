import { Body, Controller, Delete, Get, Post, Query, Req } from '@nestjs/common';
import { IUserService } from '../../core/user/user.service';
import { UserDto } from '../dto/user/user.dto';
import { UserDeleteDto } from '../dto/user/user-delete.dto';
import { AllowUnauthorizedRequest } from '../../common/decorator/allow-unauthroized-request.decorator';
import { Roles } from '../../common/decorator/roles.decorator';
import { RoleEnum } from '../../common/enum/role.enum';
import { IUserCredentials } from '../../core/entity/user-credentials.entity';
import { Request } from 'express';
import { UseFilterrDto } from '../dto/user/user.filter-dto';

@Controller({path: 'user'})
export class UserController {
  constructor(private readonly userService: IUserService) {}

  @Get()
  @Roles([RoleEnum.administrator])
  getUsers() {
    return this.userService.findUsers();
  }

  @Get('singular')
  @Roles([RoleEnum.administrator, RoleEnum.user])
  getUser(
    @Query() filter: UseFilterrDto,
    @Req() request: Request,
  ) {
    return this.userService.findUserData(filter, (request as any).userData as IUserCredentials);
  }

  @Post('login')
  @AllowUnauthorizedRequest()
  signIn(@Body() signInDto: Record<string, any>) {
    return this.userService.signIn(signInDto.email, signInDto.password);
  }

  @Post()
  @Roles([RoleEnum.administrator, RoleEnum.user])
  async upsertUser(
    @Body() user: UserDto,
    @Req() request: Request,
  ): Promise<UserDto> {
    await this.userService.upsertUser(user, (request as any).userData as IUserCredentials);
    return user;
  }

  @Delete()
  @Roles([RoleEnum.administrator])
  async deleteUser(
    @Body() user: UserDeleteDto,
  ): Promise<boolean> {
    await this.userService.deleteUser(user.email);
    return true;
  }
}
