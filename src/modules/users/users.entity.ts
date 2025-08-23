import {BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";


@Entity('users')
export class UsersEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ name: 'user_id', type: 'bigint' })
    user_id: string;

    @Column()
    pass: string;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    phone: string;
}