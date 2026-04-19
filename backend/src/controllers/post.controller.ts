import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  version: z.number().optional()
});

const generateSlug = (title: string): string => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export class PostController {
  
  static async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async createPost(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = postSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({ error: 'Validation failed', details: validationResult.error.issues });
        return;
      }

      const data = validationResult.data;
      const uniqueSlug = `${generateSlug(data.title)}-${Date.now().toString().slice(-4)}`;

      const newPost = await prisma.post.create({
        data: {
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl || null,
          slug: uniqueSlug,
          version: 1 // Versión inicial
        }
      });
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getPost(req: Request, res: Response): Promise<void> {
    try {
      const post = await prisma.post.findFirst({
        where: { OR: [{ id: req.params.identifier }, { slug: req.params.identifier }] }
      });
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validationResult = postSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({ error: 'Validation failed', details: validationResult.error.issues });
        return;
      }

      const data = validationResult.data;
      const post = await prisma.post.findUnique({ where: { id } });

      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      // Control de Concurrencia Optimista (OCC) puro
      if (data.version && post.version !== data.version) {
        res.status(409).json({ error: 'Conflict: Version mismatch' });
        return;
      }

      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl || null,
          version: { increment: 1 } // Subimos la versión automáticamente
        }
      });

      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const post = await prisma.post.findUnique({ where: { id } });

      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      await prisma.post.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}