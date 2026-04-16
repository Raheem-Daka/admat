import React, { useEffect, useState } from 'react'

const Home = () => {
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/')
            .then(response => response.json())
            .then(data => {
                setMessage(data.message);
                console.log(data);
            })
    }, [])

    return (
        <div>
            <p>{message}</p>
        </div>
    )
}

export default Home