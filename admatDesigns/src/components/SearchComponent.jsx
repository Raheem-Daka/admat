import React, {useState} from 'react'

const SearchComponent = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [searchOpen, setSearchOpen] =useState(false)
    
      const toggleSearch = () => {
        setSearchOpen(!searchOpen)
      }
    
  return (
    <div>
        {/* Desktop Search buttons */}
        <div className="relative hidden ml-14 md:flex items-center ">
          <button
            onClick={toggleSearch}
            className="hover:cursor-pointer hover:transition-transform duration-300 px-4 py-2 rounded-full text-sm font-medium transition"
          >
            {searchOpen ? <FaTimes size={16} /> : <FaSearch size={16} />}
          </button>

          <div
            className={`flex items-center border pl-4 gap-2 border-gray-500/30 h-[46px] rounded-full overflow-hidden transition-all duration-300 ${
              searchOpen ? "max-w-md opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            <button >
              <FaSearch />
            </button>
            
            <input
              type="text"
              placeholder="category, product name..."
              className="w-full h-full outline-none text-gray-500 bg-transparent placeholder-gray-500 text-sm"
            />
          </div>
    </div>
  )
}

export default SearchComponent