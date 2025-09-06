function TaskList({ tasks, onEdit, onDelete, searchTerm, filter }) {
    if (tasks.length === 0) {
        const isSearching = searchTerm && searchTerm.trim();
        const isFiltering = filter && filter !== 'all';
        
        let message = "Henüz görev eklenmemiş";
        let description = "Yukarıdaki formu kullanarak ilk görevinizi ekleyin";
        
        if (isSearching || isFiltering) {
            message = "Arama kriterlerinize uygun görev bulunamadı";
            description = "Farklı arama terimleri deneyin veya filtreleri temizleyin";
        }
        
        return (
            <div className="task-list">
                <div className="task-item">
                    <div className="task-content">
                        <div className="task-title">{message}</div>
                        <div className="task-description">{description}</div>
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
