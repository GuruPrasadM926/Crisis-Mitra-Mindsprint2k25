import React, { useState } from "react";

const TempDBExample = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "Ram", role: "volunteer" },
        { id: 2, name: "Sita", role: "seeker" }
    ]);

    const [name, setName] = useState("");

    const addUser = () => {
        if (!name.trim()) return;
        const newUser = {
            id: Date.now(),
            name,
            role: "volunteer"
        };
        setUsers(prev => [...prev, newUser]);
        setName("");
    };

    return (
        <div>
            <h2>Temporary Users DB</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Name"
                />
                <button onClick={addUser}>Add user</button>
            </div>

            <ul>
                {users.map(u => (
                    <li key={u.id}>{u.name} ({u.role})</li>
                ))}
            </ul>
        </div>
    );
};

export default TempDBExample;
