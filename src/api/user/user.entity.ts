import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  Default,
} from 'sequelize-typescript';

@Table({ tableName: 'user', timestamps: false })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column
  email: string;

  @Column
  password: string;

  @Column({ allowNull: true })
  name?: string;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deletedAt?: Date;
}
