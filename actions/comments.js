'use server';

// Note: We need to fix the firebase-admin import too
// Let's check if firebase-admin is installed
const admin = require('firebase-admin');

// Initialize if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const adminDb = admin.firestore();

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
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { error: 'Failed to add comment. Please try again.' };
  }
}

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
