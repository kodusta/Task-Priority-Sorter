const { useState, useEffect } = React;

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium'
    });
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('priority');
    const [editingTask, setEditingTask] = useState(null);

    // localStorage'dan görevleri yükle
    useEffect(() => {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    // Görevleri localStorage'a kaydet
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Görev ekleme
    const addTask = () => {
        if (!newTask.title.trim()) return;
        
        const task = {
            id: Date.now(),
            ...newTask,
            createdAt: new Date().toISOString()
        };
        
        setTasks([...tasks, task]);
        setNewTask({ title: '', description: '', priority: 'medium' });
    };

    // Görev düzenleme
    const editTask = (task) => {
        setEditingTask(task);
        setNewTask({
            title: task.title,
            description: task.description,
            priority: task.priority
        });
    };

    // Görev güncelleme
    const updateTask = () => {
        if (!newTask.title.trim()) return;
        
        setTasks(tasks.map(task => 
            task.id === editingTask.id 
                ? { ...task, ...newTask }
                : task
        ));
        
        setEditingTask(null);
        setNewTask({ title: '', description: '', priority: 'medium' });
    };

    // Görev silme
    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    // Görevleri filtrele ve sırala
    const getFilteredAndSortedTasks = () => {
        let filteredTasks = tasks;
        
        if (filter !== 'all') {
            filteredTasks = tasks.filter(task => task.priority === filter);
        }
        
        return filteredTasks.sort((a, b) => {
            switch (sortBy) {
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'date':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Task Priority Sorter</h1>
                <p>Görevlerinizi önceliğe göre yönetin</p>
            </div>

            <div className="task-form">
                <h2>{editingTask ? 'Görev Düzenle' : 'Yeni Görev Ekle'}</h2>
                <div className="form-group">
                    <label htmlFor="title">Görev Başlığı</label>
                    <input
                        type="text"
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        placeholder="Görev başlığını girin"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Açıklama</label>
                    <input
                        type="text"
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        placeholder="Görev açıklamasını girin"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Öncelik</label>
                    <select
                        id="priority"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    >
                        <option value="low">Düşük</option>
                        <option value="medium">Orta</option>
                        <option value="high">Yüksek</option>
                    </select>
                </div>
                <button 
                    className="btn" 
                    onClick={editingTask ? updateTask : addTask}
                >
                    {editingTask ? 'Güncelle' : 'Görev Ekle'}
                </button>
                {editingTask && (
                    <button 
                        className="btn" 
                        onClick={() => {
                            setEditingTask(null);
                            setNewTask({ title: '', description: '', priority: 'medium' });
                        }}
                        style={{ marginLeft: '10px', backgroundColor: '#95a5a6' }}
                    >
                        İptal
                    </button>
                )}
            </div>

            <div className="filters">
                <div className="filter-group">
                    <label htmlFor="filter">Filtrele</label>
                    <select
                        id="filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">Tümü</option>
                        <option value="high">Yüksek Öncelik</option>
                        <option value="medium">Orta Öncelik</option>
                        <option value="low">Düşük Öncelik</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="sort">Sırala</label>
                    <select
                        id="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="priority">Önceliğe Göre</option>
                        <option value="title">Başlığa Göre</option>
                        <option value="date">Tarihe Göre</option>
                    </select>
                </div>
            </div>

            <TaskList 
                tasks={getFilteredAndSortedTasks()}
                onEdit={editTask}
                onDelete={deleteTask}
            />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
