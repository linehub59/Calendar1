
import { useState, useEffect } from 'react'
import {
  ChevronLeft, ChevronRight, Plus,
  Check, Trash2, CalendarDays,
  Target, ListTodo, Sun, X,
  Clock, Sparkles, Pencil
} from 'lucide-react'

const today = new Date()

const dateKey = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const initialPlans = {
  [dateKey(today)]: [
    {
      id: 1,
      title: 'Plan my day',
      time: '08:00',
      done: false,
      category: 'Personal'
    },
    {
      id: 2,
      title: 'Work on my goals',
      time: '10:00',
      done: false,
      category: 'Work'
    }
  ]
}

const categories = ['Personal', 'Work', 'Study', 'Health', 'Other']

export default function App() {
  const [month, setMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const [selected, setSelected] = useState(dateKey(today))
  const [plans, setPlans] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dayflow-plans')) || initialPlans
    } catch {
      return initialPlans
    }
  })

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('09:00')
  const [category, setCategory] = useState('Personal')

  useEffect(() => {
    localStorage.setItem('dayflow-plans', JSON.stringify(plans))
  }, [plans])

  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ]

  while (cells.length % 7 !== 0) cells.push(null)

  const currentPlans = plans[selected] || []
  const completed = currentPlans.filter(p => p.done).length
  const pending = currentPlans.length - completed

  const selectedDate = new Date(`${selected}T12:00:00`)

  const changeMonth = (amount) => {
    setMonth(new Date(year, monthIndex + amount, 1))
  }

  const openForm = (plan = null) => {
    setEditing(plan)
    setTitle(plan?.title || '')
    setTime(plan?.time || '09:00')
    setCategory(plan?.category || 'Personal')
    setShowForm(true)
  }

  const savePlan = () => {
    if (!title.trim()) return

    const item = {
      id: editing?.id || Date.now(),
      title: title.trim(),
      time,
      category,
      done: editing?.done || false
    }

    setPlans(prev => {
      const list = prev[selected] || []
      return {
        ...prev,
        [selected]: editing
          ? list.map(p => p.id === editing.id ? item : p)
          : [...list, item].sort((a, b) =>
              a.time.localeCompare(b.time)
            )
      }
    })

    setShowForm(false)
    setEditing(null)
    setTitle('')
  }

  const togglePlan = (id) => {
    setPlans(prev => ({
      ...prev,
      [selected]: (prev[selected] || []).map(p =>
        p.id === id ? { ...p, done: !p.done } : p
      )
    }))
  }

  const deletePlan = (id) => {
    setPlans(prev => ({
      ...prev,
      [selected]: (prev[selected] || []).filter(p => p.id !== id)
    }))
  }

  const goToday = () => {
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelected(dateKey(today))
  }

  const monthName = month.toLocaleDateString('en', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="app">

      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <CalendarDays size={23}/>
          </div>
          <div>
            <h2>dayflow<span>.</span></h2>
            <small>Make every day count</small>
          </div>
        </div>

        <button className="today-btn" onClick={goToday}>
          Today
        </button>
      </header>

      <main>

        <section className="welcome">
          <div>
            <p className="eyebrow">
              <Sparkles size={14}/> YOUR PERSONAL PLANNER
            </p>
            <h1>Make today<br/> <span>meaningful.</span></h1>
            <p className="welcome-text">
              Small steps every day lead to big achievements.
            </p>
          </div>
          <div className="sun-icon">
            <Sun size={48}/>
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon purple">
              <ListTodo size={20}/>
            </div>
            <div>
              <strong>{currentPlans.length}</strong>
              <small>Today's plans</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Check size={20}/>
            </div>
            <div>
              <strong>{completed}</strong>
              <small>Completed</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Target size={20}/>
            </div>
            <div>
              <strong>{pending}</strong>
              <small>Remaining</small>
            </div>
          </div>
        </section>

        <section className="calendar-card">

          <div className="calendar-heading">
            <div>
              <p className="eyebrow">YOUR SCHEDULE</p>
              <h2>{monthName}</h2>
            </div>

            <div className="month-controls">
              <button onClick={() => changeMonth(-1)}>
                <ChevronLeft/>
              </button>
              <button onClick={() => changeMonth(1)}>
                <ChevronRight/>
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d =>
              <div className="weekday" key={d}>{d}</div>
            )}

            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`}/>

              const date = dateKey(new Date(year, monthIndex, day))
              const isToday = date === dateKey(today)
              const isSelected = date === selected
              const count = (plans[date] || []).length
              const allDone = count > 0 &&
                (plans[date] || []).every(p => p.done)

              return (
                <button
                  key={date}
                  className={`day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => setSelected(date)}
                >
                  <span>{day}</span>
                  {count > 0 && (
                    <i className={allDone ? 'done-dot' : ''}/>
                  )}
                </button>
              )
            })}
          </div>

          <div className="calendar-legend">
            <span><i className="legend-purple"/> Has activities</span>
            <span><i className="legend-green"/> Completed</span>
          </div>
        </section>

        <section className="tasks-section">

          <div className="tasks-heading">
            <div>
              <p className="eyebrow">YOUR DAILY ROUTINE</p>
              <h2>
                {selected === dateKey(today)
                  ? "Today's plans"
                  : selectedDate.toLocaleDateString('en', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
              </h2>
              <p className="task-subtitle">
                {currentPlans.length === 0
                  ? 'A fresh day. Make it count.'
                  : `${completed} of ${currentPlans.length} activities completed`}
              </p>
            </div>

            <button className="add-btn" onClick={() => openForm()}>
              <Plus size={19}/> Add
            </button>
          </div>

          {currentPlans.length > 0 ? (
            <div className="task-list">
              {currentPlans.map(plan => (
                <div className={`task ${plan.done ? 'task-done' : ''}`} key={plan.id}>
                  <button
                    className={`check-btn ${plan.done ? 'checked' : ''}`}
                    onClick={() => togglePlan(plan.id)}
                    aria-label="Toggle completion"
                  >
                    {plan.done && <Check size={17}/>}
                  </button>

                  <div className="task-info">
                    <strong>{plan.title}</strong>
                    <div className="task-meta">
                      <span><Clock size={13}/> {plan.time}</span>
                      <span className="category">{plan.category}</span>
                    </div>
                  </div>

                  <button className="icon-btn" onClick={() => openForm(plan)}>
                    <Pencil size={17}/>
                  </button>

                  <button className="icon-btn delete" onClick={() => deletePlan(plan.id)}>
                    <Trash2 size={17}/>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <CalendarDays size={32}/>
              </div>
              <h3>Nothing planned yet</h3>
              <p>Add your first activity and give this day a purpose.</p>
              <button onClick={() => openForm()}>
                <Plus size={17}/> Create an activity
              </button>
            </div>
          )}

        </section>

        <footer>
          <Sparkles size={15}/>
          <span>One day at a time. One goal at a time.</span>
        </footer>

      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <p className="eyebrow">DAILY PLANNER</p>
                <h2>{editing ? 'Edit activity' : 'New activity'}</h2>
              </div>
              <button className="icon-btn" onClick={() => setShowForm(false)}>
                <X/>
              </button>
            </div>

            <label>What do you want to do?</label>
            <input
              autoFocus
              placeholder="e.g. Study mathematics"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <label>Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
            />

            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>

            <button className="save-btn" onClick={savePlan}>
              {editing ? 'Save changes' : 'Add to my day'}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
