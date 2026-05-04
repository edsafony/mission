import { useState, useEffect } from 'react';
import { getRoles, createRole, updateRole, deleteRole } from '../api/roles';

export default function useRoles() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getRoles().then(setRoles).catch(console.error);
  }, []);

  async function add(name, description) {
    const role = await createRole(name, description);
    setRoles(prev => [...prev, role]);
    return role;
  }

  async function update(id, fields) {
    const role = await updateRole(id, fields);
    setRoles(prev => prev.map(r => (r.id === id ? role : r)));
    return role;
  }

  async function remove(id) {
    await deleteRole(id);
    setRoles(prev => prev.filter(r => r.id !== id));
  }

  return { roles, add, update, remove };
}
