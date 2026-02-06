import { getComments } from '../actions/comments'; // Changed from '@/actions/comments'
import CommentForm from './CommentForm';

export default async function CommentSection() {
  const comments = await getComments();

  return (
    <div className="comment-section">
      <h2 className="text-2xl font-bold mb-6">Community Comments</h2>
      
      <CommentForm />
      
      <div className="comments-list">
        <h3 className="text-lg font-semibold mb-4">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-5 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-blue-700">{comment.username}</h4>
                  <span className="text-sm text-gray-500">
                    {comment.timestamp && new Date(comment.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
