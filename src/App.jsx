import { useEffect, useState } from 'react'

const api = (path, opts) =>
  fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })

export default function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await api('/todos')
      setTodos(await res.json())
      setError('')
    } catch {
      setError('Cannot reach backend')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const add = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await api('/todos', { method: 'POST', body: JSON.stringify({ title }) })
    setTitle('')
    load()
  }

  const toggle = async (id) => {
    await api(`/todos/${id}`, { method: 'PATCH' })
    load()
  }

  const remove = async (id) => {
    await api(`/todos/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <main className="card">
      <h1>Todo App</h1>
      <p className="sub">React + Go + PostgreSQL, deployed by Jenkins</p>
      <form onSubmit={add}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul>
        {todos.map((t) => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span>{t.title}</span>
            </label>
            <button className="del" onClick={() => remove(t.id)}>×</button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && !error && <p className="sub">No todos yet.</p>}
    </main>
  )
}
