// import {Get, Post, Body, Put, Delete, Param, Controller, Inject} from '@nestjs/common';
// import {Service} from '../enums';
// import {IBaseService} from './base.service';
//
// @Controller()
// export abstract class BaseController<M> {
//     protected constructor(
//         @Inject(Service.Base) private readonly baseService: IBaseService<M>,
//     ) {}
//
//     @Get()
//     async findAll(): Promise<M[]> {
//         return await this.baseService.findAll();
//     }
//
//     @Get(':id')
//     async findOne(@Param('id') id: number): Promise<M> {
//         return await this.baseService.findOne(id);
//     }
//
//     @Post()
//     async create(@Body() data: any): Promise<M> {
//         return await this.baseService.create(data);
//     }
//
//     @Put(':id')
//     async update(@Param('id') id: number, @Body() data: any): Promise<M> {
//         return await this.baseService.update(id, data);
//     }
//
//     @Delete(':id')
//     async delete(@Param('id') id: number): Promise<void> {
//         return await this.baseService.delete(id);
//     }
// }
