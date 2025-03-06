import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaStudentMapper } from "../mappers/prisma-student-mapper";

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!student) {
      return null;
    }

    return PrismaStudentMapper.toDomain(student);
  }

  async create(student: Student): Promise<Student> {
    const data = PrismaStudentMapper.toPrisma(student);

    const prismaStudent = await this.prisma.user.create({
      data,
    });

    return PrismaStudentMapper.toDomain(prismaStudent);
  }

  async save(student: Student): Promise<Student> {
    const data = PrismaStudentMapper.toPrisma(student);

    const prismaStudent = await this.prisma.user.update({
      where: { id: student.id.toString() },
      data,
    });

    return PrismaStudentMapper.toDomain(prismaStudent);
  }

  async delete(student: Student): Promise<void> {
    await this.prisma.user.delete({
      where: { id: student.id.toString() },
    });
  }
}
