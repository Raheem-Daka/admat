import React, {useState, useEffect} from 'react'
import DesignCard from '../components/DesignCard'

const Products = () => {
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/products/')
            .then(response => response.json())
            .then(data => {
                setMessage(data.message);
                console.log(data);
            })
    }, [])

    return (
        <div>{message}</div>
    )
}

export default Products