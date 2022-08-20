import React, { useState, useEffect } from 'react'
import Dropdown from '../components/Dropdown'
import Nav from '../components/Nav'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import cogoToast from 'cogo-toast'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

const Movies = () => {
  let baseUrl = `https://swapi.dev/api`
  const [isDropDown, setIsDropDown] = useState(false)
  const [dropDownClickedIndex, setDropDownClickedIndex] = useState('')
  const [filmsData, setFilmsData] = useState([])
  const [isFilmsLoading, setIsFilmsLoading] = useState(true)
  const [characterData, setCharacterData] = useState([])
  const [isToggleSort, setIsToggleSort] = useState(false)
  const [isToggleGender, setIsToggleGender] = useState(false)

  // HANDLE DROP DOWN TOGGLE
  const handleDropDown = async (index, characters) => {
    setDropDownClickedIndex(index)
    setIsDropDown(!isDropDown)
    if (isDropDown === false) {
      await Promise.all(
        characters.map((charactersUrl) => {
          return axios.get(charactersUrl).then((character) => {
            setCharacterData((characterData) => [
              ...characterData,
              character.data,
            ])
          })
        }),
      )
    } else {
      return null
    }
  }

  // GET ALL STARWAR FILMS
  const handleGetAllStarWarFilms = async () => {
    try {
      let response = await axios.get(`${baseUrl}/films`)
      let result = response.data.results
      setFilmsData(result)
      setIsFilmsLoading(false)
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        cogoToast.error('Kindly check your network connection')
      } else {
        cogoToast.error('Oops!Something went wrong')
      }
      setIsFilmsLoading(false)
    }
  }

  const handleSortCharacters = () => {
    setIsToggleSort(!isToggleSort)
    if (isToggleSort === true) {
      const reverse = [...characterData].reverse()

      setCharacterData(reverse)
      console.log(reverse)
    } else if (isToggleSort === false) {
      const reverse = [...characterData].sort()

      setCharacterData(reverse)
      console.log(reverse)
    } else {
      return null
    }
  }

  const handleCharactersGender = () => {}

  useEffect(() => {
    handleGetAllStarWarFilms()
  }, [])

  return (
    <div>
      <Nav />

      <div>
        <div className="p-3 lg:p-0 block md:flex lg:flex flex-col items-center justify-center">
          <p className="mt-[5%] text-[#E8AA42] font-bold pb-2 text-base lg:text-lg tracking-wider">
            Star War Movies
          </p>
          {isFilmsLoading ? (
            <div
              className="w-[50%] h-[500px] mt-[5%] p-6 overflow-y-scroll"
              style={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
            >
              <Skeleton
                count={6}
                className="w-full h-[70px] bg-[#FDF8F0] rounded-[2px] flex items-center p-3 cursor-pointer text-[#E8AA42] text-base  justify-between font-[400px] mt-3"
              />
            </div>
          ) : (
            <div
              className="w-full md:w-[50%] lg:w-[50%] h-full lg:h-[500px]  p-6 lg:overflow-y-scroll"
              style={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
            >
              {filmsData.map((filmData, index) => {
                return (
                  <div key={index}>
                    <Dropdown
                      movieName={filmData.title}
                      handleDropDownClick={() =>
                        handleDropDown(index, filmData.characters)
                      }
                      isDropDown={isDropDown}
                    />

                    {isDropDown && dropDownClickedIndex === index && (
                      <div>
                        <div className="mt-3 bg-[#E8AA42] text-black text-base p-2 tracking-wide">
                          <div className="h-[150px] p-2">
                            <marquee
                              width="100%"
                              direction="up"
                              height="100%"
                              scrollamount="4"
                            >
                              {filmData.opening_crawl}
                            </marquee>
                          </div>
                        </div>

                        <div className="mt-4">
                          <table>
                            <tr onClick={handleSortCharacters}>
                              <th>
                                <span className="cursor-pointer">
                                  {isToggleSort ? (
                                    <ArrowDownwardIcon />
                                  ) : (
                                    <ArrowUpwardIcon />
                                  )}
                                </span>
                                Name
                              </th>
                              <th
                                onClick={() =>
                                  setIsToggleGender(!isToggleGender)
                                }
                              >
                                <span>
                                  {isToggleGender ? (
                                    <ExpandLessIcon />
                                  ) : (
                                    <ExpandMoreIcon />
                                  )}
                                  <ExpandMoreIcon />
                                </span>
                                Gender
                              </th>
                              <th>Height</th>
                            </tr>

                            {characterData.map((data, index) => {
                              return (
                                <tr key={index}>
                                  <td>{data.name}</td>
                                  <td>
                                    {data.gender === 'male'
                                      ? 'm'
                                      : data.gender === 'female'
                                      ? 'f'
                                      : 'n/a'}
                                  </td>
                                  <td>{data.height + 'cm'}</td>
                                </tr>
                              )
                            })}
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Movies
