// import { Injectable } from '@nestjs/common';
// import { Model } from 'sequelize-typescript';
//
// export interface IBaseService<M> {
//     findOne(id: number): Promise<M>;
//     findAll(): Promise<M[]>;
//     create(data: any): Promise<M>;
//     update(id: number, data: any): Promise<M>;
//     delete(id: number): Promise<void>;
// }
//
// @Injectable()
// export abstract class BaseService<M extends Model> implements IBaseService<Model> {
//     protected constructor(private readonly repository: typeof Model) {}
//
//     async findOne(id: number): Promise<M> {
//         return await this.repository.findByPk(id) as Promise<M>;
//     }
//
//     async findAll(): Promise<M[]> {
//         return await this.repository.findAll<M>();
//     }
//
//     async create(data: any): Promise<M> {
//         return await this.repository.create(data) as Promise<M>;
//     }
//
//     async update(id: number, data: any): Promise<M> {
//         const item = await this.findOne(id);
//         if (item) {
//             return item.update(data);
//         }
//         return null;
//     }
//
//     async delete(id: number): Promise<void> {
//         const item = await this.findOne(id);
//         if (item) {
//             await item.destroy();
//         }
//     }
// }
