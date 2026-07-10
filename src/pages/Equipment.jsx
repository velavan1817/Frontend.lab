import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Equipment() {

    const [equipment, setEquipment] = useState([]);

    useEffect(() => {

        api.get("/equipment")
            .then((response) => {
                setEquipment(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);


    return (
        <div>
            <h1>Equipment List</h1>

            {equipment.map((item) => (
                <div key={item.id}>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>Status: {item.status}</p>
                </div>
            ))}

        </div>
    );
}