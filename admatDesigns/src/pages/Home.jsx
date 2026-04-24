import React, { useEffect, useState } from 'react'
import DesignCard from '../components/DesignCard'
import Hero from '../components/Hero'
import DiscountComponent from '../components/DiscountComponent'

const Home = () => {


    return (
        <div>
            <Hero />
            <div className="w-full ">
                <DiscountComponent />
            </div>
            <div className="border-t border-slate-100">
                <DesignCard />
            </div>
        </div>
    )
}

export default Home