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

    return (
        <div className="container">
            <div className="header">
                <h1>Task Priority Sorter</h1>
                <p>Görevlerinizi önceliğe göre yönetin</p>
            </div>

            <div className="task-form">
                <h2>Yeni Görev Ekle</h2>
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
                <button className="btn" onClick={() => {}}>
                    Görev Ekle
                </button>
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

            <div className="task-list">
                <div className="task-item">
                    <div className="task-content">
                        <div className="task-title">Örnek Görev</div>
                        <div className="task-description">Bu bir örnek görevdir</div>
                    </div>
                    <div className="priority priority-medium">Orta</div>
                    <div className="task-actions">
                        <button className="btn btn-edit">Düzenle</button>
                        <button className="btn btn-delete">Sil</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
