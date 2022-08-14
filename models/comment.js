import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
}, {timestamps: true});

export default mongoose.model('Comment', commentSchema);