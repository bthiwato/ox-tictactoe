import { useEffect, useState } from 'react'
import { getLeaderboard } from '../api'

export default function Leaderboard(){
  const [rows, setRows] = useState<any[]>([])
  useEffect(() => { (async () => setRows(await getLeaderboard()))() }, [])
  return (
    <div>
      <h2>Leaderboard</h2>
      <table width="100%">
        <thead>
          <tr>
            <th style={{textAlign:'left'}}>ผู้เล่น</th>
            <th style={{textAlign:'right'}}>คะแนน</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(u => (
            <tr key={u.id}>
              <td style={{display:'flex',alignItems:'center',gap:8}}>
                {u.photoUrl && <img src={u.photoUrl} style={{width:24,height:24,borderRadius:12}}/>}
                {u.displayName}
              </td>
              <td style={{textAlign:'right'}}>{u.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}