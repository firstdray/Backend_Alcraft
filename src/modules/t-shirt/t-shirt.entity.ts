import {BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";


@Entity('t-shirt')
export class TShirtEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({name: 't_shirt_id'})
    tShirtId: string;

    @Index()
    @Column({name: 't_shirt_name'})
    tShirtName: string;

    @Index()
    @Column({ name: 'name_collection'})
    nameCollection: string;

    @Index()
    @Column({name: 'collection_id'})
    collectionID: string;

    @Index()
    @Column()
    color: string

    @Index()
    @Column()
    cut: string;

    @Column()
    price: number;

    @Column({ name: 'picture_path', type: 'jsonb', nullable: true})
    picturePath: Array<string>;

    @Column()
    discount: number;

    @Column({ name: 'tech_info', type: 'jsonb', nullable: true })
    techInfo: Array<string>;

    @Column({ type: 'jsonb', nullable: true })
    size: Array<string>;

    @Column({ type: 'jsonb', nullable: true })
    density: Array<number>;

    @Column({nullable: true})
    description: string;
}