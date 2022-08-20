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
import moment from 'moment'
import '../App.css'

const Movies = () => {
  let baseUrl = `https://swapi.dev/api`
  let heights = []
  const [isDropDown, setIsDropDown] = useState(false)
  const [dropDownClickedIndex, setDropDownClickedIndex] = useState('')
  const [filmsData, setFilmsData] = useState([])
  const [isFilmsLoading, setIsFilmsLoading] = useState(true)
  const [isTableDataLoading, setIsTableDataLoading] = useState(false)
  const [characterData, setCharacterData] = useState([])
  const [characterDataDuplicate, setCharacterDataDuplicate] = useState([])
  const [isToggleSort, setIsToggleSort] = useState(false)
  const [isToggleGender, setIsToggleGender] = useState(false)
  const [allHeights, setAllHeights] = useState({})

  // HANDLE DROP DOWN TOGGLE AND GETTING THE CHARACTERS DATA SUCH AS THEIR NAMES, GENDER AND HEIGHTS
  const handleDropDown = async (index, characters) => {
    setDropDownClickedIndex(index)
    setIsDropDown(!isDropDown)
    if (isDropDown === false) {
      setIsTableDataLoading(true)
      await Promise.all(
        characters.map((charactersUrl) => {
          return axios
            .get(charactersUrl)
            .then((character) => {
              setCharacterData((characterData) => [
                ...characterData,
                character.data,
              ])
              setCharacterDataDuplicate((characterData) => [
                ...characterData,
                character.data,
              ])

              heights.push(Number(character.data.height))
              handleGetAllCharactersHeights(heights)
              setIsTableDataLoading(false)
            })
            .catch((error) => {
              if (error.code === 'ERR_NETWORK') {
                cogoToast.error('Kindly check your network connection')
              } else {
                cogoToast.error('Oops!Something went wrong')
              }
            })
        }),
      )
    } else {
      return null
    }
  }

  // ADDITION OF ALL CHARCATERS HEIGHTS
  const handleGetAllCharactersHeights = (arr) => {
    let heightSum = arr.reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    }, 0)

    // FOMULAR FOR CALCULATING FEET: cm * 0.0328
    let heightFeet = Math.floor(heightSum * 0.0328)

    // FOMULAR FOR CALCULATING INCHES: cm * 0.0328
    let stepOneheightInch = heightSum / 2.54
    let stepTwoheightInch = stepOneheightInch / 12
    let heightInch = stepTwoheightInch.toFixed(2)

    setAllHeights({
      sum_in_cm: heightSum,
      sum_in_ft: heightFeet,
      sum_in_inch: heightInch,
    })
  }

  // GET ALL STARWAR FILMS
  const handleGetAllStarWarFilms = async () => {
    try {
      let response = await axios.get(`${baseUrl}/films`)
      let result = response.data.results
      const sortedDate = result.sort((a, b) => {
        return (
          (moment(b.release_date).format() > moment(a.release_date).format()) -
          (moment(b.release_date).format() < moment(a.release_date).format())
        )
      })
      setFilmsData(sortedDate)
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

  // SORT ALL CHARACTERS IN ASCENDING AND DESCENDING ORDER
  const handleSortCharacters = () => {
    setIsToggleSort(!isToggleSort)
    if (isToggleSort === true) {
      const sortedData = [...characterDataDuplicate].sort()
      setCharacterData(sortedData)
      let sortedHeightData = []
      sortedData.map((data) => {
        return sortedHeightData.push(Number(data.height))
      })

      handleGetAllCharactersHeights(sortedHeightData)
    } else if (isToggleSort === false) {
      const reversedData = [...characterDataDuplicate].reverse()
      setCharacterData(reversedData)

      let reversedHeightData = []
      reversedData.map((data) => {
        return reversedHeightData.push(Number(data.height))
      })

      handleGetAllCharactersHeights(reversedHeightData)
    } else {
      return null
    }
  }

  // FILTER ALL CHARACTERS BASED ON THEIR GENDERS(MALE AND FEMALE)
  const handleCharactersGender = (gender) => {
    setIsToggleGender(false)
    if (gender === 'm') {
      let maleData = characterDataDuplicate.filter((data) => {
        return data.gender === 'male'
      })

      setCharacterData(maleData)
      let maleHeightData = []
      maleData.map((data) => {
        return maleHeightData.push(Number(data.height))
      })

      handleGetAllCharactersHeights(maleHeightData)
    } else if (gender === 'f') {
      let femaleData = characterDataDuplicate.filter((data) => {
        return data.gender === 'female'
      })

      setCharacterData(femaleData)
      let femaleHeightData = []
      femaleData.map((data) => {
        return femaleHeightData.push(Number(data.height))
      })

      handleGetAllCharactersHeights(femaleHeightData)
    }
  }

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
              className="w-full md:w-[50%] lg:w-[50%] h-full md:h-[500px] lg:h-[500px] mt-[5%] p-6 overflow-y-scroll"
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

                        <div className="overflow-scroll mt-4">
                          {isTableDataLoading ? (
                            <div className="w-full h-[500px] mt-[5%] p-6 overflow-y-scroll">
                              <Skeleton
                                count={8}
                                className="w-full h-[40px] bg-[#FDF8F0] rounded-[2px] flex items-center p-3 cursor-pointer text-[#E8AA42] text-base  justify-between font-[400px] mt-2"
                              />
                            </div>
                          ) : (
                            <table>
                              <thead>
                                <tr>
                                  <th>
                                    <span
                                      className="cursor-pointer"
                                      onClick={handleSortCharacters}
                                    >
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
                                    className="cursor-pointer relative"
                                  >
                                    Gender
                                    <span>
                                      {isToggleGender ? (
                                        <ExpandLessIcon />
                                      ) : (
                                        <ExpandMoreIcon />
                                      )}
                                    </span>
                                    {isToggleGender && (
                                      <div className="absolute p-2 w-[80px] bg-white">
                                        <div className="">
                                          <p
                                            className="hover:bg-black hover:text-white p-1"
                                            onClick={() => {
                                              handleCharactersGender('m')
                                            }}
                                          >
                                            m
                                          </p>
                                          <p
                                            className="hover:bg-black hover:text-white p-1"
                                            onClick={() => {
                                              handleCharactersGender('f')
                                            }}
                                          >
                                            f
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </th>

                                  <th>Height</th>
                                </tr>
                              </thead>

                              {characterData.map((data, index) => {
                                return (
                                  <tbody key={index}>
                                    <tr>
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
                                  </tbody>
                                )
                              })}
                              <tfoot>
                                <tr>
                                  <td>
                                    Total Characters:{characterData.length}
                                  </td>
                                  <td>
                                    Total heights:
                                    {`${allHeights.sum_in_cm}cm  (${allHeights.sum_in_ft}ft/${allHeights.sum_in_inch}in)`}
                                  </td>
                                  <td></td>
                                </tr>
                              </tfoot>
                            </table>
                          )}
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
