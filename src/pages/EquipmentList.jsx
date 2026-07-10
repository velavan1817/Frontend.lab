import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Equipment() {

    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        fetchEquipment();

    }, []);


    const fetchEquipment = async () => {

        try {

            const response = await api.get("/equipment");

            console.log(response.data);

            setEquipment(response.data);

        } catch (error) {

            console.log("Error fetching equipment:", error);

            alert("Failed to load equipment");

        } finally {

            setLoading(false);

        }
    };


    if (loading) {
        return <h2>Loading Equipment...</h2>;
    }


    return (

        <div style={{ padding: "30px" }}>

            <h1>Equipment List</h1>


            <table
                border="1"
                cellPadding="10"
                style={{
                    width: "100%",
                    marginTop: "20px"
                }}
            >

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Available</th>
                        <th>Status</th>
                    </tr>

                </thead>


                <tbody>

                    {equipment.map((item) => (

                        <tr key={item.id}>

                            <td>{item.id}</td>

                            <td>{item.name}</td>

                            <td>{item.description}</td>

                            <td>{item.category}</td>

                            <td>{item.quantity}</td>

                            <td>{item.availableQuantity}</td>

                            <td>{item.status}</td>

                        </tr>

                    ))}

                </tbody>


            </table>


        </div>

    );
}