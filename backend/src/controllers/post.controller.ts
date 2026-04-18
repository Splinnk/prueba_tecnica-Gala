import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class PostController {
  
  static async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error fetching posts' });
    }
  }

  // Placeholder for Create, Update, Delete, GetById...
}