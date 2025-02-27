import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<{ id: number; username: string } | null> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(pass, user.password))) {
      return { id: user.id, username: user.username };
    }
    return null;
  }

  async register(username: string, password: string): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async login(username: string, password: string): Promise<{ token: string }> {
    const user = await this.validateUser(username, password);
    if (!user) throw new Error('Invalid credentials');

    const payload = { username: user.username, sub: user.id };
    return { token: this.jwtService.sign(payload) };
  }
}
