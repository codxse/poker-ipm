import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { Exclude } from 'class-transformer'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ type: 'varchar', nullable: false })
  firstName: string

  @Column({ type: 'varchar', nullable: true })
  lastName: string

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string

  @Column({ type: 'varchar', nullable: true })
  username: string

  @Column({ type: 'varchar', nullable: false })
  email: string

  @Column({ type: 'varchar', nullable: false })
  @Exclude()
  password: string
}
