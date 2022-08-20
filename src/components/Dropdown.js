import React from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

const Dropdown = ({ movieName, handleDropDownClick, isDropDown }) => {
  return (
    <div onClick={handleDropDownClick}>
      <div className="w-full h-[60px] bg-[#FDF8F0] rounded-[2px] flex items-center p-3 cursor-pointer text-[#E8AA42] text-base  justify-between font-[400px] mt-3">
        <p>{movieName}</p>
        {isDropDown ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </div>
    </div>
  )
}

export default Dropdown
