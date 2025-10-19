
import { useEffect, useMemo, useState } from 'react'
import { startNew, move as apiMove, finish } from '../api'

type Winner = 'X'|'O'|'DRAW'|null
type ScoreUpdate = { score:number; winStreak:number }

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
]

function getWinLine(b:string[]): number[] | null {
  for (const [a,b2,c] of WIN_LINES) {
    if (b[a] !== ' ' && b[a] === b[b2] && b[a] === b[c]) return [a,b2,c]
  }
  return null
}

export default function Board({ onScoreUpdate }:{ onScoreUpdate?:(s:ScoreUpdate)=>void }) {
  const [board, setBoard] = useState<string[]>(Array(9).fill(' '))
  const [winner, setWinner] = useState<Winner>(null)
  const [busy, setBusy] = useState(false)

  const [starter, setStarter] = useState<'X'|'O'>('X')
  const [difficulty, setDifficulty] = useState<'easy'|'hard'>('hard')

  useEffect(() => { newGame() }, []) // first load

  async function newGame(){
    setBusy(true)
    const s = await startNew(starter, difficulty)
    setBoard(s.board); setWinner(null); setBusy(false)
  }

  const winLine = useMemo(()=> getWinLine(board), [board])

  async function play(i:number){
    if (busy || board[i] !== ' ' || winner) return
    setBusy(true)
    const res = await apiMove(board.slice(), i, difficulty)
    setBoard(res.board); setWinner(res.winner); setBusy(false)
    if (res.winner) {
      const r = await finish(res.board, res.winner === 'X' ? 'X' : res.winner === 'O' ? 'O' : 'DRAW')
      onScoreUpdate?.({ score: r.score, winStreak: r.winStreak })
    }
  }

  return (
    <div className="card" style={{marginTop:12}}>
      {/* แถบตัวเลือก */}
      <div className="hud" style={{gap:12, flexWrap:'wrap'}}>
        <div className="hud__badges" style={{display:'flex', gap:8}}>
          <label className="badge">เริ่มก่อน:
            <select value={starter} onChange={e=>setStarter(e.target.value as 'X'|'O')} style={{marginLeft:8}}>
              <option value="X">ผู้เล่น (X)</option>
              <option value="O">บอท (O)</option>
            </select>
          </label>
          <label className="badge">ความยาก:
            <select value={difficulty} onChange={e=>setDifficulty(e.target.value as 'easy'|'hard')} style={{marginLeft:8}}>
              <option value="easy">ง่าย</option>
              <option value="hard">ยาก</option>
            </select>
          </label>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn" onClick={newGame}>เริ่มเกมใหม่ (ตามตัวเลือก)</button>
          <button className="btn btn--primary" onClick={()=>{ setWinner(null); setBoard(Array(9).fill(' ')) }}>ล้างกระดาน</button>
        </div>
      </div>

      {/* กระดาน */}
      <div className="board-wrap">
        <div className="board">
          {board.map((v, idx) => {
            const isWin = !!winLine?.includes(idx)
            const disabled = v !== ' ' || !!winner
            return (
              <button
                key={idx}
                className="cell"
                onClick={() => play(idx)}
                disabled={disabled}
              >
                <span className={`mark ${isWin ? 'mark--win':''} ${v==='X'?'mark--x': v==='O'?'mark--o':''}`}>
                  {v}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="status" style={{marginTop:8}}>
        {!winner
          ? (busy ? 'บอทกำลังคิด...' : `ตัวเริ่ม: ${starter} • ระดับ: ${difficulty.toUpperCase()}`)
          : `ผลเกม: ${winner==='DRAW'?'เสมอ': winner==='X'?'คุณชนะ':'บอทชนะ'}`}
      </div>
    </div>
  )
}
