import {BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";


@Entity('users')
export class UsersEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ name: 'user_id' })
    userId: string;

    @Column()
    pass: string;

    @Column({nullable: true})
    name: string;

    @Column({nullable: true})
    surname: string;

    @Column({ nullable: true })
    patronymic: string;

    @Column({nullable: true})
    phone: string;

    @Column()
    email: string;

    @Column({name: 'date_of_birth', nullable: true})
    dateOfBirth: Date;
}