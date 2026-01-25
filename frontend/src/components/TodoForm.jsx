import { useState } from "react";
import PropTypes from 'prop-types';

function TodoForm({ onSubmit, initialData = null, onCancel }) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");


    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, description });
        if (!initialData) {
            setTitle("");
            setDescription("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="todo-form">
            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="What needs to be done?"
                />
            </div>
            <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    placeholder="Add details..."
                />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">
                    {initialData ? "Update Task" : "Add Task"}
                </button>
                {initialData && (
                    <button type="button" onClick={onCancel} className="btn-secondary">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

TodoForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
    }),
    onCancel: PropTypes.func,
};

export default TodoForm;
