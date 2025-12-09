import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, LoginCredentials, AuthToken } from '../types';

class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string;
  
  // 模拟用户数据库（实际应该连接真实数据库）
  private users: Map<string, User & { password: string }>;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    // 初始化默认用户
    this.users = new Map();
    this.initDefaultUsers();
  }

  /**
   * 初始化默认用户
   */
  private async initDefaultUsers() {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    this.users.set('admin', {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      password: adminPassword,
    });

    this.users.set('user', {
      id: '2',
      username: 'user',
      email: 'user@example.com',
      role: 'user',
      password: userPassword,
    });
  }

  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials): Promise<AuthToken & { user: User }> {
    const { username, password } = credentials;

    // 查找用户
    const userWithPassword = this.users.get(username);
    if (!userWithPassword) {
      throw new Error('Invalid credentials');
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, userWithPassword.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // 生成 JWT token
    const { password: _, ...user } = userWithPassword;
    const token = this.generateToken(user);

    return {
      token,
      expiresIn: this.jwtExpiresIn,
      user,
    };
  }

  /**
   * 生成 JWT token
   */
  generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      this.jwtSecret,
      {
        expiresIn: this.jwtExpiresIn,
      }
    );
  }

  /**
   * 验证 JWT token
   */
  verifyToken(token: string): User {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as User;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * 用户注册（简化版）
   */
  async register(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<User> {
    // 检查用户是否存在
    if (this.users.has(userData.username)) {
      throw new Error('Username already exists');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 创建新用户
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      role: 'user',
      password: hashedPassword,
    };

    this.users.set(userData.username, newUser);

    const { password: _, ...user } = newUser;
    return user;
  }

  /**
   * 获取用户信息
   */
  getUserById(id: string): User | null {
    for (const userWithPassword of this.users.values()) {
      if (userWithPassword.id === id) {
        const { password: _, ...user } = userWithPassword;
        return user;
      }
    }
    return null;
  }

  /**
   * 获取用户信息（通过用户名）
   */
  getUserByUsername(username: string): User | null {
    const userWithPassword = this.users.get(username);
    if (!userWithPassword) {
      return null;
    }
    const { password: _, ...user } = userWithPassword;
    return user;
  }
}

export default new AuthService();
