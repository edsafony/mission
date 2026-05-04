import { useState, useEffect } from 'react';
import { getMission, updateMission } from '../api/mission';

export default function useMission() {
  const [text, setText] = useState('');

  useEffect(() => {
    getMission().then(m => setText(m.text)).catch(console.error);
  }, []);

  async function save(newText) {
    const mission = await updateMission(newText);
    setText(mission.text);
    return mission;
  }

  return { text, save };
}
