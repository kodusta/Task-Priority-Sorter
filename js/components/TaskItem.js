function TaskItem({ task, onEdit, onDelete }) {
    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            case 'low': return 'priority-low';
            default: return 'priority-medium';
        }
    };

    const getPriorityText = (priority) => {
        switch (priority) {
            case 'high': return 'Yüksek';
            case 'medium': return 'Orta';
            case 'low': return 'Düşük';
            default: return 'Orta';
        }
    };

    return (
        <div className="task-item">
            <div className="task-content">
                <div className="task-title">{task.title}</div>
                {task.description && (
                    <div className="task-description">{task.description}</div>
                )}
            </div>
            <div className={`priority ${getPriorityClass(task.priority)}`}>
                {getPriorityText(task.priority)}
            </div>
            <div className="task-actions">
                <button 
                    className="btn btn-edit" 
                    onClick={() => onEdit(task)}
                >
                    Düzenle
                </button>
                <button 
                    className="btn btn-delete" 
                    onClick={() => onDelete(task.id)}
                >
                    Sil
                </button>
            </div>
        </div>
    );
}
