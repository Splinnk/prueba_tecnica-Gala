import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

// Validation Schema using Zod
const postSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
  imageUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal(''))
});

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export class PostController {
  
  // GET /api/posts
  static async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor al obtener los posts' });
    }
  }

  // POST /api/posts
  static async createPost(req: Request, res: Response): Promise<void> {
    try {
      // 1. Safe Validation (Architectural Best Practice)
      const validationResult = postSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({ 
          error: 'La validación falló', 
          details: validationResult.error.issues 
        });
        return;
      }

      const validatedData = validationResult.data;
      
      // 2. Generate a unique slug
      const baseSlug = generateSlug(validatedData.title);
      const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      // 3. Save to database
      const newPost = await prisma.post.create({
        data: {
          title: validatedData.title,
          content: validatedData.content,
          imageUrl: validatedData.imageUrl || null,
          slug: uniqueSlug
        }
      });

      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor al crear el post' });
    }
  }

  // GET /api/posts/:identifier (ID or Slug)
  static async getPost(req: Request, res: Response): Promise<void> {
    try {
      const { identifier } = req.params;
      
      const post = await prisma.post.findFirst({
        where: {
          OR: [
            { id: identifier },
            { slug: identifier }
          ]
        }
      });

      if (!post) {
        res.status(404).json({ error: 'Post no encontrado' });
        return;
      }

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor encontrando el post' });
    }
  }

  // PUT /api/posts/:id
  static async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Safe Validation
      const validationResult = postSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({ 
          error: 'La validación falló', 
          details: validationResult.error.issues 
        });
        return;
      }

      const validatedData = validationResult.data;

      // We don't update the slug to prevent breaking existing URLs
      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          title: validatedData.title,
          content: validatedData.content,
          imageUrl: validatedData.imageUrl || null,
        }
      });

      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor al actualizar el post' });
    }
  }

  // DELETE /api/posts/:id
  static async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      await prisma.post.delete({
        where: { id }
      });

      res.status(204).send(); // 204 No Content is standard for successful deletion
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor al eliminar el post' });
    }
  }
}