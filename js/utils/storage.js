// localStorage utility fonksiyonları
const Storage = {
    // Görevleri kaydet
    saveTasks: (tasks) => {
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            return true;
        } catch (error) {
            console.error('Görevler kaydedilemedi:', error);
            return false;
        }
    },

    // Görevleri yükle
    loadTasks: () => {
        try {
            const tasks = localStorage.getItem('tasks');
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Görevler yüklenemedi:', error);
            return [];
        }
    },

    // Tüm görevleri sil
    clearTasks: () => {
        try {
            localStorage.removeItem('tasks');
            return true;
        } catch (error) {
            console.error('Görevler silinemedi:', error);
            return false;
        }
    },

    // Görev sayısını al
    getTaskCount: () => {
        const tasks = Storage.loadTasks();
        return tasks.length;
    },

    // Öncelik bazlı görev sayıları
    getTaskCountsByPriority: () => {
        const tasks = Storage.loadTasks();
        return {
            high: tasks.filter(task => task.priority === 'high').length,
            medium: tasks.filter(task => task.priority === 'medium').length,
            low: tasks.filter(task => task.priority === 'low').length,
            total: tasks.length
        };
    }
};
