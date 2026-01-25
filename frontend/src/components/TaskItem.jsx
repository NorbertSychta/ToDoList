import PropTypes from 'prop-types';

function TaskItem({ task, onToggle, onDelete, onEdit }) {
    return (
        <div className={`task-item ${task.completed ? "completed" : ""}`}>
            <div className="task-content">
                <div className="checkbox-wrapper">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggle(task.id, !task.completed)}
                    />
                </div>
                <div className="task-text">
                    <h3 onClick={() => onToggle(task.id, !task.completed)}>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                </div>
            </div>
            <div className="task-actions">
                <button onClick={() => onEdit(task)} className="btn-icon edit" title="Edit">
                    ✏️
                </button>
                <button onClick={() => onDelete(task.id)} className="btn-icon delete" title="Delete">
                    🗑️
                </button>
            </div>
        </div>
    );
}

TaskItem.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        completed: PropTypes.bool.isRequired,
    }).isRequired,
    onToggle: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default TaskItem;

