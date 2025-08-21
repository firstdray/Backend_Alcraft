import {BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Entity('orders')
export class OrdersEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({name: 'user_id'})
    userId: string;

    @Column()
    count: number;

    @Column()
    price: number;

    @Index()
    @Column()
    stage: string;

    @CreateDateColumn()
    created_at: Date;
}