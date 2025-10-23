import React from 'react'

function Footer() {
  return (
    <>
      <div className="w-full bg-linear-to-br from-gray-900 via-black to-gray-950 text-white flex flex-col">
        <div className="text-center py-6 border-t border-gray-800 text-gray-500 text-sm">
          © {new Date().getFullYear()} MePlay. All rights reserved.
        </div>
      </div>
    </>
  )
}

export default Footer