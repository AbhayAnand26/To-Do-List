class TodoApp {
            constructor() {
                this.tasks = [];
                this.currentFilter = 'all';
                this.editingId = null;
                this.init();
            }

            init() {
                this.loadSampleTasks();
                this.bindEvents();
                this.render();
            }

            loadSampleTasks() {
                this.tasks = [
                    {
                        id: 1,
                        text: 'Learn web dev',
                        completed: false,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        text: 'Practice coding',
                        completed: false,
                        createdAt: new Date().toISOString()
                    }
                ];
            }

            bindEvents() {
                // Add task events
                document.getElementById('addBtn').addEventListener('click', () => this.addTask());
                document.getElementById('taskInput').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addTask();
                });

                // Filter button events
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
                });

                // Task list events (delegated)
                document.getElementById('tasksList').addEventListener('click', (e) => this.handleTaskClick(e));
                document.getElementById('tasksList').addEventListener('keypress', (e) => this.handleTaskKeypress(e));
            }

            addTask() {
                const input = document.getElementById('taskInput');
                const text = input.value.trim();
                
                if (text === '') return;

                const task = {
                    id: Date.now(),
                    text: text,
                    completed: false,
                    createdAt: new Date().toISOString()
                };

                this.tasks.push(task);
                input.value = '';
                this.render();
            }

            toggleTask(id) {
                const task = this.tasks.find(t => t.id === id);
                if (task) {
                    task.completed = !task.completed;
                    this.render();
                }
            }

            deleteTask(id) {
                this.tasks = this.tasks.filter(t => t.id !== id);
                this.render();
            }

            startEdit(id) {
                this.editingId = id;
                this.render();
            }

            saveEdit(id) {
                const input = document.querySelector(`#edit-input-${id}`);
                const text = input.value.trim();
                
                if (text === '') return;

                const task = this.tasks.find(t => t.id === id);
                if (task) {
                    task.text = text;
                    this.editingId = null;
                    this.render();
                }
            }

            cancelEdit() {
                this.editingId = null;
                this.render();
            }

            setFilter(filter) {
                this.currentFilter = filter;
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.filter === filter);
                });
                this.render();
            }

            getFilteredTasks() {
                switch (this.currentFilter) {
                    case 'completed':
                        return this.tasks.filter(t => t.completed);
                    case 'pending':
                        return this.tasks.filter(t => !t.completed);
                    default:
                        return this.tasks;
                }
            }

            handleTaskClick(e) {
                const taskItem = e.target.closest('.task-item');
                if (!taskItem) return;

                const taskId = parseInt(taskItem.dataset.id);

                if (e.target.classList.contains('task-checkbox')) {
                    this.toggleTask(taskId);
                } else if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
                    this.startEdit(taskId);
                } else if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
                    this.deleteTask(taskId);
                } else if (e.target.classList.contains('save-btn') || e.target.closest('.save-btn')) {
                    this.saveEdit(taskId);
                } else if (e.target.classList.contains('cancel-btn') || e.target.closest('.cancel-btn')) {
                    this.cancelEdit();
                }
            }

            handleTaskKeypress(e) {
                if (e.key === 'Enter' && e.target.classList.contains('task-input-edit')) {
                    const taskItem = e.target.closest('.task-item');
                    if (taskItem) {
                        const taskId = parseInt(taskItem.dataset.id);
                        this.saveEdit(taskId);
                    }
                }
            }

            updateFilterCounts() {
                const all = this.tasks.length;
                const completed = this.tasks.filter(t => t.completed).length;
                const pending = this.tasks.filter(t => !t.completed).length;

                document.querySelector('[data-filter="all"] .count').textContent = `(${all})`;
                document.querySelector('[data-filter="completed"] .count').textContent = `(${completed})`;
                document.querySelector('[data-filter="pending"] .count').textContent = `(${pending})`;
            }

            updateStats() {
                const total = this.tasks.length;
                const completed = this.tasks.filter(t => t.completed).length;
                const pending = total - completed;
                const progress = total > 0 ? (completed / total) * 100 : 0;

                document.getElementById('totalTasks').textContent = total;
                document.getElementById('completedTasks').textContent = completed;
                document.getElementById('pendingTasks').textContent = pending;
                document.getElementById('progressFill').style.width = `${progress}%`;

                const statsCard = document.getElementById('statsCard');
                statsCard.style.display = total > 0 ? 'block' : 'none';
            }

            renderTask(task) {
                const isEditing = this.editingId === task.id;
                const date = new Date(task.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });

                return `
                    <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                        <div class="task-checkbox ${task.completed ? 'completed' : ''}"></div>
                        <div class="task-content">
                            ${isEditing ? `
                                <input type="text" class="task-input-edit" id="edit-input-${task.id}" value="${task.text}" maxlength="200">
                            ` : `
                                <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
                                <div class="task-date">
                                    <i class="fas fa-calendar-alt"></i>
                                    Created: ${date}
                                </div>
                            `}
                        </div>
                        <div class="task-actions">
                            ${isEditing ? `
                                <button class="action-btn save-btn" title="Save">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="action-btn cancel-btn" title="Cancel">
                                    <i class="fas fa-times"></i>
                                </button>
                            ` : `
                                <button class="action-btn edit-btn" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete-btn" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            `}
                        </div>
                    </div>
                `;
            }

            renderEmptyState() {
                const messages = {
                    all: 'Add a task to get started!',
                    pending: 'No pending tasks yet.',
                    completed: 'No completed tasks yet.'
                };

                return `
                    <div class="empty-state">
                        <div class="icon">📝</div>
                        <h3>No tasks found</h3>
                        <p>${messages[this.currentFilter]}</p>
                    </div>
                `;
            }

            render() {
                const filteredTasks = this.getFilteredTasks();
                const tasksList = document.getElementById('tasksList');

                if (filteredTasks.length === 0) {
                    tasksList.innerHTML = this.renderEmptyState();
                } else {
                    tasksList.innerHTML = filteredTasks.map(task => this.renderTask(task)).join('');
                }

                // Focus edit input if editing
                if (this.editingId) {
                    const editInput = document.getElementById(`edit-input-${this.editingId}`);
                    if (editInput) {
                        editInput.focus();
                        editInput.select();
                    }
                }

                this.updateFilterCounts();
                this.updateStats();
            }
        }

        // Initialize app when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new TodoApp();
        });