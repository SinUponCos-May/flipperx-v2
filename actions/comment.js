'use server';

import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

// Server action to add a comment
export async function addComment(formData) {
  const username = formData.get('username');
  const text = formData.get('text');

  // Validation
  if (!username || !text) {
    return { error: 'Username and comment are required' };
  }

  if (username.length < 2 || username.length > 50) {
    return { error: 'Username must be between 2 and 50 characters' };
  }

  if (text.length > 1000) {
    return { error: 'Comment must be 1000 characters or less' };
  }

  try {
    await adminDb.collection('comments').add({
      username,
      text,
      timestamp: Timestamp.now(),
    });

    // Revalidate the page to show new comment
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { error: 'Failed to add comment. Please try again.' };
  }
}

// Server function to get comments (for server-side rendering)
export async function getComments() {
  try {
    const snapshot = await adminDb
      .collection('comments')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const comments = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        username: data.username,
        text: data.text,
        timestamp: data.timestamp?.toDate().toISOString(),
      });
    });

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}