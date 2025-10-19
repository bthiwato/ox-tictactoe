
import { useEffect, useState } from 'react'
import { getMe, loginGoogle, logout } from './api'
import Board from './components/Board'
import Leaderboard from './components/Leaderboard'
import './styles.css'

export default function App(){
  const [me, setMe] = useState<any>(null)
  const [tab, setTab] = useState<'game'|'leaderboard'>('game')

  useEffect(() => { (async () => setMe(await getMe()))() }, [])

  function handleScoreUpdate(next: { score: number; winStreak: number }) {
    setMe((m:any) => (m ? { ...m, ...next } : m))
  }

  if (!me) {
    return (
      <div className="app">
        <div className="container" style={{display:'grid',placeItems:'center',flex:1}}>
          <div className="card" style={{maxWidth:420,width:'100%',textAlign:'center'}}>
            <div className="brand" style={{justifyContent:'center',marginBottom:12}}>
              <div className="brand__logo"/>
              <div className="brand__name">OX Tic-Tac-Toe</div>
            </div>
            <p className="small">ลงชื่อเข้าใช้งานก่อนเริ่มเล่นเกม</p>
            <button className="btn btn--primary" onClick={loginGoogle} style={{width:'100%',marginTop:10}}>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
          <div className="brand"><div className="brand__logo"/><div className="brand__name">OX Tic-Tac-Toe</div></div>
          <div className="user" style={{display:'flex',alignItems:'center',gap:10}}>
            {me.photoUrl && <img src={me.photoUrl} alt="avatar" style={{width:36,height:36,borderRadius:18}}/>}
            <div>
              <div style={{fontWeight:700}}>{me.name}</div>
              <div className="small">คะแนน: {me.score} • ชนะติด: {me.winStreak}</div>
            </div>
            <button className="btn btn--ghost" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      <main style={{flex:1}}>
        <div className="container">
          <nav className="tabs" style={{marginTop:12, display:'flex', gap:8}}>
            <button className="btn" onClick={() => setTab('game')} aria-pressed={tab==='game'}>🎮 เล่นเกม</button>
            <button className="btn" onClick={() => setTab('leaderboard')} aria-pressed={tab==='leaderboard'}>🏆 Leaderboard</button>
          </nav>

          {tab === 'game'
            ? <Board onScoreUpdate={handleScoreUpdate}/>
            : (
              <div className="card" style={{marginTop:12}}>
                <div className="table-wrap">
                  <Leaderboard/>
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  )
}
