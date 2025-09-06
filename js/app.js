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
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTask, setEditingTask] = useState(null);

    // localStorage'dan görevleri yükle
    useEffect(() => {
        const savedTasks = Storage.loadTasks();
        setTasks(savedTasks);
    }, []);

    // Görevleri localStorage'a kaydet
    useEffect(() => {
        Storage.saveTasks(tasks);
    }, [tasks]);

    // Form validasyonu
    const validateTask = (task) => {
        if (!task.title.trim()) {
            alert('Görev başlığı boş olamaz!');
            return false;
        }
        if (task.title.length > 100) {
            alert('Görev başlığı 100 karakterden uzun olamaz!');
            return false;
        }
        if (task.description.length > 500) {
            alert('Görev açıklaması 500 karakterden uzun olamaz!');
            return false;
        }
        return true;
    };

    // Görev ekleme
    const addTask = () => {
        if (!validateTask(newTask)) return;
        
        const task = {
            id: Date.now(),
            title: newTask.title.trim(),
            description: newTask.description.trim(),
            priority: newTask.priority,
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
        if (!validateTask(newTask)) return;
        
        setTasks(tasks.map(task => 
            task.id === editingTask.id 
                ? { 
                    ...task, 
                    title: newTask.title.trim(),
                    description: newTask.description.trim(),
                    priority: newTask.priority,
                    updatedAt: new Date().toISOString()
                }
                : task
        ));
        
        setEditingTask(null);
        setNewTask({ title: '', description: '', priority: 'medium' });
    };

    // Görev silme
    const deleteTask = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (task && confirm(`"${task.title}" görevini silmek istediğinizden emin misiniz?`)) {
            setTasks(tasks.filter(task => task.id !== taskId));
        }
    };

    // Enter tuşu ile görev ekleme
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (editingTask) {
                updateTask();
            } else {
                addTask();
            }
        }
    };

    // Öncelik istatistikleri
    const getPriorityStats = () => {
        const stats = Storage.getTaskCountsByPriority();
        return stats;
    };

    // Arama fonksiyonu
    const searchTasks = (tasks, searchTerm) => {
        if (!searchTerm.trim()) return tasks;
        
        const term = searchTerm.toLowerCase();
        return tasks.filter(task => 
            task.title.toLowerCase().includes(term) ||
            task.description.toLowerCase().includes(term)
        );
    };

    // Görevleri filtrele ve sırala
    const getFilteredAndSortedTasks = () => {
        let filteredTasks = tasks;
        
        // Öncelik filtresi
        if (filter !== 'all') {
            filteredTasks = tasks.filter(task => task.priority === filter);
        }
        
        // Arama filtresi
        filteredTasks = searchTasks(filteredTasks, searchTerm);
        
        // Sıralama
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

    // Filtreleri temizle
    const clearFilters = () => {
        setFilter('all');
        setSearchTerm('');
        setSortBy('priority');
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
                        onKeyPress={handleKeyPress}
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

            <div className="priority-stats">
                <div className="stats-title">Görev İstatistikleri</div>
                <div className="stats-grid">
                    <div className="stat-item stat-high">
                        <div className="stat-number">{getPriorityStats().high}</div>
                        <div className="stat-label">Yüksek Öncelik</div>
                    </div>
                    <div className="stat-item stat-medium">
                        <div className="stat-number">{getPriorityStats().medium}</div>
                        <div className="stat-label">Orta Öncelik</div>
                    </div>
                    <div className="stat-item stat-low">
                        <div className="stat-number">{getPriorityStats().low}</div>
                        <div className="stat-label">Düşük Öncelik</div>
                    </div>
                    <div className="stat-item stat-total">
                        <div className="stat-number">{getPriorityStats().total}</div>
                        <div className="stat-label">Toplam Görev</div>
                    </div>
                </div>
            </div>

            <div className="filters">
                <div className="filter-group">
                    <label htmlFor="search">🔍 Arama</label>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Görev başlığı veya açıklamasında ara..."
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="filter">Öncelik Filtresi</label>
                    <select
                        id="filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">Tüm Görevler</option>
                        <option value="high">🔴 Yüksek Öncelik</option>
                        <option value="medium">🟡 Orta Öncelik</option>
                        <option value="low">🟢 Düşük Öncelik</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="sort">Sıralama</label>
                    <select
                        id="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="priority">📊 Önceliğe Göre</option>
                        <option value="title">🔤 Başlığa Göre</option>
                        <option value="date">📅 Tarihe Göre</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>&nbsp;</label>
                    <button 
                        className="btn" 
                        onClick={clearFilters}
                        style={{ backgroundColor: '#95a5a6' }}
                    >
                        🗑️ Temizle
                    </button>
                </div>
            </div>

            {(searchTerm || filter !== 'all') && (
                <div style={{ 
                    background: '#e8f4f8', 
                    padding: '10px 15px', 
                    borderRadius: '4px', 
                    marginBottom: '20px',
                    border: '1px solid #bee5eb',
                    color: '#0c5460'
                }}>
                    <strong>Filtreleme Aktif:</strong> {getFilteredAndSortedTasks().length} görev bulundu
                    {searchTerm && ` (arama: "${searchTerm}")`}
                    {filter !== 'all' && ` (öncelik: ${filter})`}
                </div>
            )}

            <TaskList 
                tasks={getFilteredAndSortedTasks()}
                onEdit={editTask}
                onDelete={deleteTask}
                searchTerm={searchTerm}
                filter={filter}
            />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
