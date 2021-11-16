import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchTasks(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get('/apps/xxx/tasks', { params: payload })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addTask(ctx, taskData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/apps/xxx/tasks', { task: taskData })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    updateTask(ctx, { task }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/apps/xxx/tasks/${task.id}`, { task })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    removeTask(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/apps/xxx/tasks/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
