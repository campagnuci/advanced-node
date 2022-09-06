import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ name: 'nome', nullable: true })
    name?: string

  @Column()
    email!: string

  @Column({ name: 'id_facebook', nullable: true })
    facebookId?: string

  @Column({ name: 'picture_url', nullable: true })
    imageUrl?: string

  @Column({ name: 'initials', nullable: true })
    initials?: string
}
