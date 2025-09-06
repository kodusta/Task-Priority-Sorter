function TaskList({ tasks, onEdit, onDelete }) {
    if (tasks.length === 0) {
        return (
            <div className="task-list">
                <div className="task-item">
                    <div className="task-content">
                        <div className="task-title">Henüz görev eklenmemiş</div>
                        <div className="task-description">Yukarıdaki formu kullanarak ilk görevinizi ekleyin</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
